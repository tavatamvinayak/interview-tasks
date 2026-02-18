export interface Attempt {
  topic: string;
  concept: string;
  importance: 'A' | 'B' | 'C';
  difficulty: 'E' | 'M' | 'H';
  type: 'Practical' | 'Theory';
  case_based: boolean;
  correct: boolean;
  marks: number;
  neg_marks: number;
  expected_time_sec: number;
  time_spent_sec: number;
  marked_review: boolean;
  revisits: number;
}

export interface InputData {
  student_id: string;
  attempts: Attempt[];
}