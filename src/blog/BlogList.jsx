import { Link } from "react-router-dom";
import { allPosts } from "./index.js";

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
  shadow: "rgba(180,80,120,0.08)",
};

export default function BlogList() {
  return (
    <div style={{ minHeight: "100vh", background: c.bg, fontFamily: "'Georgia', serif", color: c.text }}>
      <div style={{ height: 4, background: `linear-gradient(90deg, ${c.accentDark}, ${c.accent}, #e8a0bb, #c9a84c)` }} />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 22px 80px" }}>
        <div style={{ marginBottom: 32 }}>
          <Link to="/" style={{ color: c.accent, fontSize: 14, textDecoration: "none" }}>← Back to Quiz Generator</Link>
        </div>
        <div style={{ textAlign: "center", marginBottom: 44 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: c.accentLight, borderRadius: 20, padding: "6px 18px", marginBottom: 20 }}>
            <span>💍</span>
            <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: c.accent, fontWeight: 700 }}>Party Planning Tips</span>
          </div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 38px)", fontWeight: 400, margin: "0 0 12px", color: c.text }}>
            The Party Quiz <em style={{ color: c.accent }}>Blog</em>
          </h1>
          <p style={{ color: c.textLight, fontSize: 15, maxWidth: 400, margin: "0 auto" }}>Tips, ideas, and inspiration for planning unforgettable bridal showers and parties.</p>
        </div>

        {allPosts.map(post => (
          <Link key={post.slug} to={`/blog/${post.slug}`} style={{ textDecoration: "none" }}>
            <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: "28px 28px", marginBottom: 14, boxShadow: `0 4px 20px ${c.shadow}`, borderLeft: `4px solid ${c.accent}`, transition: "transform 0.15s", cursor: "pointer" }}
              onMouseOver={e => e.currentTarget.style.transform = "translateY(-2px)"}
              onMouseOut={e => e.currentTarget.style.transform = "translateY(0)"}>
              <p style={{ fontSize: 12, color: c.textMuted, margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{post.date}</p>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: c.text, margin: "0 0 10px", lineHeight: 1.3 }}>{post.title}</h2>
              <p style={{ color: c.textLight, fontSize: 15, margin: "0 0 14px", lineHeight: 1.6 }}>{post.description}</p>
              <span style={{ color: c.accent, fontSize: 14, fontWeight: 600 }}>Read more →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
