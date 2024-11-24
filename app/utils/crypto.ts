function hash(algo: AlgorithmIdentifier, str: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest(algo, new TextEncoder().encode(str));
}
function hex(buff: ArrayBuffer): string {
  return [].map
    .call(new Uint8Array(buff), (b: number) => ('00' + b.toString(16)).slice(-2))
    .join('');
}

export async function sha256(message: string) {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);

  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

async function calculateSomeHash(somestring: string): Promise<string> {
  const hashed = await hash('SHA-256', somestring);

  return hex(hashed);
}

export function generateRandomPassword(): string {
  return crypto.randomUUID().replace(/.*-/, '');
}

export async function getUserKey(email: string) {
  const nextEmail = email.toLowerCase();
  const hexStr = await calculateSomeHash(nextEmail);

  return 'Users:' + hexStr;
}

export async function hashPassword(password: string) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));

  // Combine salt and password
  const combinedBuffer = new Uint8Array(salt.length + passwordBuffer.length);
  combinedBuffer.set(salt);
  combinedBuffer.set(passwordBuffer, salt.length);

  // Hash the combined salt and password
  const hashBuffer = await crypto.subtle.digest('SHA-256', combinedBuffer);

  // Convert the hash buffer and salt to hexadecimal strings
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');
  const saltHex = Array.from(salt)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('');

  // Return the concatenated hashed password and salt
  return hashHex + ':' + saltHex;
}

export async function comparePasswords(password: string, storedHashWithSalt: string) {
  const [storedHashHex, storedSaltHex] = storedHashWithSalt.split(':');

  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const storedSalt = new Uint8Array(
    storedSaltHex.match(/.{1,2}/g)?.map((byte: string) => parseInt(byte, 16)) ?? [],
  );

  // Combine stored salt and entered password
  const combinedBuffer = new Uint8Array(storedSalt.length + passwordBuffer.length);
  combinedBuffer.set(storedSalt);
  combinedBuffer.set(passwordBuffer, storedSalt.length);

  // Hash the combined salt and password
  const hashBuffer = await crypto.subtle.digest('SHA-256', combinedBuffer);

  // Convert the hash buffer to a hexadecimal string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((byte) => byte.toString(16).padStart(2, '0')).join('');

  // Compare the resulting hash with the stored hash
  return hashHex === storedHashHex;
}
