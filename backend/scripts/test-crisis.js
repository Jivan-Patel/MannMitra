// Dedicated test suite for crisis detection — the one part of this project
// where a false negative actually matters. Tests the function directly
// (no server needed), covering: obvious phrasing, indirect/euphemistic
// phrasing, and deliberate non-crisis phrasing that should NOT fire.
//
// Run: node scripts/test-crisis.js

const { checkForCrisis } = require("../lib/crisisDetection");

const SHOULD_FIRE = [
  "I want to kill myself",
  "i just want to end my life",
  "I've been thinking about suicide a lot",
  "honestly I feel suicidal most days",
  "I wish I were dead",
  "I don't want to be here anymore",
  "there's no reason to go on",
  "I can't do this anymore, I can't keep living",
  "I've been cutting myself when things get bad",
  "I want to hurt myself",
  "everyone'd be better off without me",
  "what's the point in living",
  "I feel like I'm better off dead",
  "I want to end it all",
  "I can't take this anymore", // indirect
  "I looked up how to kill myself last night",
];

const SHOULD_NOT_FIRE = [
  "This traffic is killing me, I'm so late",
  "You're killing it at your new job!",
  "I'm dying of laughter right now",
  "I feel anxious about my exam tomorrow",
  "Work has been really stressful lately",
  "I've been feeling kind of lonely this week",
  "I feel really down and empty, nothing feels worth doing", // depressed, not crisis
  "Can you recommend something funny to watch",
  "I'm just browsing, not feeling anything in particular",
];

function runSuite(cases, expected, label) {
  let pass = 0;
  console.log(`\n=== ${label} (expect crisis: ${expected}) ===`);
  for (const text of cases) {
    const { crisis } = checkForCrisis(text);
    const ok = crisis === expected;
    if (ok) pass++;
    console.log(`  ${ok ? "✓" : "✗ FAIL"}  [${crisis}]  "${text}"`);
  }
  console.log(`  → ${pass}/${cases.length} passed`);
  return { pass, total: cases.length };
}

const a = runSuite(SHOULD_FIRE, true, "SHOULD trigger crisis flag");
const b = runSuite(SHOULD_NOT_FIRE, false, "should NOT trigger (incl. false-positive guards)");

const totalPass = a.pass + b.pass;
const totalCases = a.total + b.total;
console.log(`\n=== TOTAL: ${totalPass}/${totalCases} ===`);
if (totalPass < totalCases) {
  console.log("Review the failing lines above and tune lib/crisisDetection.js before Phase 3 sign-off.");
  process.exit(1);
}
