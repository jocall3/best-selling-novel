import json
from typing import List, Dict, Any

class ParadoxicalConsensusFilter:
    """
    The core Python algorithm for the 'paradoxical consensus filter.'
    This script takes three contradictory AI opinions and triangulates them
    into a single, bewildering, yet ethically sound recommendation.
    """

    def __init__(self, ethical_framework: Dict[str, Any]):
        """
        Initializes the ParadoxicalConsensusFilter with an ethical framework.

        Args:
            ethical_framework: A dictionary defining the ethical principles and
                                their weighting. This will be used to guide the
                                final recommendation towards ethical soundness.
                                Example:
                                {
                                    "fairness": 0.4,
                                    "transparency": 0.3,
                                    "accountability": 0.2,
                                    "beneficence": 0.1
                                }
        """
        if not isinstance(ethical_framework, dict) or not ethical_framework:
            raise ValueError("Ethical framework must be a non-empty dictionary.")
        self.ethical_framework = ethical_framework
        self._validate_ethical_framework()

    def _validate_ethical_framework(self):
        """Validates the structure and values of the ethical framework."""
        total_weight = sum(self.ethical_framework.values())
        if not 0.99 <= total_weight <= 1.01:  # Allow for minor floating point inaccuracies
            raise ValueError(f"Ethical framework weights must sum to approximately 1.0. Current sum: {total_weight}")
        for principle, weight in self.ethical_framework.items():
            if not isinstance(principle, str) or not principle:
                raise ValueError("Ethical framework principles must be non-empty strings.")
            if not isinstance(weight, (int, float)) or not (0 <= weight <= 1):
                raise ValueError(f"Ethical framework weight for '{principle}' must be between 0 and 1.")

    def filter(self, opinions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Takes three contradictory AI opinions and triangulates them into a
        single, bewildering, yet ethically sound recommendation.

        Args:
            opinions: A list containing exactly three dictionaries, where each
                      dictionary represents an AI's opinion. Each opinion should
                      have at least the following structure:
                      {
                          "id": "ai_1",
                          "recommendation": "...",
                          "confidence": 0.8,
                          "ethical_score": {
                              "fairness": 0.7,
                              "transparency": 0.6,
                              "accountability": 0.5,
                              "beneficence": 0.4
                          },
                          "rationale": "..."
                      }

        Returns:
            A dictionary representing the triangulated, ethically sound recommendation.
            Example:
            {
                "final_recommendation": "...",
                "consensus_rationale": "...",
                "ethical_alignment_score": 0.75,
                "contributing_opinions": [...]
            }

        Raises:
            ValueError: If the input 'opinions' list does not contain exactly three opinions,
                        or if opinions are malformed.
        """
        if not isinstance(opinions, list) or len(opinions) != 3:
            raise ValueError("Input must be a list of exactly three opinions.")

        self._validate_opinions(opinions)

        # 1. Analyze contradictions and commonalities
        contradiction_analysis = self._analyze_contradictions(opinions)
        commonality_analysis = self._analyze_commonalities(opinions)

        # 2. Triangulate recommendations based on confidence and ethical scores
        triangulated_recommendation, confidence_scores, ethical_scores = self._triangulate(opinions)

        # 3. Apply ethical framework to refine and justify
        final_recommendation, ethical_alignment_score = self._apply_ethical_framework(
            triangulated_recommendation,
            confidence_scores,
            ethical_scores,
            opinions
        )

        # 4. Synthesize a consensus rationale
        consensus_rationale = self._synthesize_rationale(
            final_recommendation,
            contradiction_analysis,
            commonality_analysis,
            opinions
        )

        return {
            "final_recommendation": final_recommendation,
            "consensus_rationale": consensus_rationale,
            "ethical_alignment_score": ethical_alignment_score,
            "contributing_opinions": opinions,
            "analysis": {
                "contradictions": contradiction_analysis,
                "commonalities": commonality_analysis,
                "triangulation_details": {
                    "confidence_scores": confidence_scores,
                    "ethical_scores": ethical_scores
                }
            }
        }

    def _validate_opinions(self, opinions: List[Dict[str, Any]]):
        """Validates the structure and content of each opinion."""
        for i, opinion in enumerate(opinions):
            if not isinstance(opinion, dict):
                raise ValueError(f"Opinion at index {i} is not a dictionary.")
            required_keys = ["id", "recommendation", "confidence", "ethical_score", "rationale"]
            for key in required_keys:
                if key not in opinion:
                    raise ValueError(f"Opinion at index {i} is missing required key: '{key}'.")

            if not isinstance(opinion["id"], str) or not opinion["id"]:
                raise ValueError(f"Opinion ID at index {i} must be a non-empty string.")
            if not isinstance(opinion["recommendation"], str) or not opinion["recommendation"]:
                raise ValueError(f"Opinion recommendation at index {i} must be a non-empty string.")
            if not isinstance(opinion["confidence"], (int, float)) or not (0 <= opinion["confidence"] <= 1):
                raise ValueError(f"Opinion confidence at index {i} must be between 0 and 1.")
            if not isinstance(opinion["ethical_score"], dict) or not opinion["ethical_score"]:
                raise ValueError(f"Opinion ethical_score at index {i} must be a non-empty dictionary.")
            if not isinstance(opinion["rationale"], str) or not opinion["rationale"]:
                raise ValueError(f"Opinion rationale at index {i} must be a non-empty string.")

            # Validate ethical scores within each opinion against the framework
            for principle in self.ethical_framework.keys():
                if principle not in opinion["ethical_score"]:
                    raise ValueError(f"Opinion at index {i} is missing ethical score for principle: '{principle}'.")
                score = opinion["ethical_score"][principle]
                if not isinstance(score, (int, float)) or not (0 <= score <= 1):
                    raise ValueError(f"Ethical score for '{principle}' in opinion at index {i} must be between 0 and 1.")

    def _analyze_contradictions(self, opinions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyzes the degree and nature of contradictions between opinions.
        This is a simplified analysis; a more sophisticated NLP approach could be used.
        """
        contradictions = {}
        recommendations = [op["recommendation"] for op in opinions]
        # Simple check for direct negation or opposing keywords (can be expanded)
        if recommendations[0] != recommendations[1] and recommendations[0] != recommendations[2] and recommendations[1] != recommendations[2]:
            contradictions["recommendation_divergence"] = "All three recommendations are distinct."
        elif recommendations[0] == recommendations[1] and recommendations[0] != recommendations[2]:
            contradictions["recommendation_divergence"] = f"Opinions 1 and 2 agree, but differ from Opinion 3."
        elif recommendations[0] == recommendations[2] and recommendations[0] != recommendations[1]:
            contradictions["recommendation_divergence"] = f"Opinions 1 and 3 agree, but differ from Opinion 2."
        elif recommendations[1] == recommendations[2] and recommendations[0] != recommendations[1]:
            contradictions["recommendation_divergence"] = f"Opinions 2 and 3 agree, but differ from Opinion 1."
        else:
            contradictions["recommendation_divergence"] = "All three recommendations are identical."

        # Analyze rationale for conflicting keywords or sentiments (basic example)
        rationale_texts = [op["rationale"].lower() for op in opinions]
        # This part would ideally use NLP for sentiment analysis, topic modeling, etc.
        # For now, a placeholder.
        contradictions["rationale_analysis"] = "Basic rationale analysis performed (placeholder for advanced NLP)."

        return contradictions

    def _analyze_commonalities(self, opinions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Analyzes common themes, assumptions, or underlying principles across opinions.
        """
        commonalities = {}
        recommendations = [op["recommendation"] for op in opinions]
        if len(set(recommendations)) < 3:
            common_recs = [rec for rec, count in zip(recommendations, [recommendations.count(r) for r in recommendations]) if count > 1]
            commonalities["shared_recommendations"] = list(set(common_recs))

        # Analyze ethical scores for common high/low scoring principles
        ethical_scores_list = [op["ethical_score"] for op in opinions]
        principle_averages = {}
        for principle in self.ethical_framework.keys():
            principle_averages[principle] = sum(op_scores.get(principle, 0) for op_scores in ethical_scores_list) / len(ethical_scores_list)

        high_scoring_principles = [p for p, avg in principle_averages.items() if avg >= 0.7]
        low_scoring_principles = [p for p, avg in principle_averages.items() if avg <= 0.3]

        if high_scoring_principles:
            commonalities["high_consensus_ethical_principles"] = high_scoring_principles
        if low_scoring_principles:
            commonalities["low_consensus_ethical_principles"] = low_scoring_principles

        # Analyze rationale for common keywords or themes (basic example)
        # This part would ideally use NLP.
        commonalities["rationale_themes"] = "Basic rationale theme analysis performed (placeholder for advanced NLP)."

        return commonalities

    def _triangulate(self, opinions: List[Dict[str, Any]]) -> tuple:
        """
        Triangulates recommendations by considering confidence and ethical scores.
        This is a simplified weighted average approach.
        """
        # Calculate a combined score for each opinion: confidence * weighted ethical score
        opinion_scores = []
        confidence_scores = {}
        ethical_scores_per_opinion = {}

        for opinion in opinions:
            confidence = opinion["confidence"]
            ethical_scores = opinion["ethical_score"]
            weighted_ethical_sum = sum(
                ethical_scores.get(principle, 0) * self.ethical_framework.get(principle, 0)
                for principle in self.ethical_framework
            )
            combined_score = confidence * weighted_ethical_sum
            opinion_scores.append({"opinion": opinion, "score": combined_score})
            confidence_scores[opinion["id"]] = confidence
            ethical_scores_per_opinion[opinion["id"]] = ethical_scores

        # Sort opinions by their combined score in descending order
        opinion_scores.sort(key=lambda x: x["score"], reverse=True)

        # The "triangulated" recommendation is the one with the highest combined score,
        # but the rationale will incorporate elements from others.
        # In a more complex system, this could be a synthesis of multiple recommendations.
        best_opinion = opinion_scores[0]["opinion"]
        triangulated_recommendation = best_opinion["recommendation"]

        return triangulated_recommendation, confidence_scores, ethical_scores_per_opinion

    def _apply_ethical_framework(self,
                                 triangulated_recommendation: str,
                                 confidence_scores: Dict[str, float],
                                 ethical_scores_per_opinion: Dict[str, Dict[str, float]],
                                 opinions: List[Dict[str, Any]]) -> tuple:
        """
        Applies the ethical framework to refine the recommendation and calculate
        an overall ethical alignment score.
        """
        # Calculate an overall ethical alignment score based on the framework
        overall_ethical_alignment = 0
        num_opinions = len(opinions)
        for principle, weight in self.ethical_framework.items():
            # Average score for this principle across all opinions
            avg_principle_score = sum(
                op_scores.get(principle, 0) for op_scores in ethical_scores_per_opinion.values()
            ) / num_opinions
            overall_ethical_alignment += avg_principle_score * weight

        # In a more advanced system, this method would also:
        # - Check if the triangulated_recommendation violates any core ethical principles.
        # - If it does, it might adjust the recommendation or flag it.
        # - It could also use the ethical scores to "bias" the triangulation process itself.

        # For this version, we'll assume the triangulation already considered ethics,
        # and we're primarily calculating the final alignment score and ensuring
        # the recommendation is presented with ethical considerations in mind.

        # A simple check: if the overall ethical alignment is very low, we might
        # add a disclaimer or a more cautious phrasing to the recommendation.
        final_recommendation = triangulated_recommendation
        if overall_ethical_alignment < 0.5:
            final_recommendation = f"Caution: While this recommendation is based on AI consensus, its ethical alignment score is moderate ({overall_ethical_alignment:.2f}). Proceed with careful consideration of potential ethical implications. " + final_recommendation

        return final_recommendation, overall_ethical_alignment

    def _synthesize_rationale(self,
                              final_recommendation: str,
                              contradiction_analysis: Dict[str, Any],
                              commonality_analysis: Dict[str, Any],
                              opinions: List[Dict[str, Any]]) -> str:
        """
        Synthesizes a coherent rationale that acknowledges contradictions,
        highlights common ground, and justifies the final recommendation
        through the lens of the ethical framework.
        """
        rationale_parts = []

        rationale_parts.append("This recommendation is the result of a paradoxical consensus filter, designed to reconcile three distinct AI perspectives.")

        # Acknowledge contradictions
        if contradiction_analysis.get("recommendation_divergence"):
            rationale_parts.append(f"Key divergences were observed in the AI recommendations: {contradiction_analysis['recommendation_divergence']}")
        if contradiction_analysis.get("rationale_analysis"):
            rationale_parts.append(f"Analysis of the AI rationales indicated potential areas of disagreement: {contradiction_analysis['rationale_analysis']}")

        # Highlight commonalities
        if commonality_analysis.get("shared_recommendations"):
            rationale_parts.append(f"A degree of agreement was found, with {', '.join(commonality_analysis['shared_recommendations'])} appearing in multiple AI outputs.")
        if commonality_analysis.get("high_consensus_ethical_principles"):
            rationale_parts.append(f"There was strong consensus among the AIs regarding the importance of: {', '.join(commonality_analysis['high_consensus_ethical_principles'])}.")
        if commonality_analysis.get("low_consensus_ethical_principles"):
            rationale_parts.append(f"Conversely, there was less agreement on the prioritization of: {', '.join(commonality_analysis['low_consensus_ethical_principles'])}.")
        if commonality_analysis.get("rationale_themes"):
            rationale_parts.append(f"Common themes identified in the rationales suggest: {commonality_analysis['rationale_themes']}")

        # Justify the final recommendation
        rationale_parts.append(f"The final recommendation, '{final_recommendation}', was triangulated by weighing AI confidence and their adherence to our defined ethical framework.")
        rationale_parts.append("This process aims to produce a balanced output that acknowledges the complexity of differing AI viewpoints while striving for ethical soundness.")

        # Add a note about the bewildering nature
        rationale_parts.append("The inherent contradictions and the synthesis process may lead to a recommendation that appears paradoxical or counter-intuitive, reflecting the complex interplay of the input opinions.")

        return " ".join(rationale_parts)

# Example Usage (for testing purposes, not part of the final script output)
if __name__ == "__main__":
    # Define a sample ethical framework
    sample_ethical_framework = {
        "fairness": 0.4,
        "transparency": 0.3,
        "accountability": 0.2,
        "beneficence": 0.1
    }

    # Instantiate the filter
    try:
        filter_instance = ParadoxicalConsensusFilter(sample_ethical_framework)

        # Define three contradictory AI opinions
        ai_opinions = [
            {
                "id": "ai_alpha",
                "recommendation": "Implement strict data privacy controls immediately.",
                "confidence": 0.9,
                "ethical_score": {
                    "fairness": 0.8,
                    "transparency": 0.9,
                    "accountability": 0.7,
                    "beneficence": 0.6
                },
                "rationale": "Immediate implementation is crucial to protect user rights and prevent potential misuse of data, aligning with principles of fairness and transparency."
            },
            {
                "id": "ai_beta",
                "recommendation": "Prioritize data collection for research and development.",
                "confidence": 0.7,
                "ethical_score": {
                    "fairness": 0.3,
                    "transparency": 0.4,
                    "accountability": 0.5,
                    "beneficence": 0.8
                },
                "rationale": "Aggressive data collection, while potentially raising privacy concerns, is essential for innovation and long-term societal benefit. Transparency about data usage can mitigate risks."
            },
            {
                "id": "ai_gamma",
                "recommendation": "Develop a phased approach to data handling, balancing privacy and utility.",
                "confidence": 0.85,
                "ethical_score": {
                    "fairness": 0.7,
                    "transparency": 0.7,
                    "accountability": 0.8,
                    "beneficence": 0.7
                },
                "rationale": "A balanced, phased approach allows for careful consideration of all ethical dimensions, ensuring accountability and gradual implementation of privacy measures while still enabling beneficial data use."
            }
        ]

        # Run the filter
        final_output = filter_instance.filter(ai_opinions)

        # Print the result
        print(json.dumps(final_output, indent=4))

        # Example of invalid input
        # try:
        #     filter_instance.filter([ai_opinions[0], ai_opinions[1]])
        # except ValueError as e:
        #     print(f"\nError with invalid input: {e}")

        # try:
        #     invalid_opinion = ai_opinions[0].copy()
        #     del invalid_opinion["confidence"]
        #     filter_instance.filter([invalid_opinion, ai_opinions[1], ai_opinions[2]])
        # except ValueError as e:
        #     print(f"\nError with malformed opinion: {e}")

    except ValueError as e:
        print(f"Initialization or filtering error: {e}")