export interface User {
  uid: string;
  username: string;
  fullName: string;
  role: 'admin' | 'student';
}

export interface Question {
  id: number;
  subject: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  id: number;
  uid: string;
  username: string;
  date: string;
  sessionTitle: string;
  score: number;
  total: number;
  answersMap: string;
}
