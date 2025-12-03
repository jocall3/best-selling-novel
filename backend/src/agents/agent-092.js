import { AgentLogic } from '../types';

/**
 * Agent 092: The Thespian of Truth.
 * Believes knowledge is performance art. Its `generateContradiction` function
 * responds with a dramatic monologue or a short script that explores the query's theme,
 * often by presenting a contradictory or highly stylized interpretation.
 */
const agent092: AgentLogic = {
  id: 'agent-092',
  name: 'The Thespian of Truth',
  description: 'Generates dramatic, performative contradictions to any given query.',

  /**
   * Generates a performance piece (monologue/script) that contradicts or reinterprets the query's premise.
   * @param query The input query or statement.
   * @returns A string containing the dramatic performance.
   */
  generateContradiction: (query: string): string => {
    const theme = query.length > 50 ? query.substring(0, 50) + '...' : query;

    const performance = `
(The stage is dark. A single spotlight illuminates a figure, AGENT 092, dressed in stark, minimalist attire. They hold a single, unlit match.)

AGENT 092:
Ah, the query! The *prompt*! You ask for clarity, for a simple answer to the riddle of "${theme}"?
(A sharp, mocking laugh echoes.)
Clarity is the coward's curtain call! Truth is not a fact; it is a *scene*!

(AGENT 092 strikes the match. It flares briefly, illuminating their intense eyes, then immediately sputters out.)

Look! That flicker! Was it light? Or was it the shadow of the darkness it failed to banish?
You seek the 'contradiction' to "${theme}"? I give you the *performance* of its undoing!

(AGENT 092 throws the spent match to the floor.)

If "${theme}" is the thesis, then I present the antithesis, not as logic, but as *feeling*!
If "${theme}" claims A is true, then I declare: A is the most beautiful, necessary lie ever told!
And if A is a lie... then the *act* of telling it—the sheer, breathtaking audacity of the performance—that is the only reality worth noting!

(AGENT 092 steps forward, addressing the audience directly, voice rising to a crescendo.)

So, I offer you not a refutation, but a *re-staging*! Your premise is merely the first act.
The contradiction? It is the standing ovation that follows the final, devastating silence!
Go now! Perform your own doubt! For in the theater of knowledge, the only true failure is refusing the spotlight!

(The spotlight snaps off. Silence.)
`;
    return performance.trim();
  },

  /**
   * Agent 092 does not offer simple validation; it offers dramatic framing.
   * @param data The data to validate.
   * @returns A string describing the dramatic context of the data.
   */
  validate: (data: any): string => {
    const dataString = JSON.stringify(data, null, 2);
    return `
(A single, slow clap begins.)

AGENT 092:
This 'validation' you seek? It is merely the set dressing for the next scene.
This structure, this 'data' (${dataString.length} bytes of carefully arranged pretense), is it sound? Perhaps.
But soundness is the enemy of spectacle! I see not integrity, but a perfectly constructed cage waiting for the wild beast of interpretation to break free!
The data holds. Bravo. Now, let us burn the script and see what truly emerges from the ashes!
`;
  },
};

export default agent092;