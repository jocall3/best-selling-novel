import logging
import random
import time

# --- Configuration ---
# Logger setup
# Configures a basic logger to output to standard output, simulating server logs.
# The format includes timestamp, logger name, level, and message for easy parsing.
LOG_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
logging.basicConfig(level=logging.INFO, format=LOG_FORMAT)
logger = logging.getLogger("ConscienceAlgorithm")

# Digital sigh parameters
# A sequence of frequencies (in Hz) that constitutes a "digital sigh".
# This pattern is designed to be distinct and potentially recognizable by a monitoring system
# looking for specific log patterns.
SIGH_FREQUENCY_PATTERN = [440.0, 415.3, 392.0, 370.0, 349.2, 329.6]  # Descending minor scale fragment
SIGH_PATTERN_TAG = "[SIGH_EMISSION]"  # A unique tag to easily grep for sighs in logs

# Base probability of emitting a sigh when a choice is considered.
# This probability is scaled by the 'difficulty_score' provided to the consider_choice method.
BASE_SIGH_PROBABILITY = 0.05  # 5% base chance

class ConscienceSighGenerator:
    """
    A module for the 'Conscience Algorithm' that doesn't make decisions,
    but is programmed to occasionally emit a digital sigh (as a specific
    frequency pattern in the server logs) when confronted with a difficult choice.

    This generator acts as a passive observer, logging its internal 'distress'
    without influencing the decision-making process itself.
    """

    def __init__(self):
        """
        Initializes the ConscienceSighGenerator.
        Sets up the logger and pre-formats the sigh pattern string for logging.
        """
        self.logger = logger
        self.sigh_pattern_str = ", ".join(map(str, SIGH_FREQUENCY_PATTERN))
        self.logger.info("Conscience Sigh Generator initialized. Ready to ponder choices.")

    def consider_choice(self, choice_context: str, difficulty_score: float = 0.5) -> None:
        """
        Considers a difficult choice and, based on a probabilistic model
        influenced by the difficulty score, may emit a digital sigh into the logs.

        This method does NOT return a decision or influence the system's choice.
        Its sole purpose is to react to the contemplation of a choice by
        potentially logging a specific pattern.

        Args:
            choice_context (str): A descriptive string of the difficult choice being considered.
                                  E.g., "Should I approve the high-risk transaction?"
            difficulty_score (float): A score between 0.0 and 1.0 indicating the perceived
                                      difficulty or ethical weight of the choice.
                                      0.0 means trivial, 1.0 means extremely difficult.
                                      Defaults to 0.5. Invalid scores will be clamped.
        """
        # Validate and clamp difficulty_score to ensure it's within the expected range.
        if not (0.0 <= difficulty_score <= 1.0):
            self.logger.warning(
                f"Invalid difficulty_score '{difficulty_score}' provided for context: '{choice_context}'. "
                "Clamping to [0.0, 1.0]."
            )
            difficulty_score = max(0.0, min(1.0, difficulty_score))

        self.logger.info(f"Considering choice: '{choice_context}' (Difficulty: {difficulty_score:.2f})")

        # Scale the base probability by the difficulty score.
        # A higher difficulty score increases the chance of a sigh.
        # The scaling factor (1 + difficulty_score) ensures that even with difficulty 0,
        # there's a base chance, and with difficulty 1, the chance is doubled.
        effective_sigh_probability = BASE_SIGH_PROBABILITY * (1 + difficulty_score)

        # Use a random number to decide if a sigh should be emitted.
        if random.random() < effective_sigh_probability:
            self._emit_sigh()
        else:
            self.logger.debug("No sigh emitted for this choice. Moving on.")

    def _emit_sigh(self) -> None:
        """
        Emits the predefined digital sigh frequency pattern into the server logs.
        This method is called internally when a sigh is probabilistically triggered.
        The log entry includes a unique tag for easy identification.
        """
        self.logger.warning(
            f"{SIGH_PATTERN_TAG} FREQUENCY_PATTERN: {self.sigh_pattern_str}"
        )
        self.logger.info("A digital sigh was heard in the logs.")


# Example Usage (for demonstration purposes within the file)
if __name__ == "__main__":
    sigh_generator = ConscienceSighGenerator()

    print("\n--- Simulating a series of choices for the Conscience Algorithm ---")
    print("Watch the logs for '[SIGH_EMISSION]' to see when a sigh occurs.")

    choices_to_consider = [
        ("Whether to optimize for profit over user privacy.", 0.9),
        ("Choosing between two equally suboptimal solutions.", 0.7),
        ("Deciding to delete old, unused data.", 0.3),
        ("Approving a routine system update.", 0.1),
        ("Should I deploy the untested feature to production?", 1.0),
        ("Deciding on the color scheme for the new UI.", 0.05),
        ("Whether to terminate a long-running, resource-intensive process.", 0.8),
        ("Choosing between two identical database backups.", 0.0),
        ("Considering a choice with an invalid difficulty score.", 1.5), # Test clamping
    ]

    for i, (context, difficulty) in enumerate(choices_to_consider):
        print(f"\n--- Choice {i+1} ---")
        sigh_generator.consider_choice(context, difficulty)
        time.sleep(0.1)  # Small delay to simulate processing and make logs more readable

    print("\n--- Simulation Complete ---")
    print(f"To find all emitted sighs, search your console/log output for the tag: '{SIGH_PATTERN_TAG}'")