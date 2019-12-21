export interface SubtaskShort {
  name: string;
  description: string;
  thumbnail: string;
  lowProbabilityScore: number;
  averageProbabilityScore: number;
  highProbabilityScore: number;
  tagIds: number[];
}
