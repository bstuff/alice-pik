export function filterBoolean<T>(it: T): it is Exclude<typeof it, null | undefined> {
  return !!it;
}
