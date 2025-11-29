// src/lib/aptitudeData.js

// --- CONFIGURATION ---
export const LEVELS = Array.from({ length: 50 }, (_, i) => {
  const num = i + 1;
  return {
    id: num,
    name: `Level ${num}`,
    difficulty: num <= 10 ? 'Beginner' : num <= 25 ? 'Easy' : num <= 40 ? 'Medium' : 'Hard',
    requiredScore: Math.min(60 + (i * 0.5), 90), // Passing score increases slightly
    questionsCount: 25, 
    timeLimit: Math.max(600, 1500 - (i * 15)), // Time reduces as levels go up
  };
});

// --- STATIC DATA BANKS (Verbal & Visual remain static but rotated) ---
const VERBAL_BANK = [
  { q: "Synonym of: ABANDON", o: ["Keep", "Cherish", "Forsake", "Join"], a: 2, exp: "Abandon means to leave or forsake." },
  { q: "Antonym of: BRAVE", o: ["Cowardly", "Bold", "Strong", "Heroic"], a: 0, exp: "Cowardly is the opposite of Brave." },
  { q: "Find the error: 'He do not like to play cricket.'", o: ["He", "do not", "like to", "play cricket"], a: 1, exp: "It should be 'does not' for singular subjects." },
  { q: "Idiom: 'Break the ice'", o: ["Break a window", "Start a conversation", "End a friendship", "Feel cold"], a: 1, exp: "To initiate social interaction." },
  { q: "One word for: 'A person who loves books'", o: ["Bibliophile", "Philanthropist", "Misogynist", "Somnambulist"], a: 0, exp: "Bibliophile means book lover." },
  { q: "Analogy -> Doctor : Hospital :: Teacher : ?", o: ["School", "Court", "Office", "Field"], a: 0, exp: "Teacher works in a school." },
  { q: "Spelling: Choose correct.", o: ["Recieve", "Receive", "Riceive", "Receeve"], a: 1, exp: "'I' before 'E' except after 'C'." },
  { q: "Synonym of: VIVID", o: ["Dull", "Bright", "Weak", "Boring"], a: 1, exp: "Vivid means strong, bright, or intense." },
  { q: "Antonym of: ARTIFICIAL", o: ["Natural", "Red", "Solid", "Fake"], a: 0, exp: "Natural is the opposite of made by humans." },
  { q: "Idiom: 'Piece of cake'", o: ["Tasty", "Hard", "Easy", "Expensive"], a: 2, exp: "Something very easy to do." }
];

const VISUAL_BANK = [
  { q: "Odd one out: [Square, Rectangle, Rhombus, Circle]", o: ["Square", "Rectangle", "Rhombus", "Circle"], a: 3, exp: "Circle has no straight lines/corners." },
  { q: "Pattern: arrow UP, arrow RIGHT, arrow DOWN, ...", o: ["LEFT", "UP", "RIGHT", "DOWN"], a: 0, exp: "Rotating 90 degrees clockwise." },
  { q: "Dice: If 1 is top, what is bottom (Standard)?", o: ["6", "5", "2", "3"], a: 0, exp: "Opposite sides sum to 7. 7-1=6." },
  { q: "Mirror Image of 'b'", o: ["d", "p", "q", "b"], a: 0, exp: "Lateral inversion turns b into d." },
  { q: "Pattern: Triangle (3), Square (4), Pentagon (5), ...", o: ["Hexagon", "Heptagon", "Octagon", "Circle"], a: 0, exp: "Sides increase by 1. Next is 6 sides." },
  { q: "Water Image of 'A'", o: ["V", "A", "Upside down A", "C"], a: 2, exp: "Inverts vertically." },
  { q: "How many corners in a Cube?", o: ["6", "8", "10", "12"], a: 1, exp: "A cube has 8 vertices." },
  { q: "Shape inside Shape: Circle in Square. Next?", o: ["Square in Circle", "Triangle", "Line", "Dot"], a: 0, exp: "Logic implies inversion of container." }
];

// --- HARDER GENERATORS (Aggressive Scaling) ---
const generateQuant = (level) => {
  const type = Math.floor(Math.random() * 5);
  // Scaling Factor: Level 1 = 1x, Level 50 = 25x difficulty
  const difficultyMultiplier = Math.ceil(level / 2); 
  
  if (type === 0) { // Percentages
    const base = (Math.floor(Math.random() * 20) + 1) * 10 * difficultyMultiplier;
    const pct = (Math.floor(Math.random() * 9) + 1) * 5; // 5%, 10%, 15%...
    const ans = (base * pct) / 100;
    
    // Add noise to options based on difficulty
    const noise = difficultyMultiplier > 10 ? 0.5 : 5;
    
    return { 
      q: `What is ${pct}% of ${base}?`, 
      o: [`${ans}`, `${ans + noise}`, `${ans - noise}`, `${ans * 2}`].sort(() => 0.5 - Math.random()), 
      a: -1, // We calculate index below
      realAns: `${ans}`,
      exp: `${pct}/100 * ${base} = ${ans}` 
    };
  } 
  else if (type === 1) { // Speed
    const s = (Math.floor(Math.random() * 10) + 2) * 10 + (level * 2);
    const t = Math.floor(Math.random() * 5) + 1;
    const d = s * t;
    return { 
      q: `A car travels at ${s} km/hr for ${t} hours. How much distance does it cover?`, 
      o: [`${d} km`, `${d + 10} km`, `${d - 5} km`, `${d * 2} km`].sort(() => 0.5 - Math.random()), 
      a: -1,
      realAns: `${d} km`,
      exp: `Distance = Speed × Time = ${s} × ${t} = ${d} km` 
    };
  }
  else if (type === 2) { // Series (Arithmetic/Geometric)
    const start = Math.floor(Math.random() * 20);
    const diff = Math.floor(Math.random() * 5) + 2 + Math.floor(level / 5);
    const isGeo = level > 25 && Math.random() > 0.5; // Geometric series for hard levels
    
    let series, next, exp;
    if(isGeo) {
      const ratio = 2;
      series = [start || 1, (start||1)*ratio, (start||1)*ratio*ratio];
      next = (start||1)*ratio*ratio*ratio;
      exp = `Geometric series with ratio ${ratio}.`;
    } else {
      series = [start, start + diff, start + diff * 2];
      next = start + diff * 3;
      exp = `Arithmetic series increasing by ${diff}.`;
    }

    return { 
      q: `Complete the series: ${series.join(', ')}, ...`, 
      o: [`${next}`, `${next + diff}`, `${next - 1}`, `${next * 2}`].sort(() => 0.5 - Math.random()), 
      a: -1,
      realAns: `${next}`,
      exp: exp 
    };
  }
  else if (type === 3) { // Profit Loss
    const cp = (Math.floor(Math.random() * 10) + 1) * 100 * difficultyMultiplier;
    const profitPct = 10 + Math.floor(Math.random() * 20);
    const sp = cp + (cp * profitPct / 100);
    const p = sp - cp;
    return { 
      q: `Cost Price = ${cp}, Profit = ${profitPct}%. What is the Selling Price?`, 
      o: [`${sp}`, `${sp + 100}`, `${cp}`, `${p}`].sort(() => 0.5 - Math.random()), 
      a: -1,
      realAns: `${sp}`,
      exp: `Profit = ${profitPct}% of ${cp} = ${p}. SP = CP + Profit = ${sp}` 
    };
  }
  else { // Work (Harder for higher levels)
    const A = 10 + Math.floor(level/5); 
    const B = 15 + Math.floor(level/5);
    // Approximate for simple display, or use simple numbers logic
    const combined = (A*B)/(A+B); 
    const niceCombined = combined.toFixed(2);
    
    return { 
      q: `A does a job in ${A} days, B in ${B} days. Approximately how long together?`, 
      o: [`${niceCombined} days`, `${A+B} days`, `${(A+B)/2} days`, `1 day`].sort(() => 0.5 - Math.random()), 
      a: -1,
      realAns: `${niceCombined} days`,
      exp: `Formula: (A × B) / (A + B) = (${A}×${B})/(${A}+${B}) ≈ ${niceCombined}` 
    };
  }
};

const generateLogical = (level) => {
  const type = Math.floor(Math.random() * 3);
  if (type === 0) {
    const shift = 1 + Math.floor(level / 10);
    return { 
      q: `If A=${1+shift}, B=${2+shift}... then CAT = ? (Shift +${shift})`, 
      o: [`${3+1+20 + (3*shift)}`, "24", "50", "100"], 
      a: 0, 
      exp: `Each letter value is shifted by ${shift}.` 
    };
  } else if (type === 1) {
    return { q: "Pointing to a man, girl says 'He is my uncle'. Relation?", o: ["Uncle", "Brother", "Father", "Son"], a: 0, exp: "Direct statement." };
  } else {
    return { q: "North -> Right -> Right -> Left. Direction?", o: ["East", "South", "West", "North"], a: 0, exp: "North+90+90-90 = East." };
  }
};

// --- MAIN EXPORT ---
export const getQuestionsForLevel = (levelId) => {
  const questions = [];
  
  for (let i = 0; i < 25; i++) {
    let raw;
    let category;
    
    if (i < 7) { 
      raw = generateQuant(levelId); 
      category = "Quantitative";
    } 
    else if (i < 13) { 
      raw = generateLogical(levelId);
      category = "Logical";
    }
    else if (i < 19) {
      raw = VERBAL_BANK[i % VERBAL_BANK.length];
      category = "Verbal";
    }
    else {
      raw = VISUAL_BANK[i % VISUAL_BANK.length];
      category = "Visual";
    }

    // Fix for randomized options: Find the index of the correct answer
    let correctIndex = raw.a;
    if (raw.a === -1) {
       correctIndex = raw.o.findIndex(opt => opt === raw.realAns);
    }

    questions.push({
      id: `apt_${levelId}_${i}_${Date.now()}`,
      category,
      question: raw.q,
      options: raw.o,
      correctAnswer: correctIndex,
      explanation: raw.exp
    });
  }
  return questions;
};