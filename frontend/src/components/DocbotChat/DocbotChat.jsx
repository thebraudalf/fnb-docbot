
import { mockApi } from "../../utils/utils";
import ChatBubble from "../ChatBubble";
import { useState } from "react";

function DocbotChat() {
  const [messages, setMessages] = useState([{
    id: 1, from: 'system', text: 'Ask the DocBot about a SOP. Example: "How to drain the fryer?"'
  }]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!q.trim()) return;
    const userMsg = { id: Date.now(), from: 'user', text: q };
    setMessages(ms => [...ms, userMsg]);
    setLoading(true);
    try {
      // Replace with real API call
      const res = await mockApi.queryDocbot(q);
      const botMsg = { id: Date.now()+1, from: 'bot', text: res.answer, citations: res.citations };
      setMessages(ms => [...ms, botMsg]);
    } catch (err) {
      setMessages(ms => [...ms, { id: Date.now()+2, from: 'bot', text: 'Error querying docbot' }]);
    } finally {
      setLoading(false);
      setQ('');
    }
  };

  return (
    <div className="flex flex-col h-[70vh]">
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map(m => (
          <ChatBubble key={m.id} message={m} />
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Ask the SOPs..." className="flex-1 border rounded px-3 py-2" />
        <button onClick={send} disabled={loading} className="bg-indigo-600 text-white px-4 py-2 rounded">{loading? 'Thinking...':'Ask'}</button>
      </div>
    </div>
  );
}

export default DocbotChat;
