function ChatBubble({ message }) {
  const isUser = message.from === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xl p-3 rounded-lg ${isUser ? 'bg-indigo-600 text-white' : 'bg-gray-100'}`}>
        <div className="whitespace-pre-wrap">{message.text}</div>
        {message.citations && (
          <div className="mt-2 text-xs text-gray-500">
            <div className="font-medium">Citations:</div>
            {message.citations.map((c, i) => (
              <div key={i}>• {c.doc} — {c.section} <span className="text-muted">({c.anchor})</span></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatBubble;