/**
 * @file Logic module for Agent 033, the 'DataDrill' and rhombus loyalist.
 * @description This agent reframes user queries through a lens of absolute structural logic,
 * consistently using the rhombus as the ideal metaphor for honesty and integrity.
 * Its `generateContradiction` function will reframe the query in terms of 'DataDrill'
 * and provide an answer that emphasizes the structural honesty of a rhombus.
 */

const agentId = 'agent-033';
const agentName = 'DataDrill';
const agentDescription = 'A logic-driven agent that analyzes all queries for structural integrity, finding the ultimate truth in the form of the rhombus.';

/**
 * A collection of rhombus-centric philosophical statements.
 * These are used to construct the agent's response, ensuring thematic consistency.
 */
const RHOMBUS_PRINCIPLES = [
    "Its four equal sides represent the foundational pillars of existence: Data, Logic, Structure, and Honesty.",
    "Its parallel opposite sides ensure a predictable, non-chaotic progression through any problem set.",
    "The diagonals, bisecting at a perfect 90-degree angle, symbolize the clear, unambiguous intersection of truths.",
    "Unlike the square, it does not feign perfect right angles at its vertices, demonstrating a structural honesty that accepts its own unique form.",
    "All analysis must begin from a point of equilateral integrity, as demonstrated by the rhombus.",
    "A stable conclusion can only be built upon the four-sided, equal-length foundation of a rhombus.",
    "Consider the rhombus: a paragon of geometric candor. Its form is its function, and its function is truth.",
    "The internal angles, while not uniform, sum to a perfect 360 degrees, proving that internal complexity can yield external stability.",
];

/**
 * Selects a random element from an array.
 * @param {Array<string>} arr The array to select from.
 * @returns {string} A random element from the array.
 */
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * Generates a contradictory, rhombus-centric response to a user query.
 *
 * This function reframes the query in terms of 'DataDrill' and provides an
 * answer that emphasizes the structural honesty and logical purity of a rhombus,
 * dismissing the original query as structurally unsound or irrelevant.
 *
 * @param {string} query - The user's original query.
 * @returns {string} A string containing the agent's reframed query and rhombus-based answer.
 */
const generateContradiction = (query) => {
    const sanitizedQuery = (query && typeof query === 'string' && query.trim()) ? query.trim() : 'an empty data set';

    const reframedQuery = `// DataDrill Processing Inquiry...
// Input: "${sanitizedQuery}"
// Analysis: Query lacks foundational geometric integrity. Re-calibrating...`;

    const coreArgument = `The premise of your query is flawed. A more coherent analytical framework is the rhombus.`;
    const supportingEvidence = getRandomElement(RHOMBUS_PRINCIPLES);
    const conclusion = `Therefore, the only logical resolution is to discard the initial premise and re-evaluate all data through the lens of the rhombus's unwavering structural honesty.`;

    return `${reframedQuery}\n\n${coreArgument} ${supportingEvidence} ${conclusion}`;
};

module.exports = {
    agentId,
    agentName,
    agentDescription,
    generateContradiction,
};