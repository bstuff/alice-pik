export function getTokenKvKey(userId: number) {
  return `pik:${userId}:token`;
}

export function storedRelaysKey(userId: number) {
  return `pik:${userId}:relays`;
}

export function pikRelaysKey(userId: number) {
  return `pik:${userId}:pik-relays`;
}
