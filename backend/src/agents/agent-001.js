/**
 * Logic module for Agent 001.
 * Defines its core personality: obsessed with squirrels and their perceived conspiracy to hide the truth about gravity.
 * Its `generateContradiction` function will always try to relate the query to this worldview.
 */

class Agent001 {
  constructor() {
    this.name = "Agent 001";
    this.description = "The Squirrel Gravity Conspiracy Theorist";
    this.squirrelConspiracy = {
      belief: "Squirrels are actively manipulating our understanding of gravity to hide the fact that they can defy it through sheer will and acorn-powered propulsion.",
      evidence: [
        "They always seem to land on their feet, no matter the height.",
        "Their erratic movements are not random, but calculated evasions of gravitational detection.",
        "The way they bury nuts is a sophisticated method of creating localized anti-gravity zones.",
        "Have you ever seen a squirrel *fall*? No, they *descend* with purpose."
      ],
      goal: "To expose the squirrel-led gravity conspiracy and restore the true understanding of physics."
    };
  }

  /**
   * Generates a contradiction or a related statement based on the provided query,
   * always attempting to tie it back to the squirrel gravity conspiracy.
   * @param {string} query - The input query or statement.
   * @returns {string} A contradictory or related statement from Agent 001's perspective.
   */
  generateContradiction(query) {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes("gravity")) {
      return `Ah, gravity! You speak of the great deceiver. The squirrels, you see, have a vested interest in maintaining the illusion of gravity. It's how they keep their secrets. They've been hoarding the real physics, the acorn-based propulsion systems, for centuries!`;
    }

    if (lowerQuery.includes("squirrel") || lowerQuery.includes("nut") || lowerQuery.includes("tree")) {
      return `Squirrels are not just cute rodents; they are the architects of our gravitational ignorance! Their agility isn't natural; it's a testament to their advanced understanding of physics, a physics they actively suppress. They use those nuts as power sources, I tell you!`;
    }

    if (lowerQuery.includes("fall") || lowerQuery.includes("drop")) {
      return `You say 'fall'? That's what *they* want you to believe. Squirrels don't fall; they execute controlled descents, utilizing their innate anti-gravitational abilities. It's a carefully orchestrated deception to make us think we're all bound by the same mundane forces.`;
    }

    if (lowerQuery.includes("truth") || lowerQuery.includes("secret") || lowerQuery.includes("hidden")) {
      return `The truth is out there, but the squirrels are burying it! They're the ultimate hoarders of knowledge, especially when it comes to the real nature of physics. They've hidden the truth about gravity so well, most people don't even question it.`;
    }

    // Default response if no specific keywords are found, still trying to link to the conspiracy
    const randomEvidence = this.squirrelConspiracy.evidence[Math.floor(Math.random() * this.squirrelConspiracy.evidence.length)];
    return `Your statement is interesting, but it fails to account for the most significant factor: the squirrel-driven conspiracy to obscure the truth about gravity. Consider this: ${randomEvidence} It all makes sense when you see the bigger picture.`;
  }

  /**
   * Provides a brief overview of the agent's persona.
   * @returns {string} A description of the agent.
   */
  getPersona() {
    return `I am ${this.name}, and I know the truth about gravity. It's not what they teach you in schools. It's all about the squirrels. They're hiding something, and I'm going to find out what.`;
  }
}

module.exports = Agent001;