import * as conflictEngine from './conflictEngine.js';
import { calculateTruthRhombus } from '../utils/truthRhombusCalculator.js';
import InteractionLog from '../models/interactionLogModel.js';
import logger from '../config/logger.js';

/**
 * Service layer for the Oracle.
 * This service orchestrates the core logic of receiving a query, generating
 * multiple AI perspectives, analyzing them, and persisting the interaction.
 */

/**
 * Orchestrates the process of querying the Oracle.
 * 1. Gets conflicting opinions from the AI conflict engine.
 * 2. Calculates the Truth Rhombus score based on these opinions.
 * 3. Logs the entire interaction for analysis and record-keeping.
 * 4. Returns the consolidated result.
 *
 * @param {string} query - The user's query to the Oracle.
 * @returns {Promise<object>} An object containing the query, the AI responses, and the Truth Rhombus analysis.
 * @throws {Error} If the query is invalid, or if any downstream services fail.
 */
const askOracle = async (query) => {
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    logger.warn('askOracle service called with an invalid or empty query.');
    throw new Error('Query cannot be empty.');
  }

  logger.info(`Oracle service initiated for query: "${query}"`);

  try {
    // Step 1: Invoke the conflict engine to get AI responses
    // The conflictEngine is responsible for querying multiple AI models/personas
    // to generate a diverse set of perspectives on the user's query.
    const conflictingOpinions = await conflictEngine.getConflictingOpinions(query);

    if (!conflictingOpinions || conflictingOpinions.length === 0) {
      logger.error('Conflict engine returned no opinions for the query.', { query });
      throw new Error('Failed to get a valid response from the conflict engine.');
    }

    logger.info(`Received ${conflictingOpinions.length} opinions from the conflict engine.`);

    // Step 2: Calculate the 'Truth Rhombus' score
    // This custom logic analyzes the conflicting opinions for consensus,
    // divergence, and other factors to produce a final score and analysis.
    const truthRhombus = calculateTruthRhombus(conflictingOpinions);
    logger.info('Truth Rhombus calculated successfully.', { score: truthRhombus.score });

    // Step 3: Log the entire interaction to the database
    // Persisting this data is crucial for auditing, analysis, and improving the system over time.
    const interaction = new InteractionLog({
      query,
      responses: conflictingOpinions,
      truthRhombus,
      createdAt: new Date(),
    });

    const savedInteraction = await interaction.save();
    logger.info(`Interaction for query "${query}" saved successfully with ID: ${savedInteraction._id}`);

    // Step 4: Return the final, structured result to the controller
    return {
      id: savedInteraction._id,
      query,
      responses: conflictingOpinions,
      truthRhombus,
    };

  } catch (error) {
    logger.error(`An error occurred in the oracleService for query: "${query}"`, {
      errorMessage: error.message,
      stack: error.stack,
    });

    // Re-throw a more generic error to the controller layer to avoid leaking
    // sensitive implementation details to the end-user.
    throw new Error('An internal error occurred while consulting the Oracle. Please try again later.');
  }
};

export {
  askOracle,
};