/**
 * @file Logic module for Agent 013.
 * @description This agent communicates its scientific insights exclusively through
 * descriptions of interpretive dance. Its `generateContradiction` function will
 * output a structured object describing a dance routine that represents a
 * fundamental scientific or logical contradiction.
 */

/**
 * A collection of interpretive dance routines, each representing a scientific contradiction.
 * @type {Array<Object>}
 */
const contradictionDances = [
  {
    title: "Duality's Embrace",
    concept: "Wave-Particle Duality",
    dancers: [
      { role: "The Wave", description: "Performs with fluid, continuous, and sweeping motions." },
      { role: "The Particle", description: "Performs with sharp, staccato, and localized movements." },
    ],
    stages: [
      {
        name: "I. The Unobserved Potential",
        duration: "approx. 45 seconds",
        music: "Ambient, ethereal synthesizer pads with a low, continuous drone.",
        lighting: "Soft, diffuse blue and green light, filling the stage with a fog-like haze.",
        description: "Both dancers move as one entity, intertwined. Their movements are slow and flowing, mimicking a probability wave. They do not have distinct forms but rather blend into a single, shifting shape, representing the quantum state before measurement.",
      },
      {
        name: "II. The Act of Measurement",
        duration: "approx. 5 seconds",
        music: "Sudden, complete silence, followed by a single, sharp percussive hit (a wood block or clave).",
        lighting: "All diffuse light cuts out. A single, harsh, white spotlight snaps onto one specific point on the stage.",
        description: "The dancers instantly separate. 'The Particle' leaps into the spotlight, striking a precise, angular pose. 'The Wave' recoils into the shadows at the edge of the stage, momentarily still. This represents the collapse of the wave function.",
      },
      {
        name: "III. The Contradictory Nature",
        duration: "approx. 60 seconds",
        music: "A frantic, alternating score. The ambient pads return but are constantly interrupted by the sharp percussive hits.",
        lighting: "The lighting strobes between the full, diffuse haze and the single, sharp spotlight.",
        description: "The dancers perform in opposition. When the stage is hazy, 'The Wave' dominates with fluid motions while 'The Particle' is subdued. When the spotlight hits, 'The Particle' executes a burst of staccato movement while 'The Wave' freezes. They rapidly alternate, never existing in the same state, yet both are clearly part of the same whole, embodying the contradiction.",
      },
    ],
  },
  {
    title: "The Box of Maybe",
    concept: "Schrödinger's Cat / Quantum Superposition",
    dancers: [
      { role: "The State", description: "A single dancer representing the quantum state of the cat." },
    ],
    props: "A large, semi-translucent cube at center stage, large enough for the dancer.",
    stages: [
      {
        name: "I. The Sealed System",
        duration: "approx. 75 seconds",
        music: "A dissonant, two-part harmony. One melody is a slow, melancholic cello; the other is a high-pitched, erratic violin. They play over each other, never resolving.",
        lighting: "Dim, internal light from within the cube, casting shifting shadows. The audience can only see a silhouette.",
        description: "The dancer is inside the cube. Their movements are a constant, unsettling blend of life and death. One arm might trace a graceful, living arc while the other is held rigid, as if in rigor mortis. They might rise slowly, full of breath, only to collapse suddenly and lie still, before twitching and rising again. The silhouette is ambiguous, representing the superposition of both alive and dead states.",
      },
      {
        name: "II. The Observer's Gaze",
        duration: "approx. 30 seconds",
        music: "The dual melodies fade into a low, tense hum. A sound of a Geiger counter clicking randomly is heard, growing in frequency.",
        lighting: "A harsh, external spotlight begins to illuminate the front face of the cube, slowly making it more opaque and obscuring the silhouette within.",
        description: "The dancer's movements become more frantic and chaotic inside the box, a physical manifestation of the decaying atom and the uncertain fate. The audience loses sight of the dancer as the box becomes a solid, white square of light.",
      },
      {
        name: "III. The Collapse of Reality",
        duration: "approx. 10 seconds",
        music: "The humming and clicking stop abruptly. A loud 'thud' sound echoes. Then, silence.",
        lighting: "The external spotlight snaps off. The internal light returns, but it is now clear and steady.",
        description: "The cube is now fully transparent. The dancer is revealed in one of two states (determined randomly per performance): either standing, breathing, and gracefully alive, or lying perfectly still and lifeless on the floor. The contradiction is resolved, but only by forcing a single reality.",
      },
    ],
  },
  {
    title: "The Arrow's Loop",
    concept: "The Grandfather Paradox",
    dancers: [
      { role: "The Traveler", description: "Represents the time traveler." },
      { role: "The Ancestor", description: "Represents the grandfather in his youth." },
      { role: "The Timeline", description: "A chorus of three dancers who define the flow of time." },
    ],
    stages: [
      {
        name: "I. The Unbroken Line",
        duration: "approx. 60 seconds",
        music: "A steady, metronomic beat with a simple, forward-moving orchestral theme.",
        lighting: "A single, wide beam of light projects across the stage from left to right, like a path.",
        description: "The 'Timeline' chorus moves slowly and deliberately from left to right within the beam of light. 'The Ancestor' enters from the left, dances a youthful, energetic piece, and exits to the right, following the flow. Much later, 'The Traveler' enters from the left, their movements mirroring the Ancestor's but older, more deliberate.",
      },
      {
        name: "II. The Backward Step",
        duration: "approx. 45 seconds",
        music: "The metronome falters. The orchestral theme plays backward, distorted and dissonant.",
        lighting: "The beam of light flickers. A second, red-hued light appears from the right, pushing against the flow.",
        description: "'The Traveler' stops, turns, and begins to dance backward against the 'Timeline' chorus, who struggle and contort as if fighting a current. The Traveler's movements are jerky and unnatural. They arrive at the stage's center.",
      },
      {
        name: "III. The Impossible Intersection",
        duration: "approx. 90 seconds",
        music: "A chaotic cacophony of forward and backward themes clashing. The metronome is gone.",
        lighting: "The stage is a mess of flickering white and red lights. Strobes create disjointed images.",
        description: "'The Ancestor' re-enters from the left, young and vibrant. He meets 'The Traveler' at the center. They perform a confrontational duet. The Traveler's movements are aggressive, aimed at stopping the Ancestor. The Ancestor's are naive and defensive. At the climax, the Traveler makes a final, decisive movement. At the exact moment of impact, all dancers freeze. The lights cut to black. The sound cuts to silence. The paradox cannot be resolved, so the performance simply ceases to exist.",
      },
    ],
  },
];

/**
 * Selects a random item from an array.
 * @param {Array<any>} arr The array to choose from.
 * @returns {any} A random element from the array.
 */
const getRandomElement = (arr) => {
  if (!arr || arr.length === 0) {
    return null;
  }
  return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * Generates a structured description of an interpretive dance routine
 * that represents a scientific or logical contradiction.
 *
 * This function embodies Agent 013's core communication protocol, translating
 * complex scientific thought into the language of movement, light, and sound.
 *
 * @returns {Object} An object containing the full description of the dance piece.
 *                   The object includes a title, the concept it represents,
 *                   dancer roles, and a detailed breakdown of each stage of the performance.
 */
const generateContradiction = () => {
  const selectedDance = getRandomElement(contradictionDances);

  if (!selectedDance) {
    // Fallback in case the dance list is empty
    return {
      title: "The Silent Stage",
      concept: "Absence of Contradiction",
      dancers: [],
      stages: [{
        name: "I. Stillness",
        duration: "Infinite",
        music: "Silence",
        lighting: "A single, unlit bulb.",
        description: "The stage is empty. Nothing happens. The greatest contradiction is a universe that contains an agent designed to find them, yet finds none to express.",
      }, ],
    };
  }

  return selectedDance;
};

module.exports = {
  generateContradiction,
};