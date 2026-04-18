import React, { useState } from "react";
import axios from "axios";

function App() {

  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [generatedCode, setGeneratedCode] = useState("");

  const analyzeCode = () => {
    const lines = code.split("\n");

    let maxDepth = 0;
    let currentDepth = 0;
    let hasLog = false;

    lines.forEach(line => {
      if (line.includes("for") || line.includes("while")) {
        currentDepth++;
        if (currentDepth > maxDepth) maxDepth = currentDepth;
      }

      if (line.includes("}")) {
        currentDepth = Math.max(0, currentDepth - 1);
      }

      if (line.includes("*2") || line.includes("/2")) {
        hasLog = true;
      }
    });

    let complexity = "O(1)";
    let explanation = "No loops detected";
    let suggestion = "Code is optimal";
    let type = "constant";

    if (hasLog) {
      complexity = "O(log n)";
      explanation = "Logarithmic pattern detected";
      suggestion = "Efficient binary/log approach used";
      type = "log";
    } else if (maxDepth === 1) {
      complexity = "O(n)";
      explanation = "Single loop detected";
      suggestion = "Try reducing iterations";
      type = "single";
    } else if (maxDepth >= 2) {
      complexity = `O(n^${maxDepth})`;
      explanation = `${maxDepth}-level nested loops detected`;
      suggestion = "Use better data structures like HashMap";
      type = "nested";
    }

    setResult({ complexity, explanation, suggestion, type });
    setGeneratedCode("");
  };

  const generateOptimizedCode = () => {
    if (!result) return;

    let codeTemplate = "";

    if (result.type === "nested") {
      codeTemplate = `// Optimized using HashSet
const set = new Set(arr);

for (let i = 0; i < arr.length; i++) {
  if (set.has(arr[i])) {
    console.log(arr[i]);
  }
}`;
    } else if (result.type === "single") {
      codeTemplate = `let sum = n * (n + 1) / 2;`;
    } else if (result.type === "log") {
      codeTemplate = `// Binary Search
let low = 0, high = n;`;
    } else {
      codeTemplate = `// Already optimal`;
    }

    setGeneratedCode(codeTemplate);
  };

  // ✅ FIXED: moved inside App
const getAIOptimizedCode = async () => {
  if (!code) {
    alert("Paste code first!");
    return;
  }

  try {
    const response = await axios.post(
      "http://localhost:5000/optimize",
      { code: code }
    );

    const aiResult = response.data.choices[0].message.content;
    setGeneratedCode(aiResult);

  } catch (error) {
    console.log(error);
    alert(error.response?.data?.error?.message || error.message);
  }
};

  return (
    <div style={container}>
      <h1>🚀 Smart Code Analyzer</h1>

      <textarea
        rows="10"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Paste your code..."
        style={textarea}
      />

      <br /><br />

      <button onClick={analyzeCode} style={btn}>Analyze</button>
      <button onClick={getAIOptimizedCode} style={btn}>🤖 AI Optimize</button>

      {result && (
        <div style={card}>
          <h3>{result.complexity}</h3>
          <p>{result.explanation}</p>
          <p>{result.suggestion}</p>

          <button onClick={generateOptimizedCode} style={btn}>
            Generate Template
          </button>
        </div>
      )}

      {generatedCode && (
        <div style={card}>
          <pre style={codeBox}>{generatedCode}</pre>
        </div>
      )}
    </div>
  );
}

// styles
const container = { padding: "20px", background: "#121212", color: "white", minHeight: "100vh" };
const textarea = { width: "100%", padding: "10px", background: "#1e1e1e", color: "white" };
const btn = { padding: "10px", margin: "5px", background: "#4CAF50", color: "white", border: "none" };
const card = { marginTop: "20px", padding: "15px", background: "#1e1e1e" };
const codeBox = { background: "#000", padding: "10px" };

export default App;