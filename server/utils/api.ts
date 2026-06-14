import { APIResponse } from "#shared/types/api";

export const apiResponse = (
  status: number,
  message: string,
  data?: any,
): APIResponse => {
  return {
    statusCode: status,
    message,
    data,
  };
};
