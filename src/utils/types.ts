
// Common types for the learning app

export type QuestionStatus = "correct" | "wrong" | "unattempted";

export interface Flashcard {
  id: string | number;
  question: string;
  answer: string;
  subject: string;
  topic: string;
  status: QuestionStatus;
}

export interface MCQ {
  id: string | number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  key: "a" | "b" | "c" | "d";
  explanation: string;
  subject: string;
  topic: string;
  status: QuestionStatus;
}

export interface TestQuestion extends MCQ {
  testNumber: number;
}

export interface FilterState {
  subject: string | null;
  topic: string | null;
  testNumber?: number | null;
  status: QuestionStatus | null;
}

export interface ModuleCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  path: string;
}
