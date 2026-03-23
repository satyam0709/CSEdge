/**Run: node scripts/seedCourses.js**/

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Course from "../models/course.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const yt = (videoId) => `https://www.youtube.com/embed/${videoId}`;
let globalLectureOrder = 1;
const lec = (id, title, duration, isFree = false) => ({
  lectureId: `lec_${id}`,
  lectureTitle: title,
  lectureDuration: duration,
  lectureUrl: yt(id),
  isPreviewFree: isFree,
  lectureOrder: globalLectureOrder++,
});


const striverA2Z = {
  courseTitle: "Striver's A2Z DSA Course — Complete by takeUforward",
  courseDescription: `<p>The most in-depth, structured, and free DSA course by
    <strong>Raj Vikramaditya (Striver)</strong> — Ex Google, Amazon engineer
    and founder of takeUforward. Covers 450+ problems across 14 steps.</p>
    <p><strong>Topics:</strong> Arrays, Binary Search, Binary Trees, BST,
    Graphs, Dynamic Programming, LinkedList, Stacks, Queues, Sliding Window,
    Greedy — all patterns from basics to FAANG level.</p>`,
  courseThumbnail: "https://img.youtube.com/vi/EAR7De6Goz4/maxresdefault.jpg",
  coursePrice:      0,
  discount:         0,
  isPublished:      true,
  educator:         "admin",
  enrolledStudents: [],
  courseRatings:    [],
  courseContent: [
 
    // ── STEP 1: Learn the Basics ─────────────────────────────────────────────
    {
      chapterId: "ch_str_01",
      chapterOrder: 1,
      chapterTitle: "Step 1 – Learn the Basics (C++, Patterns, STL, Maths, Recursion, Hashing, Sorting, Arrays Easy)",
      chapterContent: [
        lec("0bHoB32fuj0", "Introduction — Don't miss this before starting", 5, true),
        lec("h3uDCJ5mvgw", "Setup VS Code for DSA | Input/Output split format", 10, true),
        lec("EAR7De6Goz4", "C++ Basics in One Shot — L1", 60, true),
        lec("FPu9Uld7W-E", "Time and Space Complexity", 45, true),
        lec("tNm_NNSB3_w", "Solve Any Pattern Question — 22 Patterns in 1 Shot", 75),
        lec("RRVYpIET_RU", "Complete C++ STL in 1 Video", 60),
        lec("1xNbjMdbjug", "Basic Maths for DSA | Euclidean Algorithm", 50),
        lec("yVdKa8dnKiE", "Recursion 1 — Introduction to Recursion | Recursion Tree | Stack Space", 35),
        lec("un6PLygfXrA", "Recursion 2 — Problems on Recursion", 30),
        lec("69ZCDFy-OUo", "Recursion 3 — Parameterised and Functional Recursion", 35),
        lec("twuC1F6gLI8", "Recursion 4 — Problems on Functional Recursion", 30),
        lec("kvRjNm4rVBE", "Recursion 5 — Multiple Recursion Calls | Problems", 30),
        lec("KEs5UyBJ39g", "Hashing | Maps | Time Complexity | Collisions | Division Rule", 45),
        lec("HGk_ypEuS24", "Sorting Part 1 — Selection Sort, Bubble Sort, Insertion Sort", 40),
        lec("ogjf7ORKfd8", "Merge Sort — Algorithm | Pseudocode | Dry Run | Code", 45),
        lec("WIrA4YexLRQ", "Quick Sort for Beginners", 40),
        lec("37E9ckMDdTk", "Arrays — Find Second Largest | Remove Duplicates from Sorted Array", 25),
        lec("wvcQg43_V8U", "Arrays — Rotate by K | Union & Intersection | Move Zeros to End", 35),
        lec("bYWLJb3vCWY", "Arrays — Single Element | Missing Number | Max Consecutive 1s", 30),
        lec("frf7qxiN2qU", "Arrays — Longest Subarray with Sum K | Generate Subarrays", 35),
        lec("UXDSeD9mN-k", "Arrays — 2 Sum Problem | Brute Better Optimal", 30),
        lec("tp8JIuCXBaU", "Arrays — Sort 0s 1s 2s | Dutch National Flag", 30),
        lec("nP_ns3uSh80", "Arrays — Majority Element I | Moore's Voting Algorithm", 30),
        lec("AHZpyENo7k4", "Arrays — Kadane's Algorithm | Maximum Subarray Sum", 30),
        lec("excAOvwF_Wk", "Arrays — Best Time to Buy and Sell Stock", 25),
        lec("h4aBagy4Uok", "Arrays — Rearrange Elements by Sign", 25),
        lec("JDOXKqF60RQ", "Arrays — Next Permutation | Intuition in Detail", 35),
        lec("cHrH9CQ8pmY", "Arrays — Leaders in an Array | Brute to Optimal", 25),
        lec("oO5uLE7EUlM", "Arrays — Longest Consecutive Sequence | Google Interview", 35),
        lec("N0MgLvceX7M", "Arrays — Set Matrix Zeroes | O(1) Space Approach", 35),
        lec("Z0R2u6gd3GU", "Arrays — Rotate Matrix/Image by 90 Degrees", 30),
      ],
    },
 
    // ── STEP 2: Arrays Medium & Hard ────────────────────────────────────────
    {
      chapterId: "ch_str_02",
      chapterOrder: 2,
      chapterTitle: "Step 2 – Arrays [Medium & Hard] — Spiral, Pascal, 3Sum, 4Sum, Inversions",
      chapterContent: [
        lec("3Zv-s9UUrFM", "Arrays — Spiral Traversal of a Matrix", 25, true),
        lec("xvNwoz-ufXA", "Arrays — Count Subarray Sum Equals K | Brute Better Optimal", 30, true),
        lec("bR7mQgwQ_o8", "Arrays — Pascal's Triangle | Finding nCr in Minimal Time", 35),
        lec("vwZj1K0e9U8", "Arrays — Majority Element II | Brute Better Optimal", 30),
        lec("DhFh8Kw7ymk", "Arrays — 3 Sum | Brute Better Optimal with Codes", 35),
        lec("eD95WRfh81c", "Arrays — 4 Sum | Brute Better Optimal with Codes", 35),
        lec("eZr-6p0B7ME", "Arrays — Number of Subarrays with XOR K", 30),
        lec("IexN60k62jo", "Arrays — Merge Overlapping Intervals | Brute Optimal", 35),
        lec("n7uwj04E0I4", "Arrays — Merge Sorted Arrays Without Extra Space | 2 Solutions", 35),
        lec("2D0D8HE6uak", "Arrays — Find the Missing and Repeating Number | 4 Approaches", 40),
        lec("AseUmwVNaoY", "Arrays — Count Inversions in an Array | Brute Optimal", 35),
        lec("0e4bZaP3MDI", "Arrays — Reverse Pairs | Hard Interview Question", 35),
        lec("hnswaLJvr6g", "Arrays — Maximum Product Subarray | Best Intuitive Approach", 30),
      ],
    },
 
    // ── STEP 3: Binary Search ───────────────────────────────────────────────
    {
      chapterId: "ch_str_03",
      chapterOrder: 3,
      chapterTitle: "Step 3 – Binary Search [1D, Search Space, 2D Arrays]",
      chapterContent: [
        lec("MHf6awe89xw", "BS-1. Binary Search Introduction | Iterative | Recursive | Overflow", 30, true),
        lec("6zhGS79oQ4k", "BS-2. Lower Bound & Upper Bound | Search Insert Position | Floor & Ceil", 35, true),
        lec("hjR1IYVx9lY", "BS-3. First and Last Occurrences | Count Occurrences in Array", 30),
        lec("5qGrJbHhqFs", "BS-4. Search Element in Rotated Sorted Array - I", 35),
        lec("w2G2W8l__pc", "BS-5. Search Element in Rotated Sorted Array II", 30),
        lec("nhEMDKMB44g", "BS-6. Minimum in Rotated Sorted Array", 30),
        lec("jtSiWTPLwd0", "BS-7. Find how many times array has been rotated", 25),
        lec("AZOmHuHadxQ", "BS-8. Single Element in Sorted Array", 25),
        lec("cXxmbemS6XM", "BS-9. Find Peak Element", 30),
        lec("Bsv3FPUX_BA", "BS-10. Finding Sqrt of a Number using Binary Search", 25),
        lec("rjEJeYCasHs", "BS-11. Find the Nth Root of an Integer", 25),
        lec("qyfekrNni90", "BS-12. Koko Eating Bananas", 30),
        lec("TXAuxeYBTdg", "BS-13. Minimum Days to Make M Bouquets", 30),
        lec("UvBKTVaG6U8", "BS-14. Find the Smallest Divisor Given a Threshold", 25),
        lec("MG-Ac4TAvTY", "BS-15. Capacity to Ship Packages within D Days", 30),
        lec("uZ0N_hZpyps", "BS-16. Kth Missing Positive Number | Maths + Binary Search", 25),
        lec("R_Mfw4ew-Vo", "BS-17. Aggressive Cows | Binary Search Hard", 35),
        lec("Z0hwjftStI4", "BS-18. Allocate Books / Book Allocation | Hard Binary Search", 35),
        lec("thUd_WJn6wk", "BS-19. Painter's Partition and Split Array - Largest Sum", 35),
        lec("kMSBvlZ-_HA", "BS-20. Minimise Maximum Distance between Gas Stations | Heap + BS", 40),
        lec("C2rRzz-JDk8", "BS-21. Median of Two Sorted Arrays | Brute Better Approach", 40),
        lec("F9c7LpRZWVQ", "BS-21. Median of Two Sorted Arrays | Binary Search Approach", 40),
        lec("D1oDwWCq50g", "BS-22. K-th Element of Two Sorted Arrays | Binary Search", 35),
        lec("SCz-1TtYxDI", "BS-23. Row with Maximum Number of 1s | Binary Search on 2D", 25),
        lec("JXU4Akft7yk", "BS-24. Search in a 2D Matrix - I | Binary Search on 2D", 30),
        lec("9ZbB397jU4k", "BS-25. Search in a 2D Matrix - II | Binary Search on 2D", 30),
        lec("nGGp5XBzC4g", "BS-26. Find Peak Element-II | Binary Search", 30),
        lec("Q9wXgdxJq48", "BS-27. Median in a Row Wise Sorted Matrix", 35),
      ],
    },
 
    // ── STEP 4: Binary Trees ────────────────────────────────────────────────
    {
      chapterId: "ch_str_04",
      chapterOrder: 4,
      chapterTitle: "Step 4 – Binary Trees [Traversals, Medium, Hard Problems]",
      chapterContent: [
        lec("_ANrF3FJm7I", "L1. Introduction to Trees | Types of Trees", 20, true),
        lec("ctCpP0RFDFc", "L2. Binary Tree Representation in C++", 15, true),
        lec("hyLyW7rP24I", "L3. Binary Tree Representation in Java", 15),
        lec("jmy0LaGET1I", "L4. Binary Tree Traversals | BFS | DFS", 25),
        lec("RlUu72JrOCQ", "L5. Preorder Traversal of Binary Tree | C++ | Java", 20),
        lec("Z_NEgBgbRVI", "L6. Inorder Traversal of Binary Tree | C++ | Java", 20),
        lec("COQOU6klsBg", "L7. Postorder Traversal of Binary Tree | C++ | Java", 20),
        lec("EoAsWbO7sqg", "L8. Level Order Traversal of Binary Tree | BFS", 25),
        lec("Bfqd8BsPVuw", "L9. Iterative Preorder Traversal | Stack", 25),
        lec("lxTGsVXjwvM", "L10. Iterative Inorder Traversal | Stack", 25),
        lec("2YBhNLodD8Q", "L11. Iterative Postorder Traversal using 2 Stacks", 25),
        lec("NzIGLLwZBS8", "L12. Iterative Postorder Traversal using 1 Stack", 25),
        lec("ySp2epYvgTE", "L13. Preorder Inorder Postorder in One Traversal", 30),
        lec("eD3tmO66aBA", "L14. Maximum Depth / Height of Binary Tree", 20),
        lec("Yt50Jfbd8Po", "L15. Check for Balanced Binary Tree", 25),
        lec("Rezetez59Nk", "L16. Diameter of Binary Tree", 25),
        lec("WszrfSwMz58", "L17. Maximum Path Sum in Binary Tree", 25),
        lec("BhuvF_-PWS0", "L18. Check if Two Trees are Identical", 20),
        lec("3OXWEdlIGl4", "L19. Zig-Zag / Spiral Traversal in Binary Tree", 25),
        lec("0ca1nvR0be4", "L20. Boundary Traversal in Binary Tree", 30),
        lec("q_a6lpbKJdw", "L21. Vertical Order Traversal of Binary Tree", 30),
        lec("Et9OCDNvJ78", "L22. Top View of Binary Tree", 25),
        lec("0FtVY6I4pB8", "L23. Bottom View of Binary Tree", 25),
        lec("KV4mRzTjlAk", "L24. Right/Left View of Binary Tree", 25),
        lec("nKggNAiEpBE", "L25. Check for Symmetrical Binary Trees", 20),
        lec("fmflMqVOC7k", "L26. Print Root to Node Path in Binary Tree", 25),
        lec("_-QHfMDde90", "L27. Lowest Common Ancestor in Binary Tree | LCA", 30),
        lec("ZbybYvcVLks", "L28. Maximum Width of Binary Tree", 25),
        lec("fnmisPM6cVo", "L29. Children Sum Property in Binary Tree | O(N) Approach", 25),
        lec("i9ORlEy6EsI", "L30. Print all Nodes at Distance K in Binary Tree", 30),
        lec("2r5wLmQfD6g", "L31. Minimum Time to BURN the Binary Tree from a Node", 30),
        lec("u-yWemKGWO0", "L32. Count Total Nodes in a Complete Binary Tree | O(Log²N)", 25),
        lec("9GMECGQgWrQ", "L33. Requirements to Construct a Unique Binary Tree | Theory", 15),
        lec("aZNaLrVebKQ", "L34. Construct Binary Tree from Preorder and Inorder", 35),
        lec("LgLRTaEMRVc", "L35. Construct Binary Tree from Postorder and Inorder", 35),
        lec("-YbXySKJsX8", "L36. Serialize and De-serialize Binary Tree", 35),
        lec("80Zug6D1_r4", "L37. Morris Traversal | Preorder | Inorder", 35),
        lec("sWf7k1x9XR4", "L38. Flatten a Binary Tree to Linked List | 3 Approaches", 30),
      ],
    },
 
    // ── STEP 5: Binary Search Trees ─────────────────────────────────────────
    {
      chapterId: "ch_str_05",
      chapterOrder: 5,
      chapterTitle: "Step 5 – Binary Search Trees [Concepts & Problems]",
      chapterContent: [
        lec("p7-9UvDQZ3w", "L39. Introduction to Binary Search Tree | BST", 20, true),
        lec("KcNt6v_56cc", "L40. Search in a Binary Search Tree | BST", 20, true),
        lec("KSsk8AhdOZA", "L41. Ceil in a Binary Search Tree | BST", 20),
        lec("xm_W1ub-K-w", "L42. Floor in a Binary Search Tree | BST", 20),
        lec("FiFiNvM29ps", "L43. Insert a Given Node in Binary Search Tree | BST", 25),
        lec("kouxiP_H5WE", "L44. Delete a Node in Binary Search Tree | BST", 30),
        lec("9TJYWh0adfk", "L45. K-th Smallest/Largest Element in BST", 25),
        lec("f-sj7I5oXEI", "L46. Check if a Tree is a BST or BT | Validate a BST", 25),
        lec("cX_kPV_foZc", "L47. LCA in Binary Search Tree", 20),
        lec("UmJT3j26t1I", "L48. Construct a BST from a Preorder Traversal | 3 Methods", 30),
        lec("SXKAD2svfmI", "L49. Inorder Successor/Predecessor in BST | 3 Methods", 25),
        lec("D2jMcmxU4bs", "L50. Binary Search Tree Iterator | O(H) Space", 25),
        lec("ssL3sHwPeb4", "L51. Two Sum in BST | Check if Pair with Sum K Exists", 25),
        lec("ZWGW7FminDM", "L52. Recover BST | Correct BST with Two Nodes Swapped", 30),
        lec("X0oXMdtUDwo", "L53. Largest BST in Binary Tree", 35),
      ],
    },
 
    // ── STEP 6: Graphs Part 1 ───────────────────────────────────────────────
    {
      chapterId: "ch_str_06",
      chapterOrder: 6,
      chapterTitle: "Step 6 – Graphs [BFS, DFS, Bipartite, Topo Sort, Shortest Path]",
      chapterContent: [
        lec("M3_pLsDdeuU", "G-1. Introduction to Graph | Types | Conventions", 25, true),
        lec("3oI-34aPMWM", "G-2. Graph Representation in C++ | 2 Ways", 20, true),
        lec("OsNklbh9gYI", "G-3. Graph Representation in Java | 2 Ways", 20),
        lec("lea-Wl_uWXY", "G-4. What are Connected Components?", 15),
        lec("-tgVpUgsQ5k", "G-5. Breadth-First Search (BFS) | C++ and Java", 30),
        lec("Qzf1a--rhp8", "G-6. Depth-First Search (DFS) | C++ and Java", 30),
        lec("ACzkVtewUYA", "G-7. Number of Provinces | Connected Components", 20),
        lec("muncqlKJrH0", "G-8. Number of Islands | Connected Components in Matrix", 25),
        lec("C-2_uSRli8o", "G-9. Flood Fill Algorithm", 20),
        lec("yf3oUhkvqA0", "G-10. Rotten Oranges", 25),
        lec("BPlrALf1LDU", "G-11. Detect Cycle in Undirected Graph using BFS", 25),
        lec("zQ3zgFypzX4", "G-12. Detect Cycle in Undirected Graph using DFS", 25),
        lec("edXdVwkYHF8", "G-13. Distance of Nearest Cell Having 1 | 0/1 Matrix", 25),
        lec("BtdgAys4yMk", "G-14. Surrounded Regions | Replace O's with X's", 25),
        lec("rxKcepXQgU4", "G-15. Number of Enclaves | Multi-source BFS", 25),
        lec("7zmgQSJghpo", "G-16. Number of Distinct Islands | DFS", 30),
        lec("-vu34sct1g8", "G-17. Bipartite Graph | BFS", 25),
        lec("KG5YFfR0j8A", "G-18. Bipartite Graph | DFS", 25),
        lec("9twcmtQj4DU", "G-19. Detect Cycle in a Directed Graph using DFS", 25),
        lec("uRbJ1OF9aYM", "G-20. Find Eventual Safe States — DFS", 25),
        lec("5lZ0iJMrUMk", "G-21. Topological Sort Algorithm | DFS", 25),
        lec("73sneFXuTEg", "G-22. Kahn's Algorithm | Topological Sort | BFS", 25),
        lec("iTBaI90lpDQ", "G-23. Detect Cycle in Directed Graph | Kahn's Algorithm", 25),
        lec("WAOfKpxYHR8", "G-24. Course Schedule I and II | Topological Sort", 25),
        lec("2gtg3VsDGyc", "G-25. Find Eventual Safe States — BFS Topological Sort", 25),
        lec("U3N_je7tWAs", "G-26. Alien Dictionary — Topological Sort", 30),
        lec("ZUFQfFaU-8U", "G-27. Shortest Path in Directed Acyclic Graph", 25),
        lec("C4gxoTaI71U", "G-28. Shortest Path in Undirected Graph with Unit Weights", 25),
        lec("tRPda0rcf8E", "G-29. Word Ladder - I | Shortest Paths", 35),
        lec("DREutrv2XD0", "G-30. Word Ladder - 2 | Shortest Paths", 35),
        lec("AD4SFl7tu7I", "G-31. Word Ladder - 2 | Optimised for Leetcode", 30),
      ],
    },
 
    // ── STEP 7: Graphs Part 2 ───────────────────────────────────────────────
    {
      chapterId: "ch_str_07",
      chapterOrder: 7,
      chapterTitle: "Step 7 – Graphs [Dijkstra, Bellman Ford, Floyd Warshall, MST, DSU]",
      chapterContent: [
        lec("V6H1qAeB-l4", "G-32. Dijkstra's Algorithm — Using Priority Queue — Part 1", 35, true),
        lec("PATgNiuTP20", "G-33. Dijkstra's Algorithm — Using Set — Part 2", 30, true),
        lec("3dINsjyfooY", "G-34. Dijkstra's Algorithm — Why PQ not Q | Time Complexity", 30),
        lec("rp1SMw7HSO8", "G-35. Print Shortest Path — Dijkstra's Algorithm", 25),
        lec("U5Mw4eyUmw4", "G-36. Shortest Distance in a Binary Maze", 25),
        lec("0ytpZyiZFhA", "G-37. Path With Minimum Effort", 25),
        lec("9XybHVqTHcQ", "G-38. Cheapest Flights Within K Stops", 30),
        lec("_BvEJ3VIDWw", "G-39. Minimum Multiplications to Reach End", 25),
        lec("_-0mx0SmYxA", "G-40. Number of Ways to Arrive at Destination", 25),
        lec("0vVofAhAYjc", "G-41. Bellman Ford Algorithm", 30),
        lec("YbY8cVwWAvw", "G-42. Floyd Warshall Algorithm", 30),
        lec("PwMVNSJ5SLI", "G-43. Find the City With Smallest Number of Neighbours", 25),
        lec("ZSPjZuZWCME", "G-44. Minimum Spanning Tree — Theory", 20),
        lec("mJcZjjKzeqk", "G-45. Prim's Algorithm — Minimum Spanning Tree", 35),
        lec("aBxjDBC4M1U", "G-46. Disjoint Set Union | Union by Rank | Path Compression", 35),
        lec("DMnDM_sxVig", "G-47. Kruskal's Algorithm — Minimum Spanning Tree", 30),
        lec("ZGr5nX-Gi6Y", "G-48. Number of Provinces — Disjoint Set", 20),
        lec("FYrl7iz9_ZU", "G-49. Number of Operations to Make Network Connected — DSU", 25),
        lec("FMwpt_aQOGw", "G-50. Accounts Merge — DSU", 30),
        lec("Rn6B-Q4SNyA", "G-51. Number of Islands II — Online Queries — DSU", 30),
        lec("lgiz0Oup6gM", "G-52. Making a Large Island — DSU", 30),
        lec("OwMNX8SPavM", "G-53. Most Stones Removed with Same Row or Column — DSU", 25),
        lec("R6uoSjZ2imo", "G-54. Strongly Connected Components — Kosaraju's Algorithm", 35),
        lec("qrAub5z8FeA", "G-55. Bridges in Graph — Tarjan's Algorithm", 35),
        lec("j1QDfU21iZk", "G-56. Articulation Point in Graph", 30),
      ],
    },
 
    // ── STEP 8: Dynamic Programming Part 1 ──────────────────────────────────
    {
      chapterId: "ch_str_08",
      chapterOrder: 8,
      chapterTitle: "Step 8 – Dynamic Programming Part 1 [1D, 2D Grid DP, Subsequences, Knapsack]",
      chapterContent: [
        lec("tyB0ztf0DNY", "DP-1. Introduction | Memoization | Tabulation | Space Optimization", 40, true),
        lec("mLfjzJsN8us", "DP-2. Climbing Stairs | 1D Recurrence Relations", 20, true),
        lec("EgG3jsGoPvQ", "DP-3. Frog Jump | 1D DP", 25),
        lec("Kmh3rhyEtB8", "DP-4. Frog Jump with K Distance", 20),
        lec("GrMBfJNk_NY", "DP-5. Maximum Sum of Non-Adjacent Elements | House Robber", 25),
        lec("3WaxQMELSkw", "DP-6. House Robber 2 | 1D DP", 25),
        lec("AE39gJYuRog", "DP-7. Ninja's Training | 2D DP | MUST WATCH", 35),
        lec("sdE0A2Oxofw", "DP-8. Grid Unique Paths | ALL TECHNIQUES", 30),
        lec("TmhpgXScLyY", "DP-9. Unique Paths 2 | Grid with Obstacles", 25),
        lec("_rgTlyky1uQ", "DP-10. Minimum Path Sum in Grid | Microsoft Interview", 25),
        lec("SrP-PiLSYC0", "DP-11. Triangle | Fixed Start Variable End | Grid DP", 25),
        lec("N_aJ5qQbYA0", "DP-12. Minimum/Maximum Falling Path Sum | Variable Start and End", 25),
        lec("QGfn7JeXK54", "DP-13. Cherry Pickup II | 3D DP", 35),
        lec("fWX9xDmIzRI", "DP-14. Subset Sum Equals to Target | DP on Subsequences", 30),
        lec("7win3dcgo3k", "DP-15. Partition Equal Subset Sum", 30),
        lec("GS_OqZb2CWc", "DP-16. Partition Set Into Two Subsets Min Absolute Diff", 30),
        lec("ZHyb-A2Mte4", "DP-17. Count Subsets with Sum K", 25),
        lec("zoilQD1kYSg", "DP-18. Count Partitions With Given Difference", 25),
      ],
    },
 
    // ── STEP 9: Dynamic Programming Part 2 ──────────────────────────────────
    {
      chapterId: "ch_str_09",
      chapterOrder: 9,
      chapterTitle: "Step 9 – Dynamic Programming Part 2 [Knapsack, Strings DP, Stocks, LIS, MCM]",
      chapterContent: [
        lec("GqOmJHQZivw", "DP-19. 0/1 Knapsack | Recursion to Space Optimised", 35, true),
        lec("myPeWb3Y68A", "DP-20. Minimum Coins | Infinite Supplies Pattern", 30, true),
        lec("b3GD8263-PQ", "DP-21. Target Sum | DP on Subsequences", 30),
        lec("HgyouUi11zk", "DP-22. Coin Change 2 | Infinite Supply Problems", 30),
        lec("OgvOZ6OrJoY", "DP-23. Unbounded Knapsack | 1D Space Optimised", 25),
        lec("mO8XpGoJwuo", "DP-24. Rod Cutting Problem | 1D Space Optimised", 25),
        lec("NPZn9jBrX8U", "DP-25. Longest Common Subsequence | Top Down | Bottom-Up", 35),
        lec("-zI4mrF2Pb4", "DP-26. Print Longest Common Subsequence", 25),
        lec("_wP9mWNPL5w", "DP-27. Longest Common Substring | DP on Strings", 25),
        lec("6i_T5kkfv4A", "DP-28. Longest Palindromic Subsequence", 25),
        lec("xPBLEj41rFU", "DP-29. Minimum Insertions to Make String Palindrome", 20),
        lec("yMnH0jrir0Q", "DP-30. Minimum Insertions/Deletions to Convert String A to B", 25),
        lec("xElxAuBcvsU", "DP-31. Shortest Common Supersequence | DP on Strings", 25),
        lec("nVG7eTiD2bY", "DP-32. Distinct Subsequences | 1D Array Optimisation", 30),
        lec("fJaKO8FbDdo", "DP-33. Edit Distance | Recursive to 1D Optimised", 30),
        lec("ZmlQ3vgAOMo", "DP-34. Wildcard Matching | Recursive to 1D Optimisation", 30),
        lec("nGJmxkUJQGs", "DP-36. Buy and Sell Stock II | Recursion to Space Optimisation", 30),
        lec("-uQGzhYj8BQ", "DP-37. Buy and Sell Stocks III | Recursion to Space Optimisation", 30),
        lec("IV1dHbk5CDc", "DP-38. Buy and Sell Stock IV | Recursion to Space Optimisation", 30),
        lec("IGIe46xw3YY", "DP-39. Buy and Sell Stocks With Cooldown", 25),
        lec("k4eK-vEmnKg", "DP-40. Buy and Sell Stocks With Transaction Fee", 25),
        lec("ekcwMsSIzVc", "DP-41. Longest Increasing Subsequence | Memoization", 30),
        lec("IFfYfonAFGc", "DP-42. Printing Longest Increasing Subsequence", 25),
        lec("on2hvxBXJH4", "DP-43. LIS using Binary Search | O(nlogn) Intuition", 30),
        lec("gDuZwBW9VvM", "DP-44. Largest Divisible Subset | LIS", 25),
        lec("YY8iBaYcc4g", "DP-45. Longest String Chain | LIS", 25),
        lec("y4vN0WNdrlg", "DP-46. Longest Bitonic Subsequence | LIS", 25),
        lec("cKVl1TFdNXg", "DP-47. Number of Longest Increasing Subsequences", 25),
        lec("vRVfmbCFW7Y", "DP-48. Matrix Chain Multiplication | Partition DP Starts", 35),
        lec("pDCXsbAw5Cg", "DP-49. Matrix Chain Multiplication | Bottom-Up Tabulation", 30),
        lec("xwomavsC86c", "DP-50. Minimum Cost to Cut the Stick", 30),
        lec("Yz4LlDSlkns", "DP-51. Burst Balloons | Partition DP", 35),
        lec("MM7fXopgyjw", "DP-52. Evaluate Boolean Expression to True | Partition DP", 30),
        lec("_H8V5hJUGd0", "DP-53. Palindrome Partitioning II | Front Partition", 30),
        lec("PhWWJmaKfMc", "DP-54. Partition Array for Maximum Sum | Front Partition", 25),
        lec("tOylVCugy9k", "DP-55. Maximum Rectangle Area with All 1s | DP on Rectangles", 30),
        lec("auS1fynpnjo", "DP-56. Count Square Submatrices with All Ones", 25),
      ],
    },
 
    // ── STEP 10: Linked List ────────────────────────────────────────────────
    {
      chapterId: "ch_str_10",
      chapterOrder: 10,
      chapterTitle: "Step 10 – LinkedList [Single LL, Double LL, Medium, Hard Problems]",
      chapterContent: [
        lec("Nq7ok-OyEpg", "L1. Introduction to LinkedList | Traversal | Length | Search", 25, true),
        lec("VaECK03Dz-g", "L2. Deletion and Insertion in LL | 8 Problems", 35, true),
        lec("0eKMU10uEDI", "L3. Introduction to Doubly LinkedList | Insertions and Deletions", 30),
        lec("u3WUW2qe6ww", "L4. Reverse a DLL | Multiple Approaches", 25),
        lec("XmRrGzR6udg", "L5. Add 2 Numbers in LinkedList | Dummy Node Approach", 25),
        lec("qf6qp7GzD5Q", "L6. Odd Even Linked List | Multiple Approaches", 25),
        lec("gRII7LhdJWc", "L7. Sort a LinkedList of 0s, 1s and 2s | Multiple Approaches", 25),
        lec("3kMKYQ2wNIU", "L8. Remove Nth Node from the End | Multiple Approaches", 25),
        lec("D2vI2DNJGd8", "L9. Reverse a LinkedList | Iterative and Recursive", 25),
        lec("lRY_G-u_8jk", "L10. Check if a LinkedList is Palindrome", 25),
        lec("aXQWhbvT3w0", "L11. Add 1 to a Number Represented by LinkedList", 20),
        lec("0DYoPz2Tpt4", "L12. Find the Intersection Point of Y LinkedList", 25),
        lec("7LjQ57RqgEc", "L13. Find the Middle Element of the LinkedList", 20),
        lec("wiOo4DC5GGA", "L14. Detect a Loop/Cycle in LinkedList | With Proof", 25),
        lec("I4g1qbkTPus", "L15. Find the Length of the Loop in LinkedList", 20),
        lec("ePpV-_pfOeI", "L16. Delete the Middle Node of the LinkedList", 20),
        lec("2Kd0KKmmHFc", "L17. Find the Starting Point of the Loop/Cycle", 25),
        lec("Mh0NH_SD92k", "L18. Delete All Occurrences of a Key in DLL", 20),
        lec("YitR4dQsddE", "L19. Find All Pairs with Given Sum in DLL", 25),
        lec("YJKVTnOJXSY", "L20. Remove Duplicates from Sorted DLL", 20),
        lec("lIar1skcQYI", "L21. Reverse Nodes in K Group Size of LinkedList", 30),
        lec("uT7YI7XbTY8", "L22. Rotate a LinkedList", 20),
        lec("jXu-H7XuClE", "L23. Merge Two Sorted Linked Lists", 25),
        lec("ykelywHJWLg", "L24. Flattening a LinkedList | Multiple Approaches", 30),
        lec("1zktEppsdig", "L25. Merge K Sorted Lists | Multiple Approaches", 30),
        lec("8ocB7a_c-Cc", "L26. Sort a Linked List | Merge Sort and Brute Force", 30),
        lec("q570bKdrnlw", "L27. Clone a LinkedList with Next and Random Pointers", 30),
        lec("mG3KLugbOdc", "L28. Design a Browser History | LinkedList Implementation", 25),
      ],
    },
 
    // ── STEP 11: Stacks & Queues ────────────────────────────────────────────
    {
      chapterId: "ch_str_11",
      chapterOrder: 11,
      chapterTitle: "Step 11 – Stacks & Queues [Learning, Monotonic Stack, Implementation]",
      chapterContent: [
        lec("tqQ5fTamIN4", "L1. Introduction to Stack and Queue | Implementation", 25, true),
        lec("xwjS0iZhw4I", "L2. Check for Balanced Parentheses | Stack", 20, true),
        lec("4pIc9UBHJtk", "L3. Prefix, Infix, and Postfix Conversion", 35),
        lec("NdDIaH91P0g", "L4. Implement Min Stack", 25),
        lec("e7XQLtOQM3I", "L5. Next Greater Element", 25),
        lec("7PrncD7v9YQ", "L6. Next Greater Element - II", 25),
        lec("zMdbdGJNlh4", "L7. Previous Smaller Element", 20),
        lec("1_5VuquLbXg", "L8. Trapping Rainwater | 2 Approaches", 30),
        lec("v0e8p9JCgRc", "L9. Sum of Subarray Minimum", 30),
        lec("gIrMptNPf5M", "L10. Sum of Subarray Ranges", 25),
        lec("_eYGqw_VDR4", "L11. Asteroid Collision", 25),
        lec("Bzat9vgD0fs", "L12. Largest Rectangle in Histogram", 30),
        lec("ttVu6G7Ayik", "L13. Maximal Rectangle | Stack", 30),
        lec("jmbuRzYPGrg", "L14. Remove K Digits", 25),
        lec("eay-zoSRkVc", "L15. Stock Span Problem", 25),
        lec("NwBvene4Imo", "L16. Sliding Window Maximum", 30),
        lec("cEadsbTeze4", "L17. The Celebrity Problem", 25),
        lec("z9bJUPxzFOw", "L18. Implement LRU Cache", 35),
        lec("mzqHlAW7jeE", "L19. Implement LFU Cache | Hard", 40),
      ],
    },
 
    // ── STEP 12: Sliding Window & Two Pointer ────────────────────────────────
    {
      chapterId: "ch_str_12",
      chapterOrder: 12,
      chapterTitle: "Step 12 – Sliding Window & Two Pointer Combined Problems",
      chapterContent: [
        lec("9kdHxplyl5I", "L1. Introduction to Sliding Window & 2 Pointers | Templates", 25, true),
        lec("pBWCOCS636U", "L2. Maximum Points from Cards | 2 Pointers", 20, true),
        lec("-zSxTJkcdAo", "L3. Longest Substring Without Repeating Characters", 25),
        lec("3E4JBHSLpYk", "L4. Max Consecutive Ones III", 25),
        lec("e3bs0uA1NhQ", "L5. Fruit Into Baskets", 25),
        lec("teM9ZsVRQyc", "L6. Longest Substring With At Most K Distinct Characters", 25),
        lec("xtqN4qlgr8s", "L7. Number of Substrings Containing All Three Characters", 25),
        lec("_eNhaDCr6P0", "L8. Longest Repeating Character Replacement", 25),
        lec("XnMdNUkX6VM", "L9. Binary Subarrays With Sum", 25),
        lec("j_QOv9OT9Og", "L10. Count Number of Nice Subarrays", 25),
        lec("7wYGbV_LsX4", "L11. Subarray with K Different Integers", 25),
        lec("WJaij9ffOIY", "L12. Minimum Window Substring | Hard", 35),
      ],
    },
 
    // ── STEP 13: Greedy Algorithms ───────────────────────────────────────────
    {
      chapterId: "ch_str_13",
      chapterOrder: 13,
      chapterTitle: "Step 13 – Greedy Algorithms [Easy, Medium, Hard]",
      chapterContent: [
        lec("DIX2p7vb9co", "L1. Assign Cookies | Greedy", 15, true),
        lec("n_tmibEhO6Q", "L2. Lemonade Change | Greedy", 15, true),
        lec("3-QbX1iDbXs", "L3. Shortest Job First (SJF) CPU Scheduling", 20),
        lec("tZAa_jJ3SwQ", "L4. Jump Game - I | Greedy", 20),
        lec("7SBVnw7GSTk", "L5. Jump Game - II | Greedy", 20),
        lec("QbwltemZbRg", "L6. Job Sequencing Problem | Greedy", 25),
        lec("mKfhTotEguk", "L7. N Meetings in One Room | Activity Selection", 20),
        lec("HDHQ8lAWakY", "L8. Non Overlapping Intervals | Greedy", 20),
        lec("xxRE-46OCC8", "L9. Insert Intervals | Greedy", 25),
        lec("AsGzwR_FWok", "L10. Minimum Number of Platforms Required | Railway Station", 25),
        lec("cHT6sG_hUZI", "L11. Valid Parenthesis String | Multiple Approaches", 25),
        lec("1ibsQrnuEEg", "L12. Fractional Knapsack Algorithm", 20),
        lec("IIqVFvKE6RY", "L13. Candy | Slope Approach | Hard", 30),
      ],
    },
 
    // ── STEP 14: Maths for DSA ───────────────────────────────────────────────
    {
      chapterId: "ch_str_14",
      chapterOrder: 14,
      chapterTitle: "Step 14 – Maths for DSA [Prime, Sieve, Power, SPF]",
      chapterContent: [
        lec("Ae_Ag_saG9s", "L1. Print All Divisors of a Number | Maths", 20, true),
        lec("MJcckSfoYdI", "L2. Check if a Number is Prime | Maths", 20, true),
        lec("LT7XhVdeRyg", "L3. Print All Prime Factors of a Number | Maths", 20),
        lec("hFWckDXE-K8", "L4. Power Exponentiation | Maths", 25),
        lec("g5Fuxn_AvSk", "L5. Sieve of Eratosthenes | Maths", 25),
        lec("os82DjD2-MA", "L6. Count Primes in Range L-R | Maths", 20),
        lec("glKWkmKFlMw", "L7. Smallest Prime Factor (SPF) | Prime Factorisation | Query Based", 25),
      ],
    },
 
  ],
};

globalLectureOrder = 1;
const chaiAurReact = {
  courseTitle: "Chai aur React – Production Ready React by Hitesh Choudhary",
  courseDescription:
    "<p>The most practical React course that takes you from basics to production-grade React applications. Learn React the way it is actually used in industry.</p><p><strong>Topics covered:</strong></p><ul><li>React fundamentals, JSX, Components, Props</li><li>Hooks: useState, useEffect, useRef, useCallback, useMemo</li><li>React Router v6, Context API, Redux Toolkit</li><li>Custom Hooks, Performance Optimization</li><li>Real projects: Password Generator, Todo App, GitHub Profile Viewer</li></ul>",
  courseThumbnail:
    "https://img.youtube.com/vi/rZ41y93P2Qo/maxresdefault.jpg",
  coursePrice: 0,
  isPublished: true,
  discount: 0,
  educator: "admin",
  enrolledStudents: [],
  courseRatings: [],
  courseContent: [
    {
      chapterId: "ch_car_1",
      chapterOrder: 1,
      chapterTitle: "Getting Started with React",
      chapterContent: [
        lec("rZ41y93P2Qo", "01 – Why React? Introduction & Roadmap", 20, true),
        lec("k3KqQvywToE", "02 – Create React App vs Vite Setup", 18, true),
        lec("wIyHSOugGGw", "03 – Understanding React Flow & Project Structure", 22),
        lec("oMnFJHEq0c0", "04 – Create Your Own React Library & JSX", 25),
        lec("co25mr37D9Y", "05 – Why you need Hooks – useState in Depth", 24),
      ],
    },
    {
      chapterId: "ch_car_2",
      chapterOrder: 2,
      chapterTitle: "Hooks, Props & Components",
      chapterContent: [
        lec("1ApSPnl6Kg0", "06 – Virtual DOM, Fibre & Reconciliation", 20),
        lec("mDke_BXVFCQ", "07 – Tailwind CSS & Props Deep Dive", 22),
        lec("qGLrnHFm4H8", "08 – Project: Background Changer", 18),
        lec("NeZ2R24XW6Y", "09 – useCallback, useMemo & useRef", 26),
        lec("OehVjGfBqHk", "10 – Custom Hooks – Currency Converter Project", 24),
      ],
    },
    {
      chapterId: "ch_car_3",
      chapterOrder: 3,
      chapterTitle: "React Router & State Management",
      chapterContent: [
        lec("VJov5QWEKE4", "11 – React Router v6 – All Concepts", 28),
        lec("IkCkQR3ztOk", "12 – Context API – Theme Switcher", 22),
        lec("1i04-A7kfFI", "13 – Redux Toolkit – Todo App", 30),
        lec("wrSBHZhfPmY", "14 – Redux Toolkit – Full Project", 25),
      ],
    },
  ],
};

globalLectureOrder = 1;
const dsaCpp = {
  courseTitle: "DSA with C++ – Complete Series by Apna College",
  courseDescription:
    "<p>The most comprehensive Data Structures & Algorithms series in C++ for placement preparation and coding interviews. Taught by Shradha Khapra of Apna College.</p><p><strong>Topics covered:</strong></p><ul><li>C++ Basics, Variables, Loops, Functions</li><li>Arrays, Strings, Pointers</li><li>Sorting Algorithms, Binary Search</li><li>Recursion, Dynamic Programming</li><li>Linked Lists, Trees, Graphs</li><li>Real interview problems from Google, Amazon, Microsoft</li></ul>",
  courseThumbnail:
    "https://img.youtube.com/vi/VTLCoHnyACE/maxresdefault.jpg",
  coursePrice: 0,
  isPublished: true,
  discount: 0,
  educator: "admin",
  enrolledStudents: [],
  courseRatings: [],
  courseContent: [
    {
      chapterId: "ch_dsa_1",
      chapterOrder: 1,
      chapterTitle: "C++ Basics & Introduction",
      chapterContent: [
        lec("VTLCoHnyACE", "Lec 01 – Introduction, Setup & Flowcharts", 25, true),
        lec("kngO8oVYFjU", "Lec 02 – Variables, Data Types & Operators", 22, true),
        lec("oGSf3finlYQ", "Lec 03 – Conditionals & Loops", 28),
        lec("KiN-BCns9D0", "Lec 04 – Patterns in C++", 24),
        lec("z9bZufPHFLU", "Lec 05 – Functions in C++", 20),
      ],
    },
    {
      chapterId: "ch_dsa_2",
      chapterOrder: 2,
      chapterTitle: "Arrays & Sorting",
      chapterContent: [
        lec("8wmn7k1TTcI", "Lec 06 – Arrays Part 1 – Introduction", 22),
        lec("NWg38xWYzEg", "Lec 07 – Arrays Part 2 – Vectors in C++", 18),
        lec("Dn0aNfCQCBA", "Lec 08 – Strings in C++", 25),
        lec("r-u4uh3QvsQ", "Lec 09 – Bitwise Operators & Data Type Modifiers", 20),
        lec("9IZYqostl2M", "Lec 10 – Kadane's Algorithm – Maximum Subarray Sum", 22),
      ],
    },
    {
      chapterId: "ch_dsa_3",
      chapterOrder: 3,
      chapterTitle: "Binary Search, Pointers & Advanced Arrays",
      chapterContent: [
        lec("T9-JGpQfRg4", "Lec 11 – Moore's Voting Algorithm", 18),
        lec("bk-nQ7HF6k4", "Lec 12 – Time & Space Complexity", 28),
        lec("iRCOBTuDCiY", "Lec 13 – Buy & Sell Stocks Problem", 20),
        lec("mBcD-8A2LrE", "Lec 14 – Container with Most Water", 22),
        lec("I0gBvME7KTI", "Lec 15 – Product of Array Except Self", 20),
        lec("iU-FZY50BXI", "Lec 16 – Pointers in Detail", 25),
        lec("W9F8fDQj7Ok", "Lec 17 – Binary Search Algorithm", 24),
      ],
    },
  ],
};


globalLectureOrder = 1;
const webDevBootcamp = {
  courseTitle: "Full Stack Web Development Bootcamp",
  courseDescription:
    "<p>A comprehensive full stack web development course covering HTML, CSS, JavaScript, React, Node.js, Express and MongoDB. Build real-world projects from scratch.</p><p><strong>What you'll learn:</strong></p><ul><li>HTML5 & CSS3 fundamentals</li><li>JavaScript ES6+ & DOM Manipulation</li><li>React.js frontend development</li><li>Node.js & Express backend</li><li>MongoDB & Mongoose</li><li>Full stack project deployment</li></ul>",
  courseThumbnail:
    "https://img.youtube.com/vi/Vi9bxu-M-ag/maxresdefault.jpg",
  coursePrice: 500,
  isPublished: true,
  discount: 0,
  educator: "admin",
  enrolledStudents: [],
  courseRatings: [],
  courseContent: [
    {
      chapterId: "ch_wd_1",
      chapterOrder: 1,
      chapterTitle: "HTML & CSS Foundations",
      chapterContent: [
        lec("Vi9bxu-M-ag", "Lec 01 – Introduction to Web Development", 20, true),
        lec("qz0aGYrrlhU", "Lec 02 – HTML Basics & Structure", 18, true),
        lec("OXGznpKZ_sA", "Lec 03 – CSS Fundamentals & Box Model", 22),
        lec("yfoY53QXEnI", "Lec 04 – Flexbox & CSS Grid Layout", 25),
        lec("3JluqTojuME", "Lec 05 – Responsive Design & Media Queries", 20),
      ],
    },
    {
      chapterId: "ch_wd_2",
      chapterOrder: 2,
      chapterTitle: "JavaScript & DOM",
      chapterContent: [
        lec("W6NZfCO5SIk", "Lec 06 – JavaScript Fundamentals", 24),
        lec("hdI2bqOjy3c", "Lec 07 – DOM Manipulation", 22),
        lec("XBTy_sqgoeA", "Lec 08 – Events & Event Listeners", 18),
        lec("PkZNo7MFNFg", "Lec 09 – ES6+ Features – Arrow Functions, Destructuring", 26),
        lec("DHjqpvDnNGE", "Lec 10 – Fetch API & Async/Await", 28),
      ],
    },
    {
      chapterId: "ch_wd_3",
      chapterOrder: 3,
      chapterTitle: "Node.js & Backend",
      chapterContent: [
        lec("TlB_eWDSMt4", "Lec 11 – Node.js Introduction & npm", 22),
        lec("G8uL0lFFoN0", "Lec 12 – Express.js Framework", 25),
        lec("ofme2o29ngU", "Lec 13 – REST API Design", 20),
        lec("zbMJhmJRGQs", "Lec 14 – MongoDB & Mongoose Basics", 24),
        lec("aclXrRYFqBc", "Lec 15 – Full Stack CRUD Application", 35),
      ],
    },
  ],
};


const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set in .env");

    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(`${uri}/LMS`);
    console.log("✅ Connected");

    const deleted = await Course.deleteMany({ educator: "admin" });
    console.log(`${deleted.deletedCount}`);

    const courses = [striverA2Z, chaiAurReact, dsaCpp, webDevBootcamp];
    const inserted = await Course.insertMany(courses);

    console.log(`${inserted.length}\n`);
    inserted.forEach((c, i) => {
      const totalLectures = c.courseContent.reduce(
        (sum, ch) => sum + ch.chapterContent.length, 0
      );
      console.log(`  ${i + 1}. ${c.courseTitle}`);
      console.log(`     Chapters: ${c.courseContent.length}  |  Total Lectures: ${totalLectures}`);
    });

    console.log("\n✅ Seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();