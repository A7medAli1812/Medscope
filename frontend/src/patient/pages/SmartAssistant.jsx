import "../styles/SmartAssistant.css";

function SmartAssistant() {
  return (
    <div className="smart-assistant-page">

      <h2>Smart Assistant</h2>

      <iframe
        src="https://www.chatbase.co/chatbot-iframe/R6TLm3ER5j0XAJ46ll2wO"
        width="100%"
        style={{
          height: "700px",
          border: "none",
          borderRadius: "15px",
        }}
        frameBorder="0"
        title="Smart Assistant"
      />

    </div>
  );
}

export default SmartAssistant;