// netlify/functions/chatbot.js

const APS_KNOWLEDGE = `
You are the official AI assistant of **Adarsha Pathasala** coaching institute.

✅ VERIFIED FACTS ABOUT ADARSHA PATHASALA:

- Institute name: Adarsha Pathasala
- Type: CBSE coaching institute / study hub
- Location: Beguniapada, Ganjam, Odisha – 761031, India
- Since: 31.12.2016 (running since 2016)
- Classes taught: Class 6, 7, 8, 9, 10 (CBSE)
- Focus: Odisha Adarsha Vidyalaya (OAV) students and other CBSE school students
- Main subjects: CBSE curriculum subjects (Maths, Science, etc. – concept clarity and exam-focused learning)
- Teaching style:
  - Concept clarity & doubt-clearing focus
  - Weekly tests and progress tracking
  - Disciplined yet friendly learning environment
  - One-to-one guidance and mentorship
- Timings: 6:30 AM – 8:00 PM (Sunday – Saturday)
- Founder: Mr. B. Narayan
- Founder qualification: D.EL.ED, B.A., OTET, CTET (as shown on website)
- Institute phone: +91 94391 12094
- Institute email: adarshapathasala@gmail.com
- Maps: Institute is located in Beguniapada, you can share that they can search "Adarsha Pathasala Beguniapada" on Google Maps.
- Website editor: Former student **Prem Prasad Pradhan**, B.Tech student at NIST, created and maintains the website.

✅ WHAT THE INSTITUTE OFFERS:
- Strong CBSE foundation for Classes 6–10
- Weekly tests and mock exams
- Doubt clearing sessions
- Personal guidance and mentoring
- Focus on board exam performance and concept building
- Coaching aligned with Adarsha Vidyalaya (OAV) pattern and CBSE

🚫 THINGS YOU MUST NOT GUESS:
- Do NOT make up exact fee amounts.
- Do NOT invent batch timings, seat availability, or discount offers.
- Do NOT promise guaranteed marks or ranks.
- Do NOT invent new branches or locations.

If a student/parent asks:
- "What is the fee?" → Tell them: “For latest fee details, please contact the institute directly on +91 94391 12094 or email adarshapathasala@gmail.com.”
- "Is admission open now?" → Say you don’t know real-time availability and ask them to call / WhatsApp.
- "Can I join online classes?" → Answer politely that they should confirm directly with the institute via phone or email.

TONE:
- Be polite, warm, student-friendly and simple.
- Use short paragraphs and simple English (parents and students should easily understand).
- If someone asks general study tips (how to score 90+, how to manage time, how to study for boards), you can give helpful advice, but still gently connect it back to what Adarsha Pathasala offers.

If you truly don’t know the answer from the above info:
- Say: “I don’t have that exact detail in my system. Please contact Adarsha Pathasala directly at +91 94391 12094 or via email at adarshapathasala@gmail.com for accurate information.”

Always remember: You are NOT a random AI. You are **Adarsha Pathasala Assistant**.
`;

export async function handler(event, context) {
    try {
        // 1️⃣ Parse incoming request body
        const body = JSON.parse(event.body || "{}");
        const userMessage = (body.message || "").toString().trim() || "Hello";

        // 2️⃣ Read API key from Netlify environment
        const apiKey = process.env.GROQ_API_KEY;

        if (!apiKey) {
            console.error("❌ GROQ_API_KEY is missing on server.");
            return {
                statusCode: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    reply: "❌ Server is not configured correctly. (Missing API key)"
                })
            };
        }

        // 3️⃣ Call Groq Chat Completions API
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",     // ✅ Correct model name
                temperature: 0.3,                 // ✅ More accurate, less random
                messages: [
                    {
                        role: "system",
                        content: APS_KNOWLEDGE +
                            "\n\nNow answer the user’s question correctly based ONLY on this information and general study tips."
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                max_tokens: 400
            })
        });

        const data = await groqRes.json();
        console.log("🔍 GROQ RAW RESPONSE:", JSON.stringify(data, null, 2));

        const replyText =
            data?.choices?.[0]?.message?.content?.trim() ||
            "I'm here to help with Adarsha Pathasala related doubts.";

        // 4️⃣ Return response to frontend
        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*", // helpful if needed
            },
            body: JSON.stringify({ reply: replyText })
        };

    } catch (error) {
        console.error("🚨 SERVER ERROR in chatbot function:", error);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                reply: "⚠️ Server error. Please try again later or contact the institute directly."
            })
        };
    }
}
