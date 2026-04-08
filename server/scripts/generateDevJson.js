/**
 * One-off generator: writes ../data/dev.json with type "dev", levels 1–30.
 * Run: node scripts/generateDevJson.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const topicForLevel = (level) => {
  if (level <= 5) return "HTML5 & Semantics";
  if (level <= 10) return "CSS3 & Layout";
  if (level <= 15) return "JavaScript Core";
  if (level <= 20) return "JavaScript Async & DOM";
  if (level <= 25) return "React";
  if (level <= 30) return "Node.js & Backend";
  return "Full Stack";
};

/** Bank of question templates; rotated per level */
const BANK = [
  {
    q: "What does the <main> element represent in HTML5?",
    o: ["Footer content", "Dominant content of the page", "Navigation only", "Script tags"],
    a: "Dominant content of the page",
    e: "<main> wraps the primary content of the document, distinct from header, nav, aside, footer.",
  },
  {
    q: "Which HTTP method is idempotent and safe for reads?",
    o: ["POST", "GET", "PATCH", "CONNECT"],
    a: "GET",
    e: "GET should not change server state and can be repeated safely.",
  },
  {
    q: "In CSS Flexbox, what does justify-content space-between do?",
    o: ["Stack vertically", "Distribute items with space between them", "Center on cross axis", "Wrap to new lines"],
    a: "Distribute items with space between them",
    e: "space-between places first/last at edges and equal space between items.",
  },
  {
    q: "What is the purpose of the alt attribute on <img>?",
    o: ["Tooltip text", "Accessible description when image fails", "Lazy loading", "Image size"],
    a: "Accessible description when image fails",
    e: "alt provides text for screen readers and when the image cannot load.",
  },
  {
    q: "Which CSS unit is relative to the root element font size?",
    o: ["em", "rem", "vh", "px"],
    a: "rem",
    e: "rem is relative to the root (html) font size; em is relative to parent.",
  },
  {
    q: "What does typeof null return in JavaScript?",
    o: ["'null'", "'undefined'", "'object'", "'number'"],
    a: "'object'",
    e: "Historical JS quirk: typeof null === 'object'.",
  },
  {
    q: "Which method creates a new array without mutating the original when adding an element?",
    o: ["push()", "concat() or spread", "pop()", "reverse()"],
    a: "concat() or spread",
    e: "push mutates; [...arr, x] or [].concat(arr, x) returns a new array.",
  },
  {
    q: "What is a closure in JavaScript?",
    o: ["A sealed class", "A function that retains access to variables from outer scope", "A private keyword", "A loop construct"],
    a: "A function that retains access to variables from outer scope",
    e: "Inner functions capture lexical environment from where they were created.",
  },
  {
    q: "What is the event loop responsible for?",
    o: ["Parsing HTML", "Scheduling callbacks after the call stack clears", "Garbage collection", "DOM parsing"],
    a: "Scheduling callbacks after the call stack clears",
    e: "The event loop queues async callbacks (microtasks, macrotasks) after synchronous work.",
  },
  {
    q: "What does async/await syntactically wrap?",
    o: ["Callbacks only", "Promises", "XMLHttpRequest", "Web Workers"],
    a: "Promises",
    e: "async functions return Promises; await pauses until a Promise settles.",
  },
  {
    q: "In React, what is the purpose of key in lists?",
    o: ["Styling", "Helping React identify elements across re-renders", "SEO", "Accessibility only"],
    a: "Helping React identify elements across re-renders",
    e: "Stable keys help reconcile list diffs and avoid incorrect state reuse.",
  },
  {
    q: "Which hook runs after paint and can subscribe to external systems?",
    o: ["useState", "useLayoutEffect", "useEffect", "useMemo"],
    a: "useEffect",
    e: "useEffect runs after commit; useLayoutEffect runs synchronously after DOM updates.",
  },
  {
    q: "What is the default port for HTTP in Node/Express examples?",
    o: ["80", "3000 or 5000", "443", "8080 only"],
    a: "3000 or 5000",
    e: "Dev servers often use 3000/5000; production HTTP is 80, HTTPS 443.",
  },
  {
    q: "What does REST stand for in REST APIs?",
    o: ["Remote Execution State Transfer", "Representational State Transfer", "Resource Encoding Standard", "Reactive State Transfer"],
    a: "Representational State Transfer",
    e: "REST uses resource-oriented URLs and standard HTTP verbs.",
  },
  {
    q: "In MongoDB, what is a document?",
    o: ["A table row in SQL", "A BSON/JSON-like record in a collection", "A binary file", "An index"],
    a: "A BSON/JSON-like record in a collection",
    e: "MongoDB stores documents in collections; analogous to rows but schema-flexible.",
  },
];

const EXTRA = [
  ["What is CORS?", ["Cross-Origin Resource Sharing — browser security for cross-origin requests", "A CSS property", "A React hook", "A database"], "Cross-Origin Resource Sharing — browser security for cross-origin requests", "CORS headers allow a browser to permit cross-origin XHR/fetch."],
  ["What is middleware in Express?", ["Functions that run in the request pipeline", "Only static files", "Database only", "HTML templates"], "Functions that run in the request pipeline", "Middleware functions run between request and response, e.g. auth, logging."],
  ["What does npm install do?", ["Installs dependencies from package.json", "Deletes node_modules", "Runs tests", "Starts server"], "Installs dependencies from package.json", "npm reads package.json and installs listed packages into node_modules."],
  ["What is JSX?", ["Syntax extension for React describing UI", "A database", "A CSS preprocessor", "A browser engine"], "Syntax extension for React describing UI", "JSX compiles to React.createElement calls."],
  ["What is JWT often used for?", ["Stateless authentication tokens", "Image compression", "CSS variables", "SQL joins"], "Stateless authentication tokens", "JWTs carry signed claims; often used for API auth."],
];

const out = [];
let idx = 0;
for (let level = 1; level <= 30; level++) {
  const topic = topicForLevel(level);
  for (let n = 0; n < 10; n++) {
    const base = BANK[(idx + n) % BANK.length];
    const extra = EXTRA[(idx + level + n) % EXTRA.length];
    const useExtra = idx % 3 === 0 && n >= 7;
    const q = useExtra
      ? { question: extra[0], options: extra[1], correctAnswer: extra[2], explanation: extra[3] }
      : { question: base.q, options: [...base.o], correctAnswer: base.a, explanation: base.e };
    out.push({
      type: "dev",
      level,
      topic,
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    });
  }
  idx += 3;
}

const outPath = path.join(__dirname, "../data/dev.json");
fs.writeFileSync(outPath, JSON.stringify(out, null, 2), "utf8");
console.log(`Wrote ${out.length} questions to ${outPath}`);
