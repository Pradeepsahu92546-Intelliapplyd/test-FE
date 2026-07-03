// models/interfaces/api-result.interface.ts
// Wraps every service response so components can handle errors
// without knowing about HTTP status codes.

export type ApiErrorCode =
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN';

export interface ApiError {
  code:    ApiErrorCode;
  message: string;        // human-readable, safe to show in the UI
  status?: number;        // original HTTP status (optional, for logging)
}

/**
 * Discriminated union — every service call returns one of these.
 *
 * Usage in component:
 *   if (result.ok) { use result.data }
 *   else           { show result.error.message }
 */
export type ApiResult<T> =
  | { ok: true;  data:  T }
  | { ok: false; error: ApiError };

/** Factory helpers so mappers don't repeat boilerplate */
export const ApiResult = {
  ok:    <T>(data: T): ApiResult<T>           => ({ ok: true,  data }),
  fail:  (error: ApiError): ApiResult<never>  => ({ ok: false, error }),
};