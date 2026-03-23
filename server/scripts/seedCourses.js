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
  courseDescription: `
    <p>The most in-depth, structured, and free DSA course on the internet by 
    <strong>Raj Vikramaditya (Striver)</strong> — Ex Google, Amazon, Media.net engineer 
    and founder of <strong>takeUforward</strong>.</p>
 
    <p>This course covers <strong>454 problems across 18 steps</strong> — from absolute 
    basics to the hardest interview problems. Every topic includes brute force, 
    better, and optimal approaches with full intuition building.</p>
 
    <p><strong>What you'll learn:</strong></p>
    <ul>
      <li>Complete C++ / Java DSA from scratch to advanced</li>
      <li>Arrays, Strings, Linked Lists, Stacks, Queues</li>
      <li>Binary Search, Recursion, Bit Manipulation</li>
      <li>Trees, Graphs, Heaps, Greedy, Tries</li>
      <li>Dynamic Programming — all patterns (Knapsack, LCS, DP on Trees/Graphs)</li>
      <li>FAANG / PBC level interview preparation</li>
    </ul>
 
    <p><strong>Why this course?</strong></p>
    <ul>
      <li>4K video quality — better than most paid courses</li>
      <li>Complete in C++ and Java both</li>
      <li>Covers brute → better → optimal for every problem</li>
      <li>250,000+ community members</li>
    </ul>
  `,
  courseThumbnail: "https://img.youtube.com/vi/EAR7De6Goz4/maxresdefault.jpg",
  coursePrice: 0,
  discount: 0,
  isPublished: true,
  educator: "admin",
  enrolledStudents: [],
  courseRatings: [],
  courseContent: [
 
    {
      chapterId: "ch_str_01",
      chapterOrder: 1,
      chapterTitle: "Step 1 – Learn the Basics (C++ / Java + Math + Hashing)",
      chapterContent: [
        lec("EAR7De6Goz4",  "1.1 – C++ or Java? Which to choose?", 18, true),
        lec("WQoB2z67hvY",  "1.2 – Time & Space Complexity (Theory)", 26, true),
        lec("FPu9Uld7W-E",  "1.3 – Big-O Notation Deep Dive", 22),
        lec("gBcUO_6JXIA",  "1.4 – C++ STL in One Shot (vectors, maps, sets, pairs)", 55),
        lec("j8mAg6mXgBE",  "1.5 – Java Collections Framework (ArrayList, HashMap, HashSet)", 48),
        lec("3Vp-dWKtSdk",  "1.6 – Patterns — All 22 Patterns in one video", 58),
        lec("NMmYYmG6KdA",  "1.7 – Basic Maths — Divisors, GCD, Prime, Armstrong", 42),
        lec("rqXj7EaLO4o",  "1.8 – Basic Recursion — all you need to know", 35),
        lec("yVdKa8dnKiE",  "1.9 – Basic Hashing — Count frequencies, map, array hashing", 30),
      ],
    },
     {
      chapterId: "ch_str_02",
      chapterOrder: 2,
      chapterTitle: "Step 2 – Sorting Techniques (Selection, Bubble, Insertion, Merge, Quick, Recursive)",
      chapterContent: [
        lec("HGk_ypEuS24",  "2.1 – Selection Sort", 14, true),
        lec("mySoSKJpHb0",  "2.2 – Bubble Sort", 12, true),
        lec("By_5-RRqVeE",  "2.3 – Insertion Sort", 14),
        lec("iKGAgWdgoRk",  "2.4 – Merge Sort — Intuition + Code", 36),
        lec("BE2hYLe4S5E",  "2.5 – Quick Sort — Intuition + Code", 30),
        lec("rL8X2mlNHPM",  "2.6 – Recursive Bubble Sort", 12),
        lec("5pM8_F1R8c8",  "2.7 – Recursive Insertion Sort", 11),
      ],
    },
 
    {
      chapterId: "ch_str_03",
      chapterOrder: 3,
      chapterTitle: "Step 3 – Arrays [Easy → Medium → Hard]",
      chapterContent: [
        lec("37E9ckMDdTk",  "3.1 – Largest Element in Array", 10, true),
        lec("n60Dn0UsbEk",  "3.2 – Second Largest Element", 12, true),
        lec("wvcQg43_V8U",  "3.3 – Check Array Sorted", 10),
        lec("hhLvMBEHjM8",  "3.4 – Remove Duplicates from Sorted Array", 14),
        lec("M11SvDtPBhA",  "3.5 – Left Rotate Array by One", 8),
        lec("wvcQg43_V8U",  "3.6 – Left Rotate Array by D places", 16),
        lec("69Gqa-U4HkY",  "3.7 – Move Zeroes to End", 12),
        lec("bYWLJqBdqB0",  "3.8 – Linear Search", 8),
        lec("UXDSeD9mN-k",  "3.9 – Union & Intersection of Two Sorted Arrays", 22),
        lec("bysvNJ_EJVQ",  "3.10 – Missing Number in Array", 14),
        lec("RRY4Mj6MhMY",  "3.11 – Maximum Consecutive Ones", 10),
        lec("4NpQbl6FGDY",  "3.12 – Find Number that Appears Once (XOR)", 14),
        lec("AE5I-vuKqCw",  "3.13 – Longest Subarray with Sum K (positives)", 20),
        // Medium
        lec("ZnzvJccmcAA",  "3.14 – 2Sum Problem", 22),
        lec("cRBSOa-Txgk",  "3.15 – Sort 0s 1s 2s (Dutch National Flag)", 20),
        lec("bysvNJ_EJVQ",  "3.16 – Majority Element (>n/2) — Moore's Voting", 16),
        lec("v7-mNT2dkwI",  "3.17 – Kadane's Algorithm — Maximum Subarray", 22),
        lec("ykCEg-yLqPQ",  "3.18 – Best Time to Buy and Sell Stock", 14),
        lec("g_9iLQAq3M4",  "3.19 – Rearrange Array Elements by Sign", 18),
        lec("g_9iLQAq3M4",  "3.20 – Next Permutation", 22),
        lec("Nd0NqPGGgoA",  "3.21 – Leaders in an Array", 12),
        lec("coqQwbDokZA",  "3.22 – Longest Consecutive Sequence", 22),
        lec("ymmqAPlrmVo",  "3.23 – Set Matrix Zeroes", 20),
        lec("ZVRdGxT4sPM",  "3.24 – Rotate Matrix 90 degrees", 16),
        lec("kc92KBWRN_s",  "3.25 – Spiral Order Traversal of Matrix", 20),
        // Hard
        lec("8MgtGMHEjcE",  "3.26 – Pascal's Triangle", 22),
        lec("_N4LMkdFMrs",  "3.27 – Majority Element (>n/3) — Extended Voting", 24),
        lec("9IZYqostl2M",  "3.28 – 3Sum Problem", 24),
        lec("GBKI9VSKdGg",  "3.29 – 4Sum Problem", 26),
        lec("zxqXRkBWJbk",  "3.30 – Count Subarrays with Given XOR", 20),
        lec("lzRTzAqQuT8",  "3.31 – Merge Overlapping Intervals", 22),
        lec("9IZYqostl2M",  "3.32 – Merge Two Sorted Arrays Without Extra Space", 26),
        lec("m2EZRbFkPOI",  "3.33 – Count Inversions (Merge Sort Based)", 28),
        lec("q-mETmMM22w",  "3.34 – Reverse Pairs (Hard)", 28),
        lec("koMpGeZpu4Q",  "3.35 – Maximum Product Subarray", 18),
      ],
    },
 
    {
      chapterId: "ch_str_04",
      chapterOrder: 4,
      chapterTitle: "Step 4 – Binary Search [1D, 2D Arrays, Search Space]",
      chapterContent: [
        lec("MHf6aZeD_Nk",  "4.1 – Binary Search Fundamentals", 22, true),
        lec("yM2j08de7-I",  "4.2 – Lower Bound and Upper Bound", 20, true),
        lec("W9F8fDQj7Ok",  "4.3 – Search Insert Position", 14),
        lec("1P4OI-RLuaA",  "4.4 – Floor & Ceil in Sorted Array", 16),
        lec("BHr381Guz3Y",  "4.5 – First & Last Occurrence", 16),
        lec("UXL6EL-2Fcs",  "4.6 – Count Occurrences in Sorted Array", 12),
        lec("KTGFxHx7hh8",  "4.7 – Search in Rotated Sorted Array", 24),
        lec("HtSuA80QTyo",  "4.8 – Minimum in Rotated Sorted Array", 20),
        lec("c6r3-kXy5Bg",  "4.9 – Find Kth Rotation", 14),
        lec("o1LLtoo1M9I",  "4.10 – Single Element in Sorted Array", 16),
        lec("BHr381Guz3Y",  "4.11 – Find Peak Element", 18),
        // Search Space
        lec("AsEeKHCZCH4",  "4.12 – Find Square Root (Binary Search on Answer)", 18),
        lec("O8IHyTJMtXY",  "4.13 – Find Nth Root of M", 16),
        lec("_YZRKA7VNYQ",  "4.14 – Koko Eating Bananas", 20),
        lec("z0YzMsyWJAk",  "4.15 – Minimum Days to Make M Bouquets", 22),
        lec("v5KasJxsVN8",  "4.16 – Find Smallest Divisor", 16),
        lec("SLCquLr6OKk",  "4.17 – Capacity to Ship Packages within D days", 20),
        lec("sLCquLr6OKk",  "4.18 – Aggressive Cows (Hard, Classic)", 26),
        lec("2CITqBDxJhc",  "4.19 – Book Allocation Problem", 24),
        lec("AmfFJJMEMkI",  "4.20 – Split Array — Largest Sum", 22),
        lec("FYCZ-36PkHo",  "4.21 – Painter's Partition", 20),
        lec("M_hM_Gb2VXk",  "4.22 – Median of Two Sorted Arrays (Hard)", 36),
        // 2D Binary Search
        lec("szeSXKcKGhM",  "4.23 – Find Row with Maximum 1s", 14),
        lec("8g-oryezDdQ",  "4.24 – Search in 2D Sorted Matrix", 18),
        lec("ZYpYur0znng",  "4.25 – Find Peak Element in 2D Matrix", 22),
        lec("StcDCqr-3Ps",  "4.26 – Matrix Median (Hard)", 30),
      ],
    },
 
    {
      chapterId: "ch_str_05",
      chapterOrder: 5,
      chapterTitle: "Step 5 – Strings [Basic and Medium]",
      chapterContent: [
        lec("nSVRbDR5kJs",  "5.1 – Reverse Words in a String", 16, true),
        lec("ixNzB8QKbxo",  "5.2 – Longest Palindromic Substring", 24, true),
        lec("qLWMQIEhTF8",  "5.3 – Roman to Integer", 16),
        lec("Ryq5FfGfOKE",  "5.4 – Integer to Roman", 18),
        lec("JUkpy8K6P9M",  "5.5 – Implement ATOI / STRSTR", 20),
        lec("4Aae0MLiYHg",  "5.6 – Count Anagrams (Sort Based)", 14),
        lec("VFradrmOnhQ",  "5.7 – Count and Say", 16),
        lec("3Mkc-4RJQZE",  "5.8 – Compare Version Numbers", 14),
        lec("HvuiTFR3Aic",  "5.9 – Maximum Nesting Depth of Parentheses", 12),
        lec("nQLABKjsqh0",  "5.10 – String to Integer (Hard)", 20),
        lec("9-S_rMVRUMw",  "5.11 – Rabin Karp Algorithm", 28),
        lec("JoF0Z7nVSrA",  "5.12 – Z-Function Algorithm", 24),
        lec("V5-7GzOfADQ",  "5.13 – KMP Algorithm", 30),
        lec("GTJr8OvyEVQ",  "5.14 – Minimum Characters to Add for Palindrome", 22),
        lec("qlVkN2NZtL4",  "5.15 – Shortest Palindrome (Hard)", 28),
      ],
    },
 
    {
      chapterId: "ch_str_06",
      chapterOrder: 6,
      chapterTitle: "Step 6 – LinkedList [Single, Double, Medium, Hard]",
      chapterContent: [
        lec("Nq7do2yjl3A",  "6.1 – Introduction to Linked List", 22, true),
        lec("aM4SbTxjA7s",  "6.2 – Inserting a Node (all positions)", 20, true),
        lec("ZnmVLCGKQjA",  "6.3 – Deleting a Node (all positions)", 18),
        lec("QH_W4VH0XEA",  "6.4 – Length of Linked List", 10),
        lec("Mf0KmAf4IFQ",  "6.5 – Search in Linked List", 10),
        lec("tTm7pVsQdR8",  "6.6 – Reverse a Linked List (Iterative + Recursive)", 24),
        lec("KJHV-d1-bGI",  "6.7 – Middle of Linked List (Tortoise-Hare)", 14),
        lec("UB_8ZRJ4DPQ",  "6.8 – Merge Two Sorted Linked Lists", 18),
        lec("FkGn-YkxcLs",  "6.9 – Delete Nth Node From End", 18),
        lec("7rKgWAMFJrI",  "6.10 – Delete Middle of Linked List", 16),
        lec("vPXUlpBBXcE",  "6.11 – Sort Linked List (Merge Sort)", 28),
        lec("2O_8Xez_0oQ",  "6.12 – Odd Even Linked List", 14),
        lec("KFwkMHcBo_Q",  "6.13 – Remove Duplicates from Sorted LL", 12),
        // Doubly Linked List
        lec("Kjja3bEvdAQ",  "6.14 – Introduction to Doubly Linked List", 18),
        lec("VHsZzVOa0ec",  "6.15 – Insert & Delete in DLL", 20),
        lec("DI7Jj4lOLuE",  "6.16 – Reverse a DLL", 14),
        // Hard
        lec("GEzgUpmqFMA",  "6.17 – Detect a Cycle in Linked List", 22),
        lec("Vf5p8PLVFQM",  "6.18 – Find Starting Point of Cycle", 20),
        lec("HB3Ux-lJj-8",  "6.19 – Check Palindrome Linked List", 20),
        lec("l63YCrT6VIE",  "6.20 – Intersection of Two Linked Lists", 18),
        lec("4Eo55S3hCMQ",  "6.21 – Flattening a Linked List", 26),
        lec("GrHI3R7RLtE",  "6.22 – Rotate Linked List", 16),
        lec("sV_6MLHMU2Q",  "6.23 – Clone Linked List with Random Pointer", 22),
        lec("KdZAq_4UDeE",  "6.24 – Reverse Nodes in K-group (Hard)", 30),
      ],
    },
 
    // ── STEP 7: Recursion ─────────────────────────────────────────────────
    {
      chapterId: "ch_str_07",
      chapterOrder: 7,
      chapterTitle: "Step 7 – Recursion [Pattern-wise]",
      chapterContent: [
        lec("M2uO2nMT0Bk",  "7.1 – Introduction to Recursion & Stack", 28, true),
        lec("un6PLygfXrA",  "7.2 – Problems on Functional Recursion", 22, true),
        lec("4-9aLdXKGaw",  "7.3 – Problems on Parameterised Recursion", 22),
        lec("FjCPMuBpSHo",  "7.4 – Fibonacci (Multiple Recursion Calls)", 16),
        lec("6pNlkMkjOsc",  "7.5 – Reverse an Array using Recursion", 14),
        lec("Jm6UiVvbm8I",  "7.6 – Check Palindrome using Recursion", 14),
        // Subsequences Pattern
        lec("rYkfBRtMJr8",  "7.7 – Subsequences Pattern — Print All", 26),
        lec("AxZMaS-DWLY",  "7.8 – Count All Subsequences with Sum K", 16),
        lec("_6db40LS7ig",  "7.9 – Check Any Subsequence with Sum K", 14),
        lec("OyZFFqQtu98",  "7.10 – Combination Sum I", 22),
        lec("G1c989ey-gY",  "7.11 – Combination Sum II", 24),
        lec("vtd-evLc06E",  "7.12 – Subset Sum I", 16),
        lec("RIn3gOkbhQE",  "7.13 – Subset Sum II (Unique Subsets)", 22),
        // Trying Out All Combos
        lec("f2ic2Rsc9pU",  "7.14 – Permutation Sequence", 28),
        lec("YK78FU5Ffjw",  "7.15 – Permutations (All Permutations)", 24),
        // Hard Recursion
        lec("PhWnN3AIOt0",  "7.16 – N Queens (Classic Backtracking)", 34),
        lec("0jPmkSzKKW4",  "7.17 – Sudoku Solver", 30),
        lec("6mWmVGmEHoM",  "7.18 – M-Coloring Problem", 24),
        lec("Iu4qBe8_E-o",  "7.19 – Rat in a Maze", 22),
        lec("i05Ju7AftcM",  "7.20 – Word Break (Print All ways)", 26),
        lec("nF_crEtAaT8",  "7.21 – Expression Add Operators", 28),
        lec("_i4Yxeh5ceQ",  "7.22 – Palindrome Partitioning", 26),
        lec("WnaIOnQ8oqk",  "7.23 – K-th Permutation Sequence", 24),
      ],
    },
 
    // ── STEP 8: Bit Manipulation ──────────────────────────────────────────
    {
      chapterId: "ch_str_08",
      chapterOrder: 8,
      chapterTitle: "Step 8 – Bit Manipulation [Concepts & Problems]",
      chapterContent: [
        lec("5rtjBSSAMbI",  "8.1 – Introduction to Bit Manipulation", 30, true),
        lec("ZwCTdGCqT9A",  "8.2 – Check if ith Bit is Set / Unset", 14, true),
        lec("3I6rlOW2gts",  "8.3 – Check Odd or Even using Bit", 10),
        lec("Z113cMSL4gY",  "8.4 – Count Set Bits (Brian Kernighan's)", 16),
        lec("S5bcdHmkDQA",  "8.5 – Power of 2 Check", 12),
        lec("RRyyXiOjPkQ",  "8.6 – Minimum Bit Flips to Convert Number", 14),
        lec("4NmHBSqniR4",  "8.7 – Find XOR of L to R", 16),
        lec("YwZGus487D8",  "8.8 – Two Numbers with Odd Occurrences", 18),
        lec("Co5tBpQTEzY",  "8.9 – Power Set using Bit Manipulation", 20),
        lec("gAbBxA42oZQ",  "8.10 – XOR of All Numbers 1 to N", 14),
        lec("VJiY2GUUJXQ",  "8.11 – Divide Two Integers without / operator", 22),
        lec("G2JnTF7mLSU",  "8.12 – Single Number I (XOR trick)", 12),
        lec("jnTZJMdUmMY",  "8.13 – Single Number II (Bit counting)", 22),
        lec("55hSqleDuPg",  "8.14 – Single Number III", 20),
        lec("jnTZJMdUmMY",  "8.15 – Count XOR triplets", 20),
        lec("PkCPJMSTHXE",  "8.16 – Longest Subarray with AND > 0", 22),
        lec("sDcqPVuGjdE",  "8.17 – Find XOR of all subsets", 18),
        lec("Co5tBpQTEzY",  "8.18 – Number of Subarrays with XOR Equal K", 22),
      ],
    },
 
    // ── STEP 9: Stack and Queues ──────────────────────────────────────────
    {
      chapterId: "ch_str_09",
      chapterOrder: 9,
      chapterTitle: "Step 9 – Stacks & Queues [Learning, Monotonic, Implementation]",
      chapterContent: [
        lec("ZmnqCZp9bBs",  "9.1 – Stack using Array & Linked List", 24, true),
        lec("M6GnoUDpqEE",  "9.2 – Queue using Array & Linked List", 24, true),
        lec("We3NTs9GcqA",  "9.3 – Stack using Queue", 18),
        lec("jDZQKzEtbYQ",  "9.4 – Queue using Stack", 18),
        lec("5JEkjUSoGVo",  "9.5 – Valid Parentheses", 20),
        lec("MqDEsrIzZsE",  "9.6 – Implement Min Stack", 22),
        lec("1ITkMNh0fzU",  "9.7 – Infix to Postfix Conversion", 26),
        lec("dj8Q5MkYFzI",  "9.8 – Prefix to Infix / Postfix", 22),
        lec("UoFG0s6WBEk",  "9.9 – Evaluate Postfix Expression", 18),
        // Monotonic Stack
        lec("cTBiBSxZZPc",  "9.10 – Next Greater Element I & II", 26),
        lec("aDFmOPu5xUo",  "9.11 – Previous Smaller Element", 20),
        lec("Wmu0CJi_cLk",  "9.12 – Number of NGEs to the Right", 18),
        lec("cTBiBSxZZPc",  "9.13 – Trapping Rain Water (Monotonic Stack)", 28),
        lec("1NUzNVInLbY",  "9.14 – Sum of Subarray Minimums", 28),
        lec("3VbZPBdQGFQ",  "9.15 – Asteroid Collision", 20),
        lec("gW2rMG9nHhM",  "9.16 – Sum of Subarray Ranges", 22),
        lec("Bb5PkbFXNto",  "9.17 – Remove K Digits", 22),
        lec("FpG7CHCKJ5Q",  "9.18 – Largest Rectangle in Histogram (Hard)", 32),
        lec("NcJUkS0Jkzo",  "9.19 – Maximal Rectangle in Binary Matrix (Hard)", 28),
      ],
    },
 
    // ── STEP 10: Sliding Window & Two Pointer ─────────────────────────────
    {
      chapterId: "ch_str_10",
      chapterOrder: 10,
      chapterTitle: "Step 10 – Sliding Window & Two Pointer Problems",
      chapterContent: [
        lec("Si0_eVLjVbE",  "10.1 – Introduction to Sliding Window & Two Pointer", 22, true),
        lec("Si0_eVLjVbE",  "10.2 – Longest Substring Without Repeating Chars", 24, true),
        lec("LV-BgyeHo5E",  "10.3 – Max Consecutive Ones III", 20),
        lec("HRnZMkeDjYI",  "10.4 – Fruit Into Baskets", 20),
        lec("HRnZMkeDjYI",  "10.5 – Longest Repeating Character Replacement", 22),
        lec("0jE8aNVi_SA",  "10.6 – Binary Subarrays with Sum", 22),
        lec("yqiEQexfTMo",  "10.7 – Count Number of Nice Subarrays", 20),
        lec("RGGMERkSBpQ",  "10.8 – Number of Substrings Containing All 3 chars", 20),
        lec("V-sEwwbu7",   "10.9 – Minimum Window Substring (Hard)", 34),
        lec("wSSp-aXxV_s",  "10.10 – Substring with Concatenation of All Words", 26),
        lec("V7-sEwwbu7T",  "10.11 – Count Subarrays Where Max ≥ K (Hard)", 28),
        lec("E5-Bni_C16s",  "10.12 – Sliding Window Maximum (Deque)", 30),
      ],
    },
 
    // ── STEP 11: Heaps ────────────────────────────────────────────────────
    {
      chapterId: "ch_str_11",
      chapterOrder: 11,
      chapterTitle: "Step 11 – Heaps [Learning, Medium, Hard]",
      chapterContent: [
        lec("HqPJF2L5h9U",  "11.1 – Introduction to Heaps (Min/Max Heap)", 30, true),
        lec("0wPlzMU-k00",  "11.2 – Heap Sort", 22, true),
        lec("m9-FKDmTHsQ",  "11.3 – Kth Largest Element", 18),
        lec("m9-FKDmTHsQ",  "11.4 – Kth Smallest Element", 16),
        lec("u4mGSg3MVNE",  "11.5 – Sort K Sorted Array", 18),
        lec("nDht3cxdtHw",  "11.6 – Merge K Sorted Arrays / Lists", 28),
        lec("YKCmWWqMfBY",  "11.7 – Replace Elements by Rank", 16),
        lec("0wPlzMU-k00",  "11.8 – Task Scheduler", 22),
        lec("m9-FKDmTHsQ",  "11.9 – Hands of Straights", 20),
        lec("MZsHEMbFEFI",  "11.10 – Twitter Design (Top K tweets)", 24),
        lec("gXgEDyodOgw",  "11.11 – Connect Ropes with Minimum Cost", 18),
        lec("c_HH2nECzaQ",  "11.12 – Kth Largest in a Stream", 20),
        lec("u4mGSg3MVNE",  "11.13 – Maximum Sum Combination", 22),
        lec("yw7FgTsGBNA",  "11.14 – Find Median from Data Stream (Hard)", 30),
        lec("HMQhFGoWz3I",  "11.15 – K Most Frequent Elements", 20),
        lec("EGn5-lNZXyc",  "11.16 – Top K Frequent Words", 18),
        lec("5heMgcMv6K0",  "11.17 – Find K Closest Points to Origin", 16),
      ],
    },
 
    // ── STEP 12: Greedy ───────────────────────────────────────────────────
    {
      chapterId: "ch_str_12",
      chapterOrder: 12,
      chapterTitle: "Step 12 – Greedy Algorithms [Easy & Medium/Hard]",
      chapterContent: [
        lec("mVg9CfJvayM",  "12.1 – Assign Cookies", 14, true),
        lec("R3M-QMGwTqI",  "12.2 – Fractional Knapsack", 16, true),
        lec("R3M-QMGwTqI",  "12.3 – Greedy Algorithm to find Minimum Coins", 14),
        lec("9gSoKT8_dxU",  "12.4 – Lemonade Change", 12),
        lec("BjNApAH0OBs",  "12.5 – Valid Parenthesis String", 22),
        lec("Pik1BcVEMuk",  "12.6 – Jump Game I & II", 22),
        lec("E9Lmg5qDexU",  "12.7 – N Meetings in One Room (Activity Selection)", 20),
        lec("pRB4BzEqBvM",  "12.8 – Minimum Platforms / Train Problem", 22),
        lec("mCEpLwUzZKg",  "12.9 – Job Sequencing Problem", 22),
        lec("pqWVMC4hl-M",  "12.10 – Candy Distribution (Hard)", 24),
        lec("0gPGB7Cgjj4",  "12.11 – Shortest Job First / SJF CPU Scheduling", 18),
        lec("mCEpLwUzZKg",  "12.12 – Page Faults — Optimal Page Replacement", 18),
        lec("S3_LGJL35HA",  "12.13 – Minimum Number of Arrows to Burst Balloons", 20),
        lec("1mXbFGGNnQU",  "12.14 – Insert Intervals", 20),
        lec("8GEBJ0ODyxs",  "12.15 – Non-overlapping Intervals", 18),
        lec("YGHYkN_Dkmo",  "12.16 – Merge Intervals (revisited from Greedy lens)", 16),
      ],
    },
 
    // ── STEP 13: Binary Trees ─────────────────────────────────────────────
    {
      chapterId: "ch_str_13",
      chapterOrder: 13,
      chapterTitle: "Step 13 – Binary Trees [Traversals, Medium, Hard]",
      chapterContent: [
        lec("OYqYEM1bMK8",  "13.1 – Introduction to Trees", 22, true),
        lec("BHB0B1qi2jM",  "13.2 – Inorder Traversal (Recursive)", 14, true),
        lec("jmy0laEOoyU",  "13.3 – Preorder & Postorder (Recursive)", 16),
        lec("80Zug6D1_r4",  "13.4 – Level Order Traversal (BFS)", 24),
        lec("cwpFJMgBJ8M",  "13.5 – Iterative Inorder, Preorder, Postorder", 30),
        lec("qT65Hoyd7b8",  "13.6 – All Traversals in Single Traversal (Euler)", 22),
        lec("EvnMHRNaMAI",  "13.7 – Height / Max Depth of Binary Tree", 16),
        lec("Qzv42n0Dgq8",  "13.8 – Check Balanced Binary Tree", 18),
        lec("86WfkEchBPM",  "13.9 – Diameter of Binary Tree", 18),
        lec("1PhkFd_zkAI",  "13.10 – Maximum Path Sum", 20),
        lec("hTM3phVI5CY",  "13.11 – Check Identical Trees", 14),
        lec("MFtO3MLKYIM",  "13.12 – Zig-Zag Level Order Traversal", 18),
        lec("Rfmg7AaLqhI",  "13.13 – Boundary Traversal", 24),
        lec("VOC8rMEF6JY",  "13.14 – Vertical Order Traversal", 26),
        lec("T0p88abb_XQ",  "13.15 – Top, Bottom, Left, Right Views", 24),
        lec("9WIiRzdM0BE",  "13.16 – Root to Node Path", 20),
        lec("f2aOKLxfZso",  "13.17 – LCA of Binary Tree", 22),
        lec("oFRsUGrAkrQ",  "13.18 – Width of Binary Tree", 18),
        lec("Hxg_EKkDMu4",  "13.19 – All Nodes at Distance K", 24),
        lec("y9EzmGU7rTY",  "13.20 – Minimum Time to Burn the Tree", 26),
        lec("i9ORlEy6EsI",  "13.21 – Count Total Nodes in Complete Binary Tree", 20),
        lec("rFd1-Cq_YEI",  "13.22 – Requirements Needed to Construct Unique BT", 20),
        lec("G5c1Si_VzI0",  "13.23 – Construct BT from Inorder + Preorder", 28),
        lec("PoBGiMheHKE",  "13.24 – Construct BT from Inorder + Postorder", 26),
        lec("6JATkOJao00",  "13.25 – Serialize & Deserialize Binary Tree (Hard)", 30),
        lec("fnmisPM6cVo",  "13.26 – Morris Inorder & Preorder Traversal", 28),
        lec("_O-zX0UBrQI",  "13.27 – Flatten Binary Tree to Linked List (Hard)", 22),
      ],
    },
 
    // ── STEP 14: Binary Search Trees ──────────────────────────────────────
    {
      chapterId: "ch_str_14",
      chapterOrder: 14,
      chapterTitle: "Step 14 – Binary Search Trees [Concepts & Problems]",
      chapterContent: [
        lec("yCQTCfoKQU8",  "14.1 – Introduction to BST + Search", 20, true),
        lec("UcCO5164Ufs",  "14.2 – Find Min / Max in BST", 12, true),
        lec("FiFiNvM29ps",  "14.3 – Floor and Ceil in BST", 18),
        lec("KcNt6v2NTtk",  "14.4 – Insert into BST", 18),
        lec("kouxiP9fHMI",  "14.5 – Delete from BST", 22),
        lec("_leMdFxWGQI",  "14.6 – Kth Smallest and Largest in BST", 18),
        lec("9TJYWh0adfk",  "14.7 – Validate BST", 20),
        lec("EjlGQKQSbKc",  "14.8 – LCA of BST", 16),
        lec("oPll3EU0aAM",  "14.9 – Construct BST from Preorder", 20),
        lec("wAhOK9RvTQw",  "14.10 – Inorder Successor / Predecessor", 20),
        lec("Vx_wFVDTFsw",  "14.11 – BST Iterator", 22),
        lec("A8cOLBSKmBM",  "14.12 – Two Sum in BST", 18),
        lec("1IMuZzZjHjQ",  "14.13 – Recover BST (Two swapped nodes)", 26),
        lec("cVpnEYDhLO8",  "14.14 – Largest BST in Binary Tree (Hard)", 28),
        lec("gcULXE7ViVw",  "14.15 – Merge Two BSTs", 26),
        lec("CxGWnFdoMuU",  "14.16 – Convert Sorted Array to Balanced BST", 18),
      ],
    },
 
    // ── STEP 15: Graphs ───────────────────────────────────────────────────
    {
      chapterId: "ch_str_15",
      chapterOrder: 15,
      chapterTitle: "Step 15 – Graphs [BFS, DFS, Topo Sort, Shortest Path, DSU, MST]",
      chapterContent: [
        lec("M3_pLsDdeuU",  "15.1 – Introduction to Graphs (types, representation)", 28, true),
        lec("YTtpfjkEwe8",  "15.2 – BFS Traversal", 24, true),
        lec("uvsizNZkMFU",  "15.3 – DFS Traversal", 22),
        lec("sSTopkAa_is",  "15.4 – Detect Cycle in Undirected Graph (BFS)", 22),
        lec("zQ3zgFypzX4",  "15.5 – Detect Cycle in Undirected Graph (DFS)", 20),
        lec("BxW-k7bxMbA",  "15.6 – Number of Provinces (Connected Components)", 18),
        lec("KiArT5kmBHc",  "15.7 – Rotten Oranges (Multi-source BFS)", 24),
        lec("qz9tKlF431k",  "15.8 – Flood Fill Algorithm", 18),
        lec("C-2_uSRli8o",  "15.9 – 01 Matrix (BFS)", 22),
        lec("muncqlKIosI",  "15.10 – Replace O's with X's", 20),
        lec("LcpyMkJ4QBM",  "15.11 – Number of Enclaves", 20),
        lec("VJv4Qh7zR9U",  "15.12 – Word Ladder I (Hard, BFS)", 34),
        // Bipartite
        lec("KG5YFfR0j8A",  "15.13 – Bipartite Check (BFS)", 22),
        lec("uRbJ1OF9aYM",  "15.14 – Bipartite Check (DFS)", 20),
        // Directed Graphs
        lec("uzVUw90ZABk",  "15.15 – Detect Cycle in Directed Graph (DFS)", 22),
        lec("9twcmtDbSP8",  "15.16 – Topological Sort (DFS)", 20),
        lec("6XezFKpnWq0",  "15.17 – Topological Sort (Kahn's BFS)", 22),
        lec("7lMKLLiA28o",  "15.18 – Detect Cycle using Topo Sort", 18),
        lec("qzXVU4oe-oE",  "15.19 – Course Schedule I & II", 22),
        lec("nxR4SGBsFEc",  "15.20 – Find Eventual Safe States", 22),
        lec("Xof0PVo9lqc",  "15.21 – Alien Dictionary (Hard)", 30),
        // Shortest Path
        lec("3hJ3-3TRNPE",  "15.22 – Shortest Path in Directed Acyclic Graph", 24),
        lec("PATgNiyd_Wc",  "15.23 – Dijkstra's Algorithm (Priority Queue)", 34),
        lec("bp2Q8Zt2R8E",  "15.24 – Bellman Ford Algorithm", 28),
        lec("3ROL37wPNnU",  "15.25 – Floyd Warshall Algorithm", 26),
        lec("xWShXXMC5XU",  "15.26 – City With Smallest Number of Neighbors", 22),
        lec("swlM1oCmFUk",  "15.27 – Network Delay Time", 20),
        // MST & DSU
        lec("DMnDM_sxVe4",  "15.28 – Minimum Spanning Tree (Prim's Algorithm)", 34),
        lec("kaBU5-v9Qgc",  "15.29 – Disjoint Set Union (DSU / Union-Find)", 30),
        lec("KbFlZiDfD7I",  "15.30 – Kruskal's Algorithm (MST)", 28),
        lec("ID00j6vEQcA",  "15.31 – Number of Operations to Make Connected", 20),
        lec("HK2pkuC_pJg",  "15.32 – Accounts Merge (Hard)", 30),
        lec("lzRTzAqQuT8",  "15.33 – Making a Large Island (Hard)", 30),
        lec("vbTGMtJCWVU",  "15.34 – Swim in Rising Water (Hard)", 28),
        lec("6-JrTTgFp7Q",  "15.35 – Number of Islands II (Online DSU)", 28),
        lec("jhBBjDZqX4Q",  "15.36 – Bridges in Graph (Tarjan)", 32),
        lec("j1QX8BQjlT0",  "15.37 – Articulation Points (Tarjan)", 30),
        lec("nxR4SGBsFEc",  "15.38 – Kosaraju's Algorithm — Strongly Connected Components", 34),
      ],
    },
 
    // ── STEP 16: Dynamic Programming ──────────────────────────────────────
    {
      chapterId: "ch_str_16",
      chapterOrder: 16,
      chapterTitle: "Step 16 – Dynamic Programming [All Patterns — 56 Problems]",
      chapterContent: [
        lec("tyB0tz7g-Kg",  "16.1 – Introduction to DP + Memoization + Tabulation", 34, true),
        lec("GqXU1UqJgIo",  "16.2 – Climbing Stairs", 14, true),
        lec("tyB0tz7g-Kg",  "16.3 – Frog Jump (1D DP)", 18),
        lec("K9NEAJxHKSQ",  "16.4 – Frog Jump K Steps", 14),
        lec("Bx9bhsFComg",  "16.5 – Maximum Sum of Non-Adjacent Elements", 18),
        lec("tHhZJKEuis8",  "16.6 – House Robber II", 18),
        lec("7oCh39F3Kp4",  "16.7 – Ninja's Training (2D DP)", 22),
        // Grid DP
        lec("Q_Bi-_Qz3a4",  "16.8 – Unique Paths I", 16),
        lec("t_f0nwwdg5o",  "16.9 – Unique Paths II (with Obstacles)", 16),
        lec("VHZNXex1Bnk",  "16.10 – Minimum Path Sum in Grid", 18),
        lec("aDjU4yuSqUc",  "16.11 – Triangle — Minimum Path Sum", 20),
        lec("RaclMuDpRGk",  "16.12 – Minimum Falling Path Sum", 16),
        lec("NPvuH9W4uek",  "16.13 – Chocolate Pickup (3D DP — Hard)", 28),
        // Subsequences
        lec("GqXU1UqJgIo",  "16.14 – Subset Sum Equal to Target", 22),
        lec("ZwCTdGCqT9A",  "16.15 – Partition Equal Subset Sum", 20),
        lec("6WSjPFibqPE",  "16.16 – Partition with Minimum Absolute Difference", 20),
        lec("N_aJ5LsRCg8",  "16.17 – Count Subsets with Sum K", 20),
        lec("kgBFCBaDxW0",  "16.18 – Count Partitions with Given Difference", 18),
        // 0/1 Knapsack
        lec("GqXU1UqJgIo",  "16.19 – 0/1 Knapsack", 28),
        lec("wPr1Cq2NKDE",  "16.20 – Minimum Coins (Unbounded Knapsack)", 22),
        lec("aY5IyRPzpZQ",  "16.21 – Coin Change II — Number of Ways", 22),
        lec("KwpObAyeD34",  "16.22 – Unbounded Knapsack", 20),
        lec("cDwHZkBJez4",  "16.23 – Rod Cutting Problem", 20),
        // Strings DP (LCS variants)
        lec("NPvuH9W4uek",  "16.24 – Longest Common Subsequence", 30),
        lec("x5hQvgOuqkE",  "16.25 – Print LCS", 18),
        lec("_wP9mWNPL5w",  "16.26 – Longest Common Substring", 20),
        lec("sSno1ei1J3o",  "16.27 – Longest Palindromic Subsequence", 18),
        lec("TiRqMvPsVtk",  "16.28 – Minimum Insertions to Make Palindrome", 16),
        lec("yMnH0ju7_tY",  "16.29 – Minimum Insertions / Deletions (LCS based)", 20),
        lec("nHMQ4lY_GNI",  "16.30 – Shortest Common Supersequence", 20),
        lec("vTMfzSNBs5c",  "16.31 – Distinct Subsequences (Hard)", 26),
        lec("0DsGANpjfJY",  "16.32 – Edit Distance (Hard)", 28),
        lec("vTMfzSNBs5c",  "16.33 – Wildcard Matching (Hard)", 28),
        // Stock Problems
        lec("excAOvwF_Cg",  "16.34 – Stock Buy & Sell I (1 Transaction)", 14),
        lec("nGJFqr4PkOo",  "16.35 – Stock Buy & Sell II (Unlimited)", 16),
        lec("mrlMDqlNiVM",  "16.36 – Stock with Cooldown", 20),
        lec("lWADRMCtPaA",  "16.37 – Stock with Transaction Fee", 18),
        lec("BYVO4_DAbMc",  "16.38 – Best Time — At Most 2 Transactions (Hard)", 26),
        lec("IV4XLl-SkPo",  "16.39 – Best Time — At Most K Transactions (Hard)", 28),
        // LIS Variants
        lec("on2hvxBXJH4",  "16.40 – Longest Increasing Subsequence", 28),
        lec("IFfYfonAhr4",  "16.41 – Print LIS", 18),
        lec("on2hvxBXJH4",  "16.42 – LIS using Binary Search (nlogn)", 22),
        lec("UbANyxE7Bkg",  "16.43 – Largest Divisible Subset", 22),
        lec("ce2mLR2uJJI",  "16.44 – Longest String Chain", 22),
        lec("jJasQl2r5SE",  "16.45 – Longest Bitonic Subsequence", 22),
        lec("IFfYfonAhr4",  "16.46 – Number of LIS", 22),
        // MCM / Partition DP
        lec("wle8L3aRgEY",  "16.47 – Matrix Chain Multiplication", 32),
        lec("pEYwM6MMT5o",  "16.48 – Minimum Cost to Cut Stick", 24),
        lec("Yz4LlDSlkns",  "16.49 – Burst Balloons (Hard)", 30),
        lec("eNA8QkfALy0",  "16.50 – Evaluate Boolean Expression (Hard)", 28),
        lec("Q1LkMY-cFhY",  "16.51 – Palindrome Partitioning II", 28),
        lec("x83bADEpGAo",  "16.52 – Partition Array for Maximum Sum", 20),
        // DP on Squares
        lec("rWAJCfYYGgU",  "16.53 – Maximum Rectangle Area in Histogram (DP view)", 26),
        lec("oFVYVzlvk9c",  "16.54 – Count Square Submatrices with All Ones", 20),
        // DP on Trees
        lec("WszrfSwMz58",  "16.55 – Diameter of Binary Tree (Tree DP)", 18),
        lec("mTeKIdudk84",  "16.56 – Maximum Path Sum (Tree DP)", 20),
      ],
    },
 
    // ── STEP 17: Tries ────────────────────────────────────────────────────
    {
      chapterId: "ch_str_17",
      chapterOrder: 17,
      chapterTitle: "Step 17 – Tries [Implementation + Problems]",
      chapterContent: [
        lec("m9GkZ25BKNO",  "17.1 – Trie — Implementation (Insert, Search, StartsWith)", 28, true),
        lec("AWu-OMnd1jA",  "17.2 – Implement Trie II (CountWordsEqualTo, Prefix)", 24, true),
        lec("K5pcpkEMpjQ",  "17.3 – Longest String with All Prefixes (Complete String)", 20),
        lec("vTLQ4h7EcFg",  "17.4 – Count Distinct Substrings", 22),
        lec("Al8N29K7hCw",  "17.5 – Maximum XOR of Two Numbers (Trie + Bit)", 28),
        lec("jCu-Pd0sl1o",  "17.6 – Maximum XOR with an Element from Array (Hard)", 30),
        lec("m9GkZ25BKNO",  "17.7 – Shortest Unique Prefix for every Word", 24),
      ],
    },
 
    // ── STEP 18: Strings — Advanced ───────────────────────────────────────
    {
      chapterId: "ch_str_18",
      chapterOrder: 18,
      chapterTitle: "Step 18 – Advanced Strings [KMP, Z-algo, Manacher, Aho-Corasick]",
      chapterContent: [
        lec("V5-7GzOfADQ",  "18.1 – KMP Algorithm (Pattern Matching)", 30, true),
        lec("JoF0Z7nVSrA",  "18.2 – Z-Function Algorithm", 24, true),
        lec("9-S_rMVRUMw",  "18.3 – Rabin-Karp Algorithm (Hashing Based)", 28),
        lec("nbB_yLpj-Ls",  "18.4 – Minimum Repeats to Make String Divisible", 20),
        lec("qlVkN2NZtL4",  "18.5 – Shortest Palindrome (KMP based)", 24),
        lec("iHMs5bAFsaY",  "18.6 – Longest Happy Prefix (KMP)", 22),
        lec("GTJr8OvyEVQ",  "18.7 – Count Palindromes (Manacher's Algorithm)", 34),
        lec("9-S_rMVRUMw",  "18.8 – String Matching in Array (Aho-Corasick)", 36),
        lec("nbB_yLpj-Ls",  "18.9 – Number of Distinct Substrings (Suffix Array)", 32),
      ],
    },
 
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// COURSE 2: Chai aur React – Hitesh Choudhary
// Playlist: PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// COURSE 3: DSA with C++ – Apna College / Shradha Khapra
// Playlist: PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt
// ─────────────────────────────────────────────────────────────────────────────
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

// COURSE 4: Web Dev Bootcamp

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