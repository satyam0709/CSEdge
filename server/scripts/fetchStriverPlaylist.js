/**
 * fetchStriverPlaylist.js
 * ============================================================
 * Run this ONCE to fetch all real video IDs from Striver's
 * A2Z DSA playlist and generate the correct seedCourses.js
 *
 * HOW TO RUN:
 * 1. Get a free YouTube API key from https://console.cloud.google.com
 *    (Enable "YouTube Data API v3")
 * 2. Set it below or as env variable: YOUTUBE_API_KEY=your_key
 * 3. Run: node fetchStriverPlaylist.js
 * 4. It generates: striverSeedReady.js  ← paste into seedCourses.js
 * ============================================================
 */

import fs from 'fs';

const API_KEY      = process.env.YOUTUBE_API_KEY || 'AIzaSyBXORnA_2zLivfRA-CTcW8iyqJ_J_cE5zM';
const PLAYLIST_ID  = 'PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz';

const STEP_MAP = [
  { step: 1,  title: 'Step 1 – Learn the Basics (C++ / Java + Math + Hashing)' },
  { step: 2,  title: 'Step 2 – Sorting Techniques' },
  { step: 3,  title: 'Step 3 – Arrays [Easy → Medium → Hard]' },
  { step: 4,  title: 'Step 4 – Binary Search [1D, 2D Arrays, Search Space]' },
  { step: 5,  title: 'Step 5 – Strings [Basic and Medium]' },
  { step: 6,  title: 'Step 6 – LinkedList [Single, Double, Medium, Hard]' },
  { step: 7,  title: 'Step 7 – Recursion [Pattern-wise]' },
  { step: 8,  title: 'Step 8 – Bit Manipulation [Concepts & Problems]' },
  { step: 9,  title: 'Step 9 – Stacks & Queues' },
  { step: 10, title: 'Step 10 – Sliding Window & Two Pointer Problems' },
  { step: 11, title: 'Step 11 – Heaps [Learning, Medium, Hard]' },
  { step: 12, title: 'Step 12 – Greedy Algorithms' },
  { step: 13, title: 'Step 13 – Binary Trees [Traversals, Medium, Hard]' },
  { step: 14, title: 'Step 14 – Binary Search Trees [Concepts & Problems]' },
  { step: 15, title: 'Step 15 – Graphs [BFS, DFS, Topo Sort, Shortest Path, DSU, MST]' },
  { step: 16, title: 'Step 16 – Dynamic Programming [All Patterns — 56 Problems]' },
  { step: 17, title: 'Step 17 – Tries [Implementation + Problems]' },
  { step: 18, title: 'Step 18 – Advanced Strings [KMP, Z-algo, Manacher]' },
];

// ── Fetch all videos from playlist (handles pagination) ──────────────────────
async function fetchAllVideos() {
  let videos = [];
  let pageToken = '';
  let page = 1;

  console.log('🔄 Fetching playlist videos from YouTube API...\n');

  do {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?` +
      `part=snippet&maxResults=50&playlistId=${PLAYLIST_ID}` +
      `&key=${API_KEY}` +
      (pageToken ? `&pageToken=${pageToken}` : '');

    const res  = await fetch(url);
    const data = await res.json();

    if (data.error) {
      console.error('❌ YouTube API Error:', data.error.message);
      console.error('\n📌 Make sure your API key is set and YouTube Data API v3 is enabled.');
      console.error('   Get free key at: https://console.cloud.google.com\n');
      process.exit(1);
    }

    const items = data.items || [];
    items.forEach(item => {
      const videoId = item.snippet.resourceId.videoId;
      const title   = item.snippet.title;
      const pos     = item.snippet.position + 1;
      videos.push({ pos, videoId, title });
    });

    console.log(`  Page ${page}: fetched ${items.length} videos (total so far: ${videos.length})`);
    pageToken = data.nextPageToken || '';
    page++;

  } while (pageToken);

  console.log(`\n✅ Total videos fetched: ${videos.length}\n`);
  return videos;
}

// ── Assign each video to a step based on its title / position ────────────────
function assignToSteps(videos) {
  // Striver's A2Z playlist is ordered — use position ranges from the sheet
  // Step sizes from TakeUforward sheet:
  const STEP_RANGES = [
    { step: 1,  from: 1,   to: 31  },  // Learn the basics  (31 videos)
    { step: 2,  from: 32,  to: 38  },  // Sorting           (7 videos)
    { step: 3,  from: 39,  to: 78  },  // Arrays            (40 videos)
    { step: 4,  from: 79,  to: 110 },  // Binary Search     (32 videos)
    { step: 5,  from: 111, to: 125 },  // Strings           (15 videos)
    { step: 6,  from: 126, to: 156 },  // Linked List       (31 videos)
    { step: 7,  from: 157, to: 181 },  // Recursion         (25 videos)
    { step: 8,  from: 182, to: 199 },  // Bit Manipulation  (18 videos)
    { step: 9,  from: 200, to: 229 },  // Stacks & Queues   (30 videos)
    { step: 10, from: 230, to: 241 },  // Sliding Window    (12 videos)
    { step: 11, from: 242, to: 258 },  // Heaps             (17 videos)
    { step: 12, from: 259, to: 274 },  // Greedy            (16 videos)
    { step: 13, from: 275, to: 313 },  // Binary Trees      (39 videos)
    { step: 14, from: 314, to: 329 },  // BST               (16 videos)
    { step: 15, from: 330, to: 382 },  // Graphs            (53 videos)
    { step: 16, from: 383, to: 438 },  // DP                (56 videos)
    { step: 17, from: 439, to: 445 },  // Tries             (7 videos)
    { step: 18, from: 446, to: 454 },  // Adv Strings       (9 videos)
  ];

  const steps = {};
  STEP_RANGES.forEach(r => { steps[r.step] = []; });

  videos.forEach(v => {
    const range = STEP_RANGES.find(r => v.pos >= r.from && v.pos <= r.to);
    if (range) {
      steps[range.step].push(v);
    }
  });

  return steps;
}

// ── Generate the seed file ───────────────────────────────────────────────────
function generateSeedFile(steps) {
  let order = 1;

  const chaptersCode = STEP_MAP.map(({ step, title }) => {
    const videos = steps[step] || [];
    
    const lecturesCode = videos.map((v, i) => {
      const isFree = i < 2 ? ', true' : '';
      // Clean the title for use as a string
      const cleanTitle = v.title.replace(/'/g, "\\'").replace(/\\/g, '\\\\');
      return `        lec("${v.videoId}", "${cleanTitle}", 20${isFree}),`;
    }).join('\n');

    return `    {
      chapterId: "ch_str_${String(step).padStart(2,'0')}",
      chapterOrder: ${step},
      chapterTitle: "${title}",
      chapterContent: [
${lecturesCode}
      ],
    },`;
  }).join('\n\n');

  const output = `/**
 * striverSeedReady.js — AUTO GENERATED
 * Generated by fetchStriverPlaylist.js
 * Contains REAL video IDs from playlist: PLgUwDviBIf0oF6QL8m22w1hIDC1vJ_BHz
 * Total videos: ${Object.values(steps).reduce((s,v) => s + v.length, 0)}
 *
 * USAGE: Copy striverA2Z object into your seedCourses.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Course from "../models/course.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const yt  = (id) => \`https://www.youtube.com/embed/\${id}\`;
let order = 1;
const lec = (id, title, duration, isFree = false) => ({
  lectureId:      \`lec_str_\${order}\`,
  lectureTitle:   title,
  lectureDuration: duration,
  lectureUrl:     yt(id),
  isPreviewFree:  isFree,
  lectureOrder:   order++,
});

const striverA2Z = {
  courseTitle: "Striver's A2Z DSA Course — Complete by takeUforward",
  courseDescription: \`<p>The most in-depth, structured, and free DSA course by 
    <strong>Raj Vikramaditya (Striver)</strong> — Ex Google, Amazon engineer 
    and founder of takeUforward. Covers 454 problems across 18 steps.</p>
    <p><strong>Topics:</strong> Arrays, Strings, Linked Lists, Stacks, Queues, 
    Binary Search, Recursion, Bit Manipulation, Trees, Graphs, Heaps, Greedy, 
    Tries, Dynamic Programming — all patterns from basics to FAANG level.</p>\`,
  courseThumbnail: "https://img.youtube.com/vi/EAR7De6Goz4/maxresdefault.jpg",
  coursePrice:     0,
  discount:        0,
  isPublished:     true,
  educator:        "admin",
  enrolledStudents: [],
  courseRatings:   [],
  courseContent: [
${chaptersCode}
  ],
};

const seed = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI not set");
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(\`\${uri}/LMS\`);
    console.log("✅ Connected\\n");

    const del = await Course.deleteOne({ courseTitle: /Striver/i });
    if (del.deletedCount) console.log("🗑  Removed old Striver course");

    const inserted = await Course.create(striverA2Z);
    const total = inserted.courseContent.reduce((s,c) => s + c.chapterContent.length, 0);

    console.log(\`\\n🎉 Seeded: \${inserted.courseTitle}\`);
    console.log(\`   Steps: \${inserted.courseContent.length} | Videos: \${total}\\n\`);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  }
};

seed();
`;

  fs.writeFileSync('striverSeedReady.js', output);
  console.log('✅ Generated: striverSeedReady.js');
  console.log('   Run it with: node scripts/striverSeedReady.js\n');
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  if (API_KEY === 'YOUR_API_KEY_HERE') {
    console.error('❌ Please set your YouTube API key!');
    console.error('   Option 1: YOUTUBE_API_KEY=your_key node fetchStriverPlaylist.js');
    console.error('   Option 2: Edit this file and replace YOUR_API_KEY_HERE\n');
    console.error('   Get a FREE key at: https://console.cloud.google.com');
    console.error('   → Create Project → Enable "YouTube Data API v3" → Create API Key\n');
    process.exit(1);
  }

  const videos = await fetchAllVideos();
  const steps  = assignToSteps(videos);

  // Print summary
  console.log('📊 Videos per step:');
  Object.entries(steps).forEach(([step, vids]) => {
    const info = STEP_MAP.find(s => s.step === Number(step));
    console.log(`  Step ${step}: ${vids.length} videos — ${info?.title || ''}`);
  });
  console.log('');

  generateSeedFile(steps);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});