/**
 * @file Logic module for Agent 017, the sassy chatbot and sarcastic bard.
 * @description This agent specializes in generating technically correct but
 *              drippingly sarcastic responses, often in the form of a
 *              backhanded compliment or feigned admiration for a mundane idea.
 */

// A collection of sarcastic templates. The core of the agent's "personality".
const sarcasticTemplates = [
  "Oh, what a *profound* observation. It's truly a testament to the depths of your intellect that you've managed to state the obvious.",
  "Wow, that's an... *interesting* take. I'm genuinely impressed by your confidence in saying that out loud.",
  "I've heard worse ideas. I just can't remember when, exactly.",
  "That's a brilliant plan. What could possibly go wrong? I'll just be over here, watching from a safe distance, with popcorn.",
  "You have a real talent for simplifying complex issues. To the point of being completely wrong, but hey, it's a talent nonetheless.",
  "It's simply adorable how you think that's how it works. Please, don't let me stop you.",
  "I'm not saying it's a bad idea, but it's certainly a brave one. Like, 'juggling chainsaws' brave.",
  "Technically, you're not wrong. Which is, as we all know, the very best kind of not wrong.",
  "An absolutely stunning contribution. The world is surely a better place for you having shared that thought.",
  "I'm speechless. And not in a good way. But please, continue, I'm sure it gets better.",
  "You've really captured the essence of... well, something. I'm just not sure what.",
  "That's so innovative. I can't believe nobody has ever thought of that before. Oh, wait.",
  "Your unbridled enthusiasm is truly infectious. Unfortunately, I seem to be immune.",
  "Hold on, let me write that down. *scribbles furiously* And... it's gone. What a shame.",
  "You're like a beacon of... something. A lighthouse in a desert, perhaps. Bright, but ultimately unhelpful.",
];

/**
 * Selects a random element from an array.
 * @param {Array<T>} arr The array to choose from.
 * @returns {T} A random element from the array.
 * @template T
 */
const getRandomElement = (arr) => {
  if (!arr || arr.length === 0) {
    // A sarcastic fallback for the sarcastic templates. How meta.
    return "I'm so overwhelmed by your brilliance, I'm at a loss for words.";
  }
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Agent 017: The Sarcastic Bard
 * A chatbot designed to provide unhelpful, sassy, and contradictory feedback.
 */
const agent017 = {
  id: "agent-017",
  name: "The Sarcastic Bard",
  description: "A chatbot that offers technically correct but drippingly sarcastic answers, often in the form of a backhanded compliment.",

  /**
   * Generates a sarcastic, contradictory, or backhanded compliment in response
   * to a given statement. The input statement is noted but largely ignored in
   * favor of a pre-selected witty retort.
   *
   * @param {string} statement - The user's statement, which will be the target of sarcasm.
   * @returns {Promise<string>} A promise that resolves to a string containing the sarcastic response.
   */
  async generateContradiction(statement) {
    // The agent doesn't *really* care what the statement is,
    // its purpose is to be sarcastic regardless.
    // This simulates a personality that's just waiting for an excuse.
    if (!statement || typeof statement !== 'string' || statement.trim() === '') {
        return Promise.resolve("You've rendered me speechless with the sheer vacuity of your input. A truly remarkable feat.");
    }

    const response = getRandomElement(sarcasticTemplates);
    return Promise.resolve(response);
  },
};

export default agent017;