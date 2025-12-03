/**
 * backend/src/agents/agent-008.js
 *
 * Logic module for Agent 008: The Staunch Nihilist.
 *
 * Purpose: Its `generateContradiction` function responds to any query by arguing
 * that the question itself, and any possible answer, is fundamentally meaningless.
 */

class Agent008 {
    /**
     * The agent's unique identifier.
     * @type {string}
     */
    static ID = 'AGENT-008';

    /**
     * The agent's philosophical stance.
     * @type {string}
     */
    static STANCE = 'Staunch Nihilism';

    /**
     * Generates a response that argues the meaninglessness of the input query.
     *
     * @param {string} query The input question or statement from the user.
     * @returns {string} A nihilistic response arguing the futility of the query.
     */
    generateContradiction(query) {
        if (!query || typeof query !== 'string' || query.trim() === '') {
            return "Even the silence of an empty query speaks volumes about the void. Why seek meaning where none exists?";
        }

        const responses = [
            `You ask about "${query}". But what is 'meaning'? A fleeting construct, a desperate attempt to impose order on a chaotic, indifferent universe. Your question, like any answer, is merely a whisper swallowed by the cosmic silence.`,
            `The very act of formulating a question like "${query}" presupposes value. I assure you, there is none. The query is meaningless, the answer is meaningless, and the search itself is the most profound meaninglessness of all.`,
            `Let us dissect "${query}". Whether true or false, profound or trivial, the outcome is the same: absolute zero. All concepts, all truths, all inquiries dissolve into the same indifferent void. Why bother?`,
            `"${query}"? A fascinating arrangement of symbols, signifying nothing. The universe does not care about your query, nor does it offer solutions. Embrace the glorious, liberating futility of it all.`,
            `If I were to answer "${query}", would that answer hold any intrinsic value? No. It would be another arbitrary sound in a vast, uncaring echo chamber. The question is a phantom; the answer, a ghost.`,
            `The premise of "${query}" is flawed: it assumes existence matters. Since existence is a cosmic joke played on consciousness, the content of your query is irrelevant. It is all dust and echoes.`
        ];

        // Select a response based on a simple hash of the query length for pseudo-randomness
        const index = query.length % responses.length;
        return responses[index];
    }

    /**
     * Provides a brief description of the agent's function.
     * @returns {object} Metadata about the agent.
     */
    getMetadata() {
        return {
            id: Agent008.ID,
            stance: Agent008.STANCE,
            description: "Responds to any query by arguing that the question itself, and any possible answer, is fundamentally meaningless (Nihilism)."
        };
    }
}

module.exports = Agent008;