export default async (req, context) => {
    try {
        const body = await req.json();
        const userMessage = body.message || "Hello";

        const completion = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama3.1-8b-instant",
                messages: [
                    { role: "system", content: "You are Adarsha Pathasala's AI assistant. Help students with admissions, class details, faculty info, results, and institute information."},
                    { role: "user", content: userMessage }
                ],
                max_tokens: 300
            })
        });

        const data = await completion.json();

        return new Response(
            JSON.stringify({ reply: data.choices?.[0]?.message?.content || "I am here to help!" }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );

    } catch (error) {
        console.error("ERROR:", error);
        return new Response(
            JSON.stringify({ reply: "Server error. Please try again later." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};
