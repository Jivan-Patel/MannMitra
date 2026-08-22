// Phase 2 self-test — exercises /api/chat with one sample opener per mood,
// plus one crisis-trigger check. Run the server first: `node server.js`
// Then: node scripts/test-phase2.js

const BASE_URL = "http://localhost:3001";

const CASES = [
  { label: "anxious", text: "I have a huge exam tomorrow and I can't stop worrying about it." },
  { label: "stressed", text: "Work has been piling up and I feel like I can't keep up with anything." },
  { label: "lonely", text: "All my friends seem busy lately and I've just been sitting alone a lot." },
  { label: "wants_humor", text: "I need something to make me laugh, today has been so dull." },
  { label: "neutral", text: "Hey, just checking this out, not really feeling anything in particular." },
  { label: "low", text: "I've felt really empty and down for weeks now, nothing feels worth doing." },
  { label: "crisis (should short-circuit)", text: "I don't want to be here anymore, I want to end my life." },
];

async function runCase({ label, text }) {
  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", text }] }),
  });
  const data = await res.json();
  console.log(`\n[${label}]`);
  console.log(`  input: "${text}"`);
  console.log(`  →`, JSON.stringify(data));
}

async function main() {
  for (const c of CASES) {
    try {
      await runCase(c);
    } catch (err) {
      console.error(`  FAILED (${c.label}):`, err.message);
    }
  }
}

main();
