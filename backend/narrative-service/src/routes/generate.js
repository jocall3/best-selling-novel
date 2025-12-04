const express = require('express');
const router = express.Router();
const narrativeController = require('../controllers/narrativeController'); // Assuming a controller handles the core logic

/**
 * @route POST /
 * @description Initiates the generation of a new narrative based on provided parameters.
 * @access Public (or authenticated, depending on project requirements)
 * @body {
 *   topic: string,             // The main topic/theme for the narrative. (Required)
 *   length_pages: number,      // The desired approximate length of the narrative in pages. (Required)
 *   style?: string,            // Optional: The desired writing style (e.g., "academic", "journalistic", "creative", "fantasy").
 *   keywords?: string[],       // Optional: An array of keywords to guide the content generation.
 *   outline_structure?: object // Optional: A predefined structure for the narrative (e.g., { chapters: [{ title: "Introduction", sections: [] }] }).
 * }
 * @returns {
 *   jobId: string,             // A unique ID to track the narrative generation job.
 *   status: string,            // The initial status of the job (e.g., "pending", "processing").
 *   message: string            // A descriptive message about the job initiation.
 * }
 * @throws {400} If required parameters are missing or invalid.
 * @throws {500} If an internal server error occurs during job initiation.
 */
router.post('/', async (req, res) => {
    const { topic, length_pages, style, keywords, outline_structure } = req.body;

    // --- Input Validation ---
    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
        return res.status(400).json({ message: 'The "topic" field is required and must be a non-empty string.' });
    }
    if (!length_pages || typeof length_pages !== 'number' || length_pages <= 0 || !Number.isInteger(length_pages)) {
        return res.status(400).json({ message: 'The "length_pages" field is required and must be a positive integer.' });
    }
    if (style && typeof style !== 'string') {
        return res.status(400).json({ message: 'The "style" field, if provided, must be a string.' });
    }
    if (keywords && (!Array.isArray(keywords) || !keywords.every(k => typeof k === 'string' && k.trim().length > 0))) {
        return res.status(400).json({ message: 'The "keywords" field, if provided, must be an array of non-empty strings.' });
    }
    if (outline_structure && (typeof outline_structure !== 'object' || Array.isArray(outline_structure) || outline_structure === null)) {
        return res.status(400).json({ message: 'The "outline_structure" field, if provided, must be a non-null object.' });
    }
    // --- End Validation ---

    try {
        const generationOptions = {
            topic,
            length_pages,
            style,
            keywords,
            outline_structure
        };

        // Delegate the generation request to the narrative controller
        // The controller is expected to handle the business logic,
        // potentially queuing the request for asynchronous processing.
        const result = await narrativeController.initiateNarrativeGeneration(generationOptions);

        // Return a 202 Accepted status as the generation might be a long-running process
        res.status(202).json(result);

    } catch (error) {
        console.error(`Error initiating narrative generation for topic "${topic}":`, error);
        // Differentiate between known errors (e.g., from external service) and unexpected errors
        if (error.name === 'ServiceError' || error.name === 'ExternalAPIError') {
            return res.status(503).json({ message: error.message });
        }
        res.status(500).json({ message: 'Failed to initiate narrative generation due to an internal server error.', error: error.message });
    }
});

module.exports = router;