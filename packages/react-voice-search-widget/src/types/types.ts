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
  phone: string;
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

export type HistoryEntry = {
  _id: string;
  query: string;
  response: string;
  timestamp: string;
};

export type ResponseItem = {
  name: string;
  category: string;
};

export type Item = {
  response: ResponseItem[];
};

export type ConfirmActionModalProps = {
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmStyle?: "danger" | "primary";
};

export type SearchHistoryModalProps = {
  userId: string;
  onClose: () => void;
};

export type DashboardCardProps = {
  title: string;
  value: number;
  infoText?: string;
};

export type SearchResultsProps = {
  results: Result[];
  transcript: string;
};
