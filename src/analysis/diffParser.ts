export function splitDiff(diff: string, maxLength = 2000): string[] {
  const chunks: string[] = [];

  for (let i = 0; i < diff.length; i += maxLength) {
    chunks.push(diff.slice(i, i + maxLength));
  }

  return chunks;
}