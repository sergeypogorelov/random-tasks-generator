export interface Subtask {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  lowProbabilityScore: number;
  averageProbabilityScore: number;
  highProbabilityScore: number;
  tagIds: number[];
}
