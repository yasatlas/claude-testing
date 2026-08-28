const { validateEmail } = require("./validateEmail");

const cases = [
  // Valid
  { input: "user@example.com",           expect: true },
  { input: "user.name+tag@sub.domain.io", expect: true },
  { input: "USER@EXAMPLE.COM",           expect: true },
  { input: "user_123@my-domain.co.uk",   expect: true },

  // Invalid
  { input: "",                           expect: false },
  { input: "plainaddress",              expect: false },
  { input: "@no-local.com",             expect: false },
  { input: "no-domain@",               expect: false },
  { input: "two@@atsigns.com",          expect: false },
  { input: "has space@example.com",     expect: false },
  { input: ".leading@example.com",      expect: false },
  { input: "trailing.@example.com",     expect: false },
  { input: "double..dot@example.com",   expect: false },
  { input: "user@-hyphen.com",          expect: false },
  { input: "user@domain.c",             expect: false },
];

let passed = 0;
let failed = 0;

for (const { input, expect } of cases) {
  const result = validateEmail(input);
  const ok = result.valid === expect;
  if (ok) {
    passed++;
    console.log(`  PASS  "${input}"`);
  } else {
    failed++;
    console.error(`  FAIL  "${input}" → expected valid=${expect}, got valid=${result.valid} (${result.error || ""})`);
  }
}

console.log(`\n${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
