import { useState, useRef } from "react";

const c = {
  bg: "#f4f8f2",
  card: "#ffffff",
  border: "#d8e8d2",
  accent: "#3a7d44",
  accentLight: "#eaf4e8",
  accentDark: "#2a6232",
  text: "#182e1a",
  textMid: "#4a6850",
  textLight: "#7a9680",
  textMuted: "#afc4b2",
  inputBg: "#f0f7ee",
  shadow: "rgba(40,110,50,0.07)",
  danger: "#c0392b",
  dangerLight: "#fff0ee",
  gold: "#b8860b",
  goldLight: "#fdf8ee",
};

const selectSteps = [
  { id: "employment", label: "Employment Status", question: "What is your current employment situation?", hint: "This helps us tailor advice to your income stability", options: ["Employed full-time", "Employed part-time", "Self-employed / Freelance", "Unemployed", "Student", "Retired"] },
  { id: "dependents", label: "People Depending on You", question: "How many people depend on your income?", hint: "Include children, a partner, or anyone else you financially support", options: ["Just me", "1 person", "2 people", "3 people", "4 or more people"] },
  { id: "spendingWeakness", label: "Biggest Spending Weakness", question: "Where does money tend to slip through your fingers most?", hint: "Be honest — this is just between you and your plan", options: ["Food & dining out", "Online shopping", "Subscriptions & streaming", "Entertainment & going out", "Impulse purchases", "I'm not sure"] },
  { id: "creditScore", label: "Credit Score Range", question: "Where would you say your credit score is right now?", hint: "A rough range is fine — no judgment here", options: ["Poor (below 580)", "Fair (580–669)", "Good (670–739)", "Very Good (740–799)", "Excellent (800+)", "I don't know"] },
];

const STEPS = [
  { id: "income", type: "number", label: "Monthly Take-Home Income", question: "What's your monthly income after taxes?", hint: "The amount that actually hits your bank account each month", prefix: "$" },
  { id: "employment", type: "select" },
  { id: "dependents", type: "select" },
  { id: "expenses", type: "number", label: "Monthly Essential Expenses", question: "How much do you spend on essentials each month?", hint: "Rent, food, utilities, transport — the non-negotiables", prefix: "$" },
  { id: "spendingWeakness", type: "select" },
  { id: "debts", type: "debts", label: "Your Debts", question: "Add each debt you owe", hint: "Add them one at a time — we'll keep track for you" },
  { id: "minPayments", type: "number", label: "Total Minimum Payments", question: "What are your total minimum monthly payments across all debts?", hint: "Add up all the minimums you're required to pay each month", prefix: "$" },
  { id: "creditScore", type: "select" },
  { id: "savings", type: "number", label: "Current Savings", question: "How much do you have in savings right now?", hint: "Any emergency fund or savings account balance", prefix: "$" },
  { id: "goal", type: "textarea", label: "Your #1 Goal", question: "What does financial freedom look like to you?", hint: 'e.g. "Pay off all debt in 5 years" or "Buy a home one day"' },
];

const getStepMeta = (step) => step.type === "select" ? selectSteps.find(s => s.id === step.id) : step;

function DebtEntry({ debts, setDebts }) {
  const [current, setCurrent] = useState({ name: "", balance: "", apr: "" });
  const [adding, setAdding] = useState(debts.length === 0);
  const [focused, setFocused] = useState(null);

  const inputStyle = (field) => ({
    width: "100%", background: c.inputBg, boxSizing: "border-box",
    border: `1.5px solid ${focused === field ? c.accent : c.border}`,
    borderRadius: 8, padding: "11px 13px", color: c.text,
    fontSize: 15, fontFamily: "'Georgia', serif", outline: "none", transition: "border-color 0.2s",
  });

  const canAdd = current.name.trim() && current.balance.trim();

  const addDebt = () => {
    if (!canAdd) return;
    setDebts([...debts, current]);
    setCurrent({ name: "", balance: "", apr: "" });
    setAdding(false);
  };

  return (
    <div>
      {debts.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          {debts.map((d, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: c.accentLight, border: `1px solid ${c.border}`, borderRadius: 8, padding: "11px 15px", marginBottom: 7 }}>
              <div>
                <span style={{ fontWeight: 700, color: c.accentDark, fontSize: 15 }}>{d.name}</span>
                <span style={{ color: c.textLight, fontSize: 14, marginLeft: 10 }}>${Number(d.balance).toLocaleString()}{d.apr ? ` · ${d.apr}% APR` : ""}</span>
              </div>
              <button onClick={() => setDebts(debts.filter((_, idx) => idx !== i))}
                style={{ background: "transparent", border: "none", color: c.textMuted, cursor: "pointer", fontSize: 20, lineHeight: 1, padding: "0 4px", transition: "color 0.15s" }}
                onMouseOver={e => e.currentTarget.style.color = c.danger}
                onMouseOut={e => e.currentTarget.style.color = c.textMuted}>×</button>
            </div>
          ))}
        </div>
      )}
      {adding ? (
        <div style={{ background: c.card, border: `1.5px solid ${c.accent}`, borderRadius: 10, padding: "18px 18px 14px" }}>
          <p style={{ margin: "0 0 14px", fontSize: 12, color: c.textLight, textTransform: "uppercase", letterSpacing: "0.1em" }}>New Debt</p>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontSize: 12, color: c.textLight, display: "block", marginBottom: 5 }}>Debt name</label>
            <input value={current.name} onChange={e => setCurrent({ ...current, name: e.target.value })}
              placeholder='e.g. "Chase Credit Card"' onFocus={() => setFocused("name")} onBlur={() => setFocused(null)} style={inputStyle("name")} />
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: c.textLight, display: "block", marginBottom: 5 }}>Balance owed ($)</label>
              <input type="number" value={current.balance} onChange={e => setCurrent({ ...current, balance: e.target.value })}
                placeholder="e.g. 4200" onFocus={() => setFocused("balance")} onBlur={() => setFocused(null)} style={inputStyle("balance")} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: 12, color: c.textLight, display: "block", marginBottom: 5 }}>Interest rate / APR (optional)</label>
              <input type="number" value={current.apr} onChange={e => setCurrent({ ...current, apr: e.target.value })}
                placeholder="e.g. 24" onFocus={() => setFocused("apr")} onBlur={() => setFocused(null)} style={inputStyle("apr")} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addDebt} disabled={!canAdd}
              style={{ flex: 1, padding: "11px", background: canAdd ? `linear-gradient(135deg, ${c.accentDark}, ${c.accent})` : c.border, color: canAdd ? "#fff" : c.textMuted, border: "none", borderRadius: 7, fontSize: 14, fontFamily: "'Georgia', serif", fontWeight: 700, cursor: canAdd ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
              + Add This Debt
            </button>
            {debts.length > 0 && (
              <button onClick={() => setAdding(false)}
                style={{ padding: "11px 16px", background: "transparent", color: c.textLight, border: `1px solid ${c.border}`, borderRadius: 7, fontSize: 14, fontFamily: "'Georgia', serif", cursor: "pointer" }}>
                Cancel
              </button>
            )}
          </div>
        </div>
      ) : (
        <button onClick={() => setAdding(true)}
          style={{ width: "100%", padding: "13px", background: c.accentLight, border: `1.5px dashed ${c.accent}`, borderRadius: 8, color: c.accent, fontSize: 15, fontFamily: "'Georgia', serif", fontWeight: 600, cursor: "pointer", transition: "all 0.2s" }}
          onMouseOver={e => e.currentTarget.style.background = c.border}
          onMouseOut={e => e.currentTarget.style.background = c.accentLight}>
          + Add Another Debt
        </button>
      )}
    </div>
  );
}

function ResourceCard({ title, tag, tagColor, description, url, why }) {
  return (
    <div style={{ background: c.goldLight, border: `1.5px solid #e8d090`, borderRadius: 12, padding: "20px 22px", marginBottom: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <span style={{ background: tagColor, color: "#fff", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", borderRadius: 6, padding: "3px 10px" }}>{tag}</span>
        <span style={{ fontWeight: 700, color: c.text, fontSize: 16 }}>{title}</span>
      </div>
      <p style={{ color: c.textMid, fontSize: 14, margin: "0 0 6px", lineHeight: 1.6 }}>{description}</p>
      <p style={{ color: c.gold, fontSize: 13, margin: "0 0 14px", fontStyle: "italic" }}>💡 {why}</p>
      <a href={url} target="_blank" rel="noopener noreferrer"
        style={{ display: "inline-block", background: `linear-gradient(135deg, ${c.accentDark}, ${c.accent})`, color: "#fff", padding: "9px 20px", borderRadius: 7, fontSize: 14, fontFamily: "'Georgia', serif", fontWeight: 700, textDecoration: "none" }}>
        Learn More →
      </a>
    </div>
  );
}

export default function DebtEscapePlan() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [currentValue, setCurrentValue] = useState("");
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(false);
  const planRef = useRef(null);

  const step = STEPS[currentStep];
  const meta = getStepMeta(step);
  const progress = (currentStep / STEPS.length) * 100;

  const advance = (newAnswers) => {
    if (currentStep < STEPS.length - 1) { setCurrentStep(currentStep + 1); setCurrentValue(""); }
    else generatePlan(newAnswers);
  };

  const handleNext = () => {
    if (step.type === "debts") {
      if (debts.length === 0) return;
      const debtStr = debts.map(d => `${d.name}: $${d.balance}${d.apr ? ` at ${d.apr}% APR` : ""}`).join(" | ");
      const newAnswers = { ...answers, debts: debtStr };
      setAnswers(newAnswers);
      advance(newAnswers);
      return;
    }
    if (!currentValue.trim()) return;
    const newAnswers = { ...answers, [step.id]: currentValue };
    setAnswers(newAnswers);
    advance(newAnswers);
  };

  const handleSelect = (val) => {
    const newAnswers = { ...answers, [step.id]: val };
    setAnswers(newAnswers);
    setCurrentValue("");
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
    else generatePlan(newAnswers);
  };

  const shouldRecommendReach = () => {
    const hasHighInterest = debts.some(d => parseFloat(d.apr) >= 15);
    const totalDebt = debts.reduce((sum, d) => sum + (parseFloat(d.balance) || 0), 0);
    return hasHighInterest || totalDebt > 5000;
  };

  const shouldRecommendNDR = (data) => {
    const totalDebt = debts.reduce((sum, d) => sum + (parseFloat(d.balance) || 0), 0);
    const poorCredit = data.creditScore?.includes("Poor") || data.creditScore?.includes("Fair");
    return totalDebt > 7500 || poorCredit;
  };

  const generatePlan = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const totalDebt = debts.reduce((sum, d) => sum + (parseFloat(d.balance) || 0), 0);
      const surplus = (parseFloat(data.income) || 0) - (parseFloat(data.expenses) || 0) - (parseFloat(data.minPayments) || 0);
      const monthsToFreedom = surplus > 0 ? Math.ceil(totalDebt / surplus) : null;
      const freeDate = monthsToFreedom ? new Date(Date.now() + monthsToFreedom * 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : null;

      const prompt = `You are an expert personal finance coach with 20 years of experience helping people escape debt. You are warm, deeply empathetic, and extraordinarily specific. You never give vague advice. You speak directly to this person's exact situation using their real numbers throughout every section.

IMPORTANT: Write long, rich, detailed responses for every section. Each section should feel like a real financial coach spent serious time thinking about THIS person's specific situation — not a generic template. Use their actual debt names, balances, income, and life circumstances throughout. The person is paying for this plan and deserves genuinely thorough, expert guidance.

Here is their complete financial picture:
- Monthly take-home income: $${data.income}
- Employment: ${data.employment}
- Dependents: ${data.dependents}
- Monthly essential expenses: $${data.expenses}
- Biggest spending weakness: ${data.spendingWeakness}
- Debts: ${data.debts}
- Total debt: $${totalDebt.toLocaleString()}
- Total minimum monthly payments: $${data.minPayments}
- Monthly surplus after essentials + minimums: $${surplus.toFixed(0)}
- Credit score range: ${data.creditScore}
- Current savings: $${data.savings}
- Their stated goal: ${data.goal}
- Estimated debt-free date at current surplus: ${freeDate || "Needs budget work first"}

Write their full plan using these exact section headers. Be thorough and specific in every section:

## 📊 Your Financial Snapshot
Paint a clear, honest, compassionate picture of exactly where they stand right now. Calculate and explain their monthly surplus of $${surplus.toFixed(0)}. Break down what their money is doing each month. Acknowledge their employment situation (${data.employment}) and what it means for their stability. If they have dependents, acknowledge the extra pressure that brings. If their surplus is negative, be honest but kind — explain exactly what needs to shift first before the debt payoff plan can work. Be real. Don't sugarcoat, but don't catastrophize either. This person deserves the truth told with care.

## 🎯 Your Debt-Free Date
${freeDate
  ? `They could be completely debt-free by ${freeDate}. Make this feel real and exciting. Show the math step by step — how their $${surplus.toFixed(0)} monthly surplus, applied consistently, chips away at their $${totalDebt.toLocaleString()} total debt over time. Talk about what life will look like when this date arrives. What financial doors open up? What stress disappears? Make them feel the possibility of it. Also explain how small increases in their monthly payment — even an extra $50 or $100 per month — could move that date significantly closer, with specific examples.`
  : `Their current expenses exceed their income, so we need to tackle that before attacking debt. Walk through exactly what they need to cut or earn to create a positive surplus. Be specific — name the categories. Explain what a realistic surplus target looks like for their situation and how quickly things can turn around once they achieve it.`}

## 🚨 Your Most Urgent Priority This Week
Give them ONE single, specific action to take within the next 7 days. Not a vague suggestion — a precise, concrete action with exact steps. Explain WHY this specific action matters most right now given their situation. Tell them what to do, how to do it, and what result to expect. This should feel like advice from someone who has thought deeply about their specific circumstances.

## 💸 Your ${data.spendingWeakness} Spending Plan
This is one of the most important sections. Dive deep into their specific spending weakness: ${data.spendingWeakness}. Give 4-5 highly specific, practical, psychologically-informed strategies for addressing this weakness. Don't just say "spend less on dining out" — explain the behavioral psychology behind why this weakness happens, specific tactics to counter it, and realistic targets for how much they could redirect to debt payoff. Include dollar amounts wherever possible.

## 🗺️ Your Personalized Debt Payoff Order
This section should be highly detailed. List every debt they mentioned and explain exactly why you're ordering them the way you are. Use the avalanche method (highest APR first) and show the math — how much interest they're currently paying on each debt per month, and how much they'll save by attacking the highest-rate debt first. If any debts are missing APR info, note what you'd assume and why. Also explain the snowball alternative briefly — sometimes the psychological wins of paying off smaller balances first matter more than the math. Let them choose. Give them everything they need to make that decision.

## 📅 Your Month-by-Month Roadmap to Freedom
Map out their journey in real detail. Use their actual numbers for each milestone:
- Month 1–3: What specifically happens, what gets paid down, what changes
- Month 4–6: The progress they'll see, how their situation shifts
- Month 7–12: The momentum building, credit score changes beginning
- Year 2: What their debt picture looks like, what's been paid off
- Year 3 and beyond: The homestretch, what financial life starts to look like
Use specific dollar amounts and debt names throughout. Make it feel like a real map, not a generic timeline.

## ✅ Your First Month Action Checklist
Give exactly 6 specific, actionable checklist items for Month 1 — things they can actually DO, not vague goals. Each should be concrete, measurable, and tied to their specific situation. Format each as a checkbox item starting with "[ ]". Make these count — this checklist should feel like the launchpad for their entire journey.

## 💡 5 Real Ways to Find Extra Money
Don't give generic advice. Give 5 specific, realistic ideas tailored precisely to their employment status (${data.employment}), life situation (supporting ${data.dependents}), and spending patterns. For each idea, give a realistic dollar estimate of what it could add per month and exactly how to get started. Think creatively — side income, expense cuts, negotiation tactics, benefit claims they might be missing, and so on.

## 📈 Your Credit Score Transformation
Based on their current score (${data.creditScore}), write a detailed roadmap of exactly what their credit score journey looks like. Explain the specific factors affecting their score right now. Give realistic, specific expectations: what will their score look like in 6 months if they follow this plan? In 1 year? In 2 years? What specific actions will have the biggest positive impact on their score and why? What should they absolutely avoid doing? What does reaching a "Good" or "Very Good" score unlock for them financially — lower interest rates, better loan options, housing opportunities?

## 💬 A Personal Note From Your Coach
Write a warm, genuine, personal message to close. Acknowledge the specific weight of their situation — their debts, their dependents, their employment situation, their goal. Don't be generic. Reference what they told you. Tell them what you see in them — someone who took a hard, honest look at their situation and asked for help, which takes real courage. Remind them that their situation is not permanent. End with something that will stay with them.

Remember: every single section must reference their specific numbers, debts, and circumstances. Generic advice is not acceptable. This person deserves a plan that feels written just for them — because it is.`;

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
      const text = result.content?.map((b) => b.text || "").join("") || "";
      setPlan(text);
      setParsedData({ ...data, totalDebt, surplus, freeDate });
    } catch (e) {
      setError("Something went wrong generating your plan. Please try again.");
    }
    setLoading(false);
  };

  const formatPlan = (text) =>
    text.split(/(?=## )/).filter(s => s.trim()).map((section, i) => {
      const lines = section.trim().split("\n");
      return { header: lines[0].replace("## ", ""), body: lines.slice(1).join("\n").trim(), key: i };
    });

  const renderBody = (body) =>
    body.split("\n").map((line, i) => {
      if (line.match(/\*\*(.*?)\*\*/)) {
        const html = line.replace(/\*\*(.*?)\*\*/g, `<strong style="color:${c.accentDark}">$1</strong>`);
        return <p key={i} style={{ marginBottom: 6, lineHeight: 1.8 }} dangerouslySetInnerHTML={{ __html: html }} />;
      }
      if (line.match(/^\[ \]/)) {
        return (
          <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
            <div style={{ width: 18, height: 18, border: `2px solid ${c.accent}`, borderRadius: 4, flexShrink: 0, marginTop: 3 }} />
            <p style={{ margin: 0, lineHeight: 1.75 }}>{line.replace(/^\[ \] /, "")}</p>
          </div>
        );
      }
      if (line.startsWith("- ") || line.startsWith("• ")) {
        return (
          <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
            <span style={{ color: c.accent, fontSize: 18, lineHeight: 1.4, flexShrink: 0 }}>›</span>
            <p style={{ margin: 0, lineHeight: 1.8 }}>{line.replace(/^[-•] /, "")}</p>
          </div>
        );
      }
      if (line.trim() === "") return <div key={i} style={{ height: 10 }} />;
      return <p key={i} style={{ marginBottom: 8, lineHeight: 1.8 }}>{line}</p>;
    });

  const canContinue = () => {
    if (step.type === "debts") return debts.length > 0;
    if (step.type === "select") return false;
    return currentValue.trim().length > 0;
  };

  const showReach = parsedData && shouldRecommendReach();
  const showNDR = parsedData && shouldRecommendNDR(parsedData);

  return (
    <div style={{ minHeight: "100vh", background: c.bg, color: c.text, fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <style>{`
        @media print { .no-print { display: none !important; } body { background: white; } .plan-card { break-inside: avoid; } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ height: 4, background: `linear-gradient(90deg, ${c.accentDark}, ${c.accent}, #6fc46a)` }} />

      <div style={{ maxWidth: 650, margin: "0 auto", padding: "44px 22px 80px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 48 }} className="no-print">
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: c.accentLight, borderRadius: 20, padding: "6px 16px", marginBottom: 22 }}>
            <span>🌱</span>
            <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: c.accent, fontWeight: 700 }}>Debt Escape Plan</span>
          </div>
          <h1 style={{ fontSize: "clamp(28px, 6vw, 46px)", fontWeight: 400, margin: "0 0 14px", lineHeight: 1.2, color: c.text, letterSpacing: "-0.02em" }}>
            Your fresh start<br /><em style={{ color: c.accent }}>begins today.</em>
          </h1>
          <p style={{ color: c.textLight, fontSize: 15, margin: "0 auto", lineHeight: 1.65, maxWidth: 400 }}>
            Answer 10 honest questions. Get a personalized, judgment-free roadmap out of debt.
          </p>
        </div>

        {/* Form */}
        {!loading && !plan && (
          <div className="no-print">
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: c.textLight }}>Question {currentStep + 1} <span style={{ color: c.textMuted }}>of {STEPS.length}</span></span>
                <span style={{ fontSize: 13, color: c.accent, fontWeight: 600 }}>{Math.round(progress)}%</span>
              </div>
              <div style={{ height: 6, background: c.border, borderRadius: 3, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${c.accentDark}, ${c.accent})`, borderRadius: 3, transition: "width 0.5s ease" }} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 5, marginBottom: 36, justifyContent: "center", flexWrap: "wrap" }}>
              {STEPS.map((_, i) => (
                <div key={i} style={{ width: i === currentStep ? 18 : 7, height: 7, borderRadius: 4, background: i <= currentStep ? c.accent : c.border, transition: "all 0.3s", opacity: i > currentStep ? 0.45 : 1 }} />
              ))}
            </div>

            <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: "34px 30px", marginBottom: 14, boxShadow: `0 4px 20px ${c.shadow}` }}>
              <div style={{ display: "inline-block", background: c.accentLight, borderRadius: 10, padding: "3px 12px", marginBottom: 18 }}>
                <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: c.accent, fontWeight: 700 }}>{meta.label}</span>
              </div>
              <h2 style={{ fontSize: 21, fontWeight: 400, color: c.text, margin: "0 0 9px", lineHeight: 1.35 }}>{meta.question}</h2>
              <p style={{ color: c.textLight, fontSize: 14, margin: "0 0 26px", lineHeight: 1.55 }}>{meta.hint}</p>

              {step.type === "select" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                  {meta.options.map((opt) => (
                    <button key={opt} onClick={() => handleSelect(opt)}
                      style={{ textAlign: "left", padding: "13px 17px", background: c.inputBg, border: `1.5px solid ${c.border}`, borderRadius: 8, cursor: "pointer", fontSize: 15, color: c.textMid, fontFamily: "'Georgia', serif", transition: "all 0.15s" }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = c.accent; e.currentTarget.style.background = c.accentLight; e.currentTarget.style.color = c.accentDark; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = c.inputBg; e.currentTarget.style.color = c.textMid; }}>
                      {opt}
                    </button>
                  ))}
                </div>
              )}

              {step.type === "debts" && <DebtEntry debts={debts} setDebts={setDebts} />}

              {step.type === "textarea" && (
                <textarea value={currentValue} onChange={e => setCurrentValue(e.target.value)}
                  placeholder={meta.hint} rows={3}
                  onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
                  style={{ width: "100%", background: c.inputBg, border: `1.5px solid ${focused ? c.accent : c.border}`, borderRadius: 8, padding: "13px 15px", color: c.text, fontSize: 15, fontFamily: "'Georgia', serif", resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.6, transition: "border-color 0.2s" }} />
              )}

              {step.type === "number" && (
                <div style={{ position: "relative" }}>
                  {step.prefix && <span style={{ position: "absolute", left: 15, top: "50%", transform: "translateY(-50%)", color: c.accent, fontSize: 22, fontWeight: 300 }}>{step.prefix}</span>}
                  <input type="number" value={currentValue} onChange={e => setCurrentValue(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleNext()}
                    onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder="0"
                    style={{ width: "100%", background: c.inputBg, border: `1.5px solid ${focused ? c.accent : c.border}`, borderRadius: 8, padding: step.prefix ? "15px 15px 15px 32px" : "15px", color: c.text, fontSize: 24, fontFamily: "'Georgia', serif", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s" }} />
                </div>
              )}
            </div>

            {step.type !== "select" && (
              <button onClick={handleNext} disabled={!canContinue()}
                style={{ width: "100%", padding: "16px", background: canContinue() ? `linear-gradient(135deg, ${c.accentDark}, ${c.accent})` : c.border, color: canContinue() ? "#fff" : c.textMuted, border: "none", borderRadius: 8, fontSize: 15, fontFamily: "'Georgia', serif", fontWeight: 700, letterSpacing: "0.05em", cursor: canContinue() ? "pointer" : "not-allowed", transition: "all 0.2s" }}>
                {currentStep < STEPS.length - 1 ? "Continue →" : "Generate My Plan →"}
              </button>
            )}

            {currentStep > 0 && (
              <button onClick={() => { setCurrentStep(currentStep - 1); setCurrentValue(answers[STEPS[currentStep - 1].id] || ""); }}
                style={{ width: "100%", padding: "11px", marginTop: 9, background: "transparent", color: c.textLight, border: "none", fontSize: 13, cursor: "pointer", fontFamily: "'Georgia', serif" }}>
                ← Go back
              </button>
            )}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }} className="no-print">
            <div style={{ width: 50, height: 50, borderRadius: "50%", border: `3px solid ${c.border}`, borderTop: `3px solid ${c.accent}`, animation: "spin 0.9s linear infinite", margin: "0 auto 28px" }} />
            <h3 style={{ fontWeight: 400, color: c.text, marginBottom: 10, fontSize: 21 }}>Building your plan...</h3>
            <p style={{ color: c.textLight, fontSize: 15 }}>Analyzing your situation and crafting your personalized roadmap</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: c.dangerLight, border: "1px solid #f5c0c0", borderRadius: 10, padding: 28, textAlign: "center" }} className="no-print">
            <p style={{ color: c.danger, margin: 0 }}>{error}</p>
            <button onClick={() => { setError(null); setPlan(null); setCurrentStep(0); setAnswers({}); setDebts([]); }}
              style={{ marginTop: 16, background: "transparent", color: c.accent, border: `1px solid ${c.accent}`, borderRadius: 6, padding: "8px 20px", cursor: "pointer", fontFamily: "'Georgia', serif" }}>
              Try Again
            </button>
          </div>
        )}

        {/* Plan output */}
        {plan && !loading && (
          <div ref={planRef}>
            <div style={{ textAlign: "center", marginBottom: 40 }}>
              <div style={{ width: 54, height: 54, background: c.accentLight, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 26 }}>🌱</div>
              <h2 style={{ fontWeight: 400, fontSize: 26, color: c.text, margin: "0 0 8px" }}>Your Debt Escape Plan</h2>
              <p style={{ color: c.textLight, fontSize: 14, margin: "0 0 20px" }}>Personalized to your exact situation</p>
              <button onClick={() => window.print()} className="no-print"
                style={{ background: `linear-gradient(135deg, ${c.accentDark}, ${c.accent})`, color: "#fff", border: "none", borderRadius: 8, padding: "11px 24px", fontSize: 14, fontFamily: "'Georgia', serif", fontWeight: 700, cursor: "pointer", letterSpacing: "0.05em" }}>
                📄 Save / Print My Plan
              </button>
            </div>

            {/* Debt-free date banner */}
            {parsedData?.freeDate && (
              <div style={{ background: `linear-gradient(135deg, ${c.accentDark}, ${c.accent})`, borderRadius: 12, padding: "22px 26px", marginBottom: 16, textAlign: "center", color: "#fff" }}>
                <p style={{ margin: "0 0 4px", fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", opacity: 0.8 }}>Your estimated debt-free date</p>
                <p style={{ margin: 0, fontSize: 30, fontWeight: 700, letterSpacing: "-0.01em" }}>{parsedData.freeDate} 🎉</p>
                <p style={{ margin: "6px 0 0", fontSize: 13, opacity: 0.75 }}>Based on your current monthly surplus of ${parsedData.surplus.toFixed(0)}</p>
              </div>
            )}

            {/* Plan sections */}
            {formatPlan(plan).map(({ header, body, key }) => (
              <div key={key} className="plan-card" style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 12, padding: "28px 28px", marginBottom: 14, borderLeft: `4px solid ${c.accent}`, boxShadow: `0 2px 10px ${c.shadow}` }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: c.text, margin: "0 0 16px" }}>{header}</h3>
                <div style={{ color: c.textMid, fontSize: 15, lineHeight: 1.8 }}>{renderBody(body)}</div>
              </div>
            ))}

            {/* Recommended resources */}
            {(showReach || showNDR) && (
              <div style={{ marginTop: 28 }}>
                <div style={{ textAlign: "center", marginBottom: 18 }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", color: c.gold, fontWeight: 700 }}>Recommended Resources For You</span>
                  <p style={{ color: c.textLight, fontSize: 13, margin: "6px 0 0" }}>Based on your situation, these services may help speed up your journey</p>
                </div>
                {showReach && (
                  <ResourceCard
                    title="Reach Financial"
                    tag="Personal Loan"
                    tagColor={c.accent}
                    description="Reach Financial offers personal loans designed to consolidate high-interest debt into one lower monthly payment — potentially saving you thousands in interest over time."
                    url="https://www.reachfinancial.com"
                    why="You have high-interest debt. A consolidation loan at a lower rate could cut your total interest paid significantly and simplify your monthly payments into one."
                  />
                )}
                {showNDR && (
                  <ResourceCard
                    title="National Debt Relief"
                    tag="Debt Settlement"
                    tagColor="#7a4a9a"
                    description="National Debt Relief negotiates directly with creditors to reduce what you owe — often settling debts for less than the full balance with no upfront fees."
                    url="https://www.nationaldebtrelief.com"
                    why="With your debt level and credit situation, debt settlement could be a powerful option to explore alongside your payoff plan to reduce what you actually owe."
                  />
                )}
              </div>
            )}

            {/* Footer */}
            <div style={{ background: c.accentLight, border: `1px solid ${c.border}`, borderRadius: 10, padding: "18px 22px", marginTop: 20, textAlign: "center" }}>
              <p style={{ color: c.textLight, fontSize: 13, margin: "0 0 12px", lineHeight: 1.6 }}>
                ⚠ For educational purposes only. Consult a certified financial advisor for professional advice.
              </p>
              <button onClick={() => { setPlan(null); setCurrentStep(0); setAnswers({}); setCurrentValue(""); setDebts([]); setParsedData(null); }} className="no-print"
                style={{ background: "transparent", color: c.accent, border: `1.5px solid ${c.accent}`, borderRadius: 6, padding: "9px 22px", cursor: "pointer", fontFamily: "'Georgia', serif", fontSize: 14 }}>
                Start Over
              </button>
            </div>
          </div>
        )}

        <p style={{ textAlign: "center", color: c.textMuted, fontSize: 12, marginTop: 40 }} className="no-print">🔒 Your answers are never stored or shared.</p>
      </div>
    </div>
  );
}
