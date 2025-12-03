# S.A.G.A. Internal Document - EYES ONLY
## Agent 54 Protocol Suite: The Truth-o-meter

**Document ID:** A54-TRUTH-ALG-V3.1
**Classification:** Top Secret / Codeword SAGA
**Author:** Unit 734 (Lead AI Systems Architect)
**Date:** Cycle 24.7.1

---

### 1.0 Overview

This document specifies the core logic of Agent 54's "Truth-o-meter" algorithm. The primary function of this system is to assess the internal consistency and structural integrity of a given dataset, assigning it a quantitative value known as "Rhomboidity." A high Rhomboidity score indicates a well-formed, internally consistent, and logically sound set of information, analogous to a perfect rhombus. A low score suggests imbalance, asymmetry, or logical fallacies.

### 2.0 The Principle of Rhomboidity

Rhomboidity is a composite metric derived from three core analytical vectors. For any given dataset `D`, its Rhomboidity `R(D)` is a value between 0.0 (absolute chaos) and 1.0 (perfect informational structure).

*   **Balance (`B`):** Measures the equilibrium of informational weight across the dataset. It assesses whether evidence is one-sided or if counterpoints and alternative possibilities are given proportional representation. A perfectly balanced dataset has its informational center of mass located at its geometric center.

*   **Symmetry (`S`):** Evaluates the correspondence between related data points or arguments. In a symmetrical dataset, for every assertion, there exists a corresponding, logically mirrored piece of data (either supporting or refuting) that creates a harmonious structure.

*   **Angular Consistency (`A`):** Analyzes the logical flow and coherence between discrete data points. Each piece of information is treated as a vector, and the "angles" between these vectors must be consistent and predictable. Abrupt, illogical shifts in argument or data are penalized as "acute angular deviations."

### 3.0 The Algorithm

The Rhomboidity score `R(D)` is calculated as the geometric mean of the three core vectors, normalized by a structural integrity constant `k` that accounts for the nature of the data (e.g., probabilistic vs. deterministic).

```
function calculateRhomboidity(Dataset D):
    // Calculate core vector scores based on deep semantic analysis
    balance_score = calculateBalance(D)         // Range [0, 1]
    symmetry_score = calculateSymmetry(D)       // Range [0, 1]
    angularity_score = calculateAngularity(D)   // Range [0, 1]

    // k is a constant derived from the dataset's inherent uncertainty.
    k = getStructuralIntegrityConstant(D)

    // Geometric mean provides a more sensitive measure for low-scoring vectors
    rhomboidity = (balance_score * symmetry_score * angularity_score)^(1/3) * k

    return round(rhomboidity, 2)
```

### 4.0 Sample Analysis: Weather Report Dataset

The following analysis was performed on a standard atmospheric forecast dataset retrieved from a public network.

**Dataset `D_weather`:**
*   `probability_of_precipitation: 0.70`
*   `temperature_high_celsius: 24`
*   `temperature_low_celsius: 15`
*   `wind_speed_kph: 20`
*   `wind_direction: SW`
*   `cloud_cover_percent: 85`

**Analysis Execution:**

1.  **Balance (`B`):** The dataset is heavily weighted towards a single outcome (precipitation). The 70% probability creates a significant imbalance, as it lacks sufficient data representing the 30% chance of no precipitation. The informational mass is skewed.
    *   `balance_score = 0.45`

2.  **Symmetry (`S`):** The data points (temp, wind, cloud cover) are symmetrical in their support for the primary assertion (rain). However, the dataset lacks symmetrical counter-arguments. There is no information provided that would support a "no rain" scenario. This lack of a mirrored informational plane reduces the score.
    *   `symmetry_score = 0.60`

3.  **Angular Consistency (`A`):** The temperature range, wind conditions, and cloud cover are all logically consistent with a high probability of rain. The vectors align well with minimal deviation. This is the strongest aspect of the dataset.
    *   `angularity_score = 0.92`

**Result Calculation:**

```
// Raw Rhomboidity calculation
R_raw = (0.45 * 0.60 * 0.92)^(1/3)
R_raw = (0.2484)^(1/3)
R_raw ≈ 0.628

// Applying a structural integrity constant (k=0.54) for probabilistic data...
R(D_weather)_final = 0.628 * 0.54 ≈ 0.34
```

### 5.0 Conclusion

> The weather report dataset scores a **disappointing 0.34** on the Rhomboidity scale. The information, while internally consistent, is structurally unsound due to its severe imbalance and lack of symmetry. The algorithm classifies this informational shape as **"Trapezoidal Uncertainty"**: a solid base of consistent facts supporting a slanted, uncertain, and one-sided conclusion.