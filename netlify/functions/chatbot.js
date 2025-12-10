export async function handler(event, context) {
    try {
        // Parse request
        const body = JSON.parse(event.body || "{}");
        const userMessage = body.message || "Hello";

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ reply: "❌ GROQ_API_KEY missing on server!" })
            };
        }

        // ⛔ No node-fetch — Netlify already provides fetch()
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
                        content: "You are Adarsha Pathasala AI Assistant. Help with admissions, classes, timings, results, fees, etc."
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

    } catch (error) {
        console.error("SERVER ERROR:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                reply: "⚠️ Server error. Try again later."
            })
        };
    }
}
