import { useParams, Link } from "react-router-dom";
import { lazy, Suspense } from "react";

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

const postModules = {
  "personalized-bridal-shower-game": lazy(() => import("./posts/personalized-bridal-shower-game.jsx")),
  "how-well-do-you-know-the-bride-questions": lazy(() => import("./posts/how-well-do-you-know-the-bride-questions.jsx")),
  "best-bridal-shower-games-large-groups": lazy(() => import("./posts/best-bridal-shower-games-large-groups.jsx")),
  "baby-shower-games-everyone-will-love": lazy(() => import("./posts/baby-shower-games-everyone-will-love.jsx")),
  "bridal-shower-on-a-budget": lazy(() => import("./posts/bridal-shower-on-a-budget.jsx")),
  "baby-shower-trivia-questions": lazy(() => import("./posts/baby-shower-trivia-questions.jsx")),
  "bachelorette-party-games-not-cringe": lazy(() => import("./posts/bachelorette-party-games-not-cringe.jsx")),
  "bridal-shower-games-small-groups": lazy(() => import("./posts/bridal-shower-games-small-groups.jsx")),
};

const postMetas = {
  "personalized-bridal-shower-game": {
    title: "Why a Personalized Bridal Shower Game Beats Any Generic Template",
    description: "Every bridal shower plays 'How Well Do You Know the Bride?' but most versions are boring. Here's why personalized questions make all the difference.",
    date: "2026-04-01",
  },
  "how-well-do-you-know-the-bride-questions": {
    title: "50 'How Well Do You Know the Bride' Questions That Actually Work",
    description: "Skip the generic questions. Here are 50 personalized, funny, and memorable questions for your bridal shower trivia game.",
    date: "2026-04-05",
  },
  "best-bridal-shower-games-large-groups": {
    title: "Best Bridal Shower Games for Large Groups (That Actually Work)",
    description: "Planning a bridal shower with 20, 30, or 50+ guests? Here are the games that keep everyone engaged no matter how big the crowd.",
    date: "2026-04-10",
  },
  "baby-shower-games-everyone-will-love": {
    title: "Baby Shower Games Everyone Will Actually Love (No Diaper Sniffing Required)",
    description: "Skip the gross baby shower games. Here are fun, inclusive games that work for every guest — including the ones who've never been to a baby shower before.",
    date: "2026-04-12",
  },
  "bridal-shower-on-a-budget": {
    title: "How to Plan a Bridal Shower on a Budget Without It Looking Like One",
    description: "You don't need to spend hundreds of dollars to throw a bridal shower that feels special. Here's how to do it right without breaking the bank.",
    date: "2026-04-14",
  },
  "baby-shower-trivia-questions": {
    title: "50 Baby Shower Trivia Questions That Will Actually Stump Your Guests",
    description: "Generic baby shower trivia is boring. Here are 50 questions about pregnancy, parenting, and the mom-to-be that will have your guests genuinely stumped and laughing.",
    date: "2026-04-17",
  },
  "bachelorette-party-games-not-cringe": {
    title: "Bachelorette Party Games That Aren't Cringe (Your Group Will Actually Enjoy)",
    description: "Skip the embarrassing bachelorette party games nobody actually wants to play. Here are fun, memorable alternatives that work for every type of group.",
    date: "2026-04-17",
  },
  "bridal-shower-games-small-groups": {
    title: "Bridal Shower Game Ideas for Small Groups (10 People or Fewer)",
    description: "Small bridal showers need different games than large ones. Here are the best options for intimate gatherings where everyone knows each other well.",
    date: "2026-04-17",
  },
};

export default function BlogPost() {
  const { slug } = useParams();
  const PostContent = postModules[slug];
  const meta = postMetas[slug];

  if (!PostContent || !meta) {
    return (
      <div style={{ minHeight: "100vh", background: c.bg, fontFamily: "'Georgia', serif", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 18, color: c.text }}>Post not found.</p>
          <Link to="/blog" style={{ color: c.accent }}>← Back to Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: c.bg, fontFamily: "'Georgia', serif", color: c.text }}>
      <div style={{ height: 4, background: `linear-gradient(90deg, ${c.accentDark}, ${c.accent}, #e8a0bb, #c9a84c)` }} />
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 22px 80px" }}>
        <div style={{ marginBottom: 32 }}>
          <Link to="/blog" style={{ color: c.accent, fontSize: 14, textDecoration: "none" }}>← Back to Blog</Link>
        </div>

        <div style={{ background: c.card, border: `1px solid ${c.border}`, borderRadius: 14, padding: "40px", boxShadow: `0 4px 20px ${c.shadow}` }}>
          <p style={{ fontSize: 12, color: c.textMuted, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.1em" }}>{meta.date}</p>
          <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 700, color: c.text, margin: "0 0 16px", lineHeight: 1.3 }}>{meta.title}</h1>
          <p style={{ color: c.textLight, fontSize: 15, margin: "0 0 32px", lineHeight: 1.6, fontStyle: "italic", borderBottom: `1px solid ${c.border}`, paddingBottom: 24 }}>{meta.description}</p>

          <div style={{ color: c.textMid, fontSize: 16, lineHeight: 1.9 }}>
            <style>{`
              .blog-content p { margin-bottom: 18px; }
              .blog-content h2 { font-size: 20px; font-weight: 700; color: #2d1a24; margin: 32px 0 14px; }
            `}</style>
            <div className="blog-content">
              <Suspense fallback={<p>Loading...</p>}>
                <PostContent />
              </Suspense>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: c.accentLight, border: `1.5px solid ${c.border}`, borderRadius: 14, padding: "28px", marginTop: 24, textAlign: "center" }}>
          <p style={{ fontSize: 12, letterSpacing: "0.15em", textTransform: "uppercase", color: c.accent, fontWeight: 700, margin: "0 0 8px" }}>Ready to try it?</p>
          <h3 style={{ fontSize: 20, fontWeight: 400, color: c.text, margin: "0 0 10px" }}>Generate your personalized quiz in 2 minutes</h3>
          <p style={{ color: c.textLight, fontSize: 14, margin: "0 0 18px" }}>15 custom questions, funny wrong answers, print-ready PDF. Just $5.</p>
          <Link to="/" style={{ display: "inline-block", background: `linear-gradient(135deg, ${c.accentDark}, ${c.accent})`, color: "#fff", padding: "12px 28px", borderRadius: 8, fontSize: 15, fontFamily: "'Georgia', serif", fontWeight: 700, textDecoration: "none" }}>
            💍 Create My Quiz →
          </Link>
        </div>
      </div>
    </div>
  );
}
