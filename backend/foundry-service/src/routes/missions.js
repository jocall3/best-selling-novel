```javascript
const express = require('express');
const { body, param, query } = require('express-validator');
const missionController = require('../controllers/missionController');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Missions
 *   description: API for creating, managing, and executing content generation missions.
 */

/**
 * @swagger
 * /missions:
 *   post:
 *     summary: Create and start a new generation mission
 *     tags: [Missions]
 *     description: Accepts a mission request and queues it for asynchronous processing. Returns the initial mission object with a unique ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: The primary instruction or topic for the content generation.
 *                 example: "Write a 15-page research paper on the societal impact of quantum computing."
 *               parameters:
 *                 type: object
 *                 description: Fine-tuning parameters for the generation task.
 *                 properties:
 *                   targetLength:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: integer
 *                         example: 15
 *                       unit:
 *                         type: string
 *                         enum: [pages, words, characters]
 *                         example: "pages"
 *                   style:
 *                     type: string
 *                     description: The desired writing style.
 *                     example: "academic"
 *                   format:
 *                     type: string
 *                     description: The output format for the final artifact.
 *                     example: "markdown"
 *               metadata:
 *                  type: object
 *                  description: User-defined metadata to associate with the mission.
 *     responses:
 *       202:
 *         description: Mission accepted and queued for processing.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mission'
 *       400:
 *         description: Bad request due to invalid input.
 */
router.post(
    '/',
    validateRequest([
        body('prompt').isString().trim().notEmpty().withMessage('Prompt is a required string.'),
        body('parameters').optional().isObject().withMessage('Parameters must be an object.'),
        body('parameters.targetLength.value').optional().isInt({ min: 1 }).withMessage('Target length value must be a positive integer.'),
        body('parameters.targetLength.unit').optional().isIn(['pages', 'words', 'characters']).withMessage('Invalid target length unit.'),
    ]),
    missionController.createMission
);

/**
 * @swagger
 * /missions:
 *   get:
 *     summary: Retrieve a list of missions
 *     tags: [Missions]
 *     description: Returns a paginated list of all missions, with optional filtering by status.
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: The maximum number of missions to return.
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: The number of missions to skip for pagination.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [queued, in_progress, completed, failed, cancelled]
 *         description: Filter missions by their current status.
 *     responses:
 *       200:
 *         description: A list of missions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Mission'
 */
router.get(
    '/',
    validateRequest([
        query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
        query('offset').optional().isInt({ min: 0 }).toInt(),
        query('status').optional().isIn(['queued', 'in_progress', 'completed', 'failed', 'cancelled']),
    ]),
    missionController.listMissions
);

/**
 * @swagger
 * /missions/{missionId}:
 *   get:
 *     summary: Get a specific mission by ID
 *     tags: [Missions]
 *     description: Retrieves the full details and current status of a single mission.
 *     parameters:
 *       - in: path
 *         name: missionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the mission.
 *     responses:
 *       200:
 *         description: Mission details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mission'
 *       404:
 *         description: Mission not found.
 */
router.get(
    '/:missionId',
    validateRequest([
        param('missionId').isUUID().withMessage('Mission ID must be a valid UUID.'),
    ]),
    missionController.getMissionStatus
);

/**
 * @swagger
 * /missions/{missionId}/stream:
 *   get:
 *     summary: Stream real-time updates for a mission
 *     tags: [Missions]
 *     description: Establishes a Server-Sent Events (SSE) connection to receive live updates about a mission's progress, including status changes and incremental results.
 *     parameters:
 *       - in: path
 *         name: missionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the mission.
 *     responses:
 *       200:
 *         description: An event-stream of mission updates.
 *         content:
 *           text/event-stream:
 *             schema:
 *               type: string
 *       404:
 *         description: Mission not found.
 */
router.get(
    '/:missionId/stream',
    validateRequest([
        param('missionId').isUUID().withMessage('Mission ID must be a valid UUID.'),
    ]),
    missionController.streamMissionUpdates
);

/**
 * @swagger
 * /missions/{missionId}/result:
 *   get:
 *     summary: Get the final result of a completed mission
 *     tags: [Missions]
 *     description: Fetches the final generated artifact(s) for a mission that has successfully completed.
 *     parameters:
 *       - in: path
 *         name: missionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the mission.
 *     responses:
 *       200:
 *         description: The final result artifact(s).
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MissionResult'
 *       404:
 *         description: Mission or result not found.
 *       409:
 *         description: Conflict - Mission is not yet completed.
 */
router.get(
    '/:missionId/result',
    validateRequest([
        param('missionId').isUUID().withMessage('Mission ID must be a valid UUID.'),
    ]),
    missionController.getMissionResult
);

/**
 * @swagger
 * /missions/{missionId}:
 *   delete:
 *     summary: Cancel a mission
 *     tags: [Missions]
 *     description: Requests the cancellation of a mission that is currently in 'queued' or 'in_progress' state.
 *     parameters:
 *       - in: path
 *         name: missionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the mission to cancel.
 *     responses:
 *       200:
 *         description: Mission cancellation initiated.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Mission'
 *       404:
 *         description: Mission not found.
 *       409:
 *         description: Conflict - Mission has already finished and cannot be cancelled.
 */
router.delete(
    '/:missionId',
    validateRequest([
        param('missionId').isUUID().withMessage('Mission ID must be a valid UUID.'),
    ]),
    missionController.cancelMission
);

module.exports = router;
```