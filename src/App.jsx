import { useState, useEffect } from "react";

const c = {
  bg: "#fdf6f0",
  card: "#ffffff",
  border: "#f0d9e8",
  accent: "#c9517a",
  accentLight: "#fdf0f5",
  accentDark: "#a03660",
  text: "#2d1a24",
  textMid: "#6b3d52",
  textLight: "#9e6b80",
  textMuted: "#d4a8bc",
  inputBg: "#fdf8fb",
  shadow: "rgba(180,80,120,0.08)",
  gold: "#c9a84c",
  goldLight: "#fdf9ee",
};

const FACTS_COUNT = 8;

export default function BridalQuizGenerator() {
  const [step, setStep] = useState("form"); // form | preview | paying | result
  const [brideName, setBrideName] = useState("");
  const [occasion, setOccasion] = useState("Bridal Shower");
  const [facts, setFacts] = useState(Array(FACTS_COUNT).fill(""));
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState(null);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(null);

  // Check for Stripe return
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      const saved = sessionStorage.getItem("quizData");
      if (saved) {
        setQuiz(JSON.parse(saved));
        setStep("result");
        sessionStorage.removeItem("quizData");
        window.history.replaceState({}, "", "/");
      }
    }
    if (params.get("cancelled") === "true") {
      window.history.replaceState({}, "", "/");
    }
  }, []);

  const updateFact = (i, val) => {
    const updated = [...facts];
    updated[i] = val;
    setFacts(updated);
  };

  const filledFacts = facts.filter(f => f.trim()).length;
  const canGenerate = brideName.trim() && filledFacts >= 5;

  const generateQuiz = async () => {
    setLoading(true);
    setError(null);
    try {
      const factList = facts.filter(f => f.trim()).map((f, i) => `${i + 1}. ${f}`).join("\n");
      const prompt = `You are creating a fun, personalized party quiz for a ${occasion} for someone named ${brideName}.

Here are facts and stories about ${brideName}:
${factList}

Create exactly 15 multiple choice questions based on these facts. Each question should be fun, engaging, and test how well guests know ${brideName}.

Return ONLY a valid JSON array with exactly this structure, no other text:
[
  {
    "question": "question text here",
    "options": ["A) option1", "B) option2", "C) option3", "D) option4"],
    "answer": "A) option1",
    "fun_fact": "brief fun explanation"
  }
]

Rules:
- Make questions fun and celebratory, not embarrassing
- Make wrong answers plausible and funny
- Cover a variety of facts
- Keep questions under 20 words
- Make it feel like a game show, not a test`;

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const result = await response.json();
      const text = result.content?.map(b => b.text || "").join("") || "";
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error("Could not parse quiz");
      const questions = JSON.parse(jsonMatch[0]);
      const quizData = { brideName, occasion, questions };
      setQuiz(quizData);
      setStep("preview");
    } catch (e) {
      setError("Something went wrong generating your quiz. Please try again.");
    }
    setLoading(false);
  };

  const handlePayment = async () => {
    setLoading(true);
    sessionStorage.setItem("quizData", JSON.stringify(quiz));
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      window.location.href = data.url;
    } catch (e) {
      setError("Payment failed to load. Please try again.");
      setLoading(false);
    }
  };

  const printQuiz = () => window.print();

  const inputStyle = (field) => ({
    width: "100%",
    boxSizing: "border-box",
    background: c.inputBg,
    border: `1.5px solid ${focused === field ? c.accent : c.border}`,
    borderRadius: 8,
    padding: "12px 14px",
    color: c.text,
    fontSize: 15,
    fontFamily: "'Georgia', serif",
    outline: "none",
    transition: "border-color 0.2s",
  });

  return (
    <div style={{ minHeight: "100vh", background: c.bg, color: c.text, fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          .print-page { page-break-after: always; }
          body { background: white; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Top bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${c.accentDark}, ${c.accent}, #e8a0bb, ${c.gold})` }} />
<div style={{ background: c.card, borderBottom: `1px solid ${c.border}`, padding: "12px 22px", textAlign: "right" }} className="no-print">
  <a href="/blog" style={{ color: c.accent, fontSize: 14, textDecoration: "none", fontFamily: "'Georgia', serif", fontWeight: 600 }}>📝 Party Planning Blog →</a>
</div>

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 22px 80px" }}>

        {/* Header */}
        {step === "form" && (
          <div style={{ textAlign: "center", marginBottom: 44 }} className="no-print">
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: c.accentLight, borderRadius: 20, padding: "6px 18px", marginBottom: 20 }}>
              <span>💍</span>
              <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: c.accent, fontWeight: 700 }}>Party Quiz Generator</span>
            </div>
            <h1 style={{ fontSize: "clamp(26px, 6vw, 44px)", fontWeight: 400, margin: "0 0 12px", lineHeight: 1.2, color: c.text, letterSpacing: "-0.02em" }}>
              How well do they<br /><em style={{ color: c.accent }}>really know her?</em>
            </h1>
            <p style={{ color: c.textLight, fontSize: 15, margin: "0 auto", lineHeight: 1.65, maxWidth: 420 }}>
              Enter a few facts about the guest of honor and get a beautiful, personalized quiz in seconds.
            </p>
          </div>
        )}

        {/* Form */}
        {step === "form" && !loading && (
          <div className="no-print" style={{ animation: "fadeIn 0.4s ease" }}>

            {/* Occasion selector */}
            <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: "28px 28px 24px", marginBottom: 14, boxShadow: `0 4px 20px ${c.shadow}` }}>
              <label style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: c.accent, fontWeight: 700, display: "block", marginBottom: 14 }}>Occasion</label>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {["Bridal Shower", "Baby Shower", "Birthday", "Retirement"].map(o => (
                  <button key={o} onClick={() => setOccasion(o)}
                    style={{ padding: "9px 18px", borderRadius: 20, border: `1.5px solid ${occasion === o ? c.accent : c.border}`, background: occasion === o ? c.accentLight : "transparent", color: occasion === o ? c.accentDark : c.textLight, fontSize: 14, fontFamily: "'Georgia', serif", cursor: "pointer", fontWeight: occasion === o ? 700 : 400, transition: "all 0.15s" }}>
                    {o === "Bridal Shower" ? "💍 " : o === "Baby Shower" ? "👶 " : o === "Birthday" ? "🎂 " : "🎉 "}{o}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: "28px 28px 24px", marginBottom: 14, boxShadow: `0 4px 20px ${c.shadow}` }}>
              <label style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: c.accent, fontWeight: 700, display: "block", marginBottom: 14 }}>Guest of Honor's Name</label>
              <input
                value={brideName}
                onChange={e => setBrideName(e.target.value)}
                placeholder='e.g. "Sarah"'
                onFocus={() => setFocused("name")}
                onBlur={() => setFocused(null)}
                style={inputStyle("name")}
              />
            </div>

            {/* Facts */}
            <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: "28px 28px 24px", marginBottom: 14, boxShadow: `0 4px 20px ${c.shadow}` }}>
              <label style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: c.accent, fontWeight: 700, display: "block", marginBottom: 6 }}>Facts & Stories</label>
              <p style={{ color: c.textLight, fontSize: 13, margin: "0 0 18px" }}>Enter at least 5 facts, stories, or quirks about {brideName || "the guest of honor"}. The more specific, the better the quiz!</p>
              {facts.map((fact, i) => (
                <div key={i} style={{ marginBottom: 10 }}>
                  <textarea
                    value={fact}
                    onChange={e => updateFact(i, e.target.value)}
                    placeholder={[
                      'e.g. "She met her fiancé at a coffee shop in Brooklyn"',
                      'e.g. "Her guilty pleasure is reality TV, especially The Bachelor"',
                      'e.g. "She has a cat named Mochi"',
                      'e.g. "She studied abroad in Italy for a semester"',
                      'e.g. "Her first job was at a summer camp in Maine"',
                      'e.g. "She can eat an entire pizza by herself"',
                      'e.g. "She\'s been best friends with her maid of honor since 3rd grade"',
                      'e.g. "Her dream honeymoon is in the Maldives"',
                    ][i]}
                    rows={2}
                    onFocus={() => setFocused(`fact${i}`)}
                    onBlur={() => setFocused(null)}
                    style={{ ...inputStyle(`fact${i}`), resize: "vertical", lineHeight: 1.5 }}
                  />
                </div>
              ))}
              <p style={{ color: c.textMuted, fontSize: 12, margin: "8px 0 0" }}>{filledFacts}/{FACTS_COUNT} facts entered {filledFacts >= 5 ? "✓" : `(need at least 5)`}</p>
            </div>

            {/* Price notice */}
            <div style={{ background: c.goldLight, border: `1px solid #e8d090`, borderRadius: 8, padding: "12px 16px", marginBottom: 12, textAlign: "center" }}>
              <p style={{ margin: 0, fontSize: 14, color: c.gold }}>💍 Your personalized quiz is <strong>$5</strong> — instant download, print-ready PDF</p>
            </div>

            {error && <p style={{ color: "#c0392b", textAlign: "center", fontSize: 14, marginBottom: 12 }}>{error}</p>}

            <button onClick={generateQuiz} disabled={!canGenerate}
              style={{ width: "100%", padding: "16px", background: canGenerate ? `linear-gradient(135deg, ${c.accentDark}, ${c.accent})` : c.border, color: canGenerate ? "#fff" : c.textMuted, border: "none", borderRadius: 8, fontSize: 15, fontFamily: "'Georgia', serif", fontWeight: 700, letterSpacing: "0.05em", cursor: canGenerate ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
              Generate My Quiz Preview →
            </button>

            <p style={{ textAlign: "center", color: c.textMuted, fontSize: 12, marginTop: 14 }}>🔒 Preview first, pay only when you love it</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }} className="no-print">
            <div style={{ fontSize: 40, marginBottom: 20 }}>💍</div>
            <div style={{ width: 50, height: 50, borderRadius: "50%", border: `3px solid ${c.border}`, borderTop: `3px solid ${c.accent}`, animation: "spin 0.9s linear infinite", margin: "0 auto 28px" }} />
            <h3 style={{ fontWeight: 400, color: c.text, marginBottom: 10, fontSize: 21 }}>Creating your quiz...</h3>
            <p style={{ color: c.textLight, fontSize: 15 }}>Crafting 15 personalized questions just for {brideName}</p>
          </div>
        )}

        {/* Preview */}
        {step === "preview" && quiz && !loading && (
          <div className="no-print" style={{ animation: "fadeIn 0.4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎉</div>
              <h2 style={{ fontWeight: 400, fontSize: 26, color: c.text, margin: "0 0 8px" }}>Your quiz is ready!</h2>
              <p style={{ color: c.textLight, fontSize: 15, margin: 0 }}>Here's a preview of the first 3 questions</p>
            </div>

            {/* Preview questions */}
            {quiz.questions.slice(0, 3).map((q, i) => (
              <div key={i} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: "22px 24px", marginBottom: 12, borderLeft: `4px solid ${c.accent}`, boxShadow: `0 2px 10px ${c.shadow}` }}>
                <p style={{ fontWeight: 700, color: c.text, margin: "0 0 12px", fontSize: 15 }}>Q{i + 1}. {q.question}</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {q.options.map((opt, j) => (
                    <div key={j} style={{ background: c.accentLight, borderRadius: 6, padding: "8px 12px", fontSize: 13, color: c.textMid }}>{opt}</div>
                  ))}
                </div>
              </div>
            ))}

            {/* Blurred remaining */}
            <div style={{ position: "relative", marginBottom: 24 }}>
              <div style={{ filter: "blur(6px)", pointerEvents: "none", userSelect: "none" }}>
                {quiz.questions.slice(3, 6).map((q, i) => (
                  <div key={i} style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: "22px 24px", marginBottom: 12 }}>
                    <p style={{ fontWeight: 700, color: c.text, margin: "0 0 12px", fontSize: 15 }}>Q{i + 4}. {q.question}</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      {q.options.map((opt, j) => (
                        <div key={j} style={{ background: c.accentLight, borderRadius: 6, padding: "8px 12px", fontSize: 13, color: c.textMid }}>{opt}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center", background: "rgba(255,255,255,0.95)", borderRadius: 12, padding: "18px 28px", border: `1.5px solid ${c.border}`, boxShadow: `0 4px 20px ${c.shadow}` }}>
                <p style={{ margin: "0 0 4px", fontWeight: 700, color: c.text, fontSize: 16 }}>12 more questions inside</p>
                <p style={{ margin: 0, color: c.textLight, fontSize: 13 }}>Unlock the full quiz + print-ready PDF</p>
              </div>
            </div>

            <div style={{ background: c.goldLight, border: `1px solid #e8d090`, borderRadius: 10, padding: "16px 20px", marginBottom: 16, textAlign: "center" }}>
              <p style={{ margin: "0 0 4px", fontWeight: 700, color: c.gold, fontSize: 16 }}>What you get for $5:</p>
              <p style={{ margin: 0, color: c.textMid, fontSize: 14, lineHeight: 1.7 }}>✓ All 15 personalized questions &nbsp;·&nbsp; ✓ Answer key &nbsp;·&nbsp; ✓ Print-ready PDF &nbsp;·&nbsp; ✓ Instant download</p>
            </div>

            {error && <p style={{ color: "#c0392b", textAlign: "center", fontSize: 14, marginBottom: 12 }}>{error}</p>}

            <button onClick={handlePayment}
              style={{ width: "100%", padding: "16px", background: `linear-gradient(135deg, ${c.accentDark}, ${c.accent})`, color: "#fff", border: "none", borderRadius: 8, fontSize: 16, fontFamily: "'Georgia', serif", fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em", marginBottom: 10 }}>
              💍 Get the Full Quiz for $5 →
            </button>

            <button onClick={() => { setStep("form"); setQuiz(null); }}
              style={{ width: "100%", padding: "11px", background: "transparent", color: c.textLight, border: "none", fontSize: 13, cursor: "pointer", fontFamily: "'Georgia', serif" }}>
              ← Start over
            </button>
          </div>
        )}

        {/* Result — full quiz after payment */}
        {step === "result" && quiz && (
          <div>
            <div style={{ textAlign: "center", marginBottom: 36 }} className="no-print">
              <div style={{ fontSize: 48, marginBottom: 12 }}>💍</div>
              <h2 style={{ fontWeight: 400, fontSize: 26, color: c.text, margin: "0 0 8px" }}>Your quiz is ready!</h2>
              <p style={{ color: c.textLight, fontSize: 14, margin: "0 0 20px" }}>Print or save as PDF for the party</p>
              <button onClick={printQuiz}
                style={{ background: `linear-gradient(135deg, ${c.accentDark}, ${c.accent})`, color: "#fff", border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 14, fontFamily: "'Georgia', serif", fontWeight: 700, cursor: "pointer" }}>
                📄 Print / Save as PDF
              </button>
            </div>

            {/* Question sheet */}
            <div className="print-page" style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: "36px", marginBottom: 16, boxShadow: `0 2px 10px ${c.shadow}` }}>
              <div style={{ textAlign: "center", marginBottom: 28, borderBottom: `2px solid ${c.border}`, paddingBottom: 20 }}>
                <p style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: c.accent, margin: "0 0 6px", fontWeight: 700 }}>{quiz.occasion}</p>
                <h2 style={{ fontSize: 28, fontWeight: 400, color: c.text, margin: "0 0 6px" }}>How Well Do You Know</h2>
                <h1 style={{ fontSize: 36, fontWeight: 700, color: c.accent, margin: 0 }}>{quiz.brideName}?</h1>
              </div>
              {quiz.questions.map((q, i) => (
                <div key={i} style={{ marginBottom: 22 }}>
                  <p style={{ fontWeight: 700, color: c.text, margin: "0 0 10px", fontSize: 15 }}>{i + 1}. {q.question}</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {q.options.map((opt, j) => (
                      <div key={j} style={{ background: c.accentLight, borderRadius: 6, padding: "7px 12px", fontSize: 13, color: c.textMid }}>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ textAlign: "center", marginTop: 24, paddingTop: 16, borderTop: `1px solid ${c.border}` }}>
                <p style={{ color: c.textMuted, fontSize: 12 }}>Created with debtescapetoday.com 💍</p>
              </div>
            </div>

            {/* Answer key */}
            <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: "36px", boxShadow: `0 2px 10px ${c.shadow}` }}>
              <div style={{ textAlign: "center", marginBottom: 24, borderBottom: `2px solid ${c.border}`, paddingBottom: 16 }}>
                <p style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: c.accent, margin: "0 0 6px", fontWeight: 700 }}>Answer Key</p>
                <h2 style={{ fontSize: 24, fontWeight: 400, color: c.text, margin: 0 }}>How Well Do You Know {quiz.brideName}?</h2>
              </div>
              {quiz.questions.map((q, i) => (
                <div key={i} style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
                  <span style={{ background: c.accent, color: "#fff", borderRadius: "50%", width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                  <div>
                    <p style={{ margin: "0 0 3px", fontWeight: 700, color: c.accentDark, fontSize: 14 }}>{q.answer}</p>
                    <p style={{ margin: 0, color: c.textLight, fontSize: 13, fontStyle: "italic" }}>{q.fun_fact}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: c.accentLight, border: `1px solid ${c.border}`, borderRadius: 10, padding: "16px 20px", marginTop: 20, textAlign: "center" }} className="no-print">
              <button onClick={() => { setStep("form"); setQuiz(null); setBrideName(""); setFacts(Array(FACTS_COUNT).fill("")); }}
                style={{ background: "transparent", color: c.accent, border: `1.5px solid ${c.accent}`, borderRadius: 6, padding: "9px 22px", cursor: "pointer", fontFamily: "'Georgia', serif", fontSize: 14 }}>
                Create Another Quiz
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
