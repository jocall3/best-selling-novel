```javascript
// Load environment variables from .env file
require('dotenv').config();

// Standard library imports
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

// --- Mock Services ---
// In a real-world scenario, these functions would make HTTP/gRPC calls
// to other microservices (e.g., planner-service, writer-service).

/**
 * Mocks a call to a planning service to generate an outline for the document.
 * @param {string} prompt - The main topic for the content.
 * @param {number} targetPageCount - The desired number of pages.
 * @returns {Promise<string[]>} A promise that resolves to an array of section titles.
 */
const callPlannerService = async (prompt, targetPageCount) => {
  console.log(`[PlannerService] Generating outline for: "${prompt}" (${targetPageCount} pages)`);
  return new Promise(resolve => {
    setTimeout(() => {
      const sections = [];
      // Simple logic: assume ~2 sections per 5 pages, with a minimum of 3 sections.
      const sectionCount = Math.max(3, Math.ceil(targetPageCount / 5) * 2);
      for (let i = 1; i <= sectionCount; i++) {
        sections.push(`Chapter ${i}: A Deep Dive into Aspect ${i} of ${prompt}`);
      }
      console.log(`[PlannerService] Outline generated with ${sections.length} sections.`);
      resolve(sections);
    }, 2500); // Simulate network latency and AI processing time
  });
};

/**
 * Mocks a call to a writer service to generate content for a single section.
 * @param {string} sectionPrompt - The prompt for the specific section.
 * @returns {Promise<string>} A promise that resolves to the generated text for the section.
 */
const callWriterService = async (sectionPrompt) => {
  console.log(`[WriterService] Writing content for: "${sectionPrompt}"`);
  return new Promise(resolve => {
    setTimeout(() => {
      const content = `This is the detailed, AI-generated content for the section titled "${sectionPrompt}". This text would typically be several paragraphs long, exploring the topic in depth with relevant details, examples, and analysis. The generation process involves complex language models to ensure coherence, accuracy, and a natural flow. For the purpose of this simulation, we use this placeholder text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.`;
      console.log(`[WriterService] Finished writing content for: "${sectionPrompt}"`);
      resolve(content);
    }, 1800 + Math.random() * 1200); // Simulate variable AI writing time
  });
};

// --- In-Memory Mission Store ---
// In a production environment, this would be a persistent database like Redis or PostgreSQL.
const missions = new Map();

// --- Core Orchestration Logic ---

/**
 * Orchestrates a complete content generation mission from planning to completion.
 * This function is designed to run in the background and updates the mission state.
 * @param {string} missionId - The unique ID for the mission to orchestrate.
 */
const orchestrateMission = async (missionId) => {
  const mission = missions.get(missionId);
  if (!mission) {
    console.error(`[Orchestrator] Mission with ID ${missionId} not found for orchestration.`);
    return;
  }

  try {
    // 1. Planning Phase: Generate the document outline
    mission.status = 'planning';
    mission.progress = 10;
    missions.set(missionId, mission);
    console.log(`[Mission:${missionId}] Starting planning phase.`);
    const outline = await callPlannerService(mission.prompt, mission.targetPageCount);
    mission.outline = outline;
    mission.sections = outline.map(title => ({ title, content: null, status: 'pending' }));

    // 2. Writing Phase: Generate content for each section in parallel
    mission.status = 'writing';
    mission.progress = 20;
    missions.set(missionId, mission);
    console.log(`[Mission:${missionId}] Starting writing phase for ${outline.length} sections.`);

    const writingPromises = mission.sections.map(async (section, index) => {
      section.status = 'writing';
      missions.set(missionId, mission); // Update section status
      const content = await callWriterService(section.title);
      section.content = content;
      section.status = 'completed';
      
      // Atomically update overall mission progress
      const currentMissionState = missions.get(missionId);
      const completedSections = currentMissionState.sections.filter(s => s.status === 'completed').length;
      currentMissionState.progress = 20 + Math.floor((completedSections / currentMissionState.sections.length) * 70);
      missions.set(missionId, currentMissionState);
      console.log(`[Mission:${missionId}] Section ${index + 1}/${currentMissionState.sections.length} completed.`);
    });

    await Promise.all(writingPromises);

    // 3. Assembling Phase: Combine all sections into a single document
    mission.status = 'assembling';
    mission.progress = 95;
    missions.set(missionId, mission);
    console.log(`[Mission:${missionId}] Assembling final document.`);

    let finalContent = `Title: ${mission.prompt}\n\n`;
    mission.sections.forEach(section => {
      finalContent += `## ${section.title}\n\n`;
      finalContent += `${section.content}\n\n---\n\n`;
    });
    mission.finalContent = finalContent;

    // 4. Completion
    mission.status = 'completed';
    mission.progress = 100;
    mission.completedAt = new Date().toISOString();
    missions.set(missionId, mission);
    console.log(`[Mission:${missionId}] Mission completed successfully.`);

  } catch (error) {
    console.error(`[Mission:${missionId}] Mission failed. Error:`, error);
    const mission = missions.get(missionId);
    if (mission) {
      mission.status = 'failed';
      mission.error = error.message || 'An unknown error occurred during orchestration.';
      missions.set(missionId, mission);
    }
  }
};


// --- Express Application Setup ---
const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(express.json());

// --- API Routes ---

/**
 * Health check endpoint to verify the service is running.
 */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'foundry-service' });
});

/**
 * POST /api/v1/missions
 * Creates and starts a new content generation mission.
 */
app.post('/api/v1/missions', (req, res) => {
  const { prompt, targetPageCount = 15 } = req.body;

  if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
    return res.status(400).json({ error: 'A non-empty string "prompt" is required.' });
  }

  const missionId = uuidv4();
  const newMission = {
    id: missionId,
    prompt,
    targetPageCount,
    status: 'queued', // 'queued', 'planning', 'writing', 'assembling', 'completed', 'failed'
    progress: 0,
    createdAt: new Date().toISOString(),
    completedAt: null,
    outline: null,
    sections: [],
    finalContent: null,
    error: null,
  };

  missions.set(missionId, newMission);

  // Trigger the orchestration logic asynchronously.
  // The API call returns immediately.
  orchestrateMission(missionId);

  res.status(202).json({
    message: "Mission accepted for processing.",
    missionId: newMission.id,
    status: newMission.status,
  });
});

/**
 * GET /api/v1/missions/:missionId
 * Retrieves the current status and data for a specific mission.
 */
app.get('/api/v1/missions/:missionId', (req, res) => {
  const { missionId } = req.params;
  const mission = missions.get(missionId);

  if (!mission) {
    return res.status(404).json({ error: 'Mission not found.' });
  }

  // To avoid sending a potentially huge final document every time,
  // we can send a summary or omit the finalContent until it's explicitly requested.
  // For this implementation, we send the full object.
  res.status(200).json(mission);
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`[Foundry Service] Orchestrator is running on http://localhost:${PORT}`);
});
```