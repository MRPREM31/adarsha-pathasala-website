// Netlify requires this import in some cases
import fetch from "node-fetch";

export async function handler(event, context) {
    try {
        const body = JSON.parse(event.body || "{}");
        const userMessage = body.message || "Hello";

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({
                    reply: "❌ GROQ_API_KEY missing on Netlify server!"
                })
            };
        }

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama3.1-8b-instant",
                messages: [
                    {
                        role: "system",
                        content:
"💬 You are Adarsha Pathasala AI Assistant.\nHelp with admissions, classes, fees, location, results & faculty."
                    },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 250
            })
        });

        const data = await groqRes.json();

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                reply: data?.choices?.[0]?.message?.content || "I'm here to help!"
            })
        };

    } catch (err) {
        console.error("SERVER ERROR:", err);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                reply: "⚠️ Server error. Try again later."
            })
        };
    }
}
