import { computeSqi } from '../src/lib/sqiEngine';
import { InputData } from '../src/types';

// Use sample dataset from query
const sampleData: InputData = {
  student_id: 'S001',
  attempts: [
    // Paste sample attempts here
    { topic: 'Borrowing Costs', concept: 'Definitions', importance: 'A', difficulty: 'M', type: 'Theory', case_based: false, correct: false, marks: 2, neg_marks: 0.5, expected_time_sec: 90, time_spent_sec: 130, marked_review: true, revisits: 1 },
    // Add others
  ],
};

test('computes overall SQI correctly', () => {
  const result = computeSqi(sampleData);
  expect(result.overall_sqi).toBeCloseTo(74.2, 1); // As per schema example
  // Add more assertions for topics, concepts, ranks
});