export function searchParamsToObject(
  params: URLSearchParams
): Record<string, unknown> {
  return [...params.keys()].reduce((result, key) => {
    const values = params.getAll(key);
    const value = values.length > 1 ? values : values[0];

    return { ...result, [key]: value };
  }, {});
}
