export type ApiError = {
  detail?: string;
  [key: string]: unknown;
};

export type ApiResponse<T> = {
  data: T;
  status: number;
};
