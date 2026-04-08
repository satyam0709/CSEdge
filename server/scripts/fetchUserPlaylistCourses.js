import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "../.env") });

const API_KEY = process.env.YOUTUBE_API_KEY || "";

/** @type {{ playlistId: string; courseTitle: string; courseDescription: string; slug: string }[]} */
const PLAYLISTS = [
  {
    playlistId: "PLQEaRBV9gAFu4ovJ41PywklqI7IyXwr01",
    slug: "dsa_pl",
    courseTitle: "DSA — Data Structures & Algorithms (YouTube Playlist)",
    courseDescription: `<p>Full playlist in original order. Free lectures embedded in the LMS player.</p>`,
  },
  {
    playlistId: "PLGjplNEQ1it_oTvuLRNqXfz_v_0pq6unW",
    slug: "js_pl",
    courseTitle: "JavaScript — Complete Course (YouTube Playlist)",
    courseDescription: `<p>JavaScript course from the linked playlist, in playlist order.</p>`,
  },
  {
    playlistId: "PLlasXeu85E9cQ32gLCvAvr9vNaUccPVNP",
    slug: "js_s1",
    courseTitle: "JavaScript — Season 1 (YouTube Playlist)",
    courseDescription: `<p>Season 1 — all videos in playlist order.</p>`,
  },
  {
    playlistId: "PLlasXeu85E9eWOpw9jxHOQyGMRiBZ60aX",
    slug: "js_s2",
    courseTitle: "JavaScript — Season 2 (YouTube Playlist)",
    courseDescription: `<p>Season 2 — all videos in playlist order.</p>`,
  },
  {
    playlistId: "PLu71SKxNbfoBsMugTFALhdLlZ5VOqCg2s",
    slug: "py_pl",
    courseTitle: "Python — Full Course (YouTube Playlist)",
    courseDescription: `<p>Python course — lectures in playlist order.</p>`,
  },
  {
    playlistId: "PLu71SKxNbfoDqgPchmvIsL4hTnJIrtige",
    slug: "react_pl",
    courseTitle: "React.js — Full Course (YouTube Playlist)",
    courseDescription: `<p>React — all playlist videos in order.</p>`,
  },
  {
    playlistId: "PLu71SKxNbfoBGh_8p_NS-ZAh6v7HhYqHW",
    slug: "node_pl",
    courseTitle: "Node.js — Backend (YouTube Playlist)",
    courseDescription: `<p>Node.js backend — playlist order preserved.</p>`,
  },
];

/** Single-video “courses” */
const SINGLES = [
  {
    videoId: "zG3hNL08Dro",
    slug: "fs_single",
    courseTitle: "Full Stack Development — Single Course (YouTube)",
    courseDescription: `<p>Single long-form full stack video — plays inside the LMS.</p>`,
  },
  {
    videoId: "a-wVHL0lpb0",
    slug: "js_oneshot",
    courseTitle: "JavaScript — One Shot (YouTube)",
    courseDescription: `<p>JavaScript in one video — embedded player.</p>`,
  },
];

async function fetchJson(url) {
  const res = await fetch(url);
  const data = await res.json();
  if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));
  return data;
}

async function fetchPlaylistTitle(playlistId) {
  const url =
    `https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=${playlistId}&key=${API_KEY}`;
  const data = await fetchJson(url);
  const t = data.items?.[0]?.snippet?.title;
  return t || null;
}

async function fetchAllPlaylistItems(playlistId) {
  const out = [];
  let pageToken = "";
  do {
    const url =
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50` +
      `&playlistId=${playlistId}&key=${API_KEY}` +
      (pageToken ? `&pageToken=${pageToken}` : "");
    const data = await fetchJson(url);
    for (const item of data.items || []) {
      const vid = item.snippet?.resourceId?.videoId;
      const title = item.snippet?.title;
      if (!vid || title === "Deleted video" || title === "Private video") continue;
      out.push({ videoId: vid, title });
    }
    pageToken = data.nextPageToken || "";
  } while (pageToken);
  return out;
}

/** ISO 8601 duration e.g. PT15M33S -> minutes (rounded) */
function isoDurationToMinutes(iso) {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!m) return 20;
  const h = parseInt(m[1] || "0", 10);
  const min = parseInt(m[2] || "0", 10);
  const s = parseInt(m[3] || "0", 10);
  return Math.max(1, Math.round(h * 60 + min + s / 60));
}

async function fetchVideoDurations(videoIds) {
  const map = new Map();
  for (let i = 0; i < videoIds.length; i += 50) {
    const chunk = videoIds.slice(i, i + 50);
    const url =
      `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${chunk.join(",")}&key=${API_KEY}`;
    const data = await fetchJson(url);
    for (const v of data.items || []) {
      const iso = v.contentDetails?.duration || "PT20M";
      map.set(v.id, isoDurationToMinutes(iso));
    }
  }
  return map;
}

function escStr(s) {
  return s.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\r?\n/g, " ");
}

function buildCourseJs({ slug, courseTitle, courseDescription, firstVideoId, items, chapterTitle = "Playlist" }) {
  const thumb = `https://img.youtube.com/vi/${firstVideoId}/maxresdefault.jpg`;
  const lines = items.map(
    (it, i) =>
      `            l("${it.videoId}", "${escStr(it.title)}", ${it.durationMinutes}, ${i < 2 ? "true" : "false"}),`
  );

  return `    {
      courseTitle: '${escStr(courseTitle)}',
      courseDescription: \`${courseDescription.replace(/`/g, "\\`")}\`,
      courseThumbnail: "${thumb}",
      coursePrice: 0,
      discount: 0,
      isPublished: true,
      educator: "admin",
      enrolledStudents: [],
      courseRatings: [],
      courseContent: [
        {
          chapterId: "ch_${slug}_1",
          chapterOrder: 1,
          chapterTitle: "${chapterTitle}",
          chapterContent: (() => {
            const l = L("${slug}");
            return [
${lines.join("\n")}
            ];
          })(),
        },
      ],
    },`;
}

async function main() {
  if (!API_KEY) {
    console.error("Set YOUTUBE_API_KEY in server/.env or environment.");
    process.exit(1);
  }

  const blocks = [];

  for (const pl of PLAYLISTS) {
    console.log(`Fetching playlist ${pl.playlistId}...`);
    const [items, plTitle] = await Promise.all([
      fetchAllPlaylistItems(pl.playlistId),
      fetchPlaylistTitle(pl.playlistId),
    ]);
    if (!items.length) {
      console.warn(`  (empty) ${pl.playlistId}`);
      continue;
    }
    const ids = items.map((x) => x.videoId);
    const durMap = await fetchVideoDurations(ids);
    const enriched = items.map((it) => ({
      ...it,
      durationMinutes: durMap.get(it.videoId) || 20,
    }));
    const title = plTitle ? `${plTitle} (YouTube)` : pl.courseTitle;
    const desc =
      pl.courseDescription +
      (plTitle ? `<p><strong>Playlist:</strong> ${escStr(plTitle)}</p>` : "");
    blocks.push(
      buildCourseJs({
        slug: pl.slug,
        courseTitle: title,
        courseDescription: desc,
        firstVideoId: enriched[0].videoId,
        items: enriched,
      })
    );
    console.log(`  OK: ${enriched.length} videos`);
  }

  for (const s of SINGLES) {
    console.log(`Fetching single video ${s.videoId}...`);
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${s.videoId}&key=${API_KEY}`;
    const data = await fetchJson(url);
    const v = data.items?.[0];
    if (!v) {
      console.warn(`  missing video ${s.videoId}`);
      continue;
    }
    const title = v.snippet?.title || s.courseTitle;
    const minutes = isoDurationToMinutes(v.contentDetails?.duration || "PT60M");
    const item = { videoId: s.videoId, title, durationMinutes: minutes };
    blocks.push(
      buildCourseJs({
        slug: s.slug,
        courseTitle: title.includes("http") ? s.courseTitle : `${title} (YouTube)`,
        courseDescription: s.courseDescription + `<p><strong>Video:</strong> ${escStr(title)}</p>`,
        firstVideoId: s.videoId,
        items: [item],
        chapterTitle: "Video",
      })
    );
    console.log(`  OK: 1 video`);
  }

  const out = `/**
 * AUTO-GENERATED by scripts/fetchUserPlaylistCourses.js — do not edit by hand.
 * Re-run the script after changing playlists.
 */
export function getUserPlaylistCourses(yt) {
  const L = (prefix) => {
    let order = 1;
    return (videoId, title, minutes, isPreviewFree = true) => ({
      lectureId: \`lec_\${prefix}_\${videoId}\`,
      lectureTitle: title,
      lectureDuration: minutes,
      lectureUrl: yt(videoId),
      isPreviewFree: isPreviewFree,
      lectureOrder: order++,
    });
  };

  return [
${blocks.join("\n\n")}
  ];
}
`;

  const outPath = path.join(__dirname, "userPlaylistCourses.generated.js");
  fs.writeFileSync(outPath, out, "utf8");
  console.log(`\nWrote ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
