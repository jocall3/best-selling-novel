const express = require('express');
const oracleRoutes = require('./oracle');
const agentRoutes = require('./agents');
const sagaRoutes = require('./saga');

const router = express.Router();

/**
 * @swagger
 * /api/v1:
 *   get:
 *     summary: API v1 Status Check
 *     description: Provides a simple health check endpoint to confirm the API v1 router is active.
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: API is up and running.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: 'ok'
 *                 message:
 *                   type: string
 *                   example: 'API v1 is alive!'
 */
router.get('/', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API v1 is alive!',
  });
});

// Mount resource-specific routers
router.use('/oracle', oracleRoutes);
router.use('/agents', agentRoutes);
router.use('/saga', sagaRoutes);

module.exports = router;