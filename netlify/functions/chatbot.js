export async function handler(event, context) {
    try {
        const body = JSON.parse(event.body || "{}");
        const userMessage = body.message || "Hello";

        const apiKey = process.env.GROQ_API_KEY;
        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ reply: "API key missing on server." })
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
                    { role: "system", content: "You are Adarsha Pathasala’s AI assistant. Help with admissions, results, classes, faculty, etc." },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 300
            })
        });

        const data = await groqRes.json();

        return {
            statusCode: 200,
            body: JSON.stringify({
                reply: data.choices?.[0]?.message?.content || "I am here to help!"
            })
        };

    } catch (err) {
        console.error("SERVER ERROR:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ reply: "Server error. Please try again later." })
        };
    }
}
