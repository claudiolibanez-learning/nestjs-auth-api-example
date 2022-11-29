import { compare, compareSync, hash, hashSync } from 'bcrypt';

const SALT = 10;

export async function generateHash(payload: string): Promise<string> {
  return hash(payload, SALT);
}

export function generateHashSync(payload: string): string {
  return hashSync(payload, SALT);
}

export async function compareHash(
  payload: string,
  hashed: string,
): Promise<boolean> {
  return compare(payload, hashed);
}

export function compareHashSync(payload: string, hashed: string): boolean {
  return compareSync(payload, hashed);
}
