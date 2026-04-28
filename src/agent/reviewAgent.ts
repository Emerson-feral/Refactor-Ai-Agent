export async function reviewCode(code: string, filename: string ): Promise<string> {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      max_tokens: 80,
      temperature: 0.2,
      messages: [
        {
          role: "system",
          content:`
            You are a strict code reviewer.

            Rules:
            - Analyze ONLY the given code
            - Do NOT invent code
            - Do NOT create examples
            - Do NOT assume missing context
            - Ignore comments
            - Ignore empty lines nad code spaces
            - If there is no real issue, return ONLY: OK
            - Be concise (max 1 sentence)

            Output format:
            Issue: <short>
            Fix: <short>
          `,
        },
        {
          role: "user",
          content:`
            File: ${filename}

            Changed line:
            ${code}
          `,
        },
      ],
    }),
  });

  const data = await response.json();

  return data.choices?.[0]?.message?.content || "";
}