# 🔊 react-voice-search-widget

A **plug-and-play** React component that lets users **search** either by typing or using **voice input** (speech-to-text). Built for reusability, flexibility, and quick integration into any modern React application.

---

## ✨ Features

- 🎤 **Voice Input Support**  
  Capture audio from the microphone and transcribe it using a backend speech-to-text service (e.g., Vosk).

- ⌨️ **Text Input Support**  
  Supports both voice and manual text input in the same field.

- 🔍 **Real-Time Search**  
  Automatically queries a backend search API as you speak or type (with debounce).

- 💾 Search History
  Users can view their past queries and associated results.

- 🎯 **Keyword Highlighting**  
  Matched words are highlighted in the search results and transcript text.

- ⚛️ **Modular and Reusable**  
  Packaged as a standalone React component that can be embedded in any React app.

- 💬 **Error Handling**  
  Includes fallback for unsupported browsers and clear messages when audio isn't captured or no results are found.

---

## 📦 Installation

Install the component via NPM:

```bash
npm install react-voice-search-widget
# or
yarn add react-voice-search-widget
```

---

## 🚀 Usage

```tsx
import React from 'react';
import VoiceInput from 'react-voice-search-widget';

function App() {
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <VoiceInput />
    </div>
  );
}

export default App;
```

---

## 🧱 Component Overview

### `VoiceInput.tsx`

The main component that handles:
- Microphone access
- Recording and sending audio to the backend
- Typing + voice input management
- Displaying real-time search results

### `SearchResults.tsx`

Displays the result list and highlights matched keywords.

### `UnsupportedBrowserFallback.tsx`

Renders a fallback message if the browser doesn't support `MediaRecorder` or microphone access.

---

## 🛠️ Backend API Expectations

Your backend should expose two endpoints:

### `/api/transcribe` (POST)

- Accepts an audio file (`multipart/form-data`) and returns a JSON `{ text: "transcribed text" }`.

### `/search?q=query` (GET)

- Accepts a search query and returns results in the following format:

```json
{
  "results": [
    {
      "id": "1",
      "name": "<highlighted text>",
      "category": "<highlighted category>",
      "matchedWords": ["keyword1", "keyword2"]
    }
  ]
}
```

🔗 Example backend repo: [speech-to-text (GitHub)](https://github.com/aarathi01/speech-to-text)

---

## 🧪 Development & Build

To work locally and customize:

```bash
# Start dev server
npm run dev

# Lint the code
npm run lint

# Build for production
npm run build
```

---
## 🧪 Testing
We are using Vitest and React Testing Library for unit tests.

✅ Login & Register Pages covered

✅ VoiceInput tested with mocked voice + text flows

✅ All hooks (useSearch, useSearchHistory, useSaveSearch, useVoiceRecorder) tested

✅ App.tsx, ToastHandler, and Validation Utils covered

✅ Target: 80%+ test coverage

```bash
#  Run tests
npm run test


## 🧩 Project Structure

```
react-voice-search-widget/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── services/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   └── main.tsx
├── tests/
│   ├── App.test.tsx
│   ├── hooks/
│   ├── pages/
│   └── utils/
├── public/
├── vite.config.ts
├── tsconfig.json
└── README.md

```

---

## 🎨 Styling

Tailwind CSS is used for styling. If your host app uses Tailwind, styles will integrate seamlessly. Otherwise, you may want to adjust or override styles accordingly.

---

## 📌 Customization (Coming Soon)

Planned for future versions:
- Props to override API endpoints
- Custom result renderers
- Adjustable debounce delay
- Theming via CSS variables

---

## 📃 License

MIT License

---

## 🙋‍♀️ Maintainer

**[@aarathi01](https://github.com/aarathi01)**  
_Contributions and feedback are welcome!_

---

## 🌐 Related Projects

- 🔧 [speech-to-text (Backend Repo)](https://github.com/aarathi01/speech-to-text) – Node.js + Vosk + MongoDB backend for voice search