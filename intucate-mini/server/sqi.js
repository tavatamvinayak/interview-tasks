// backend/sqi.js

const importanceWeights = {
  A: 1.0,
  B: 0.7,
  C: 0.5,
};

const difficultyWeights = {
  E: 0.6,
  M: 1.0,
  H: 1.4,
};

const typeWeights = {
  Practical: 1.1,
  Theory: 1.0,
};

/**
 * Computes SQI for one student
 * @param {Object} inputData - { student_id: string, attempts: Array }
 * @returns {Object} formatted payload for Summary Customizer Agent
 */
function computeSqi(inputData) {
  const { student_id, attempts } = inputData;

  if (!student_id || !Array.isArray(attempts) || attempts.length === 0) {
    throw new Error("Invalid input: student_id and attempts array required");
  }

  let totalWeighted = 0;
  let totalMaxPossible = 0;

  // Group by topic and by concept (topic-concept pair)
  const topicGroups = {};
  const conceptGroups = {};

  attempts.forEach((attempt) => {
    const {
      topic,
      concept,
      importance,
      difficulty,
      type,
      correct,
      marks,
      neg_marks,
      expected_time_sec,
      time_spent_sec,
      marked_review,
      revisits,
    } = attempt;

    // Validate required fields (you can make this stricter)
    if (!topic || !concept || !importance || !difficulty || !type) {
      console.warn(`Skipping invalid attempt: missing required fields`);
      return;
    }

    // Base score
    let base = correct ? marks : -neg_marks;

    // Apply weights
    let weighted = base *
      (importanceWeights[importance] || 1) *
      (difficultyWeights[difficulty] || 1) *
      (typeWeights[type] || 1);

    // Behavior adjustments
    const timeRatio = expected_time_sec > 0 ? time_spent_sec / expected_time_sec : 1;

    if (timeRatio > 1.5) weighted *= 0.9;
    if (timeRatio > 2.0) weighted *= 0.8;     // stacks with previous

    if (marked_review && !correct) weighted *= 0.9;

    if (revisits > 0 && correct) {
      weighted += 0.2 * marks;   // bonus
    }

    // Max possible for normalization (full marks with weights)
    const maxForThis = marks *
      (importanceWeights[importance] || 1) *
      (difficultyWeights[difficulty] || 1) *
      (typeWeights[type] || 1);

    totalWeighted += weighted;
    totalMaxPossible += maxForThis;

    // ── Topic aggregation ────────────────────────────────
    if (!topicGroups[topic]) {
      topicGroups[topic] = { weighted: 0, maxPossible: 0, attempts: [] };
    }
    topicGroups[topic].weighted += weighted;
    topicGroups[topic].maxPossible += maxForThis;
    topicGroups[topic].attempts.push(attempt);

    // ── Concept aggregation ──────────────────────────────
    const conceptKey = `${topic}|||${concept}`; // safe separator
    if (!conceptGroups[conceptKey]) {
      conceptGroups[conceptKey] = { weighted: 0, maxPossible: 0, attempts: [] };
    }
    conceptGroups[conceptKey].weighted += weighted;
    conceptGroups[conceptKey].maxPossible += maxForThis;
    conceptGroups[conceptKey].attempts.push(attempt);
  });

  const clamp = (val) => Math.max(0, Math.min(100, val));

  const overall_sqi = totalMaxPossible > 0
    ? clamp((totalWeighted / totalMaxPossible) * 100)
    : 0;

  // Topic scores
  const topic_scores = Object.entries(topicGroups).map(([topic, g]) => ({
    topic,
    sqi: clamp(g.maxPossible > 0 ? (g.weighted / g.maxPossible) * 100 : 0),
  }));

  // Concept scores
  const concept_scores = Object.entries(conceptGroups).map(([key, g]) => {
    const [topic, concept] = key.split("|||");
    return {
      topic,
      concept,
      sqi: clamp(g.maxPossible > 0 ? (g.weighted / g.maxPossible) * 100 : 0),
    };
  });

  // ── Ranked concepts for summary agent ────────────────────────────────
  const ranked_concepts_for_summary = concept_scores
    .map((cs) => {
      const key = `${cs.topic}|||${cs.concept}`;
      const group = conceptGroups[key];
      const att = group.attempts;

      // Weight factors (as per your spec)
      const wrongAtLeastOnce = att.some(a => !a.correct) ? 1 : 0;
      const impW = importanceWeights[att[0]?.importance] || 0.5;
      const timeProxyAvg = att.reduce((sum, a) => {
        const r = a.expected_time_sec > 0 ? a.time_spent_sec / a.expected_time_sec : 1;
        return sum + (r < 1 ? 1 : r < 1.5 ? 0.7 : 0.4);
      }, 0) / att.length;
      const diagQuality = 1 - (cs.sqi / 100);

      let weight = (0.40 * wrongAtLeastOnce) +
                   (0.25 * impW) +
                   (0.20 * timeProxyAvg) +
                   (0.15 * diagQuality);

      // Optional: normalize weight to [0,1] range more strictly if desired
      // weight = Math.max(0, Math.min(1, weight));

      const reason = `Wrong once+: ${wrongAtLeastOnce}, Imp: ${impW.toFixed(2)}, Time proxy: ${timeProxyAvg.toFixed(2)}, Diag qual: ${diagQuality.toFixed(2)}`;

      return {
        topic: cs.topic,
        concept: cs.concept,
        weight: Number(weight.toFixed(3)),
        computed_at: new Date().toISOString(),
        engine: "sqi-v0.1",
        // reason,               // uncomment if you want to include explanation in JSON
      };
    })
    .sort((a, b) => b.weight - a.weight);

  // Final payload
  return {
    student_id: student_id.replace(/^S?0+/, "S") || student_id, // normalize S001 → S1 etc. (optional)
    topic_scores,
    overall_sqi: Number(overall_sqi.toFixed(1)),
    concept_scores,
    ranked_concepts_for_summary,
    metadata: {
      diagnostic_prompt_version: "V1", // can come from DB / header later
      computed_at: new Date().toISOString(),
      engine: "sqi-v0.1",
    },
  };
}

module.exports = { computeSqi };