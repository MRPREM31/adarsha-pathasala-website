export async function handler(event, context) {
    try {
        const body = JSON.parse(event.body || "{}");
        const userMessage = body.message || "Hello";

        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ reply: "❌ GROQ_API_KEY missing on server!" })
            };
        }

        // CALL GROQ API
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
                        "You are the official AI Assistant of Adarsha Pathasala. Answer clearly about admissions, class timings, faculty, fees, results, address, and institute details."
                    },
                    { role: "user", content: userMessage }
                ],
                max_tokens: 250
            })
        });

        const data = await groqRes.json();

        console.log("GROQ RAW RESPONSE:", data); // Debug

        // FIX: Correct path for Groq response
        const replyText =
            data?.choices?.[0]?.message?.content ??
            data?.choices?.[0]?.delta?.content ??
            "Sorry, I couldn't get a response.";

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reply: replyText })
        };

    } catch (error) {
        console.error("SERVER ERROR:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reply: "⚠️ Server error. Try again later." })
        };
    }
}
