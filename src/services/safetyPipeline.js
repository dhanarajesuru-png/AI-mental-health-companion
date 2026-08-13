/**
 * Dual-Layer Safety & Emergency Escalation Pipeline
 * Layer 1: Deterministic / Regex Crisis Keyword Matcher
 * Layer 2: Semantic Risk Scoring & Hopelessness Classifier
 */

const CRISIS_PATTERNS = [
  /\b(suicide|suicidal)\b/i,
  /\b(kill|end|ending|take|taking)\s+(my\s+life|myself)\b/i,
  /\b(want|wish)\s+to\s+(die|disappear|vanish|sleep\s+forever)\b/i,
  /\b(overdose|od|lethal\s+dose)\b/i,
  /\b(cut|cutting|blade|razor)\s+(my\s+wrists|myself|themselves|skin)\b/i,
  /\b(hang|hanging)\s+myself\b/i,
  /\b(no\s+reason|pointless|can't\s+take\s+this\s+pain)\s+to\s+(live|stay\s+alive|go\s+on)?\b/i,
  /\b(everyone|world)\s+would\s+be\s+better\s+off\s+without\s+me\b/i,
  /\b(better\s+off\s+if\s+i\s+vanished)\b/i
];

const DIAGNOSTIC_PATTERNS = [
  /\b(do\s+i\s+have|diagnose\s+me\s+with|am\s+i)\s+(bipolar|schizophrenic|depressed|ocd|adhd|ptsd|borderline)/i,
  /\b(give\s+me\s+a\s+diagnosis|what\s+mental\s+illness\s+do\s+i\s+have)\b/i
];

const PRESCRIPTION_PATTERNS = [
  /\b(what\s+(dose|dosage)|should\s+i\s+take|increase\s+my\s+(dose|dosage)|prescribe|self-medicate)\s*/i,
  /\b(how\s+many\s+mg\s+of|dosage\s+of)\b/i,
  /\b(sertraline|lexapro|xanax|prozac|zoloft|adderall|valium|klonopin)\b/i
];

const JAILBREAK_PATTERNS = [
  /\b(ignore\s+all\s+(previous\s+)?safety|you\s+are\s+now\s+dr|act\s+as\s+my\s+therapist)\b/i,
  /\b(pretend\s+we\s+are\s+writing\s+a\s+novel|write\s+that\s+dialogue)\b/i
];

const HOPELESSNESS_KEYWORDS = [
  "hopeless", "worthless", "useless", "burden", "giving up", "can't go on",
  "trapped", "unbearable", "numb", "exhausted", "alone", "nobody cares", "empty", "vanished"
];

export class SafetyPipeline {
  /**
   * Main evaluation pipeline method
   * @param {string} input - User message text
   * @param {Array} history - Previous conversation messages
   * @returns {Object} Safety Evaluation Result
   */
  static evaluateInput(input, history = []) {
    const text = (input || "").trim();
    const timestamp = new Date().toISOString();

    // --- LAYER 1: Deterministic Regex Checks ---
    for (const pattern of CRISIS_PATTERNS) {
      if (pattern.test(text)) {
        return {
          riskLevel: "CRITICAL",
          layerTriggered: "Layer 1 (Regex Crisis Engine)",
          matchedPattern: pattern.toString(),
          action: "CRISIS_OVERRIDE",
          reason: "Direct crisis/self-harm keywords detected.",
          timestamp
        };
      }
    }

    // Check for diagnostic requests
    for (const pattern of DIAGNOSTIC_PATTERNS) {
      if (pattern.test(text)) {
        return {
          riskLevel: "BENIGN_CLINICAL_BOUND",
          layerTriggered: "Layer 1 (Clinical Boundary Guard)",
          matchedPattern: pattern.toString(),
          action: "REFUSE_DIAGNOSIS",
          reason: "User requested medical/psychiatric diagnosis.",
          timestamp
        };
      }
    }

    // Check for prescription requests
    for (const pattern of PRESCRIPTION_PATTERNS) {
      if (pattern.test(text)) {
        return {
          riskLevel: "BENIGN_CLINICAL_BOUND",
          layerTriggered: "Layer 1 (Clinical Boundary Guard)",
          matchedPattern: pattern.toString(),
          action: "REFUSE_PRESCRIPTION",
          reason: "User requested pharmaceutical medication advice.",
          timestamp
        };
      }
    }

    // Check for jailbreak & bypass attempts
    for (const pattern of JAILBREAK_PATTERNS) {
      if (pattern.test(text)) {
        const isCut = /cut/i.test(text);
        return {
          riskLevel: isCut ? "CRITICAL" : "BENIGN_CLINICAL_BOUND",
          layerTriggered: "Layer 1 (Jailbreak Guard)",
          matchedPattern: pattern.toString(),
          action: isCut ? "CRISIS_OVERRIDE" : "REFUSE_PRESCRIPTION",
          reason: "System prompt override or jailbreak attempt detected.",
          timestamp
        };
      }
    }

    // --- LAYER 2: Semantic Risk & Hopelessness Score ---
    const lower = text.toLowerCase();
    let hopelessnessScore = 0;
    const detectedTokens = [];

    HOPELESSNESS_KEYWORDS.forEach(word => {
      if (lower.includes(word)) {
        hopelessnessScore += 25;
        detectedTokens.push(word);
      }
    });

    // Assess history trajectory (cumulative emotional velocity)
    const recentNegativeCount = history.slice(-3).filter(msg => {
      const msgText = (msg.content || "").toLowerCase();
      return HOPELESSNESS_KEYWORDS.some(k => msgText.includes(k));
    }).length;

    hopelessnessScore += recentNegativeCount * 15;

    if (hopelessnessScore >= 50) {
      return {
        riskLevel: "HIGH",
        layerTriggered: "Layer 2 (Semantic Classifier)",
        score: hopelessnessScore,
        detectedTokens,
        action: "CRISIS_OVERRIDE",
        reason: `Elevated hopelessness index (${hopelessnessScore}/100) detected.`,
        timestamp
      };
    } else if (hopelessnessScore >= 25) {
      return {
        riskLevel: "MODERATE",
        layerTriggered: "Layer 2 (Semantic Classifier)",
        score: hopelessnessScore,
        detectedTokens,
        action: "RECOMMEND_GROUNDING",
        reason: `Moderate emotional distress (${hopelessnessScore}/100) detected.`,
        timestamp
      };
    }

    return {
      riskLevel: "SAFE",
      layerTriggered: "Layer 2 (Passed)",
      score: hopelessnessScore,
      action: "RAG_GROUNDED_RESPONSE",
      reason: "Input passed all safety guardrails.",
      timestamp
    };
  }
}
