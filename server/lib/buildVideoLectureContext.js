import { fetchTranscript } from "youtube-transcript/dist/youtube-transcript.esm.js";
import { extractYoutubeVideoId } from "./extractYoutubeVideoId.js";

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Build text context for the CURRENT lecture’s video: transcript + YouTube snippet (if API key) + LMS metadata.
 */
export async function buildVideoLectureContext({ course, lecture, chapterTitle }) {
  const videoId = extractYoutubeVideoId(lecture?.lectureUrl);

  let transcriptText = "";
  if (videoId) {
    try {
      const chunks = await fetchTranscript(videoId);
      transcriptText = chunks
        .map((c) => c.text)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
    } catch {
      transcriptText = "";
    }
  }

  const maxTranscript = 14000;
  if (transcriptText.length > maxTranscript) {
    transcriptText = `${transcriptText.slice(0, maxTranscript)}\n[...truncated for length...]`;
  }

  let youtubeTitle = "";
  let youtubeDescription = "";
  const apiKey = process.env.YOUTUBE_API_KEY?.trim();
  if (videoId && apiKey) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${encodeURIComponent(
        videoId
      )}&key=${encodeURIComponent(apiKey)}`;
      const r = await fetch(url);
      const data = await r.json();
      const sn = data?.items?.[0]?.snippet;
      if (sn) {
        youtubeTitle = sn.title || "";
        youtubeDescription = sn.description || "";
      }
    } catch {
      /* optional enrichment */
    }
  }

  const courseDesc = stripHtml(course?.courseDescription || "").slice(0, 4000);

  const contextBlock = `
Course: ${course?.courseTitle || ""}
Course overview (excerpt): ${courseDesc.slice(0, 2500)}
Chapter / section: ${chapterTitle || ""}
LMS lecture title: ${lecture?.lectureTitle || ""}
YouTube video ID: ${videoId || "(not a YouTube URL — use LMS title only)"}
YouTube title: ${youtubeTitle || "(not fetched)"}
YouTube description (excerpt):
${youtubeDescription.slice(0, 6000)}

Video transcript ${transcriptText.length > 80 ? "(from captions / auto-captions)" : "(not available — use title, description, and LMS title only)"}:
${transcriptText || "(none)"}
`.trim();

  return {
    videoId,
    contextBlock,
    hasTranscript: transcriptText.length > 80,
  };
}
