// api/claude.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.VITE_CLAUDE_API_KEY,
        "anthropic-version": "2024-02-29",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    return res.json(data);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
