import React from 'react';
import VoiceInput from './components/VoiceInput';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <h1>Voice Search</h1>
      <VoiceInput />
    </div>
  );
};

export default App;
