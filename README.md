# 💻 Hiresense AI – Frontend

This is the frontend interface for **Hiresense AI**, an AI-powered resume screening and matching platform. It provides a clean, fast, and user-friendly interface for uploading resumes, matching candidates to job descriptions, scoring resumes like an ATS, and more.

🧠 Works seamlessly with the [Hiresense AI Backend](https://github.com/RohithRamesh28/HireSense-Ai-backend.git)
# import in your utils.py
from dotenv import load_dotenv
load_dotenv()


---

## 🚀 Features Overview

The UI is divided into **two main tabs**, each with focused tools and internal sub-tabs:

### 📁 Tab 1: Resume Upload & Matching
- **Upload Resumes**: Upload multiple PDF resumes at once.
- **Match with JD**:
  - Input job description as **text** or **PDF**.
  - Uses LLM + vector search to return **Top-K matching candidates**.
  - View ranked results with scores, preview links, and download buttons.

### 📊 Tab 2: ATS Scoring
- **ATS Scoring**: Upload a single resume and get a score (0–100) based on structure, format, and section clarity.
- **ATS + JD**: Upload both resume and job description to get a combined ATS + relevance score.
- **Instant Matching** - upload both resune and jd to get a relevance score,

💡 UI Notes:
- Upload tab uses a white theme, scoring tab uses a light gray theme.
- Tabbed interface allows seamless switching with stateful logic.

---

## ⚙️ Tech Stack

- React (Vite)
- Axios
- FastAPI backend (required)

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/HireSense-Ai-frontend.git
cd HireSense-Ai-frontend

2. Install dependencies
npm install
pip install requirements(dont forget a create a env and run this command)

3. Set up environment variables
Create a .env file in the root directory with:
VITE_API_BASE_URL=http://localhost:8070
⚠️ Make sure the backend is running at localhost:8070, or the frontend won’t work.

▶️ Running the Frontend
npm run dev
Then open:
http://localhost:5173
```
📤 Feature Summary
Upload & Match	- Upload multiple resumes in PDF format
Match with JD -	Enter or upload JD to find best-matching resumes
ATS Scoring	- ATS Scoring	Score a resume based on structure and formatting
ATS + JD	- Score a resume in the context of a job description

🧪 Development Notes
Upload limit: 5 resumes previewed, extras shown on hover tooltip.
Matching uses vector search and LLM scoring (via backend).
ATS scoring is fast and instant via OpenAI API.

😄 Final Note
The frontend is pretty smart — but without the backend, it’s just a stylish ghost 👻.
Make sure your backend is running at http://localhost:8070 or this app will throw beautiful errors.

