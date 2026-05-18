export function pickKey<T extends object, K extends keyof T>(
  base: T,
  keys: K[],
) {
  const entries = keys.map((key) => [key, base[key]]);
  return Object.fromEntries(entries) as Pick<T, K>;
}

export function createQueryParams(
  searchParams: Record<string, unknown>,
  currentIndex = 1,
) {
  let index = currentIndex;
  const values: unknown[] = [];
  let conditions = "";

  Object.keys(searchParams).forEach((key) => {
    const value = searchParams[key];

    if (value !== null && value !== undefined) {
      if (typeof value === "string") {
        conditions += ` AND ${key}::text ILIKE $${index}`;
        values.push(`%${value}%`);
      } else {
        conditions += ` AND ${key} = $${index}`;
        values.push(value);
      }
      index++;
    }
  });

  return { conditions, values, nextIndex: index };
}

export interface PaginationInterfaceHelper {
  page?: number;
  limit?: number;
  [key: string]: unknown;
}
