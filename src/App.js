import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [code,          setCode]          = useState("");
  const [result,        setResult]        = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");
  const [improvements,  setImprovements]  = useState([]);
  const [loading,       setLoading]       = useState(false);
  const [error,         setError]         = useState("");
  const [copied,        setCopied]        = useState(false);
  const [lang,          setLang]          = useState("JavaScript");

  const languages = ["JavaScript", "Python", "Java", "C++", "TypeScript", "Go"];

  // Both Analyze and AI Optimize now use AI for accurate results
  const analyzeCode = async () => {
    if (!code.trim()) { setError("Please paste some code first!"); return; }
    setError(""); setLoading(true); setGeneratedCode(""); setImprovements([]);

    try {
      const response = await axios.post("http://localhost:5000/optimize", { code });
      const data = response.data;

      setResult({
        complexity:  data.complexity  || "Unknown",
        explanation: data.explanation || "",
        suggestion:  "See AI improvements below.",
        type:        "ai"
      });
      setImprovements(data.improvements || []);
      setGeneratedCode(
        (data.optimizedCode || "").replace(/\\n/g, "\n").replace(/\\t/g, "\t")
      );
    } catch (err) {
      setError(
        err.response?.data?.error || "Server error. Is your backend running on port 5000?"
      );
    }
    setLoading(false);
  };

  const getAIOptimizedCode = async () => {
    if (!code.trim()) { setError("Paste some code first."); return; }
    setError(""); setLoading(true); setGeneratedCode(""); setImprovements([]);

    try {
      const response = await axios.post("http://localhost:5000/optimize", { code });
      const data = response.data;

      setGeneratedCode(
        (data.optimizedCode || "").replace(/\\n/g, "\n").replace(/\\t/g, "\t")
      );
      setImprovements(data.improvements || []);
      setResult({
        complexity:  data.complexity  || "Analyzed",
        explanation: data.explanation || "",
        suggestion:  "See AI improvements below.",
        type:        "ai"
      });
    } catch (err) {
      setError(
        err.response?.data?.error || "Server error. Is your backend running on port 5000?"
      );
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setCode(""); setResult(null); setGeneratedCode("");
    setImprovements([]); setError("");
  };

  const complexityColor = (c) => {
    if (!c) return "#94a3b8";
    if (c === "O(1)")        return "#22c55e";
    if (c.includes("log"))   return "#3b82f6";
    if (c.includes("n log")) return "#f59e0b";
    if (c === "O(n)" || c.includes("n+m") || c.includes("n + m")) return "#f59e0b";
    if (c.includes("n²") || c.includes("n^2")) return "#ef4444";
    if (c.includes("2^n") || c.includes("n!")) return "#dc2626";
    if (c === "Analyzed" || c === "Optimal" || c === "Unknown") return "#a1a1aa";
    return "#ef4444";
  };

  const complexityWidth = (c) => {
    if (!c) return "10%";
    if (c === "O(1)")        return "5%";
    if (c.includes("log"))   return "20%";
    if (c === "O(n)")        return "40%";
    if (c.includes("n log")) return "55%";
    if (c.includes("n+m") || c.includes("n + m")) return "40%";
    if (c.includes("n²") || c.includes("n^2")) return "75%";
    if (c.includes("n^3"))   return "88%";
    if (c.includes("2^n") || c.includes("n!")) return "98%";
    return "50%";
  };

  return (
    <div className="app">

      {/* NAV */}
      <nav className="nav">
        <div className="nav-left">
          <div className="nav-logo">
            <div className="logo-mark"></div>
            <span className="logo-text">BTrace</span>
          </div>
          <div className="nav-links">
            <a href="#analyzer" className="nav-link active">Analyzer</a>
            <a href="#docs" className="nav-link">Docs</a>
            <a href="#examples" className="nav-link">Examples</a>
          </div>
        </div>
        <div className="nav-right">
          <div className="nav-status">
            <span className="status-dot"></span>
            <span>API Connected</span>
          </div>
          <a
            href="https://github.com/bhoomis17/code-analyzer"
            target="_blank"
            rel="noreferrer"
            className="github-btn"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero" id="analyzer">
        <div className="hero-content">
          <div className="hero-badge">AI-Powered Analysis</div>
          <h1 className="hero-title">
            Understand your code's<br />
            <span className="hero-accent">complexity instantly</span>
          </h1>
          <p className="hero-sub">
            Paste any code snippet — get accurate Big O analysis, AI-powered optimization,
            and a refactored version in seconds. Works for any language.
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat">
            <div className="stat-num">O(1)</div>
            <div className="stat-label">to O(n³)</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <div className="stat-num">AI</div>
            <div className="stat-label">Powered</div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat">
            <div className="stat-num">Free</div>
            <div className="stat-label">Always</div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="main">

        {/* LEFT — Editor */}
        <section className="editor-section">
          <div className="editor-header">
            <div className="editor-header-left">
              <div className="editor-dots">
                <span className="dot red"></span>
                <span className="dot yellow"></span>
                <span className="dot green"></span>
              </div>
              <span className="editor-title">Input</span>
            </div>
            <div className="editor-header-right">
              <select
                className="lang-select"
                value={lang}
                onChange={e => setLang(e.target.value)}
              >
                {languages.map(l => <option key={l}>{l}</option>)}
              </select>
              <button className="icon-btn" onClick={handleClear} title="Clear code">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M8 6V4h8v2"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="editor-body">
            <div className="line-numbers">
              {code.split("\n").map((_, i) => (
                <div key={i} className="line-num">{i + 1}</div>
              ))}
              {code === "" && <div className="line-num">1</div>}
            </div>
            <textarea
              className="code-input"
              value={code}
              onChange={e => { setCode(e.target.value); setError(""); }}
              placeholder={`// Paste your ${lang} code here...\n// Works with any language!\n// Example:\nfor (let i = 0; i < n; i++) {\n  for (let j = 0; j < n; j++) {\n    console.log(i, j);\n  }\n}`}
              spellCheck={false}
            />
          </div>

          <div className="editor-footer">
            <span className="code-meta">
              {code.split("\n").length} lines · {code.length} chars
            </span>
            <div className="action-btns">
              <button className="btn-secondary" onClick={analyzeCode} disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner" style={{borderTopColor:"#fff"}}></span>
                    Analyzing...
                  </span>
                ) : "Analyze"}
              </button>
              <button className="btn-primary" onClick={getAIOptimizedCode} disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner"></span>
                    Analyzing...
                  </span>
                ) : "AI Optimize"}
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT — Results */}
        <section className="results-section">

          {error && (
            <div className="error-banner">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {loading && (
            <div className="loading-wrap">
              <div className="loading-bar"></div>
              <p className="loading-text">AI is analyzing your code...</p>
            </div>
          )}

          {!result && !loading && (
            <div className="empty-state">
              <div className="empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
                </svg>
              </div>
              <p className="empty-title">No analysis yet</p>
              <p className="empty-sub">Paste any code and click Analyze or AI Optimize</p>
            </div>
          )}

          {result && (
            <div className="results-content">

              {/* Complexity card */}
              <div className="complexity-card">
                <div className="complexity-label">Time Complexity</div>
                <div
                  className="complexity-value"
                  style={{ color: complexityColor(result.complexity) }}
                >
                  {result.complexity}
                </div>
                <div className="complexity-bar">
                  <div
                    className="complexity-fill"
                    style={{
                      width: complexityWidth(result.complexity),
                      background: complexityColor(result.complexity)
                    }}
                  ></div>
                </div>
                <div className="complexity-scale">
                  <span>Fast</span><span>Slow</span>
                </div>
              </div>

              {/* Info cards */}
              <div className="info-grid">
                <div className="info-card">
                  <div className="info-card-label">What was found</div>
                  <div className="info-card-value">{result.explanation}</div>
                </div>
                <div className="info-card">
                  <div className="info-card-label">Suggestion</div>
                  <div className="info-card-value">{result.suggestion}</div>
                </div>
              </div>

              {/* Improvements */}
              {improvements.length > 0 && (
                <div className="improvements">
                  <div className="improvements-title">Changes Made</div>
                  {improvements.map((item, i) => (
                    <div key={i} className="improvement-item">
                      <div className="improvement-dot"></div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Output code */}
              {generatedCode && (
                <div className="output-wrap">
                  <div className="output-header">
                    <span className="output-label">AI Optimized Code</span>
                    <button className="copy-btn" onClick={handleCopy}>
                      {copied ? (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Copied
                        </>
                      ) : (
                        <>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="9" y="9" width="13" height="13" rx="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                          </svg>
                          Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="output-code">{generatedCode}</pre>
                </div>
              )}

            </div>
          )}
        </section>
      </main>

      {/* FEATURES */}
      <section className="features">
        <div className="feature">
          <div className="feature-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div>
            <div className="feature-title">Accurate Analysis</div>
            <div className="feature-desc">AI understands your actual algorithm</div>
          </div>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <div className="feature-title">AI Optimization</div>
            <div className="feature-desc">Powered by state-of-the-art LLMs</div>
          </div>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
            </svg>
          </div>
          <div>
            <div className="feature-title">Any Language</div>
            <div className="feature-desc">JS, Python, Java, C++ and more</div>
          </div>
        </div>
        <div className="feature">
          <div className="feature-icon">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <div>
            <div className="feature-title">Open Source</div>
            <div className="feature-desc">Free forever on GitHub</div>
          </div>
        </div>
      </section>

      {/* DOCS SECTION */}
      <section id="docs" className="docs-section">
        <div className="section-heading">
          <h2>How it works</h2>
          <p>Everything you need to know about using BTrace</p>
        </div>
        <div className="docs-grid">
          <div className="doc-card">
            <div className="doc-num">01</div>
            <h3>Paste your code</h3>
            <p>Paste any code snippet in the editor — JavaScript, Python, Java, C++, or any other language.</p>
          </div>
          <div className="doc-card">
            <div className="doc-num">02</div>
            <h3>Analyze complexity</h3>
            <p>Click Analyze — AI reads your actual algorithm and returns the correct Big O complexity, not just a loop count.</p>
          </div>
          <div className="doc-card">
            <div className="doc-num">03</div>
            <h3>AI Optimize</h3>
            <p>Click AI Optimize to get a fully rewritten version using better data structures and algorithms.</p>
          </div>
          <div className="doc-card">
            <div className="doc-num">04</div>
            <h3>Copy and use</h3>
            <p>Copy the optimized code with one click and drop it straight into your project.</p>
          </div>
        </div>
      </section>

      {/* EXAMPLES SECTION */}
      <section id="examples" className="examples-section">
        <div className="section-heading">
          <h2>Examples</h2>
          <p>Click any example to load it into the editor</p>
        </div>
        <div className="examples-grid">
          {[
            {
              label: "O(n²) — Nested Loop",
              lang: "JavaScript",
              code: `for (let i = 0; i < arr.length; i++) {\n  for (let j = 0; j < arr.length; j++) {\n    if (arr[i] === arr[j] && i !== j) {\n      console.log("Duplicate:", arr[i]);\n    }\n  }\n}`
            },
            {
              label: "O(n) — Single Loop",
              lang: "JavaScript",
              code: `let sum = 0;\nfor (let i = 0; i < arr.length; i++) {\n  sum += arr[i];\n}\nconsole.log(sum);`
            },
            {
              label: "O(log n) — Binary Search",
              lang: "JavaScript",
              code: `function binarySearch(arr, target) {\n  let low = 0, high = arr.length - 1;\n  while (low <= high) {\n    const mid = Math.floor((low + high) / 2);\n    if (arr[mid] === target) return mid;\n    else if (arr[mid] < target) low = mid + 1;\n    else high = mid - 1;\n  }\n  return -1;\n}`
            },
            {
              label: "O(n²) — Bubble Sort",
              lang: "JavaScript",
              code: `function bubbleSort(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length - i - 1; j++) {\n      if (arr[j] > arr[j + 1]) {\n        let temp = arr[j];\n        arr[j] = arr[j + 1];\n        arr[j + 1] = temp;\n      }\n    }\n  }\n  return arr;\n}`
            },
          ].map((ex, i) => (
            <div
              key={i}
              className="example-card"
              onClick={() => {
                setCode(ex.code);
                setLang(ex.lang);
                setResult(null);
                setGeneratedCode("");
                setImprovements([]);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <div className="example-header">
                <span className="example-label">{ex.label}</span>
                <span className="example-lang">{ex.lang}</span>
              </div>
              <pre className="example-code">{ex.code}</pre>
              <div className="example-cta">Click to load in editor</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-left">
          <span className="logo-text">BTrace</span>
          <span className="footer-sep">—</span>
          <span>Built by Bhoomi Salian</span>
        </div>
        <div className="footer-right">
          <a href="https://github.com/bhoomis17/code-analyzer" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </div>
      </footer>

    </div>
  );
}

export default App;