export function parsePatch(patch: string) {
  const comments: { line: number; code: string }[] = [];

  const lines = patch.split("\n");
  let currentLine = 0;

  for (const line of lines) {
    if (line.startsWith("@@")) {
      const match = line.match(/\+(\d+)/);
      if (match) {
        currentLine = parseInt(match[1], 10);
      }
      continue;
    }

    if (line.startsWith("+") && !line.startsWith("+++")) {
      comments.push({
        line: currentLine,
        code: line.substring(1),
      });
      currentLine++;
      continue;
    }

    if (!line.startsWith("-")) {
      currentLine++;
    }
  }

  return comments;
}