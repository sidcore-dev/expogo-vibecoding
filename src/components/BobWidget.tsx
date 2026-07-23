import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { askBob, getBobSettings } from "@/lib/bob.functions";
import { BTN_PRIMARY, CARD, INPUT } from "@/lib/ui";

interface Message {
  role: "user" | "bob";
  text: string;
}

export function BobWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  const settingsQuery = useQuery({ queryKey: ["bob-settings"], queryFn: () => getBobSettings() });

  useEffect(() => {
    if (settingsQuery.data) {
      setMessages([{ role: "bob", text: settingsQuery.data.greeting }]);
    }
  }, [settingsQuery.data]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages, thinking, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || thinking) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setThinking(true);
    const reply = await askBob({ data: text });
    setMessages((m) => [...m, { role: "bob", text: reply }]);
    setThinking(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className={"flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden " + CARD}>
          <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Bob</div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Helper
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Bob"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={"flex " + (m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={
                    "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed " +
                    (m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-secondary/40 text-foreground")
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="rounded-xl border border-border bg-secondary/40 px-3.5 py-2.5 text-sm text-muted-foreground">
                  Bob is thinking…
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Ask Bob something…"
              className={"flex-1 rounded-xl bg-background px-3.5 py-2.5 text-sm text-foreground " + INPUT}
            />
            <button
              type="button"
              onClick={send}
              disabled={thinking || input.trim().length === 0}
              aria-label="Send"
              className={"h-10 w-10 flex-none justify-center " + BTN_PRIMARY}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close Bob helper" : "Open Bob helper"}
        className={"px-4 py-3 shadow-lg " + BTN_PRIMARY}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span>Bob</span>
      </button>
    </div>
  );
}
