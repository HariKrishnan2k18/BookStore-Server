import express from "express";
import ytdlp from "yt-dlp-exec";
import { spawn } from "child_process";

const router = express.Router();
router.post("/formats", async (req, res) => {
  const { videoUrl } = req.body;
  if (!videoUrl) {
    return res.status(400).json({ error: "Video URL is required" });
  }
  try {
    const metadata = await ytdlp(videoUrl, { dumpSingleJson: true });
    const videoWithAudioFormats = metadata.formats.filter(
      format => format.vcodec !== "none" && format.acodec !== "none"
    );

    const audioOnlyFormats = metadata.formats.filter(
      format =>
        format.vcodec === "none" &&
        format.acodec !== "none" &&
        format.size !== "unknown" &&
        format.audio_bitrate !== "unknown" &&
        !["webm", "mp4"].includes(format.ext) &&
        !/^[0-9]+$/.test(format.format_id)
    );

    const mappedVideoWithAudioFormats = videoWithAudioFormats.map(format => ({
      format_id: format.format_id,
      resolution: format.format_note || `${format.width}x${format.height}`,
      ext: format.ext,
      size: format.filesize
        ? (Number(format.filesize) / (1024 * 1024)).toFixed(2)
        : "Unknown"
    }));

    const mappedAudioOnlyFormats = audioOnlyFormats.map(format => ({
      format_id: format.format_id,
      ext: format.ext,
      size: format.filesize
        ? (Number(format.filesize) / (1024 * 1024)).toFixed(2)
        : "Unknown",
      audio_bitrate: format.abr ? `${format.abr} kbps` : "Unknown"
    }));
    const thumbnail = metadata.thumbnail;

    res.json({
      title: metadata.title,
      thumbnail: thumbnail,
      video: mappedVideoWithAudioFormats,
      audio: mappedAudioOnlyFormats
    });
  } catch (error) {
    console.error("Error fetching formats:", error.message);
    res.status(500).json({ error: "Failed to fetch formats." });
  }
});
router.post("/download", async (req, res) => {
  const { videoUrl, formatId } = req.body;

  if (!videoUrl || !formatId) {
    return res.status(400).send("Video URL and format ID are required.");
  }

  try {
    console.log("Starting download for:", videoUrl);
    console.log("Using format ID:", formatId);
    const downloadProcess = await spawn("yt-dlp", [
      "-f",
      formatId,
      "-o",
      "-",
      videoUrl
    ]);
    res.setHeader("Content-Disposition", 'attachment; filename="video.mp4"');
    res.setHeader("Content-Type", "video/mp4");
    downloadProcess.stdout.pipe(res);
    downloadProcess.stderr.on("data", data => {
      console.error("Error during streaming:", data.toString());
    });
    downloadProcess.on("error", err => {
      console.error("yt-dlp process failed:", err);
      res.status(500).send("Error streaming video.");
    });
    downloadProcess.on("close", code => {
      if (code !== 0) {
        console.error(`yt-dlp process exited with code: ${code}`);
      }
    });
  } catch (error) {
    console.error("Error during video streaming:", error.message);
    res.status(500).send("Failed to stream video.");
  }
});

export default router;
