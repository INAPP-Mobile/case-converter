"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import Script from "next/script";
import {
  ClipboardPaste,
  Copy,
  Check,
  Trash2,
  Star,
  History as HistoryIcon,
  Clock,
} from "lucide-react";
import { toast } from "react-toastify";

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

import {
  HistoryEntry,
  getHistory,
  addEntry,
  deleteEntry,
  clearHistory,
  togglePin,
} from "@/lib/history";
import {
  parseWords,
  toCamelCase,
  toPascalCase,
  toSnakeCase,
  toKebabCase,
  toUpperCase,
  toLowerCase,
  toTitleCase,
  toCapitalized,
  toConstantCase,
  toTrainCase,
  toDotCase,
  toSentenceCase,
  toToggleCase,
  toAlternatingCase,
} from "@/lib/case";

const firebaseConfig = {
  apiKey: "AIzaSyBTFYW79t3Hd8ldCfc6tw6VFG34FjsjGgU",
  authDomain: "freeq-one.firebaseapp.com",
  projectId: "freeq-one",
  storageBucket: "freeq-one.firebasestorage.app",
  messagingSenderId: "905128076747",
  appId: "1:905128076747:web:5c7e293432301f611b824e",
  measurementId: "G-DT3XNM6TPG",
};

const app = initializeApp(firebaseConfig);
export { app };

interface CaseResult {
  label: string;
  value: string;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function truncate(str: string, len: number): string {
  if (str.length <= len) return str;
  return str.slice(0, len) + "...";
}

const INPUT_STORAGE_KEY = "case-input";

export default function Home() {
  const [input, setInput] = useState(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem(INPUT_STORAGE_KEY) || "";
      } catch {
        return "";
      }
    }
    return "";
  });
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    if (typeof window !== "undefined") {
      try {
        return getHistory();
      } catch {
        return [];
      }
    }
    return [];
  });
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const lastRecordedRef = useRef<string>("");

  useEffect(() => {
    getAnalytics(app);
  }, []);

  const persistInput = useCallback((val: string) => {
    setInput(val);
    try {
      localStorage.setItem(INPUT_STORAGE_KEY, val);
    } catch {
      // storage full
    }
  }, []);

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      persistInput(text);
      toast.success("Pasted from clipboard");
    } catch {
      toast.error("Failed to read clipboard");
    }
  }, [persistInput]);

  const handleClear = useCallback(() => {
    persistInput("");
    toast.success("Cleared");
  }, [persistInput]);

  const wordCount = useMemo(() => {
    if (!input.trim()) return 0;
    return input.trim().split(/\s+/).length;
  }, [input]);

  const charCount = useMemo(() => input.length, [input]);

  const words = useMemo(() => parseWords(input), [input]);

  const results: CaseResult[] = useMemo(() => [
    { label: "camelCase", value: toCamelCase(words) },
    { label: "PascalCase", value: toPascalCase(words) },
    { label: "snake_case", value: toSnakeCase(words) },
    { label: "kebab-case", value: toKebabCase(words) },
    { label: "UPPER CASE", value: toUpperCase(words) },
    { label: "lower case", value: toLowerCase(words) },
    { label: "Title Case", value: toTitleCase(words) },
    { label: "Capitalized", value: toCapitalized(words) },
    { label: "CONSTANT_CASE", value: toConstantCase(words) },
    { label: "Train-Case", value: toTrainCase(words) },
    { label: "dot.case", value: toDotCase(words) },
    { label: "Sentence case", value: toSentenceCase(words) },
    { label: "Toggle Case", value: input ? toToggleCase(input) : "" },
    { label: "Alternating Case", value: input ? toAlternatingCase(input) : "" },
  ], [words, input]);

  const handleCopy = useCallback(async (value: string, index: number) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  }, []);

  useEffect(() => {
    if (input) {
      const key = input;
      if (key !== lastRecordedRef.current) {
        lastRecordedRef.current = key;
        const updated = addEntry(input, "case-converter", "");
        setHistory(updated);
      }
    }
  }, [input]);

  const displayHistory = useMemo(() => {
    const pinned = history.filter((e) => e.pinned);
    const unpinned = history.filter((e) => !e.pinned);
    return [...pinned, ...unpinned];
  }, [history]);

  const handleHistoryLoad = useCallback(
    (entry: HistoryEntry) => {
      persistInput(entry.input);
      lastRecordedRef.current = entry.input;
    },
    [persistInput]
  );

  const handleHistoryTogglePin = useCallback((id: string) => {
    const result = togglePin(id);
    setHistory(result.entries);
    if (result.limitReached) {
      toast.warning("Maximum 10 pinned items");
    }
  }, []);

  const handleHistoryDelete = useCallback((id: string) => {
    const updated = deleteEntry(id);
    setHistory(updated);
  }, []);

  const handleHistoryClear = useCallback(() => {
    const updated = clearHistory();
    setHistory(updated);
    toast.success("History cleared");
  }, []);

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-2 text-center">
          Case Converter
        </h1>
        <p className="text-center text-gray-400 mb-8 text-sm">
          Convert text between camelCase, snake_case, kebab-case, and more
        </p>

        <div className="space-y-3 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Input
            </h2>
            <div className="flex gap-1.5">
              <button
                onClick={handlePaste}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs text-gray-300 transition-colors"
              >
                <ClipboardPaste size={14} />
                Paste
              </button>
              <button
                onClick={handleClear}
                disabled={!input}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-xs text-gray-300 transition-colors"
              >
                <Trash2 size={14} />
                Clear
              </button>
            </div>
          </div>

          <textarea
            value={input}
            onChange={(e) => persistInput(e.target.value)}
            placeholder="Type or paste your text here..."
            rows={6}
            className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
            spellCheck={false}
          />

          <div className="flex justify-between text-xs text-gray-500">
            <span>{charCount} characters</span>
            <span>{wordCount} words</span>
          </div>
        </div>

        {input && (
          <div className="space-y-4 mb-8">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider">
              Results
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {results.map((result, index) => (
                <div
                  key={result.label}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-400">
                      {result.label}
                    </span>
                    {result.value && (
                      <button
                        onClick={() => handleCopy(result.value, index)}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
                      >
                        {copiedIndex === index ? (
                          <Check size={12} className="text-green-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                        Copy
                      </button>
                    )}
                  </div>
                  <div className="text-sm text-white font-mono break-all">
                    {result.value || (
                      <span className="text-gray-500 italic">no input</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <HistoryIcon size={14} />
              History
            </h2>
            {displayHistory.length > 0 && (
              <button
                onClick={handleHistoryClear}
                className="flex items-center gap-1 px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs text-gray-300 transition-colors"
              >
                <Trash2 size={12} />
                Clear All
              </button>
            )}
          </div>

          {displayHistory.length === 0 ? (
            <div className="text-gray-500 text-sm text-center py-8">
              No history yet
            </div>
          ) : (
            <div className="space-y-1 max-h-[320px] overflow-y-auto pr-1">
              {displayHistory.map((entry) => (
                <div
                  key={entry.id}
                  className="group flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg cursor-pointer transition-colors"
                  onClick={() => handleHistoryLoad(entry)}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHistoryTogglePin(entry.id);
                    }}
                    className="shrink-0 p-0.5 transition-colors"
                    title={entry.pinned ? "Unpin" : "Pin"}
                  >
                    <Star
                      size={14}
                      className={
                        entry.pinned
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-500 hover:text-gray-300"
                      }
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px] font-medium px-1 py-0.5 rounded bg-purple-900/50 text-purple-300">
                        CASE
                      </span>
                      <span className="text-[10px] text-gray-500 truncate">
                        {truncate(entry.input, 48)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={10} className="text-gray-600" />
                      <span className="text-[10px] text-gray-600">
                        {timeAgo(entry.timestamp)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHistoryDelete(entry.id);
                    }}
                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-600/30 rounded transition-all text-gray-500 hover:text-red-400 shrink-0"
                    title="Delete"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>
            Convert text between multiple case formats. Part of the{" "}
            <a
              href="https://freeq.one"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              freeq.one
            </a>{" "}
            tools suite.
          </p>
        </div>
      </div>

      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=AW-971442831"
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-971442831');
        gtag('event', 'conversion', {
            'send_to': 'AW-971442831/vGudCLGrjq4cEI-VnM8D',
            'value': 1.0,
            'currency': 'CAD'
        });
      `,
        }}
      />
    </main>
  );
}
