import * as z from 'zod';
import { Attempt } from '@/types/index';

export const attemptSchema = z.object({
  topic: z.string(),
  concept: z.string(),
  importance: z.enum(['A', 'B', 'C']),
  difficulty: z.enum(['E', 'M', 'H']),
  type: z.enum(['Practical', 'Theory']),
  case_based: z.boolean(),
  correct: z.boolean(),
  marks: z.number(),
  neg_marks: z.number(),
  expected_time_sec: z.number(),
  time_spent_sec: z.number(),
  marked_review: z.boolean(),
  revisits: z.number(),
});

export const inputSchema = z.object({
  student_id: z.string(),
  attempts: z.array(attemptSchema),
});

// Output schema similar, but for validation if needed