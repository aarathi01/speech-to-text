export interface Result {
  matchedWords: string[];
  id: number;
  name: string;
  category: string;
  score: number;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  country: string;
  phone: number;
}
