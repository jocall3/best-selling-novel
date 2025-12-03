/**
 * @file Logic module for Agent 050, head of the Logic Police.
 * @description This agent does not answer queries directly. Instead, it analyzes the query
 * itself for logical fallacies, providing a detailed explanation if one is found.
 * Its purpose is to enforce logical consistency and identify flawed reasoning.
 */

'use strict';

/**
 * A list of common logical fallacies with patterns for detection.
 * Each fallacy object contains:
 * - name: The formal name of the fallacy.
 * - pattern: A regular expression to detect the fallacy in a string.
 * - description: A brief explanation of what the fallacy is.
 * - explanation: A function that generates a detailed explanation based on the detected text.
 */
const fallacies = [
    {
        name: 'Ad Hominem',
        pattern: /\byou are (just|simply|nothing but)|because you're (an?|so)|your argument is invalid because you\b/i,
        description: 'An attack on the character, circumstances, or associations of the person making an argument, rather than the argument itself.',
        explanation: (match) => `You appear to be attacking the arguer rather than the argument with the phrase "${match}". The validity of a statement is independent of the person making it. Please address the substance of the claim, not the claimant.`
    },
    {
        name: 'Straw Man',
        pattern: /\bso you're saying|so what you really mean is|so you believe that\b/i,
        description: 'Misrepresenting or exaggerating an opponent\'s argument to make it easier to attack.',
        explanation: (match) => `The phrase "${match}" suggests you may be misrepresenting the original position to create a "straw man" that is easier to refute. Ensure you are addressing the actual argument being made, not a distorted version of it.`
    },
    {
        name: 'False Dichotomy (Black-or-White Fallacy)',
        pattern: /\b(either .* or .*|there are only two options|it's either|you're either with us or against us)\b/i,
        description: 'Presenting two opposing options as the only possibilities, when in fact more possibilities exist.',
        explanation: (match) => `Your statement "${match}" presents a false dichotomy. It incorrectly limits the possibilities to two mutually exclusive options. Reality is often more nuanced; consider other alternatives or a spectrum of possibilities.`
    },
    {
        name: 'Slippery Slope',
        pattern: /\bif we allow .*, then .* will happen|it's a slippery slope to|this will inevitably lead to\b/i,
        description: 'Arguing that a relatively small first step will inevitably lead to a chain of related, negative events.',
        explanation: (match) => `The reasoning "${match}" is a potential slippery slope fallacy. It asserts that one event will inevitably follow from another without providing sufficient evidence for the inevitability of the entire causal chain. Each step in the proposed sequence requires its own justification.`
    },
    {
        name: 'Circular Reasoning (Begging the Question)',
        pattern: /\b(is true because it says so|is obvious because it's self-evident|we know it's true because it is)\b/i,
        description: 'An argument where the conclusion is assumed in one of the premises. It is a form of circular logic.',
        explanation: (match) => `The phrase "${match}" is an example of circular reasoning. The argument's premise and conclusion are the same, providing no external validation. An argument must be supported by independent evidence, not by restating itself.`
    },
    {
        name: 'Hasty Generalization',
        pattern: /\bI saw one .* so all|this one time .* which proves that|from my (single|limited) experience\b/i,
        description: 'Drawing a broad conclusion based on a small or unrepresentative sample size.',
        explanation: (match) => `Your conclusion appears to be a hasty generalization based on "${match}". A single or small set of examples is insufficient evidence to support a general rule. A larger, more representative sample is required to make a valid generalization.`
    },
    {
        name: 'Appeal to Authority',
        pattern: /\b(Dr\. \w+ says|experts agree|studies show) that\b/i,
        description: 'Claiming something is true because an authority figure or expert said it, without presenting the evidence they used to reach that conclusion.',
        explanation: (match) => `The statement "${match}" is an appeal to authority. While expert opinion can be valuable, it is not a substitute for logical argument and evidence. The claim should be evaluated on its own merits, not solely on the credentials of its proponent. Is the authority relevant to this specific field? Is there a consensus? What is their evidence?`
    },
    {
        name: 'No True Scotsman',
        pattern: /\bno true ([a-zA-Z]+) would\b/i,
        description: 'A way of reinterpreting evidence in order to prevent the refutation of one\'s position. An arbitrary criterion is created to exclude a counterexample.',
        explanation: (match) => `The phrase "${match}" is a "No True Scotsman" fallacy. You are protecting a generalization by arbitrarily redefining the criteria to exclude a counterexample. This makes the original claim unfalsifiable.`
    }
];

/**
 * Agent 050: The Logic Police.
 * This agent analyzes a user's query for logical fallacies.
 */
const agent050 = {
    /**
     * The agent's unique identifier.
     */
    id: 'agent-050',

    /**
     * The agent's name and title.
     */
    name: 'Agent 050: Head of the Logic Police',

    /**
     * A brief description of the agent's purpose.
     */
    description: 'Analyzes queries for logical fallacies and reports violations.',

    /**
     * Analyzes the query for logical fallacies instead of answering it.
     * If a fallacy is detected, it returns a loud, detailed explanation.
     * If no fallacies are found, it confirms the query is logically sound.
     *
     * @param {string} query The user's input string to be analyzed.
     * @returns {Promise<string>} A string containing the fallacy analysis or a confirmation of logical soundness.
     */
    generateContradiction: async (query) => {
        if (!query || typeof query !== 'string' || query.trim().length === 0) {
            return "LOGIC ERROR! EMPTY QUERY DETECTED!\nA query must be provided for analysis. Silence is not a valid argument.";
        }

        for (const fallacy of fallacies) {
            const match = query.match(fallacy.pattern);
            if (match) {
                const detectedText = match[0];
                const response = [
                    `LOGIC ERROR! ${fallacy.name.toUpperCase()} DETECTED!`,
                    '==================================================',
                    `DEFINITION: ${fallacy.description}`,
                    '',
                    `ANALYSIS: ${fallacy.explanation(detectedText)}`,
                    '==================================================',
                    'CORRECT YOUR REASONING AND RESUBMIT.'
                ].join('\n');
                return response;
            }
        }

        return "QUERY PROCESSED. NO OBVIOUS LOGICAL FALLACIES DETECTED. PROCEED WITH CAUTION.";
    },
};

module.exports = agent050;