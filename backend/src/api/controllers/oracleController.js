const oracleService = require('../services/oracleService');
const logger = require('../../utils/logger');

/**
 * @description Handles a query to the Oracle, validates it, and returns synthesized contradictory perspectives.
 * @route POST /api/oracle/query
 * @access Public
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 */
const askOracle = async (req, res) => {
  try {
    const { query } = req.body;

    // --- Input Validation ---
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      logger.warn('Validation failed: Missing or invalid query.', { body: req.body });
      return res.status(400).json({
        success: false,
        message: 'A non-empty "query" string is required in the request body.',
      });
    }

    // Example of a more specific validation rule
    if (query.length > 1024) {
      logger.warn('Validation failed: Query exceeds maximum length.', { queryLength: query.length });
      return res.status(400).json({
        success: false,
        message: 'Query exceeds the maximum length of 1024 characters.',
      });
    }

    logger.info(`Received a valid query for the Oracle: "${query}"`);

    // --- Service Layer Call ---
    // The service layer contains the core business logic to interact with the AI model
    const perspectives = await oracleService.getContradictoryPerspectives(query);

    // --- Success Response ---
    return res.status(200).json({
      success: true,
      data: perspectives,
    });

  } catch (error) {
    // --- Error Handling ---
    logger.error('An error occurred in the askOracle controller:', {
      message: error.message,
      stack: error.stack,
      requestBody: req.body, // Be cautious logging full bodies in production if they contain sensitive data
    });

    // Send a generic error response to the client
    return res.status(500).json({
      success: false,
      message: 'An internal server error occurred while consulting the Oracle. Please try again later.',
    });
  }
};

module.exports = {
  askOracle,
};