# 🌟 Adarsha Pathasala – Official Website & AI Assistant  
### Designed & Developed by **Prem Prasad Pradhan**

[![Project Banner](https://github.com/MRPREM31/adarsha-pathasala-website/blob/master/assets/github_pages/homepage.png?raw=true)](https://adarshapathasala.netlify.app/)

Adarsha Pathasala is a CBSE-based coaching institute located in **Beguniapada, Ganjam (Odisha)**.  
This website is a complete digital platform built to provide:

- Institute information  
- Faculty details  
- Class timings  
- Results  
- Admission guidance  
- AI-powered assistance  
- Contact form with Google Apps Script  
- Clean, fast, mobile-responsive UI  

Hosted on **Netlify** with **serverless functions** for AI chatbot integration.

---

## 🚀 **Features**

### ✅ **Fully Responsive Website**
- Modern UI  
- Mobile-first design  
- Smooth animations  
- Lazy-loaded images for performance  

### 🤖 **AI Assistant (Netlify Serverless Function)**
- Built with JavaScript (Node.js)  
- Uses Groq API for instant responses  
- Special knowledge base about the institute  
- Saves chat history in localStorage  
- Day/Night theme support  
- Quick-suggestion buttons  

### 📨 **Contact Form (Google Apps Script)**
- Sends enquiry directly to Google Sheets  
- Returns a unique enquiry ID  
- Real-time success/error messages  
- Form validation (email, phone, message length)  

### 🌐 **SEO Optimized**
- Complete meta tags  
- Open Graph image for social sharing  
- Twitter card support  
- robots.txt & sitemap.xml included  
- Indexed by Google  

### 🔐 **Theme System**
- Light/Dark mode toggle  
- Automatically saved using localStorage  

### 📁 **Clean File Structure**


Here is an overview of the file organization for Adarsha Pathasala:

```text
ADARSHA-PATHASALA/
│
├── assets/                 # Static assets (images, icons)
│   ├── logo/
│   │   ├── adarshapathasala.png
│   │   └── chatbot_ai.png
│   ├── og/
│   │   └── banner.jpg      # Open Graph banner for social sharing
│   └── app-icon/
│       └── whatsapp.png
│
├── netlify/
│   └── functions/
│       └── chatbot.js      # Serverless AI backend logic
│
├── index.html              # Main landing page
├── chatbot.html            # Dedicated Chatbot UI interface
├── script.js               # Core JavaScript logic for the homepage
├── style.css               # Main stylesheet
├── sitemap.xml             # SEO Sitemap
├── robots.txt              # Search engine crawler rules
└── README.md               # Project documentation
```
---

## 🧠 Backend Architecture (chatbot.js)

**Flow:**
`User` ➜ `chatbot.html` ➜ `Netlify Function (chatbot.js)` ➜ `Groq LLM` ➜ `Response`

**Key Responsibilities:**
* Validate user input
* Prevent off-topic responses
* Follow custom APS KnowledgeBase rules
* Format clean answer
* Return JSON `{ reply: "..." }`

---

## 🔧 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript |
| **Backend** | Netlify Serverless Functions |
| **AI Model** | Groq LLM (Mixtral / Llama) |
| **Hosting** | Netlify |
| **SEO Tools** | Open Graph, Robots.txt, Sitemap.xml |

---

## 🛠️ Setup & Installation

### 1️⃣ Clone Repository
```bash
git clone [https://github.com/MRPREM31/adarsha-pathasala-website.git](https://github.com/MRPREM31/adarsha-pathasala-website.git)
cd adarsha-pathasala-website
```
### 2️⃣ Install Netlify CLI
#### (Optional but recommended for local testing)
```bash
npm install -g netlify-cli
```
### 3️⃣ Add Environment Variables
#### Go to Netlify Dashboard → Site Settings → Environment Variables and add:
```bash
GROQ_API_KEY = your_api_key_here
```
### 4️⃣ Test Serverless Function Locally
```bash
netlify dev
```
### 5️⃣ Deploy
```bash
netlify deploy --prod
```
### 📡 API Endpoint (Serverless Function)
```bash
https://your-site.netlify.app/.netlify/functions/chatbot
```
### Example Request:
```bash
{
  "message": "What are class timings?"
}
```
### Example Response:
```bash
{
  "reply": "Class timings for Adarsha Pathasala are ..."
}
```
## 🛡️ Security Notes
* ✅ API key stored securely in **Netlify environment variables**.
* ✅ No sensitive institute data stored on the client.
* ✅ AI responses restricted using `APS_KNOWLEDGE` base.

---

## 🔥 Screenshots
### Homepage
[![Homepage Screenshot](https://github.com/MRPREM31/adarsha-pathasala-website/blob/master/assets/github_pages/homepage.png?raw=true)](https://adarshapathasala.netlify.app/)

### AI Assistant
[![AI Assistant page Screenshot](https://github.com/MRPREM31/adarsha-pathasala-website/blob/master/assets/github_pages/aipage.png?raw=true)](https://adarshapathasala.netlify.app/chatbot)
---

## 📄 License
This project is licensed under the [**MIT License**](https://github.com/MRPREM31/adarsha-pathasala-website/blob/master/LICENSE).
You are free to modify, distribute, and use it commercially with attribution.

---

## 👨‍💻 Developer
**Prem Prasad Pradhan**
*B.Tech Student, NIST Berhampur*  
*Web Developer | designer | Automation | AI Integration*  
*If anyone wants to build a similar website or AI system, feel free to contact me.*

* 🌐 **Website:** [mrprem.in](https://mrprem.in)
* 📧 **Email:** [mrprem2006@gmail.com](mailto:mrprem2006@gmail.com)
* 📞 **WhatsApp:** [+91 9827775230](https://wa.me/919827775230)

<br>

### ⭐ If you like this project → Give it a star on GitHub!

