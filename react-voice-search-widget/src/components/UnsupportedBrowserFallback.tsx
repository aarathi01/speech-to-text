import React from "react";

const UnsupportedBrowserFallback: React.FC = () => {
  return (
    <div className="unsupported-browser">
      <h2>Speech Recognition Not Supported</h2>
      <p>
        Unfortunately, your browser doesn't support voice input using the Web
        Speech API.
      </p>
      <p>
        Please try using a supported browser like <strong>Google Chrome</strong>{" "}
        or <strong>Microsoft Edge</strong>.
      </p>
      <p>You can still use the search by typing in the text area.</p>
    </div>
  );
};

export default UnsupportedBrowserFallback;
