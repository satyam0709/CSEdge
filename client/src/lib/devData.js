// src/lib/devData.js

// ==========================================
// 1. SYLLABUS MAPPING
// ==========================================
const getTopicForLevel = (level) => {
  if (level <= 5) return "HTML5 & Semantics";
  if (level <= 10) return "CSS3: Flexbox & Grid";
  if (level <= 15) return "JS: Basics & ES6";
  if (level <= 20) return "JS: Async & DOM";
  if (level <= 25) return "React: Components & Props";
  if (level <= 30) return "React: Hooks & Lifecycle";
  if (level <= 35) return "State Management (Redux/Context)";
  if (level <= 40) return "Node.js & Express";
  if (level <= 45) return "Databases (SQL & Mongo)";
  return "DevOps & System Design"; // 46-50
};

export const DEV_LEVELS = Array.from({ length: 50 }, (_, i) => {
  const num = i + 1;
  const topic = getTopicForLevel(num);
  let difficulty = 'Junior';
  
  if (num > 15) difficulty = 'Intermediate';
  if (num > 35) difficulty = 'Senior';
  if (num > 45) difficulty = 'Architect';

  return {
    id: num,
    name: `Dev Lvl ${num}`,
    topic,
    difficulty,
    requiredScore: 65,
    questionsCount: 25,
    timeLimit: 1200, // 20 mins
  };
});

// ==========================================
// 2. QUESTION BANKS (Tech Stack Specific)
// ==========================================

const BANKS = {
  html: [
    { q: "Which tag is semantic for sidebar content?", code: "<div> vs <aside>", o: ["<aside>", "<section>", "<article>", "<footer>"], a: 0, exp: "<aside> defines content aside from the page content." },
    { q: "Correct input type for email?", code: "<input type='?'>", o: ["email", "text", "mail", "input"], a: 0, exp: "type='email' provides validation and mobile keyboard support." },
    { q: "Which attribute opens link in new tab?", code: "<a href='...'>", o: ["target='_blank'", "new='tab'", "target='new'", "window='new'"], a: 0, exp: "target='_blank' opens the linked document in a new window or tab." }
  ],
  css: [
    { q: "Flex property to align items vertically?", code: ".container { display: flex; ... }", o: ["align-items", "justify-content", "text-align", "float"], a: 0, exp: "align-items controls cross-axis (vertical in row mode) alignment." },
    { q: "Which selector has highest specificity?", o: ["#id", ".class", "tag", "*"], a: 0, exp: "IDs (#) have higher specificity (100) than classes (10)." },
    { q: "Grid: How to span 2 columns?", code: "grid-column: ...", o: ["span 2", "2 / 3", "merge 2", "double"], a: 0, exp: "grid-column: span 2; tells the item to take up two tracks." }
  ],
  js: [
    { q: "What is output?", code: "console.log(typeof NaN);", o: ["'number'", "'NaN'", "'undefined'", "'object'"], a: 0, exp: "Surprisingly, NaN (Not a Number) is technically of type 'number'." },
    { q: "Output of equality?", code: "console.log(1 == '1');", o: ["true", "false", "error", "undefined"], a: 0, exp: "== performs type coercion. === would be false." },
    { q: "How to declare block-scoped variable?", o: ["let", "var", "window.val", "global"], a: 0, exp: "let and const are block-scoped; var is function-scoped." }
  ],
  react: [
    { q: "Which hook replaces componentDidMount?", o: ["useEffect", "useState", "useMemo", "useCallback"], a: 0, exp: "useEffect(() => {}, []) runs once on mount." },
    { q: "State updates in React are?", o: ["Asynchronous", "Synchronous", "Immediate", "Global"], a: 0, exp: "React batches state updates for performance, making them async." },
    { q: "Why use 'key' in lists?", o: ["Performance/Reconciliation", "Styling", "Sorting", "Required syntax"], a: 0, exp: "Keys help React identify which items have changed, added, or removed." }
  ],
  backend: [
    { q: "HTTP status for 'Unauthorized'?", o: ["401", "403", "404", "500"], a: 0, exp: "401 is Unauthorized (login required); 403 is Forbidden (permissions)." },
    { q: "Express: How to access URL params?", code: "/users/:id", o: ["req.params.id", "req.query.id", "req.body.id", "req.url"], a: 0, exp: "Route parameters are stored in req.params." },
    { q: "Which is NOT a SQL command?", o: ["GET", "SELECT", "INSERT", "UPDATE"], a: 0, exp: "GET is an HTTP method, not SQL. SQL uses SELECT." }
  ]
};

// ==========================================
// 3. PROCEDURAL GENERATORS (Syntax Tracing)
// ==========================================

const generateCSSBoxModel = () => {
  const w = Math.floor(Math.random() * 100) + 100;
  const p = 10, b = 5, m = 20;
  return {
    q: "Calculate total element width:",
    code: `.box {\n  width: ${w}px;\n  padding: ${p}px;\n  border: ${b}px solid;\n  margin: ${m}px;\n  box-sizing: content-box;\n}`,
    o: [`${w + 2*p + 2*b}px`, `${w}px`, `${w + 2*p}px`, `${w + 2*m}px`],
    a: 0,
    exp: "content-box adds padding and border to the width. Margin is outside.",
    cat: "CSS Logic"
  };
};

const generateJSPromise = () => {
  const ms = Math.floor(Math.random() * 500) + 100;
  return {
    q: "What logs first?",
    code: `console.log('A');\nsetTimeout(() => console.log('B'), ${ms});\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');`,
    o: ["A, D, C, B", "A, B, C, D", "A, C, D, B", "A, D, B, C"],
    a: 0,
    exp: "Microtasks (Promises) run before Macrotasks (setTimeout), but synchronous code (A, D) runs first.",
    cat: "Event Loop"
  };
};

// ==========================================
// 4. MAIN EXPORT
// ==========================================

export const getDevQuestions = (levelId) => {
  const questions = [];
  const topic = getTopicForLevel(levelId);
  
  // Select Bank
  let bank = BANKS.html;
  if (topic.includes("CSS")) bank = BANKS.css;
  if (topic.includes("JS")) bank = BANKS.js;
  if (topic.includes("React")) bank = BANKS.react;
  if (topic.includes("Node") || topic.includes("Data")) bank = BANKS.backend;

  for (let i = 0; i < 25; i++) {
    let qData;
    const seed = Math.random();

    // Mix 20% Procedural Logic Questions
    if (topic.includes("CSS") && seed > 0.8) {
      qData = generateCSSBoxModel();
    } else if (topic.includes("JS") && seed > 0.8) {
      qData = generateJSPromise();
    } else {
      const raw = bank[i % bank.length];
      qData = { ...raw };
    }

    questions.push({
      id: `dev_${levelId}_${i}_${Date.now()}`,
      category: topic,
      question: qData.q,
      code: qData.code,
      options: qData.o,
      correctAnswer: qData.a,
      explanation: qData.exp
    });
  }
  return questions;
};