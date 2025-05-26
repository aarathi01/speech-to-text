# 🧠 Voice Search Backend (Node.js + Express + Vosk + MongoDB)

This is the backend server for the `react-voice-search-widget`, responsible for handling audio transcription and fuzzy database search. It uses the open-source Vosk speech recognition toolkit for offline transcription and MongoDB for storage.

---

## 🚀 Features

- 🎤 Accepts audio input and converts it to text using Vosk.
- 🔍 Performs fuzzy search on a MongoDB collection using keywords extracted from the input.
- 💡 Returns highlighted matches to the frontend.
- 🧱 Modular, plug-and-play backend suitable for integration with multiple applications.

---

## 📁 Folder Structure

```
server/
├── db.js                 # MongoDB connection and search logic
├── highlightUtils.js    # Utility to extract words and highlight them
├── index.js             # Main server file (Express, Vosk integration)
├── models/              # Directory to place the downloaded Vosk model
└── uploads/             # Temp directory for audio uploads
```

---

## 🧰 Technologies Used

- **Node.js + Express** – Backend framework
- **Vosk** – Offline speech recognition engine
- **MongoDB** – Data store
- **ffmpeg/fluent-ffmpeg** – Audio processing
- **Multer** – File uploads
- **CORS & Dotenv** – Cross-origin and environment config

---

## 📦 Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/aarathi01/speech-to-text.git
cd speech-to-text/server
```

### 2. Install dependencies

```bash
npm install
```

### 3. Download Vosk Model

Download a Vosk model (e.g. `vosk-model-small-en-in-0.4`) from:

🔗 https://alphacephei.com/vosk/models

Then, unzip and place it inside the `models/vosk` directory:

```
models/
└── vosk/
    ├── am
    ├── conf
    └── ...etc
```

### 4. Configure environment

Create a `.env` file in the `server` directory or use the existing `dev.env`:

```bash
MONGODB_URI=mongodb://[specified user name: specified password@]host 1[:specified port number 1][,….. host N][:specified port number N] 
PORT=5000
```

> You can also use separate env files per environment like `dev.env`, `prod.env`, etc.

### 5. Start the server

```bash
node index.js
```

The server should be running at:

```
http://localhost:5000
```

---

## 🛠 API Endpoints

### POST `/api/transcribe`

Accepts an audio file and returns the transcribed text.

**Request:**

- `multipart/form-data`
- field: `audio` (file: .wav)

**Response:**

```json
{ "text": "your transcribed text here" }
```

---

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

## 🧪 Testing

1. Use the `react-voice-search-widget` frontend to type or record input.
2. Confirm results appear automatically or with highlights.
3. Check the server console/logs for transcription and query debug info.

---

## 📋 License

MIT © [aarathi01](https://github.com/aarathi01)