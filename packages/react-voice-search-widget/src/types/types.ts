export type Result = {
  text: unknown;
  title: unknown;
  matchedWords: string[];
  id: number;
  name: string;
  category: string;
  score: number;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  country: string;
  phone: number;
};

export type ErrorWithMessage = {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

export type JwtPayload = {
  exp: number;
  [key: string]: unknown;
};

export type HistoryPayload = {
  query: string;
  response: Result[];
};

export type HistoryEntry =  {
  query: string;
  response: string;
  timestamp: string;
}

export type  ResponseItem = {
  name: string;
  category: string;
}

export type  Item = {
  response: ResponseItem[];
}