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

            And answer in this format using the minimum amount of words possible:
            - ![gif](https://emojis.slackmojis.com/emojis/images/1620248090/36123/megaman_dance.gif?1620248090) - AI AGENT REVIEW:
            - Issue: Say whats the issue
            - Explanation: Explain why is it an issue
            - Suggestion: Suggest how to fix it
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