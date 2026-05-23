export function createId(): string {
  if ("randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
