import { InputData, Attempt } from '@/types';

const importanceWeights: Record<string, number> = { A: 1, B: 0.7, C: 0.5 };
const difficultyWeights: Record<string, number> = { E: 0.6, M: 1, H: 1.4 };
const typeWeights: Record<string, number> = { Practical: 1.1, Theory: 1 };

interface GroupedScores {
  [key: string]: { weighted: number; maxPossible: number; attempts: Attempt[] };
}

export const computeSqi = (data: InputData) => {
  let totalWeighted = 0;
  let totalMaxPossible = 0;
  const topicGroups: GroupedScores = {};
  const conceptGroups: GroupedScores = {};

  data.attempts.forEach((attempt) => {
    let base = attempt.correct ? attempt.marks : -attempt.neg_marks;
    let weighted = base * importanceWeights[attempt.importance] * difficultyWeights[attempt.difficulty] * typeWeights[attempt.type];

    // Behavior adjustments
    const timeRatio = attempt.time_spent_sec / attempt.expected_time_sec;
    if (timeRatio > 1.5) weighted *= 0.9;
    if (timeRatio > 2) weighted *= 0.8; // Note: This applies on top if >2
    if (attempt.marked_review && !attempt.correct) weighted *= 0.9;
    if (attempt.revisits > 0 && attempt.correct) weighted += 0.2 * attempt.marks;

    const maxForThis = attempt.marks * importanceWeights[attempt.importance] * difficultyWeights[attempt.difficulty] * typeWeights[attempt.type];
    totalWeighted += weighted;
    totalMaxPossible += maxForThis;

    // Group by topic
    if (!topicGroups[attempt.topic]) topicGroups[attempt.topic] = { weighted: 0, maxPossible: 0, attempts: [] };
    topicGroups[attempt.topic].weighted += weighted;
    topicGroups[attempt.topic].maxPossible += maxForThis;
    topicGroups[attempt.topic].attempts.push(attempt);

    // Group by concept (topic + concept key)
    const conceptKey = `${attempt.topic}-${attempt.concept}`;
    if (!conceptGroups[conceptKey]) conceptGroups[conceptKey] = { weighted: 0, maxPossible: 0, attempts: [] };
    conceptGroups[conceptKey].weighted += weighted;
    conceptGroups[conceptKey].maxPossible += maxForThis;
    conceptGroups[conceptKey].attempts.push(attempt);
  });

  const clamp = (val: number) => Math.max(0, Math.min(100, val));

  const overallSqi = clamp((totalWeighted / totalMaxPossible) * 100);

  const topicScores = Object.entries(topicGroups).map(([topic, { weighted, maxPossible }]) => ({
    topic,
    sqi: clamp((weighted / maxPossible) * 100),
  }));

  const conceptScores = Object.entries(conceptGroups).map(([key, { weighted, maxPossible }]) => {
    const [topic, concept] = key.split('-');
    return { topic, concept, sqi: clamp((weighted / maxPossible) * 100) };
  });

  // Ranked concepts with weights
  const rankedConcepts = conceptScores.map(({ topic, concept, sqi }) => {
    const attempts = conceptGroups[`${topic}-${concept}`].attempts;
    const wrongAtLeastOnce = attempts.some(a => !a.correct) ? 1 : 0;
    const impWeight = importanceWeights[attempts[0].importance]; // Assume same per concept
    const timeProxy = attempts.reduce((acc, a) => {
      const ratio = a.time_spent_sec / a.expected_time_sec;
      return acc + (ratio < 1 ? 1 : ratio < 1.5 ? 0.7 : 0.4);
    }, 0) / attempts.length;
    const diagQuality = 1 - (sqi / 100);

    let weight = (0.4 * wrongAtLeastOnce) + (0.25 * impWeight) + (0.20 * timeProxy) + (0.15 * diagQuality);
    weight = weight / 1.0; // Normalize to 0-1 (max possible is ~1)

    // Bonus: Why score? explanation
    const reason = `Wrong: ${wrongAtLeastOnce ? 'Yes' : 'No'}, Importance: ${impWeight}, Time Proxy: ${timeProxy.toFixed(2)}, Diag Quality: ${diagQuality.toFixed(2)}`;

    return { topic, concept, weight, reason, computed_at: new Date().toISOString(), engine: 'sqi-v0.1' };
  }).sort((a, b) => b.weight - a.weight);

  // Output payload
  const payload = {
    student_id: data.student_id,
    topic_scores: topicScores,
    overall_sqi: overallSqi,
    concept_scores: conceptScores,
    ranked_concepts_for_summary: rankedConcepts,
    metadata: {
      diagnostic_prompt_version: 'V1', // From saved prompt or hardcoded
      computed_at: new Date().toISOString(),
      engine: 'sqi-v0.1',
    },
  };

  return payload;
};