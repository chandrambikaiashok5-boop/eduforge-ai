"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type Message = { role: "user" | "assistant"; content: string };

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const history = messages.slice(-10);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });
      const data = await res.json();
      const reply = res.ok
        ? data.answer
        : data.error ?? "Sorry, I could not answer right now.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex h-screen max-w-4xl flex-col bg-[#020617] p-4 text-white">
      <h1 className="text-3xl font-bold">ZenChat</h1>
      <p className="mb-4 text-slate-400">
        Study smarter and build better engineering projects.
      </p>

      <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl border border-slate-700 bg-[#0f172a] p-4">
        {messages.length === 0 && (
          <p className="text-slate-500">
            Ask about studies, coding, or engineering projects.
          </p>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-4 py-3 ${
                m.role === "user" ? "bg-[#007595]" : "bg-[#1e293b]"
              }`}
            >
              <div className="mb-1 text-xs font-bold uppercase text-slate-300">
                {m.role === "user" ? "You" : "ZenChat"}
              </div>

              {m.role === "assistant" ? (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => <p className="mb-2">{children}</p>,
                    ul: ({ children }) => (
                      <ul className="mb-2 list-disc pl-5">{children}</ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-2 list-decimal pl-5">{children}</ol>
                    ),
                    code: ({ children }) => (
                      <code className="rounded bg-black/40 px-1 py-0.5 font-mono text-sm">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="mb-2 overflow-x-auto rounded bg-black/40 p-3 text-sm">
                        {children}
                      </pre>
                    ),
                  }}
                >
                  {m.content}
                </ReactMarkdown>
              ) : (
                <p className="whitespace-pre-wrap">{m.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && <p className="text-sm text-slate-500">Thinking...</p>}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex gap-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={2}
          placeholder="Ask about studies, coding, or engineering projects..."
          className="flex-1 resize-none rounded-2xl border border-slate-700 bg-[#0f172a] p-3 outline-none"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="rounded-2xl bg-cyan-400 px-6 font-bold text-black disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </main>
  );
}