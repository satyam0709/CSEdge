// src/lib/aptitudeData.js

// Stubbed out - questions moved to backend. Keep minimal exports to avoid import errors.
export const LEVELS = [];
export const getQuestionsForLevel = (levelId) => [];


// --- CONFIGURATION ---
export const LEVELS = Array.from({ length: 50 }, (_, i) => {
  const num = i + 1;
  return {
    id: num,
    name: `Level ${num}`,
    difficulty: num <= 10 ? 'Beginner' : num <= 25 ? 'Intermediate' : num <= 40 ? 'Advanced' : 'Expert',
    requiredScore: Math.min(60 + (i * 0.5), 85),
    questionsCount: 15,  // CHANGED TO 15
    timeLimit: Math.max(600, 1200 - (i * 15)), // Adjusted time for 15 qs
  };
});

// --- ADVANCED VOCABULARY BANK (Static but Tiered) ---
const VOCAB_EASY = [
  { q: "Synonym of: HAPPY", o: ["Sad", "Joyful", "Angry", "Tired"], a: 1, exp: "Joyful means happy." },
  { q: "Antonym of: FAST", o: ["Quick", "Slow", "Rapid", "Swift"], a: 1, exp: "Slow is the opposite of fast." },
];
const VOCAB_HARD = [
  { q: "Synonym of: EPHEMERAL", o: ["Lasting", "Transient", "Eternal", "Stable"], a: 1, exp: "Ephemeral means lasting for a very short time." },
  { q: "Antonym of: MITIGATE", o: ["Alleviate", "Aggravate", "Reduce", "Soothe"], a: 1, exp: "Mitigate means to make less severe; Aggravate means to make worse." },
  { q: "One word for: 'Something that cannot be corrected'", o: ["Incurable", "Incorrigible", "Impossible", "Invulnerable"], a: 1, exp: "Incorrigible means not able to be corrected or reformed." },
  { q: "Synonym of: OBSEQUIOUS", o: ["Domineering", "Servile", "Confident", "Rude"], a: 1, exp: "Obsequious means obedient or attentive to an excessive degree." },
  { q: "Find the error: 'Hardly had I reached the station when the train left.'", o: ["Hardly had I", "reached the station", "when the train", "No Error"], a: 3, exp: "'Hardly... when' is the correct correlative conjunction pair." }
];

// --- QUANTITATIVE GENERATOR (Adaptive Difficulty) ---
const generateQuant = (level) => {
  const seed = Math.random();
  let qData = {};

  if (level <= 15) {
    // --- TIER 1: BASICS ---
    if (seed < 0.33) { // Percentages
      const base = (Math.floor(Math.random() * 50) + 1) * 10;
      const pct = (Math.floor(Math.random() * 5) + 1) * 10;
      const ans = (base * pct) / 100;
      qData = { q: `What is ${pct}% of ${base}?`, ans: ans, exp: `(${base} * ${pct}) / 100 = ${ans}` };
    } else if (seed < 0.66) { // Averages
      const n1 = Math.floor(Math.random() * 20) + 10;
      const n2 = n1 + Math.floor(Math.random() * 10);
      const n3 = n2 + Math.floor(Math.random() * 10);
      const ans = (n1 + n2 + n3) / 3;
      qData = { q: `Average of ${n1}, ${n2}, and ${n3}?`, ans: ans.toFixed(1), exp: `(${n1}+${n2}+${n3})/3` };
    } else { // Simple Series
      const start = Math.floor(Math.random() * 10);
      const diff = Math.floor(Math.random() * 5) + 2;
      qData = { q: `Next in series: ${start}, ${start+diff}, ${start+(diff*2)}...`, ans: start+(diff*3), exp: `Arithmetic progression (+${diff}).` };
    }
  } 
  else if (level <= 35) {
    // --- TIER 2: INTERMEDIATE ---
    if (seed < 0.33) { // Compound Interest (Rupees)
      const P = 1000 * (Math.floor(Math.random() * 5) + 1);
      const R = 10; 
      const T = 2; 
      const amount = P * Math.pow((1 + R/100), T);
      const CI = amount - P;
      qData = { q: `Find Compound Interest on ₹${P} at ${R}% for ${T} years.`, ans: `₹${CI}`, exp: `CI = P(1+R/100)^t - P` };
    } else if (seed < 0.66) { // Profit & Loss (Rupees)
        const cp = (Math.floor(Math.random() * 10) + 1) * 100;
        const profitPct = 10 + Math.floor(Math.random() * 20);
        const sp = cp + (cp * profitPct / 100);
        qData = { q: `Cost Price = ₹${cp}, Profit = ${profitPct}%. Selling Price?`, ans: `₹${sp}`, exp: `Profit = ${profitPct}% of ₹${cp}. SP = CP + Profit.` };
    } else { // Relative Speed
      const d = 100 + (Math.floor(Math.random() * 10) * 10);
      const s1 = 40;
      const s2 = 60; 
      const time = d / (s1 + s2);
      qData = { q: `Two trains ${d}km apart travel towards each other at ${s1}km/h and ${s2}km/h. When do they meet?`, ans: time.toFixed(1) + " hrs", exp: `Relative Speed = ${s1}+${s2}. Time = Dist/Speed` };
    }
  } 
  else {
    // --- TIER 3: EXPERT ---
    if (seed < 0.33) { // Permutations
      const wordLen = 4 + Math.floor(Math.random() * 3); 
      const fact = (n) => n <= 1 ? 1 : n * fact(n - 1);
      const ans = fact(wordLen);
      qData = { q: `In how many ways can ${wordLen} distinct books be arranged?`, ans: ans, exp: `${wordLen}! (Factorial)` };
    } else if (seed < 0.66) { // Probability
      const red = Math.floor(Math.random() * 3) + 3;
      const blue = Math.floor(Math.random() * 3) + 3;
      const total = red + blue;
      qData = { q: `Bag has ${red} Red, ${blue} Blue balls. Probability of drawing Red?`, ans: `${red}/${total}`, exp: `Favorable (${red}) / Total (${total})` };
    } else { // Mensuration
      const r = Math.floor(Math.random() * 5) + 2;
      const h = 10;
      const vol = (Math.PI * r * r * h).toFixed(0);
      qData = { q: `Volume of cylinder with radius ${r} and height ${h}? (approx)`, ans: vol, exp: `πr²h` };
    }
  }

  // Generate wrong options logic
  const correctStr = qData.ans.toString().replace('₹', '');
  const isCurrency = qData.ans.toString().includes('₹');
  const options = [qData.ans.toString()];
  
  while (options.length < 4) {
    let wrong;
    if (!isNaN(parseFloat(correctStr))) {
      const val = parseFloat(correctStr);
      const offset = val * (0.1 + Math.random() * 0.2); 
      const wrongVal = (Math.random() > 0.5 ? val + offset : val - offset).toFixed(correctStr.includes('.') ? 2 : 0);
      wrong = isCurrency ? `₹${wrongVal}` : wrongVal.toString();
      
      if (!options.includes(wrong)) options.push(wrong);
    } else {
      options.push("Cannot Determine", "None of these", "0");
      break;
    }
  }

  return {
    q: qData.q,
    o: options.sort(() => 0.5 - Math.random()),
    realAns: qData.ans.toString(),
    exp: qData.exp
  };
};

// --- LOGICAL GENERATOR ---
const generateLogical = (level) => {
  const seed = Math.random();
  let qData = {};

  if (level <= 15) {
    const shift = Math.floor(Math.random() * 3) + 1;
    qData = { q: `If A=${1+shift}, B=${2+shift}, then CAT = ?`, ans: (3+shift + 1+shift + 20+shift), exp: `Each letter value shifted by +${shift}.` };
  } 
  else if (level <= 35) {
    qData = { q: "Pointing to a photo, X said 'She is the daughter of my grandfather's only son'. How is she related to X?", ans: "Sister", exp: "Grandfather's only son is Father. Father's daughter is Sister." };
  } 
  else {
    qData = { q: "Statement: All A are B. No B is C. Conclusion: Some A are C?", ans: "False", exp: "Since No B is C and all A are inside B, A cannot touch C." };
  }

  let opts = [qData.ans.toString()];
  if (!isNaN(qData.ans)) {
    opts.push((qData.ans + 5).toString(), (qData.ans - 2).toString(), (qData.ans * 2).toString());
  } else {
    if (qData.ans === "Sister") opts.push("Mother", "Aunt", "Cousin");
    if (qData.ans === "False") opts.push("True", "Maybe", "Data Inadequate");
  }

  return {
    q: qData.q,
    o: opts.sort(() => 0.5 - Math.random()),
    realAns: qData.ans.toString(),
    exp: qData.exp
  };
};

// --- VISUAL/ABSTRACT GENERATOR ---
const generateVisual = (level) => {
    const shapes = ["Circle", "Triangle", "Square", "Pentagon", "Hexagon"];
    
    if (level < 25) {
        const start = Math.floor(Math.random() * 3);
        return {
            q: `Series: ${shapes[start]} -> ${shapes[start+1]} -> ${shapes[start+2]} -> ?`,
            o: [shapes[start+3] || "Heptagon", shapes[start], "Line", "Dot"],
            realAns: shapes[start+3] || "Heptagon",
            exp: "Sides are increasing by 1."
        };
    } else {
        return {
            q: "Matrix: Row 1 [2, 4, 8]. Row 2 [3, 9, 27]. Row 3 [4, 16, ?]",
            o: ["64", "32", "20", "48"],
            realAns: "64",
            exp: "Logic is x, x^2, x^3. 4^3 = 64."
        };
    }
}

// --- MAIN EXPORT ---
export const getQuestionsForLevel = (levelId) => {
  const questions = [];
  
  // Distribution for 15 Questions:
  // 0-5 (6): Quant
  // 6-11 (6): Logical
  // 12-14 (3): Verbal/Visual Mix
  
  for (let i = 0; i < 15; i++) {
    let raw;
    let category;
    
    if (i < 6) { 
      raw = generateQuant(levelId); 
      category = "Quantitative";
    } 
    else if (i < 12) { 
      raw = generateLogical(levelId);
      category = "Logical Reasoning";
    }
    else {
      // Verbal / Visual
      if (Math.random() > 0.5) {
          const bank = levelId > 20 ? VOCAB_HARD : VOCAB_EASY;
          raw = bank[i % bank.length];
          raw.realAns = raw.o[raw.a];
          category = "Verbal Ability";
      } else {
          raw = generateVisual(levelId);
          category = "Abstract Reasoning";
      }
    }

    let correctIndex = raw.o.findIndex(opt => opt == raw.realAns);
    if (correctIndex === -1) {
        raw.o[0] = raw.realAns;
        correctIndex = 0;
    }

    questions.push({
      id: `apt_${levelId}_${i}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      category,
      question: raw.q,
      options: raw.o,
      correctAnswer: correctIndex,
      explanation: raw.exp
    });
  }
  return questions;
};