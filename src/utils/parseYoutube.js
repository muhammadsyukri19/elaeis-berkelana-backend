// src/utils/parseYoutube.js

// Ambil ID video dari berbagai format YouTube URL:
// - https://www.youtube.com/watch?v=VIDEOID
// - https://youtu.be/VIDEOID
// - https://www.youtube.com/embed/VIDEOID
// - https://www.youtube.com/shorts/VIDEOID
// - https://m.youtube.com/watch?v=VIDEOID
// Juga handle query tambahan seperti &t=30s, &ab_channel=..., dsb.

export const extractYouTubeId = (input) => {
  if (!input || typeof input !== "string") return null;

  try {
    // Jika user kadang memasukkan langsung ID (panjang 11, alfanumerik/_/-)
    const maybeId = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(maybeId)) return maybeId;

    // Normalisasi ke URL
    const url = new URL(input);

    // 1) watch?v=VIDEOID
    const v = url.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

    // 2) youtu.be/VIDEOID
    // 3) /embed/VIDEOID
    // 4) /shorts/VIDEOID
    const path = url.pathname.replace(/^\/+|\/+$/g, ""); // trim slashes
    const segments = path.split("/");

    // youtu.be/<id>
    if (url.hostname.includes("youtu.be") && segments[0]) {
      const id = segments[0];
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }

    // youtube.com/embed/<id> atau youtube.com/shorts/<id>
    if (segments.length >= 2) {
      const [type, id] = segments;
      if ((type === "embed" || type === "shorts") && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return id;
      }
    }

    // 5) youtube.com/v/<id> (format lama)
    if (segments.length >= 2 && segments[0] === "v") {
      const id = segments[1];
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) return id;
    }

    return null;
  } catch {
    return null; // jika bukan URL valid, kembalikan null
  }
};

// Optional: default export supaya import default juga bisa dipakai
export default extractYouTubeId;
