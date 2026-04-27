export async function reviewCode(diff: string): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
            You are a senior reviewer.

            Analyze this diff and find:
            - bugs
            - performance issues
            - bad practices
          `,
        },
        {
          role: "user",
          content: `Analyze this diff:\n${diff}`,
        },
      ],
    }),
  });

  const data = await response.json();

  return data.choices?.[0]?.message?.content || "";
}