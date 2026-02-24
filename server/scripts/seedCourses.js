/**
 * ============================================================
 * CSEdge Course Seeder - 4 Real YouTube Playlist Courses
 * ============================================================
 * Run: node scripts/seedCourses.js
 *
 * Courses:
 *  1. Namaste JavaScript (Akshay Saini)  - playlist PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz
 *  2. Chai aur React (Hitesh Choudhary) - playlist PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ
 *  3. DSA with C++ (Apna College)       - playlist PLfqMhTWNBTe137I_EPQd34TsgV6IO55pt
 *  4. Web Dev Bootcamp                  - playlist PLDzeHZWIZsTo0wSBcg4-NMIbC0L8evLrD
 *
 * lectureUrl is stored as YouTube embed URL so it plays inside the platform.
 * ============================================================
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Course from "../models/course.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// Helper: build embed URL from YouTube video ID
const yt = (videoId) => `https://www.youtube.com/embed/${videoId}`;
// Helper: build lecture object
let globalLectureOrder = 1;
const lec = (id, title, duration, isFree = false) => ({
  lectureId: `lec_${id}`,
  lectureTitle: title,
  lectureDuration: duration,
  lectureUrl: yt(id),
  isPreviewFree: isFree,
  lectureOrder: globalLectureOrder++,
});

// ─────────────────────────────────────────────────────────────────────────────
// COURSE 1: Namaste JavaScript – Akshay Saini
// Season 1 (19 episodes) + Season 2 teaser
// Playlist: PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz
// ─────────────────────────────────────────────────────────────────────────────
const namasteJS = {
  courseTitle: "Namaste JavaScript – Deep Dive by Akshay Saini",
  courseDescription:
    "<p>The most in-depth JavaScript course that dives deep into the engine, execution context, closures, event loop, prototypes and more. If you want to truly understand JavaScript and ace frontend interviews, this is the series for you.</p><p><strong>What you'll learn:</strong></p><ul><li>How the JS engine executes code under the hood</li><li>Hoisting, Scope, Closures, Prototypes</li><li>Event Loop, Asynchronous JS, Promises</li><li>Higher-Order Functions, map/filter/reduce</li></ul>",
  courseThumbnail:
    "https://img.youtube.com/vi/0bHoB32fuj0/maxresdefault.jpg",
  coursePrice: 0,
  isPublished: true,
  discount: 0,
  educator: "admin",
  enrolledStudents: [],
  courseRatings: [],
  courseContent: [
    {
      chapterId: "ch_njs_1",
      chapterOrder: 1,
      chapterTitle: "Season 1 – JavaScript Fundamentals",
      chapterContent: [
        lec("0bHoB32fuj0", "EP 01 – How JavaScript Works & Execution Context", 18, true),
        lec("iLWTnMzWtj4", "EP 02 – How JS Code is Executed & Call Stack", 16, true),
        lec("Fnlnw8uY6jo", "EP 03 – Hoisting in JavaScript (variables & functions)", 14),
        lec("gSDncyInECo", "EP 04 – How Functions Work & Variable Environment", 12),
        lec("QyUFheng6J0", "EP 05 – Shortest JS Program – window & this keyword", 13),
        lec("B7iF6G3EyIk", "EP 06 – undefined vs not defined in JS", 10),
        lec("uH-tVP8MUs8", "EP 07 – The Scope Chain, Scope & Lexical Environment", 17),
        lec("BNC6slYyjIo", "EP 08 – let & const in JS – Temporal Dead Zone", 21),
        lec("lW_erSjyoBo", "EP 09 – Block Scope & Shadowing in JS", 16),
      ],
    },
    {
      chapterId: "ch_njs_2",
      chapterOrder: 2,
      chapterTitle: "Season 1 – Closures, Async & Advanced Concepts",
      chapterContent: [
        lec("qikiqc9T6ro", "EP 10 – Closures in JS", 14),
        lec("eBTBG4nda2A", "EP 11 – setTimeout + Closures Interview Question", 17),
        lec("I5ENjnEFQW8", "EP 12 – Crazy JS Interview ft. Closures", 13),
        lec("HY1o4xAMGR0", "EP 13 – First Class Functions & Anonymous Functions", 15),
        lec("btj35dh3_U8", "EP 14 – Callback Functions in JS ft. Event Listeners", 20),
        lec("8zKuNo4ay8E", "EP 15 – Asynchronous JS & Event Loop from Scratch", 26),
        lec("2WJL19wDH68", "EP 16 – JS Engine EXPOSED – Google's V8 Architecture", 18),
        lec("nqsPmuicJJc", "EP 17 – Trust Issues with setTimeout()", 14),
        lec("HkWxvB1RGwY", "EP 18 – Higher-Order Functions ft. Functional Programming", 16),
        lec("zdp0zrpKzIE", "EP 19 – map, filter & reduce", 22),
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

// ─────────────────────────────────────────────────────────────────────────────
// COURSE 4: Web Dev Bootcamp
// Playlist: PLDzeHZWIZsTo0wSBcg4-NMIbC0L8evLrD
// ─────────────────────────────────────────────────────────────────────────────
globalLectureOrder = 1;
const webDevBootcamp = {
  courseTitle: "Full Stack Web Development Bootcamp",
  courseDescription:
    "<p>A comprehensive full stack web development course covering HTML, CSS, JavaScript, React, Node.js, Express and MongoDB. Build real-world projects from scratch.</p><p><strong>What you'll learn:</strong></p><ul><li>HTML5 & CSS3 fundamentals</li><li>JavaScript ES6+ & DOM Manipulation</li><li>React.js frontend development</li><li>Node.js & Express backend</li><li>MongoDB & Mongoose</li><li>Full stack project deployment</li></ul>",
  courseThumbnail:
    "https://img.youtube.com/vi/Vi9bxu-M-ag/maxresdefault.jpg",
  coursePrice: 0,
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

// ─────────────────────────────────────────────────────────────────────────────
// RUN SEED
// ─────────────────────────────────────────────────────────────────────────────
const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is not set in .env");

    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(`${uri}/LMS`);
    console.log("✅ Connected");

    // Remove old seeded courses (keep manually added ones)
    const deleted = await Course.deleteMany({ educator: "admin" });
    console.log(`🗑️  Removed ${deleted.deletedCount} previously seeded courses`);

    const courses = [namasteJS, chaiAurReact, dsaCpp, webDevBootcamp];
    const inserted = await Course.insertMany(courses);

    console.log(`\n🎉 Successfully seeded ${inserted.length} courses:\n`);
    inserted.forEach((c, i) => {
      const totalLectures = c.courseContent.reduce(
        (sum, ch) => sum + ch.chapterContent.length, 0
      );
      console.log(`  ${i + 1}. ${c.courseTitle}`);
      console.log(`     Chapters: ${c.courseContent.length}  |  Total Lectures: ${totalLectures}`);
    });

    console.log("\n✅ Seeding complete! Visit your platform to see the courses.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
};

seed();