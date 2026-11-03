// High-quality page recording via the Chrome DevTools screencast.
//
// Playwright's built-in recordVideo encodes low-bitrate VP8, which smears text. Instead we take
// near-lossless JPEG frames straight from the compositor, each with its own timestamp, and encode
// once with x264. Real-time animations keep their speed because frame durations come from the
// timestamps.

import ffmpegPath from "ffmpeg-static";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const ffmpeg = (...args) => execFileSync(ffmpegPath, ["-y", "-loglevel", "error", ...args]);

/** Prefer installed Edge/Chrome (H.264 playback for sites with background video). */
export async function launchBrowser(chromium) {
  for (const channel of ["msedge", "chrome"]) {
    try {
      return await chromium.launch({ channel });
    } catch {}
  }
  return chromium.launch();
}

/**
 * Start recording `page`. Returns `stop(out, { width, height, crf })`, which encodes an MP4.
 * `maxWidth`/`maxHeight` cap the captured frame size (use the viewport × deviceScaleFactor).
 */
export async function startScreencast(page, { maxWidth, maxHeight, quality = 92 }) {
  const dir = mkdtempSync(join(tmpdir(), "cast-"));
  const cdp = await page.context().newCDPSession(page);
  const frames = [];

  cdp.on("Page.screencastFrame", async ({ data, metadata, sessionId }) => {
    const file = join(dir, `f${String(frames.length).padStart(5, "0")}.jpg`);
    writeFileSync(file, Buffer.from(data, "base64"));
    frames.push({ file, t: metadata.timestamp });
    await cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
  });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality, maxWidth, maxHeight, everyNthFrame: 1 });

  return async function stop(out, { width, height, crf = 20, fps = 30, endAt, maxSeconds }) {
    await cdp.send("Page.stopScreencast").catch(() => {});
    await cdp.detach().catch(() => {});
    if (frames.length < 2) throw new Error(`only ${frames.length} screencast frames captured`);

    // Frames arrive only when the page changes, so durations vary; the concat demuxer keeps them exact.
    const end = endAt ?? frames.at(-1).t + 1 / fps;
    const list = frames
      .map((f, i) => {
        const next = i + 1 < frames.length ? frames[i + 1].t : end;
        return `file '${f.file.replace(/\\/g, "/")}'\nduration ${Math.max(0.001, next - f.t).toFixed(4)}`;
      })
      .join("\n");
    const listFile = join(dir, "frames.txt");
    writeFileSync(listFile, `${list}\nfile '${frames.at(-1).file.replace(/\\/g, "/")}'\n`);

    ffmpeg(
      "-f", "concat", "-safe", "0", "-i", listFile,
      ...(maxSeconds ? ["-t", String(maxSeconds)] : []),
      "-vf", `fps=${fps},scale=${width}:${height}:flags=lanczos`,
      "-c:v", "libx264", "-preset", "slow", "-crf", String(crf), "-profile:v", "high",
      "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an", out,
    );
    rmSync(dir, { recursive: true, force: true });
    return { frames: frames.length, seconds: end - frames[0].t };
  };
}
