export function oauthCodeKvKey(code: string) {
  return `oauth:codes:${code}`;
}

export async function storeCodeData() {
  //
}
