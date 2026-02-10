// Stubbed out - questions moved to backend. Keep minimal exports to avoid import errors.
export const DSA_LEVELS = [];
export const getDSAQuestions = (levelId) => [];

  const topic = getTopicForLevel(num);
  let difficulty = 'Beginner';
  if (num > 10) difficulty = 'Easy';
  if (num > 25) difficulty = 'Medium';
  if (num > 40) difficulty = 'Hard';

  return {
    id: num,
    name: `DSA Level ${num}`,
    topic: topic, 
    difficulty,
    requiredScore: Math.min(60 + i, 85),
    questionsCount: 15, // CHANGED TO 15
    timeLimit: 900 + (num * 10), 
  };
});

// ==========================================
// 2. QUESTION BANKS (Organized by Topics)
// ==========================================

const BANKS = {
  basics: [
    { q: "What is the result of 5 ^ 3 (XOR)?", code: "5 (101) ^ 3 (011)", o: ["6 (110)", "2", "8", "15"], a: 0, exp: "XOR returns 1 if bits are different. 101 ^ 011 = 110 (6)." },
    { q: "Output of this loop?", code: "for(int i=0; i<5; i+=2) print(i);", o: ["0 2 4", "0 1 2 3 4", "0 2", "Infinite"], a: 0, exp: "Steps by 2: 0, then 2, then 4. Next is 6 which fails i<5." },
    { q: "Complexity of sum 1 to N?", code: "for(i=1; i<=N; i++) sum+=i;", o: ["O(N)", "O(1)", "O(logN)", "O(N^2)"], a: 0, exp: "Loop runs N times." }
  ],
  pointers: [
    { q: "What does `*ptr` access?", o: ["Value at address", "Memory Address", "Next pointer", "Null"], a: 0, exp: "Dereferencing operator (*) gets the value stored at the pointer's address." },
    { q: "Size of an integer pointer on 64-bit system?", o: ["8 bytes", "4 bytes", "2 bytes", "16 bytes"], a: 0, exp: "Pointers store addresses. On 64-bit systems, addresses are 64-bit (8 bytes)." },
    { q: "Output?", code: "int arr[]={10,20}; int *p=arr; print(*(p+1));", o: ["20", "10", "Garbage", "Error"], a: 0, exp: "p points to 10. p+1 points to 20. *(p+1) gives 20." }
  ],
  arrays: [
    { q: "Binary Search precondition?", o: ["Array must be Sorted", "Array size > 100", "No duplicates", "Integers only"], a: 0, exp: "Binary search relies on dividing a sorted range." },
    { q: "Worst case of Quicksort?", o: ["O(N^2)", "O(N log N)", "O(N)", "O(1)"], a: 0, exp: "Occurs when pivot is always the smallest or largest element (already sorted)." },
    { q: "Kadane's Algorithm finds?", o: ["Max Subarray Sum", "Longest Substring", "Shortest Path", "Cycle"], a: 0, exp: "Standard algorithm for Maximum Subarray Sum problem." }
  ],
  recursion: [
    { q: "Base case for Factorial?", code: "int fact(n)", o: ["if (n<=1) return 1;", "if (n==0) return 0;", "if (n<0) return;", "None"], a: 0, exp: "Factorial of 0 or 1 is 1. Without this, infinite recursion occurs." },
    { q: "Towers of Hanoi complexity?", o: ["O(2^N)", "O(N^2)", "O(N log N)", "O(N!)"], a: 0, exp: "Each step doubles the moves required." },
    { q: "Tail Recursion optimization?", o: ["Saves Stack Space", "Runs slower", "Uses Heap", "No benefit"], a: 0, exp: "Compiler can reuse the current stack frame, preventing stack overflow." }
  ],
  linkedlist: [
    { q: "Floyd's Cycle Detection uses?", o: ["Slow & Fast Pointers", "Hashing", "DFS", "Recursion"], a: 0, exp: "Tortoise and Hare algorithm." },
    { q: "Reverse Linked List time complexity?", o: ["O(N)", "O(N log N)", "O(1)", "O(N^2)"], a: 0, exp: "Iterative reversal visits each node once." },
    { q: "Insert at end of Doubly LL?", o: ["O(1) if Tail known", "O(N)", "O(log N)", "O(1) always"], a: 0, exp: "If we have a tail pointer, it is constant time." }
  ],
  trees: [
    { q: "Max nodes in Binary Tree height H?", o: ["2^H - 1", "2*H", "H^2", "H!"], a: 0, exp: "Geometric progression sum formula." },
    { q: "BST Left Child is always?", o: ["Smaller than Root", "Larger than Root", "Equal to Root", "Random"], a: 0, exp: "BST Property: Left < Root < Right." },
    { q: "Lowest Common Ancestor (LCA) complexity?", o: ["O(H)", "O(N^2)", "O(1)", "O(log N)"], a: 0, exp: "Depends on height of tree." }
  ],
  graphs: [
    { q: "BFS uses which structure?", o: ["Queue", "Stack", "Heap", "Array"], a: 0, exp: "Queue is used for level-order traversal." },
    { q: "Detect cycle in Directed Graph?", o: ["DFS + Recursion Stack", "BFS", "Union Find", "Prim's"], a: 0, exp: "If we encounter a node currently in the recursion stack, there is a cycle." },
    { q: "Dijkstra's Algorithm fails for?", o: ["Negative Weight Edges", "Cycles", "Weighted Graphs", "Trees"], a: 0, exp: "Negative edges can cause infinite loops or incorrect shortest paths." }
  ],
  dp: [
    { q: "0/1 Knapsack Approach?", o: ["Dynamic Programming", "Greedy", "Divide & Conquer", "Backtracking"], a: 0, exp: "DP is required because Greedy fails for 0/1 constraints." },
    { q: "Longest Common Subsequence (LCS) complexity?", o: ["O(N*M)", "O(N+M)", "O(N log M)", "O(2^N)"], a: 0, exp: "Using a 2D DP table of size N x M." },
    { q: "Difference between DP and Memoization?", o: ["Bottom-up vs Top-down", "Fast vs Slow", "Hard vs Easy", "Same"], a: 0, exp: "DP (Tabulation) is iterative/bottom-up. Memoization is recursive/top-down." }
  ]
};

// ==========================================
// 3. ADVANCED GENERATORS (High Difficulty)
// ==========================================

const generateLogicCode = (level) => {
  // Level 1-20: Simple Puzzles
  if (level <= 20) {
    const a = Math.floor(Math.random() * 10);
    const b = Math.floor(Math.random() * 10);
    return {
      q: "Trace the output:",
      code: `int a=${a}, b=${b};\nif(a > b) a = a-b;\nelse b = b-a;\nprint(a+b);`,
      o: [`${Math.abs(a-b) + (a>b?a-b:b-a) + (a>b?b:a)}`, // Trick option logic, just putting random
          `${(a>b?a-b:a) + (a>b?b:b-a)}`, 
          "0", "Error"],
      a: 1, // Let's simplify: Correct calculation below
      realAns: ((a>b?a-b:a) + (a>b?b:b-a)).toString(), // Actual logic
      exp: "Trace the if/else logic carefully.",
      cat: "Code Trace"
    };
  } 
  // Level 21-50: Complexity & Recursion
  else {
    const depth = Math.floor(level / 10);
    return {
      q: "Estimate Time Complexity:",
      code: `void solve(n) {\n  if(n<=1) return;\n  for(i=0; i<n; i++) print(i);\n  solve(n/2);\n}`,
      o: ["O(N)", "O(N log N)", "O(log N)", "O(N^2)"],
      a: 0,
      exp: "Recurrence: T(N) = T(N/2) + O(N). This is a Geometric Series summing to O(N).",
      cat: "Big-O Analysis"
    };
  }
};

// ==========================================
// 4. MAIN EXPORT
// ==========================================

export const getDSAQuestions = (levelId) => {
  const questions = [];
  const topicName = getTopicForLevel(levelId);
  
  // Select Bank based on keyword matching
  let bank = BANKS.basics; 
  if (topicName.includes("Pointers")) bank = BANKS.pointers;
  if (topicName.includes("Array") || topicName.includes("Strings")) bank = BANKS.arrays;
  if (topicName.includes("Recursion")) bank = BANKS.recursion;
  if (topicName.includes("Linked")) bank = BANKS.linkedlist;
  if (topicName.includes("Trees") || topicName.includes("Heaps")) bank = BANKS.trees;
  if (topicName.includes("Graphs")) bank = BANKS.graphs;
  if (topicName.includes("Dynamic")) bank = BANKS.dp;

  // Generate strictly 15 questions
  for (let i = 0; i < 15; i++) {
    let qData;
    const seed = Math.random();
    
    // 30% Chance of Procedural Logic Question
    if (seed > 0.7) {
      qData = generateLogicCode(levelId);
      // Fix options if generated dynamically
      if (qData.realAns) {
         qData.o = [qData.realAns, (parseInt(qData.realAns)+2).toString(), "0", "10"];
         qData.a = 0;
      }
    } else {
      // 70% Topic Specific
      const raw = bank[i % bank.length];
      qData = { ...raw }; 
    }

    questions.push({
      id: `dsa_${levelId}_${i}_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      category: topicName,
      question: qData.q,
      code: qData.code, 
      options: qData.o.sort(() => 0.5 - Math.random()),
      correctAnswer: 0, // Options shuffled above, but logic requires tracking. 
                        // Simplified: Since options shuffled, we need to find correct index.
                        // For static, 'a' is index in original 'o'.
      explanation: qData.exp
    });
    
    // Fix correct Answer Index after shuffle
    const correctOpt = qData.o[qData.a]; // The correct string from original
    // Find where it moved to
    questions[i].correctAnswer = questions[i].options.indexOf(correctOpt);
    // Fallback if index lost (shouldn't happen)
    if (questions[i].correctAnswer === -1) {
        questions[i].options[0] = correctOpt;
        questions[i].correctAnswer = 0;
    }
  }

  return questions;
};