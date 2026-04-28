export function parsePatch(patch: string) {
  const comments: { line: number; code: string }[] = [];

  const lines = patch.split("\n");
  let currentLine = 0;

  for (const rawLine of lines) {
    const line = rawLine.trim();

    // diff header
    if (rawLine.startsWith("@@")) {
      const match = rawLine.match(/\+(\d+)/);
      if (match) {
        currentLine = parseInt(match[1], 10);
      }
      continue;
    }

    // add line
    if (rawLine.startsWith("+") && !rawLine.startsWith("+++")) {
      const code = rawLine.substring(1).trim();

      // ❌ ignore empty lines
      if (!code) {
        currentLine++;
        continue;
      }

      // ❌ ignore common comments
      if (
        code.startsWith("//") ||
        code.startsWith("/*") ||
        code.startsWith("*") ||
        code.startsWith("*/")
      ) {
        currentLine++;
        continue;
      }

      comments.push({
        line: currentLine,
        code,
      });

      currentLine++;
      continue;
    }

    if (!rawLine.startsWith("-")) {
      currentLine++;
    }
  }

  return comments;
}