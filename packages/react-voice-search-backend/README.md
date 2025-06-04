# 🧠 Voice Search Backend (Node.js + Express + Vosk + MongoDB Atlas)

This is the backend server for the `react-voice-search-widget`, responsible for handling audio transcription and fuzzy database search. It uses the open-source Vosk speech recognition toolkit for offline transcription and MongoDB for storage.

---

## 🚀 Features

- 🎤 Real-time transcription using WebSocket and Vosk.
- 🔍  Performs full-text search on a MongoDB Atlas collection using extracted keywords.
- 💡 Returns highlighted matches to the frontend.
- 🧱 Modular, plug-and-play backend suitable for integration with multiple applications.

---

## 📁 Folder Structure

```
react-voice-search-backend/
├── controllers/
│   └── searchController.js     # Handles search route logic
├── routes/
│   └── searchRoutes.js         # Search endpoint routing
├── services/
│   └── transcriptionService.js # WebSocket speech-to-text service
├── utils/
│   ├── db.js                   # MongoDB connection and Atlas search logic
│   └── highlightUtils.js      # Word extraction and highlighting utils
├── models/                    # Vosk model directory (download required)
├── dev.env                    # Example development env file
└── index.js                   # Server entry point
```

---

## 🧰 Technologies Used

- **Node.js + Express** – Backend framework
- **Vosk** – Offline speech recognition engine
- **MongoDB Atlas** – Cloud database with full-text search
- **WebSocket (ws)** – Real-time speech recognition
- **CORS & Dotenv** – Cross-origin and environment config

---

## 📦 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/aarathi01/speech-to-text.git
cd speech-to-text/packages/react-voice-search-backend/
```

### 2. Install dependencies

```bash
npm install
```

### 3. Download Vosk Model

Download a model from: https://alphacephei.com/vosk/models

Unzip into:

```
models/
└── vosk/
    ├── am
    ├── conf
    └── ...
```

### 4. Configure environment

Create a `.env` file in the `react-voice-search-backend` directory or use the existing `dev.env`:

```
MONGODB_URI=your-mongodb-atlas-uri
PORT=5000
SAMPLE_RATE=16000
BASE_URL=localhost
```
> You can also use separate env files per environment like `dev.env`, `prod.env`, etc.

⚠️ Make sure your IP is whitelisted in MongoDB Atlas under Network Access.
Only an IP address you add to your Access List will be able to connect to your project's clusters. You can manage existing IP entries via the Network Access Page in https://cloud.mongodb.com/.


```bash
MONGODB_URI=mongodb://[specified user name: specified password@]host 1[:specified port number 1][,….. host N][:specified port number N] 
PORT=5000
```

### 5. Start the server

```bash
node index.js
```

## 🔌 WebSocket Endpoint
### ws://localhost:5000/ws/transcribe

- Accepts audio stream and returns live transcribed text (partial + final).

**Message Format:**

```json
{ "partial": "text" }
{ "final": "complete sentence" }
```

---

## 🛠 API Endpoints

### GET `/search?q=...`

Performs a fuzzy search in the database using the provided query.

**Query Params:**

- `q`: (string) the input text or transcript

**Response:**

```json
{
  "results": [
    {
      "id": "...",
      "name": "...highlighted...",
      "category": "...highlighted...",
      "matchedWords": [...]
    }
  ]
}
```
---

## ✅ Audio Privacy

- Audio is streamed temporarily and not stored.
- No persistent storage of user voice data beyond real-time processing.

---

## 🧪 Testing

1. Use the `react-voice-search-widget` frontend to type or record input.
2. Watch results update in real-time..
3. Confirm correct highlighting and matches in output.

📦 Unit Tests

- Run all tests:

  ```bash
  npm test
  ```

---
## ❗️Known Limitations

- MongoDB Atlas Search may require additional tuning to match prefixes (e.g., "sam" → "Samsung").
- Ensure Atlas indexes are properly configured (`autocomplete`, `text`, etc.).

---

## 📋 License

MIT © [aarathi01](https://github.com/aarathi01)