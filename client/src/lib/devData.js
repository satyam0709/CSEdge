// src/lib/devData.js

// ==========================================
// 1. SYLLABUS MAPPING & LEVELS
// ==========================================
const getTopicForLevel = (level) => {
  if (level <= 5) return "HTML5 & Semantics";
  if (level <= 10) return "CSS3: Flexbox, Grid & Animations";
  if (level <= 15) return "JS: Closures, prototypes & ES6+";
  if (level <= 20) return "JS: Event Loop, Async/Await & DOM";
  if (level <= 25) return "React: Fiber, Reconciliation & Hooks";
  if (level <= 30) return "React: Context, Redux & Performance";
  if (level <= 35) return "Node.js: Streams, Buffers & Event Emitter";
  if (level <= 40) return "Backend: Auth (JWT/OAuth) & Security";
  if (level <= 45) return "Database: Indexing, Normalization & ACID";
  return "System Design: Scalability, Caching & Microservices"; // 46-50
};

export const DEV_LEVELS = Array.from({ length: 50 }, (_, i) => {
  const num = i + 1;
  const topic = getTopicForLevel(num);
  let difficulty = 'Junior';
  
  if (num > 15) difficulty = 'Intermediate';
  if (num > 30) difficulty = 'Senior';
  if (num > 45) difficulty = 'Architect';

  return {
    id: num,
    name: `Dev Level ${num}`,
    topic,
    difficulty,
    requiredScore: Math.min(60 + i, 85),
    questionsCount: 15, // CHANGED TO 15
    timeLimit: 900 + (num * 10), // Time scales with level
  };
});

// ==========================================
// 2. QUESTION BANKS (Tech Stack Specific)
// ==========================================

const BANKS = {
  html: [
    { q: "What is the primary purpose of the <main> tag?", code: "<body>...<main>...</main>...</body>", o: ["SEO ranking", "Encapsulate dominant content", "Styling wrapper", "Internet Explorer support"], a: 1, exp: "<main> specifies the main content of a document, unique to that page." },
    { q: "Which attribute creates a tooltip on hover?", code: "<div ?>Tooltip text</div>", o: ["alt", "src", "title", "data-tip"], a: 2, exp: "The 'title' attribute displays text when hovering over the element." },
    { q: "Difference between <script> 'defer' and 'async'?", o: ["Async blocks parsing, Defer waits for DOM", "Defer blocks parsing", "No difference", "Async guarantees order"], a: 0, exp: "Async downloads in parallel but executes immediately (blocking). Defer executes after HTML parsing." }
  ],
  css: [
    { q: "In Grid, what does '1fr' represent?", o: ["1 frame", "1 fraction of free space", "1 fixed row", "100% width"], a: 1, exp: "fr unit distributes available space proportionally." },
    { q: "Which property triggers hardware acceleration (GPU)?", code: ".anim { ? }", o: ["transform: translateZ(0)", "display: block", "position: absolute", "float: left"], a: 0, exp: "3D transforms force the browser to promote the element to a new compositor layer." },
    { q: "How to target the LAST paragraph only?", code: "p:??? { color: red; }", o: ["last-child", "last-of-type", "nth-last(1)", "end-child"], a: 1, exp: ":last-of-type selects the last element of that specific tag type." }
  ],
  js: [
    { q: "Output of this IIFE?", code: "(function(){ var a = b = 3; })();\nconsole.log(typeof a, typeof b);", o: ["undefined, number", "number, number", "undefined, undefined", "error, error"], a: 0, exp: "'b = 3' becomes a global variable (without strict mode). 'var a' is local." },
    { q: "What is the result of `[] + {}`?", o: ["'[object Object]'", "0", "undefined", "TypeError"], a: 0, exp: "Array converts to empty string, Object to '[object Object]'. String concat happens." },
    { q: "Which method flattens an array of arrays?", code: "[[1], [2]].???()", o: ["flat()", "flatten()", "reduce()", "map()"], a: 0, exp: "Array.prototype.flat() was introduced in ES2019." }
  ],
  react: [
    { q: "What causes a React Infinite Loop?", code: "useEffect(() => { setCount(c => c+1) });", o: ["Missing dependency array", "Using useState", "Using functional updates", "React bug"], a: 0, exp: "Without dependency array [], useEffect runs after EVERY render, triggering state update -> render -> effect loop." },
    { q: "Purpose of `useRef` besides DOM access?", o: ["Persist values without re-render", "State management", "Memoization", "Context replacement"], a: 0, exp: "useRef holds a mutable .current property that doesn't trigger a re-render when changed." },
    { q: "Why use React.memo?", o: ["Prevent unnecessary re-renders", "Cache API calls", "Memoize functions", "Global state"], a: 0, exp: "It performs a shallow comparison of props and skips rendering if props haven't changed." }
  ],
  backend: [
    { q: "Node.js is single-threaded. How does it handle concurrency?", o: ["Event Loop & Libuv", "Multiple processes", "Java Threads", "It doesn't"], a: 0, exp: "It uses an event-driven, non-blocking I/O model powered by the Event Loop and Libuv C++ library." },
    { q: "Which JOIN returns all records from LEFT table?", code: "SELECT * FROM A ??? JOIN B ON A.id = B.id", o: ["LEFT JOIN", "INNER JOIN", "OUTER JOIN", "RIGHT JOIN"], a: 0, exp: "LEFT JOIN returns all rows from the left table, even if there are no matches in the right table." },
    { q: "In System Design, what is 'Sharding'?", o: ["Partitioning DB horizontally", "Caching", "Load Balancing", "Replication"], a: 0, exp: "Splitting a large database across multiple machines based on a shard key." }
  ]
};

// ==========================================
// 3. ADVANCED GENERATORS (High Difficulty)
// ==========================================

const generateClosurePuzzle = (level) => {
  const base = Math.floor(Math.random() * 5) + 1;
  const mult = Math.floor(Math.random() * 3) + 2;
  return {
    q: "Predict the output (Closure):",
    code: `function create(x) {\n  return function(y) {\n    return x * y;\n  }\n}\nconst fn = create(${base});\nconsole.log(fn(${mult}));`,
    o: [`${base * mult}`, `${base + mult}`, "undefined", "Error"],
    a: 0,
    exp: `The inner function remembers 'x=${base}' from its lexical scope. Returns ${base} * ${mult}.`,
    cat: "JS Scopes"
  };
};

const generateReactRender = () => {
  return {
    q: "In what order do these log?",
    code: `useEffect(() => console.log('A'));\nuseLayoutEffect(() => console.log('B'));\nconsole.log('C');`,
    o: ["C, B, A", "C, A, B", "B, A, C", "A, B, C"],
    a: 0,
    exp: "Render body (C) runs first. useLayoutEffect (B) runs synchronously after mutation. useEffect (A) runs asynchronously after paint.",
    cat: "React Lifecycle"
  };
};

const generateSQLScenario = () => {
  const cost = (Math.floor(Math.random() * 10) + 1) * 1000;
  return {
    q: "You need to find the 2nd highest salary.",
    code: `SELECT MAX(salary) FROM Emp WHERE salary < (\n  SELECT MAX(salary) FROM Emp\n)`,
    o: ["Correct", "Syntax Error", "Returns Highest", "Returns Lowest"],
    a: 0,
    exp: "This subquery logic correctly identifies the maximum value that is strictly less than the absolute maximum.",
    cat: "SQL Logic"
  };
};

// ==========================================
// 4. MAIN EXPORT
// ==========================================

export const getDevQuestions = (levelId) => {
  const questions = [];
  const topic = getTopicForLevel(levelId);
  
  // Select Bank based on topic keywords
  let bank = BANKS.html;
  if (topic.includes("CSS")) bank = BANKS.css;
  if (topic.includes("JS")) bank = BANKS.js;
  if (topic.includes("React")) bank = BANKS.react;
  if (topic.includes("Node") || topic.includes("Data") || topic.includes("System")) bank = BANKS.backend;

  // Generate strictly 15 questions
  for (let i = 0; i < 15; i++) {
    let qData;
    const seed = Math.random();

    // 30% Chance of Procedural "Hard" Question for levels > 10
    if (levelId > 10 && seed > 0.7) {
        if (topic.includes("JS")) qData = generateClosurePuzzle(levelId);
        else if (topic.includes("React")) qData = generateReactRender();
        else if (topic.includes("Data")) qData = generateSQLScenario();
        else {
             // Fallback to Bank if generator doesn't match
             const raw = bank[i % bank.length];
             qData = { ...raw };
        }
    } else {
      // Standard Bank Question
      const raw = bank[i % bank.length];
      qData = { ...raw };
    }

    questions.push({
      id: `dev_${levelId}_${i}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      category: topic,
      question: qData.q,
      code: qData.code, // Can be undefined, component handles it
      options: qData.o,
      correctAnswer: qData.a,
      explanation: qData.exp
    });
  }
  return questions;
};