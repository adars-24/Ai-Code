import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { useAuth } from "./context/AuthContext";
import { runTool } from "./api";
import Auth from "./pages/Auth";
import HistoryPanel from "./components/HistoryPanel";
import DebugResultComponent from "./components/DebugResult";
import ExplainResultComponent from "./components/ExplainResult";
import ConvertResultComponent from "./components/ConvertResult";
import ComplexityResultComponent from "./components/ComplexityResult";
import {
  type ToolType,
  type AIProvider,
  type ToolResult,
  type DebugResult,
  type ExplainResult,
  type ConvertResult,
  type ComplexityResult,
  type Tab,
  type IHistory,
} from "./types";
import "./index.css";

const TABS: Tab[] = [
  { id: "debug", label: "Debug", icon: "🐛", description: "Find & fix errors" },
  {
    id: "explain",
    label: "Explain",
    icon: "📖",
    description: "Understand code",
  },
  {
    id: "convert",
    label: "Convert",
    icon: "🔄",
    description: "Change language",
  },
  {
    id: "complexity",
    label: "Complexity",
    icon: "⏱",
    description: "Analyze performance",
  },
];

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "cpp",
  "csharp",
  "go",
  "rust",
  "php",
  "ruby",
];

const TARGET_LANGUAGES = [
  "Python",
  "JavaScript",
  "TypeScript",
  "Java",
  "C++",
  "C#",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
];

const DEFAULT_CODE = `function findDuplicates(arr) {
  let duplicates = [];
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] === arr[j]) {
        duplicates.push(arr[i]);
      }
    }
  }
  return duplicates;
}`;

const App = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTool, setActiveTool] = useState<ToolType>("debug");
  const [provider, setProvider] = useState<AIProvider>("gemini");
  const [code, setCode] = useState<string>(DEFAULT_CODE);
  const [language, setLanguage] = useState<string>("javascript");
  const [targetLanguage, setTargetLanguage] = useState<string>("Python");
  const [result, setResult] = useState<ToolResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tokensUsed, setTokensUsed] = useState<number>(0);
  const [historyRefresh, setHistoryRefresh] = useState<number>(0);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  // Show auth page if not logged in
  if (!isAuthenticated) {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#1a1d2e",
              color: "#e2e8f0",
              border: "1px solid #2d3148",
              borderRadius: "8px",
              fontSize: "13px",
            },
          }}
        />
        <Auth />
      </>
    );
  }

  const handleRun = async (): Promise<void> => {
    if (!code.trim()) {
      toast.error("Please enter some code first");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await runTool(
        code,
        activeTool,
        provider,
        activeTool === "convert" ? targetLanguage : undefined,
      );

      if (response.success && response.data) {
        setResult(response.data);
        setTokensUsed(response.tokensUsed || 0);
        setHistoryRefresh((prev) => prev + 1); // trigger history reload
        toast.success("Analysis complete");
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message.includes("429")) {
          toast.error("Rate limit reached — wait 15 minutes");
        } else if (error.message.includes("401")) {
          toast.error("Session expired — please login again");
          logout();
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Failed to connect to server");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string): void => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleToolChange = (tool: ToolType): void => {
    setActiveTool(tool);
    setResult(null);
  };

  // Load a history item back into editor
  const handleHistorySelect = (item: IHistory): void => {
    setCode(item.code);
    setActiveTool(item.tool);
    setResult(item.result);
    setProvider(item.provider);
    if (item.targetLanguage) setTargetLanguage(item.targetLanguage);
    toast.success("History loaded");
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const activeTab = TABS.find((t) => t.id === activeTool)!;

  const renderResult = () => {
    if (loading) {
      return (
        <div className="result-loading">
          {[140, 100, 180, 120, 160].map((w, i) => (
            <div
              key={i}
              className="skeleton"
              style={{ height: i === 0 ? "80px" : "16px", width: `${w}px` }}
            />
          ))}
        </div>
      );
    }

    if (!result) {
      return (
        <div className="result-empty">
          <div className="result-empty-icon">{activeTab.icon}</div>
          <h3>{activeTab.label}</h3>
          <p>{activeTab.description} — paste your code and click Run</p>
        </div>
      );
    }

    return (
      <div className="result-content">
        {activeTool === "debug" && (
          <DebugResultComponent
            data={result as DebugResult}
            onCopy={handleCopy}
          />
        )}
        {activeTool === "explain" && (
          <ExplainResultComponent data={result as ExplainResult} />
        )}
        {activeTool === "convert" && (
          <ConvertResultComponent
            data={result as ConvertResult}
            onCopy={handleCopy}
          />
        )}
        {activeTool === "complexity" && (
          <ComplexityResultComponent data={result as ComplexityResult} />
        )}
      </div>
    );
  };

  return (
    <div className="app-layout">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1d2e",
            color: "#e2e8f0",
            border: "1px solid #2d3148",
            borderRadius: "8px",
            fontSize: "13px",
          },
        }}
      />

      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-icon">⚡</div>
          <div>
            <div className="logo-text">DevTools AI</div>
            <div className="logo-sub">Code Intelligence</div>
          </div>
        </div>

        <div className="sidebar-section-label">Tools</div>
        <nav className="sidebar-nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTool === tab.id ? "active" : ""}`}
              onClick={() => handleToolChange(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <div>
                <div>{tab.label}</div>
                <div className="nav-desc">{tab.description}</div>
              </div>
            </button>
          ))}
        </nav>

        {/* History panel */}
        <HistoryPanel
          onSelect={handleHistorySelect}
          refreshTrigger={historyRefresh}
        />

        <div className="sidebar-footer">
          {/* Provider toggle */}
          <div className="provider-toggle">
            <span className="provider-label">AI Provider</span>
            <div className="toggle-btns">
              <button
                className={`toggle-btn ${provider === "gemini" ? "active" : ""}`}
                onClick={() => setProvider("gemini")}
              >
                Gemini
              </button>
              <button
                className={`toggle-btn ${provider === "groq" ? "active" : ""}`}
                onClick={() => setProvider("groq")}
              >
                Groq
              </button>
              <button
                className={`toggle-btn ${provider === "openai" ? "active" : ""}`}
                onClick={() => setProvider("openai")}
              >
                GPT
              </button>
            </div>
          </div>

          {/* Token count */}
          {tokensUsed > 0 && (
            <div className="token-count">
              {tokensUsed.toLocaleString()} tokens used
            </div>
          )}

          {/* User info + logout */}
          <div
            style={{
              borderTop: "1px solid var(--sidebar-border)",
              paddingTop: "12px",
              marginTop: "8px",
            }}
          >
            <div className="sidebar-user">
              <div className="sidebar-avatar">
                {user ? getInitials(user.name) : "?"}
              </div>
              <div className="sidebar-user-name">{user?.name}</div>
            </div>
            <button className="sidebar-logout-btn" onClick={logout}>
              🚪 Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <div className="topbar">
          <div>
            <div className="topbar-title">
              {activeTab.icon} {activeTab.label}
            </div>
            <div className="topbar-desc">{activeTab.description}</div>
          </div>
          <button
            className={`run-btn ${loading ? "loading" : ""}`}
            onClick={handleRun}
            disabled={loading}
          >
            {loading ? "⏳ Analyzing..." : `▶ Run ${activeTab.label}`}
          </button>
        </div>

        <div className="workspace">
          {/* Editor pane */}
          <div className="editor-pane">
            <div className="pane-header">
              <span className="pane-title">Input Code</span>
              <div style={{ display: "flex", gap: "8px" }}>
                <select
                  className="lang-select"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l.charAt(0).toUpperCase() + l.slice(1)}
                    </option>
                  ))}
                </select>
                {activeTool === "convert" && (
                  <select
                    className="target-lang-select"
                    value={targetLanguage}
                    onChange={(e) => setTargetLanguage(e.target.value)}
                  >
                    {TARGET_LANGUAGES.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div className="monaco-wrapper">
              <Editor
                height="100%"
                language={language}
                value={code}
                onChange={(val) => setCode(val || "")}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  wordWrap: "on",
                  lineNumbers: "on",
                  renderLineHighlight: "line",
                  padding: { top: 12 },
                  fontFamily: "Fira Code, Consolas, monospace",
                  fontLigatures: true,
                }}
              />
            </div>
          </div>

          {/* Result pane */}
          <div className="result-pane">
            <div className="pane-header">
              <span className="pane-title">Analysis Result</span>
              {result && (
                <span
                  style={{
                    fontSize: "11px",
                    color: "var(--success)",
                    fontWeight: 600,
                  }}
                >
                  ✓{" "}
                  {provider === "gemini"
                    ? "Gemini"
                    : provider === "groq"
                      ? "Groq (Llama 3)"
                      : "GPT-4o mini"}
                </span>
              )}
            </div>
            {renderResult()}
          </div>
        </div>
      </div>
      {/* Mobile bottom nav */}
      <div className="mobile-bottom-nav">
        <div className="mobile-nav-items">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`mobile-nav-item ${activeTool === tab.id ? "active" : ""}`}
              onClick={() => handleToolChange(tab.id)}
            >
              <span className="mobile-nav-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
          <button
            className="mobile-nav-item"
            onClick={() => setDrawerOpen(true)}
          >
            <span className="mobile-nav-icon">⚙️</span>
            More
          </button>
        </div>
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="mobile-drawer-overlay"
          onClick={() => setDrawerOpen(false)}
          style={{ display: drawerOpen ? "block" : "none" }}
        />
      )}

      {/* Mobile drawer — provider + history */}
      <div className={`mobile-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="mobile-drawer-handle" />

        <div className="mobile-drawer-title">AI Provider</div>
        <div className="mobile-provider-row">
          {(["gemini", "groq", "openai"] as AIProvider[]).map((p) => (
            <button
              key={p}
              className={`mobile-provider-btn ${provider === p ? "active" : ""}`}
              onClick={() => {
                setProvider(p);
                setDrawerOpen(false);
              }}
            >
              {p === "gemini" ? "Gemini" : p === "groq" ? "Groq" : "GPT"}
            </button>
          ))}
        </div>

        <div className="mobile-drawer-title">Recent History</div>
        <HistoryPanel
          onSelect={(item) => {
            handleHistorySelect(item);
            setDrawerOpen(false);
          }}
          refreshTrigger={historyRefresh}
        />

        {tokensUsed > 0 && (
          <div
            style={{
              textAlign: "center",
              fontSize: "11px",
              color: "var(--text-sidebar)",
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid #2d3148",
            }}
          >
            {tokensUsed.toLocaleString()} tokens used
          </div>
        )}

        <div
          style={{
            borderTop: "1px solid #2d3148",
            marginTop: "12px",
            paddingTop: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div className="sidebar-avatar">
              {user ? getInitials(user.name) : "?"}
            </div>
            <span
              style={{ fontSize: "13px", color: "#e2e8f0", fontWeight: 600 }}
            >
              {user?.name}
            </span>
          </div>
          <button
            className="sidebar-logout-btn"
            style={{ width: "auto" }}
            onClick={() => {
              logout();
              setDrawerOpen(false);
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
