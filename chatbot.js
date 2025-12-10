const API_URL = "https://adarshapathasala.netlify.app/.netlify/functions/chatbot";

const chatBox = document.getElementById("chatBox");
const input = document.getElementById("userInput");

// Load chat history
window.onload = () => {
    const history = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    history.forEach(msg => addMessage(msg.text, msg.sender, false));
    welcomeMessage();
};

function saveHistory() {
    const messages = [...chatBox.children].map(m => ({
        text: m.innerText,
        sender: m.classList.contains("user") ? "user" : "bot"
    }));

    localStorage.setItem("chatHistory", JSON.stringify(messages));
}

function addMessage(text, sender, save = true) {
    const div = document.createElement("div");
    div.className = `message ${sender}`;
    div.innerText = text;
    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;

    if (save) saveHistory();
}

function addTyping() {
    const t = document.createElement("div");
    t.className = "message bot typing";
    t.id = "typing";
    t.innerText = "Typing...";
    chatBox.appendChild(t);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function removeTyping() {
    const t = document.getElementById("typing");
    if (t) t.remove();
}

async function sendMessage() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, "user");
    input.value = "";

    addTyping();

    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        });

        const data = await res.json();

        removeTyping();
        addMessage(data.reply, "bot");

    } catch (err) {
        removeTyping();
        addMessage("⚠️ Network error. Try again later.", "bot");
    }
}

// Quick question buttons
function quickAsk(q) {
    input.value = q;
    sendMessage();
}

// Voice Input
function startVoice() {
    const recog = new webkitSpeechRecognition();
    recog.lang = "en-IN";
    recog.start();

    recog.onresult = e => {
        input.value = e.results[0][0].transcript;
        sendMessage();
    };
}

// Welcome Message
function welcomeMessage() {
    if (!localStorage.getItem("welcomed")) {
        addMessage("👋 Hello! I am your Adarsha Pathasala AI Assistant. How can I help you today?", "bot");
        localStorage.setItem("welcomed", true);
    }
}

// Theme toggle
document.getElementById("themeToggle").onclick = () => {
    document.body.classList.toggle("dark");
};
