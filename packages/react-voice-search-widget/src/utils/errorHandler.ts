import { toast } from 'react-toastify';
import { ErrorWithMessage } from '../types/types';

let isToastActive = false;

export const showError = (
  error: unknown,
  fallbackMessage = "Something went wrong"
) => {
  if (isToastActive) return;

  isToastActive = true;

  let message = fallbackMessage;

  if (typeof error === "string") {
    message = error;
  } else if (typeof error === "object" && error !== null) {
    const err = error as ErrorWithMessage;

    if (err.response?.data?.message) {
      message = err.response.data.message;
    } else if (err.message) {
      message = err.message;
    }
  }

  const toastId = toast.error(message, {
    onClose: () => {
      isToastActive = false;
    },
  });

  return toastId;
};


export const showSuccess = (msg: string) => {
  toast.dismiss();
  toast.success(msg);
};