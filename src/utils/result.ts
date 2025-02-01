export type Result<T, E> =
  | { status: "ok"; value: T }
  | { status: "error"; error: E };

export const Result = {
  ok: <T, E>(value: T): Result<T, E> => ({ status: "ok", value }),
  err: <T, E>(error: E): Result<T, E> => ({ status: "error", error }),
};

export function isOk<T, E>(result: Result<T, E>) {
  return result.status === "ok";
}

export function isErr<T, E>(result: Result<T, E>) {
  return result.status === "error";
}
