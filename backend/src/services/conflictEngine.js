/**
 * @file backend/src/services/conflictEngine.js
 * @description The core of the Inquiry Foundation. This service takes a user query,
 * distributes it to a large number of specialized AI agents, orchestrates a multi-round
 * "debate" among them, and synthesizes the resulting contradictions, nuances, and points
 * of consensus into a final, multi-faceted response.
 */

import { getAgentResponse } from './aiAgentService.js'; // Assuming a service to interact with an LLM
import { generateAgentPersonas } from '../utils/personaGenerator.js';
import logger from '../utils/logger.js';

const NUM_AGENTS = 100;
const DEBATE_ROUNDS = 2;
const DEBATE_PANEL_SIZE = 5;

class ConflictEngineService {
  constructor() {
    this.agents = generateAgentPersonas(NUM_AGENTS);
    logger.info(`ConflictEngineService initialized with ${this.agents.length} agents.`);
  }

  /**
   * Main entry point for resolving a user query.
   * Orchestrates the entire process from initial response to final synthesis.
   * @param {string} query - The user's query.
   * @returns {Promise<object>} An object containing the synthesized response and metadata.
   */
  async resolveQuery(query) {
    try {
      logger.info(`Starting resolution for query: "${query}"`);

      // Phase 1: Get initial, independent responses from all agents
      const initialResponses = await this._initialResponsePhase(query);
      logger.info(`Phase 1 Complete: Collected ${initialResponses.length} initial responses.`);

      // Phase 2: Orchestrate debate rounds
      const debateArtifacts = await this._debatePhase(query, initialResponses);
      logger.info(`Phase 2 Complete: Finished ${DEBATE_ROUNDS} debate rounds.`);

      // Phase 3: Synthesize the results into a final report
      const finalSynthesis = await this._synthesisPhase(query, debateArtifacts);
      logger.info(`Phase 3 Complete: Synthesis finished.`);

      return {
        query,
        synthesis: finalSynthesis,
        // Optionally include the raw debate data for deeper analysis
        // debateHistory: debateArtifacts,
      };
    } catch (error) {
      logger.error(`Error in resolveQuery: ${error.message}`, { stack: error.stack });
      throw new Error('Failed to resolve query due to an internal conflict engine error.');
    }
  }

  /**
   * Phase 1: Each agent provides an initial response to the query based on its unique persona.
   * @param {string} query - The user's query.
   * @returns {Promise<Array<object>>} A promise that resolves to an array of response objects.
   * @private
   */
  async _initialResponsePhase(query) {
    const responsePromises = this.agents.map(agent => {
      const prompt = `Based on your unique perspective, provide a direct and concise answer to the following query:\n\nQUERY: "${query}"`;
      return getAgentResponse(agent.systemPrompt, prompt)
        .then(response => ({
          agentId: agent.id,
          agentName: agent.name,
          response: response,
        }))
        .catch(error => {
            logger.warn(`Agent ${agent.id} failed to generate initial response: ${error.message}`);
            return { agentId: agent.id, agentName: agent.name, response: null, error: true };
        });
    });

    const results = await Promise.all(responsePromises);
    return results.filter(r => !r.error && r.response); // Filter out failed responses
  }

  /**
   * Phase 2: Agents are grouped into panels to critique each other's responses over several rounds.
   * @param {string} query - The user's query.
   * @param {Array<object>} initialResponses - The responses from Phase 1.
   * @returns {Promise<Array<object>>} A promise that resolves to the final state of agent responses after debate.
   * @private
   */
  async _debatePhase(query, initialResponses) {
    let currentResponses = [...initialResponses];

    for (let round = 1; round <= DEBATE_ROUNDS; round++) {
      logger.info(`Starting Debate Round ${round}...`);
      const nextRoundResponses = [];
      const shuffledAgents = this._shuffleArray(currentResponses);
      const panels = this._createPanels(shuffledAgents, DEBATE_PANEL_SIZE);

      const panelPromises = panels.map(async (panel) => {
        const panelCritiquePromises = panel.map(currentAgent => {
          const otherPerspectives = panel
            .filter(p => p.agentId !== currentAgent.agentId)
            .map(p => `--- PERSPECTIVE from ${p.agentName} ---\n${p.response}\n--- END PERSPECTIVE ---`)
            .join('\n\n');

          const debatePrompt = `The original query was: "${query}"
Your initial response was: "${currentAgent.response}"

Now, consider these other perspectives from your peers:
${otherPerspectives}

Critique these perspectives, identify points of conflict with your own view, and provide a refined, more robust version of your original answer. Acknowledge valid points from others if applicable.`;
          
          const agentPersona = this.agents.find(a => a.id === currentAgent.agentId);
          return getAgentResponse(agentPersona.systemPrompt, debatePrompt)
            .then(refinedResponse => ({
              ...currentAgent,
              response: refinedResponse, // Update the response with the refined one
            }))
            .catch(error => {
                logger.warn(`Agent ${currentAgent.agentId} failed during debate round ${round}: ${error.message}`);
                return currentAgent; // Keep the previous response if refinement fails
            });
        });
        return Promise.all(panelCritiquePromises);
      });

      const resultsFromPanels = await Promise.all(panelPromises);
      currentResponses = resultsFromPanels.flat(); // Flatten the array of panels into a single response list
    }

    return currentResponses;
  }

  /**
   * Phase 3: A master synthesizer agent analyzes the entire debate to produce a final report.
   * @param {string} query - The user's query.
   * @param {Array<object>} debateArtifacts - The final state of responses after the debate.
   * @returns {Promise<string>} A promise that resolves to the final synthesized text.
   * @private
   */
  async _synthesisPhase(query, debateArtifacts) {
    const formattedDebate = debateArtifacts.map(artifact => 
      `AGENT: ${artifact.agentName} (ID: ${artifact.agentId})\nFINAL STANCE:\n${artifact.response}\n--------------------`
    ).join('\n\n');

    const synthesisPrompt = `You are a master synthesis AI. Your task is to analyze a complex debate among 100 specialist AIs regarding the query: "${query}".
Below is the final stance of each agent after several rounds of critique and refinement.

Your analysis must NOT take a side. Instead, you must produce a structured, multi-faceted report that accomplishes the following:
1.  **Identify Core Themes:** What are the 3-5 primary schools of thought or fundamental perspectives that emerged?
2.  **Summarize Each Theme:** For each theme, provide a clear summary of its main argument and list the key supporting points made by its proponents.
3.  **Map the Conflicts:** Describe the primary points of contention and contradiction *between* these themes. Where do they fundamentally disagree?
4.  **Highlight Nuance and Consensus:** Point out any surprising areas of agreement, subtle nuances, or minority opinions that are worth noting.
5.  **Conclusion:** Provide a concluding summary of the overall intellectual landscape surrounding the query, emphasizing that the "answer" is a complex tapestry of these conflicting, yet valid, viewpoints.

DEBATE TRANSCRIPT:
${formattedDebate}

Begin your synthesis now.`;

    // The synthesizer uses a neutral, powerful system prompt for objective analysis.
    const synthesizerSystemPrompt = 'You are a world-class analyst and synthesizer of complex information. You are objective, insightful, and skilled at structuring disparate information into a coherent, understandable report.';
    
    return getAgentResponse(synthesizerSystemPrompt, synthesisPrompt);
  }

  /**
   * Shuffles an array in place.
   * @param {Array} array The array to shuffle.
   * @returns {Array} The shuffled array.
   * @private
   */
  _shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Splits an array into chunks of a specified size.
   * @param {Array} array The array to split.
   * @param {number} size The size of each chunk.
   * @returns {Array<Array>} An array of arrays (panels).
   * @private
   */
  _createPanels(array, size) {
    const panels = [];
    for (let i = 0; i < array.length; i += size) {
      panels.push(array.slice(i, i + size));
    }
    return panels;
  }
}

export const conflictEngineService = new ConflictEngineService();