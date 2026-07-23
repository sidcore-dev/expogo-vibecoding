import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { askBob, BOB_GREETING } from "@/lib/bob.functions";
import { GLASS_PRIMARY } from "@/lib/ui";

interface Message {
  role: "user" | "bob";
  text: string;
}

export function BobWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "bob", text: BOB_GREETING }]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

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
    const reply = await askBob(text);
    setMessages((m) => [...m, { role: "bob", text: reply }]);
    setThinking(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[28rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-b from-card to-card/70 shadow-2xl shadow-black/20 ring-1 ring-white/40">
          <div className="flex items-center justify-between gap-2 border-b border-border/40 px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 shadow-md shadow-primary/40 ring-1 ring-white/30">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground">Bob</div>
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  AI helper
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Bob"
              className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
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
                    "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm " +
                    (m.role === "user"
                      ? "bg-gradient-to-b from-primary to-primary/90 text-primary-foreground shadow-primary/20"
                      : "border border-border/40 bg-gradient-to-b from-secondary/70 to-secondary/40 text-foreground shadow-black/5")
                  }
                >
                  {m.text}
                </div>
              </div>
            ))}
            {thinking && (
              <div className="flex justify-start">
                <div className="rounded-2xl border border-border/40 bg-gradient-to-b from-secondary/70 to-secondary/40 px-3.5 py-2.5 text-sm text-muted-foreground shadow-sm shadow-black/5">
                  Bob is thinking…
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-border/40 p-3">
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
              className="flex-1 rounded-2xl border border-border/50 bg-background px-3.5 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={send}
              disabled={thinking || input.trim().length === 0}
              aria-label="Send"
              className={"flex h-10 w-10 flex-none items-center justify-center " + GLASS_PRIMARY}
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
        className={"flex items-center gap-2 px-4 py-3 " + GLASS_PRIMARY}
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
        <span className="text-sm font-semibold">Bob</span>
      </button>
    </div>
  );
}
