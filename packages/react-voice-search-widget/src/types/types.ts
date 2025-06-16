export type Result = {
  matchedWords: string[];
  id: number;
  name: string;
  category: string;
  score: number;
}

export type LoginPayload =  {
  email: string;
  password: string;
}

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  country: string;
  phone: number;
}

export type ErrorWithMessage = {
  message?: string;
  response?: {
    data?: {
      message?: string;
    };
  };
};

