import { isAxiosError } from "axios";
import { toast } from "sonner";
interface ErrorResponseData {
  message?: string;
  [key: string]: unknown;
}

export function getErrorMessage(error: unknown): string {
  if (isAxiosError<ErrorResponseData>(error)) {
    const serverMessage = error.response?.data?.message;

    if (typeof serverMessage === "string") {
      return serverMessage || error.message;
    }
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  const stringifiedError = String(error);

  return stringifiedError &&
    stringifiedError.trim() !== "" &&
    stringifiedError !== "[object Object]"
    ? stringifiedError
    : "An unexpected error occurred.";
}

export function errorHandler(error: unknown): string | number {
  const messageToDisplay = getErrorMessage(error);
  return toast.error(messageToDisplay);
}
