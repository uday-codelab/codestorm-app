"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    const res = await fetch("/api/history");
    const data = await res.json();
    setHistory(data.chats || []);
  };

  const handleSubmit = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setResponse(data.reply);
    setLoading(false);
    fetchHistory();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">AI Career Counselor</h1>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 text-base text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Ask a career related question..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white rounded-lg px-6 py-3 font-semibold hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Send"}
        </button>
        {response && (
          <div className="mt-4 p-4 bg-gray-100 rounded-lg text-gray-800 whitespace-pre-wrap">
            {response}
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="w-full max-w-2xl mt-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Previous Conversations</h2>
          <div className="flex flex-col gap-4">
            {history.map((chat) => (
              <div key={chat.id} className="bg-white rounded-xl shadow p-4">
                <p className="font-medium text-blue-600">Q: {chat.message}</p>
                <p className="mt-2 text-gray-700">A: {chat.reply}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}