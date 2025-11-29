// src/lib/dsaData.js

// ==========================================
// 1. TOPIC MAP (The Syllabus)
// ==========================================
const getTopicForLevel = (level) => {
  if (level <= 5) return "Basics: Loops & Conditions";
  if (level <= 10) return "Basics: Functions & Pointers";
  if (level <= 15) return "Arrays: Searching"; // Linear/Binary Search
  if (level <= 20) return "Arrays: Sorting"; // Bubble, Merge, Quick
  if (level <= 25) return "Strings & Pattern Matching";
  if (level <= 30) return "Linked Lists";
  if (level <= 35) return "Stacks & Queues";
  if (level <= 40) return "Trees & BST";
  if (level <= 45) return "Graphs & Hashing";
  return "Dynamic Programming & Greedy"; // 46-50
};

export const DSA_LEVELS = Array.from({ length: 50 }, (_, i) => {
  const num = i + 1;
  const topic = getTopicForLevel(num);
  let difficulty = 'Beginner';
  if (num > 10) difficulty = 'Easy';
  if (num > 25) difficulty = 'Medium';
  if (num > 40) difficulty = 'Hard';

  return {
    id: num,
    name: `Lvl ${num}`,
    topic: topic, 
    difficulty,
    requiredScore: 60,
    questionsCount: 25,
    timeLimit: 1200, 
  };
});

// ==========================================
// 2. QUESTION BANK (Organized by Topics)
// ==========================================

const BANKS = {
  basics: [
    { q: "What is the output?", code: "int a=5; print(a++); print(a);", o: ["5 6", "6 6", "5 5", "6 5"], a: 0, exp: "Post-increment prints current value (5) then increments to 6." },
    { q: "Correct way to declare a pointer?", code: "", o: ["int *ptr;", "int ptr;", "pointer int;", "int &ptr;"], a: 0, exp: "Asterisk (*) denotes a pointer." },
    { q: "Time complexity of accessing array index?", code: "arr[5]", o: ["O(1)", "O(N)", "O(logN)", "O(N^2)"], a: 0, exp: "Array access is constant time." },
    { q: "What handles 'true' or 'false' values?", o: ["bool", "int", "char", "void"], a: 0, exp: "Boolean data type stores logical values." }
  ],
  arrays: [
    { q: "Best case complexity of Bubble Sort?", o: ["O(N)", "O(N^2)", "O(logN)", "O(1)"], a: 0, exp: "O(N) occurs when the array is already sorted." },
    { q: "Binary Search requires the array to be?", o: ["Sorted", "Unsorted", "Large", "Small"], a: 0, exp: "Binary search relies on sorted order to divide space." },
    { q: "Identify the algorithm:", code: "for(i=0; i<N; i++) \n for(j=0; j<N-i-1; j++) \n  if(arr[j] > arr[j+1]) swap...", o: ["Bubble Sort", "Quick Sort", "Merge Sort", "Insertion Sort"], a: 0, exp: "Nested loops comparing adjacent elements is Bubble Sort." },
    { q: "Which finding algorithm is O(N)?", o: ["Linear Search", "Binary Search", "Hash Search", "Sort"], a: 0, exp: "Linear search checks every element." }
  ],
  strings: [
    { q: "Logic to check Palindrome?", code: "racecar", o: ["Read forward == backward", "Sort letters", "Check length", "Remove vowels"], a: 0, exp: "A palindrome reads the same forwards and backwards." },
    { q: "Anagram of 'listen'?", o: ["silent", "list", "tinsel", "enlist"], a: 0, exp: "Anagrams contain the exact same letters." },
    { q: "ASCII value of 'A'?", o: ["65", "97", "48", "1"], a: 0, exp: "Standard ASCII for uppercase A is 65." }
  ],
  linkedlist: [
    { q: "Last node of Linked List points to?", o: ["NULL", "Head", "Previous", "Random"], a: 0, exp: "The tail node points to NULL to signify end." },
    { q: "Finding a cycle uses which approach?", o: ["Fast/Slow Pointers", "Binary Search", "Sorting", "Stack"], a: 0, exp: "Floyd's Cycle Detection uses two pointers moving at different speeds." },
    { q: "Complexity to insert at Head?", o: ["O(1)", "O(N)", "O(logN)", "O(N^2)"], a: 0, exp: "Updating head pointer is constant time." }
  ],
  stacks: [
    { q: "Stack follows which principle?", o: ["LIFO", "FIFO", "LILO", "Random"], a: 0, exp: "Last In, First Out." },
    { q: "Convert Infix (A+B) to Postfix?", o: ["AB+", "+AB", "A+B", "BA+"], a: 0, exp: "Operator comes after operands in Postfix." },
    { q: "Valid Parentheses check uses?", o: ["Stack", "Queue", "Array", "Tree"], a: 0, exp: "Push open brackets, pop on closed brackets." }
  ],
  trees: [
    { q: "Max nodes in binary tree of height H?", o: ["2^H - 1", "2*H", "H^2", "H!"], a: 0, exp: "Formula for full binary tree nodes." },
    { q: "Traversal: Left -> Root -> Right?", o: ["Inorder", "Preorder", "Postorder", "Level Order"], a: 0, exp: "Inorder traversal visits root in the middle." },
    { q: "BST Property?", o: ["Left < Root < Right", "Left > Root > Right", "Random", "Left = Right"], a: 0, exp: "Binary Search Tree ordering property." }
  ],
  graphs: [
    { q: "BFS uses which data structure?", o: ["Queue", "Stack", "Array", "Heap"], a: 0, exp: "Breadth-First Search uses a Queue." },
    { q: "DFS uses which data structure?", o: ["Stack/Recursion", "Queue", "Map", "Set"], a: 0, exp: "Depth-First Search uses a Stack or Recursion." },
    { q: "Dijkstra's Algorithm finds?", o: ["Shortest Path", "MST", "Cycles", "Flow"], a: 0, exp: "Shortest path in weighted graphs." }
  ],
  dp: [
    { q: "Fibonacci Logic using DP?", o: ["Save previous results", "Re-calculate everything", "Random guess", "Greedy"], a: 0, exp: "Memoization/Tabulation stores results to avoid re-work." },
    { q: "Knapsack Problem type?", o: ["Optimization", "Sorting", "Searching", "String"], a: 0, exp: "Finding max value within weight limit." },
    { q: "Complexity of merge sort?", o: ["O(N log N)", "O(N^2)", "O(N)", "O(1)"], a: 0, exp: "Divide and conquer split is logN, merge is N." }
  ]
};

// ==========================================
// 3. HARD MODE GENERATOR
// ==========================================

const generateLogicCode = (topic, level) => {
  const complexity = Math.floor(level / 10); // Increases every 10 levels
  
  if (complexity < 2) {
    // Simple Loop/If (Levels 1-19)
    const val = Math.floor(Math.random() * 10) + 1;
    return {
      q: `What is the output?`,
      code: `int x = ${val};\nif(x > 5) print(x*2);\nelse print(x+1);`,
      o: [`${val > 5 ? val*2 : val+1}`, `${val}`, "Error", "0"],
      a: 0,
      exp: "Basic conditional check.",
      cat: "Logic Trace"
    };
  } else {
    // Nested Loops (Levels 20-50)
    const limit = 3 + Math.floor(Math.random() * 3);
    return {
      q: `How many times does 'Hi' print?`,
      code: `for(int i=0; i<${limit}; i++) {\n  for(int j=0; j<${limit}; j++) {\n    print("Hi");\n  }\n}`,
      o: [`${limit*limit}`, `${limit}`, `${limit+limit}`, "Infinite"],
      a: 0,
      exp: `Nested loops run Outer x Inner times (${limit} * ${limit}).`,
      cat: "Complexity Trace"
    };
  }
};

// ==========================================
// 4. MAIN EXPORT
// ==========================================

export const getDSAQuestions = (levelId) => {
  const questions = [];
  const topicName = getTopicForLevel(levelId);
  
  let bank = BANKS.basics; 
  if (topicName.includes("Array")) bank = BANKS.arrays;
  if (topicName.includes("Strings")) bank = BANKS.strings;
  if (topicName.includes("Linked")) bank = BANKS.linkedlist;
  if (topicName.includes("Stacks")) bank = BANKS.stacks;
  if (topicName.includes("Trees")) bank = BANKS.trees;
  if (topicName.includes("Graphs")) bank = BANKS.graphs;
  if (topicName.includes("Dynamic")) bank = BANKS.dp;

  for (let i = 0; i < 25; i++) {
    let qData;
    
    // Mix 70% Static Topic Questions, 30% Dynamic Logic
    if (i % 3 !== 0) {
      const raw = bank[i % bank.length];
      qData = { ...raw }; 
    } else {
      // PASS levelId HERE FOR SCALING DIFFICULTY
      qData = generateLogicCode(topicName, levelId); 
    }

    questions.push({
      id: `dsa_${levelId}_${i}_${Date.now()}`,
      category: topicName,
      question: qData.q,
      code: qData.code, 
      options: qData.o,
      correctAnswer: qData.a,
      explanation: qData.exp
    });
  }

  return questions;
};