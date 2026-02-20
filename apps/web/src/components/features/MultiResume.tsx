"use client";

import { useState, useRef } from "react";

export function MultiResume() {
  const [input, setInput] = useState("");
  const [variant, setVariant] = useState<"product" | "service" | "startup">("product");
  const [result, setResult] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const text = await new Promise<string>((res, rej) => {
        const r = new FileReader();
        r.onload = () => res(String(r.result ?? ""));
        r.onerror = rej;
        r.readAsText(f, "UTF-8");
      });
      setInput(text);
    } catch {
      setInput("");
    }
    e.target.value = "";
  };
  const run = () => {
    const tips =
      variant === "product"
        ? "Emphasize scale, metrics, and ownership. Add system design and performance."
        : variant === "service"
        ? "Emphasize client delivery, timelines, and communication. Add agile/process."
        : "Emphasize speed, ownership, and full-stack. Add initiative and learning.";
    setResult(`Resume variant: ${variant.toUpperCase()}\n\nFocus for this version:\n${tips}`);
  };
  return (
    <div className="space-y-6">
      <p className="text-gray-400">Upload a file (any format) or paste. Generate different versions for product / service / startup.</p>
      <div>
        <input type="file" accept="*" ref={fileRef} onChange={onFile} className="hidden" />
        <button type="button" onClick={() => fileRef.current?.click()} className="mb-2 px-3 py-1.5 rounded-lg bg-white/10 text-sm text-gray-300">Upload file (any format)</button>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} placeholder="Or paste resume / key points..." className="input-field min-h-[100px]" />
      </div>
      <div>
        <label className="block text-sm text-gray-400 mb-2">Target</label>
        <div className="flex gap-3">
          {(["product", "service", "startup"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setVariant(v)}
              className={`px-4 py-2 rounded-xl text-sm ${variant === v ? "bg-cyan-500/30 text-cyan-300" : "bg-white/10 text-gray-400"}`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <button onClick={run} className="btn-primary">Get strategy</button>
      {result && <pre className="glass-card p-4 rounded-xl text-sm text-gray-300 whitespace-pre-wrap">{result}</pre>}
    </div>
  );
}
