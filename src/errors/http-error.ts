export default interface HttpError {
  error: Error;
  httpCode: number;
  message: string;
  detail?: string;
}
