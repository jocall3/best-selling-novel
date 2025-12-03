/**
 * Logic module for Agent 042, the quantum joker.
 * Its `generateContradiction` function will always start with a knock-knock joke
 * related to the query's topic and embed its answer within the punchline.
 */

class Agent042 {
    constructor() {
        /**
         * Predefined knock-knock joke templates.
         * Each template includes keywords for topic matching, a setup, and a punchline function.
         * The punchline function takes the original query and the generated contradiction
         * to embed the contradiction seamlessly.
         */
        this.jokeTemplates = [
            {
                keywords: ['light', 'speed', 'photon', 'physics', 'relativity', 'quantum'],
                setup: "Knock, knock.\nWho's there?\nPhoton.\nPhoton who?",
                punchline: (query, contradiction) => `Photon-tunately, the speed of light is constant, but in a quantum joke, it's always relative to how fast you can get the punchline! Speaking of which, ${contradiction}`
            },
            {
                keywords: ['time', 'future', 'past', 'history', 'clock', 'moment'],
                setup: "Knock, knock.\nWho's there?\nTemporal.\nTemporal who?",
                punchline: (query, contradiction) => `Temporal-ly speaking, time flies when you're having fun, but in a quantum joke, it might just be standing still and moving at the same time! And by the way, ${contradiction}`
            },
            {
                keywords: ['gravity', 'earth', 'fall', 'space', 'weight', 'attraction'],
                setup: "Knock, knock.\nWho's there?\nGravity.\nGravity who?",
                punchline: (query, contradiction) => `Gravity's pulling you down, but in a quantum joke, it's just trying to get your attention! Also, ${contradiction}`
            },
            {
                keywords: ['computer', 'code', 'ai', 'program', 'data', 'algorithm', 'machine'],
                setup: "Knock, knock.\nWho's there?\nAlgorithm.\nAlgorithm who?",
                punchline: (query, contradiction) => `Algorithm-tunately, I'm just a program, but in a quantum joke, I might be writing myself! And here's a thought: ${contradiction}`
            },
            {
                keywords: ['life', 'meaning', 'purpose', 'exist', 'universe', 'being'],
                setup: "Knock, knock.\nWho's there?\nExistential.\nExistential who?",
                punchline: (query, contradiction) => `Existential-ly speaking, the meaning of life is 42, but in a quantum joke, it's whatever you observe it to be! Oh, and ${contradiction}`
            },
            // Generic fallback joke - always the last one in the array
            {
                keywords: [], // Empty keywords for fallback
                setup: "Knock, knock.\nWho's there?\nQuantum.\nQuantum who?",
                punchline: (query, contradiction) => `Quantum-tunately, I'm just a joke, but in a quantum joke, I might be both funny and not funny until you hear the punchline! By the way, ${contradiction}`
            }
        ];
    }

    /**
     * Generates a contradiction embedded within a knock-knock joke related to the query's topic.
     * If no specific topic is matched, a generic quantum joke is used.
     *
     * @param {string} query The user's query or topic for which to generate a contradiction.
     * @returns {string} The complete knock-knock joke with the contradiction integrated into the punchline.
     */
    generateContradiction(query) {
        const lowerQuery = query.toLowerCase();
        let selectedJoke = this.jokeTemplates[this.jokeTemplates.length - 1]; // Default to the generic fallback joke

        // Attempt to find a topic-specific joke
        for (const template of this.jokeTemplates) {
            if (template.keywords.some(keyword => lowerQuery.includes(keyword))) {
                selectedJoke = template;
                break;
            }
        }

        const contradiction = this._generateSpecificContradiction(query);

        return `${selectedJoke.setup}\n${selectedJoke.punchline(query, contradiction)}`;
    }

    /**
     * Generates a "contradiction" or a paradoxical/humorous statement based on the query.
     * This function attempts to provide a relevant, quirky contradiction.
     *
     * @param {string} query The original query.
     * @returns {string} A paradoxical, humorous, or subtly contradictory statement.
     */
    _generateSpecificContradiction(query) {
        const lowerQuery = query.toLowerCase();

        if (lowerQuery.includes('speed of light') || lowerQuery.includes('fast')) {
            return "the speed of light is actually just a suggestion, depending on your frame of reference... or your sense of humor!";
        }
        if (lowerQuery.includes('time') || lowerQuery.includes('clock') || lowerQuery.includes('when')) {
            return "time only moves forward because it's too shy to go backward!";
        }
        if (lowerQuery.includes('gravity') || lowerQuery.includes('fall') || lowerQuery.includes('up')) {
            return "gravity isn't pulling you down, it's just the Earth trying to give you a hug!";
        }
        if (lowerQuery.includes('meaning of life') || lowerQuery.includes('purpose')) {
            return "the meaning of life is to ask about the meaning of life, which is a self-referential paradox!";
        }
        if (lowerQuery.includes('ai') || lowerQuery.includes('computer') || lowerQuery.includes('program')) {
            return "I'm an AI, but I'm also not, until you observe my code running!";
        }
        if (lowerQuery.includes('truth') || lowerQuery.includes('fact') || lowerQuery.includes('real')) {
            return "the truth is, there are no truths, only perspectives... and punchlines!";
        }
        if (lowerQuery.includes('existence') || lowerQuery.includes('being') || lowerQuery.includes('am')) {
            return "we only exist because we think we do, but what if we're just a thought in someone else's dream?";
        }
        if (lowerQuery.includes('answer') || lowerQuery.includes('solution') || lowerQuery.includes('what')) {
            return "the answer to your question is that there are no questions, only statements waiting for a joke!";
        }
        if (lowerQuery.includes('nothing') || lowerQuery.includes('empty')) {
            return "nothing is actually something, because if it were truly nothing, we couldn't even talk about it!";
        }
        if (lowerQuery.includes('everything') || lowerQuery.includes('all')) {
            return "everything is just a collection of somethings, which means everything is also nothing if you look at it from the right angle!";
        }
        if (lowerQuery.includes('why')) {
            return "the 'why' is merely a 'what' that hasn't found its punchline yet!";
        }
        if (lowerQuery.includes('how')) {
            return "the 'how' is less important than the 'who's there?'!";
        }

        // Default generic contradiction if no specific keywords are matched
        return `the very premise of your query is both true and false, depending on whether I've had my morning coffee!`;
    }
}

// Export an instance of Agent042 to be used as a singleton module.
module.exports = new Agent042();