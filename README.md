# 🗣️ Speech-to-Text Voice Search (Monorepo)

A plug-and-play monorepo for voice-driven search using offline speech recognition (Vosk), fuzzy matching, and a reusable React widget. This setup enables voice input, transcription, search, and result highlighting in real-time.

---

## 📦 Monorepo Structure

```
speech-to-text/
├── react-voice-search-widget/   # Frontend React component (published to NPM)
├── react-voice-search-backend/  # Backend Node.js + Express + Vosk
└── README.md                    # Project root readme
```

---

## 🧩 Features

### ✅ Frontend (`react-voice-search-widget`)
- Reusable React component (published as an NPM package)
- Audio recording and transcript display
- Real-time highlighting of matched keywords
- Tailwind CSS for styling
- Written in TypeScript

### ✅ Backend (`react-voice-search-backend`)
- Node.js + Express API
- Vosk for offline speech-to-text
- MongoDB integration with fuzzy search
- Highlighting utility for results
- Temporary file handling via Multer
- FFmpeg integration for audio conversion

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- Vosk speech recognition model

---

## 🔧 Setup

### 1. Clone the repo

```bash
git clone https://github.com/aarathi01/speech-to-text.git
cd speech-to-text
```

---

## 🔌 Frontend: `react-voice-search-widget`

### 📦 Install dependencies

```bash
cd react-voice-search-widget
npm install
```

### 🧪 Run in dev mode

```bash
npm run dev
```

### 🚢 Build

```bash
npm run build
```

### 📤 Publish to NPM

```bash
npm publish --access public
```

> Make sure to update `package.json` before publishing.

---

## 🔌 Backend: `server`

### 📦 Install dependencies

```bash
cd react-voice-search-backend
npm install
```

### 🧠 Download Vosk Model

Download a model (e.g. `vosk-model-small-en-us-0.15`) from [https://alphacephei.com/vosk/models](https://alphacephei.com/vosk/models), and extract it (if not available in the repo) into:

```
server/models/vosk/
```

### ⚙️ Environment Setup

Create a file named `dev.env` inside `server/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/voice-search<your url>
```

### ▶️ Start the server

```bash
npm run dev
```

---

## 🌐 API Endpoints

### `POST /api/transcribe`
Uploads audio and returns transcribed text.

- `FormData`: audio (file)

### `GET /search?q=keyword`
Performs a fuzzy search on the database and returns matched documents with highlights.

---

## 🧪 Example Use Case

1. User speaks a query.
2. Frontend sends the audio to `/api/transcribe`.
3. Transcript is parsed and matched using fuzzy search.
4. Results are returned and highlighted in the UI.

---

## 📦 NPM Package (Frontend)

> Visit: [https://www.npmjs.com/package/react-voice-search-widget](https://www.npmjs.com/package/react-voice-search-widget)

```bash
npm install react-voice-search-widget
```

Then use it in your app:

```tsx
import { VoiceSearchWidget } from 'react-voice-search-widget';

function App() {
  return <VoiceSearchWidget apiUrl="http://localhost:5000" />;
}
```

---

## 🧹 TODO / Roadmap

- [ ] Enable real-time streaming transcription
- [ ] Add test coverage

---

## 🛠️ Technologies

- React 19 + TypeScript
- Vite
- TailwindCSS
- Node.js + Express
- Vosk
- FFmpeg
- MongoDB

---

## 🧑‍💻 Author

**Aarathi Ajith** – [GitHub](https://github.com/aarathi01)

---

## 📄 License

This project is licensed under the MIT License.