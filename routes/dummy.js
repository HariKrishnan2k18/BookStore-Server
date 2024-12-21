import express from "express";
import ytdlp from "yt-dlp-exec";
import fs from "fs";
import path from "path";
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8001 });

const router = express.Router();
router.post("/formats", async (req, res) => {
  const { videoUrl } = req.body;

  if (!videoUrl) {
    return res.status(400).json({ error: "Video URL is required" });
  }

  try {
    const info = await ytdlp(videoUrl, { dumpSingleJson: true });
    const formats = info.formats.map(f => ({
      format_id: f.format_id,
      resolution: f.format_note || "Audio",
      ext: f.ext
    }));
    res.json({ formats, title: info.title });
  } catch (error) {
    console.error("Error fetching formats:", error);
    res.status(500).json({ error: "Failed to fetch formats." });
  }
});
router.post("/download", async (req, res) => {
  const { videoUrl, formatId } = req.body;

  if (!videoUrl || !formatId) {
    return res
      .status(400)
      .json({ error: "Video URL and format ID are required" });
  }

  try {
    const outputDir = "downloads";
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);
    const randomName = `video_${Math.random().toString(36).substring(7)}`;
    const outputTemplate = path.join(outputDir, `${randomName}.%(ext)s`);

    console.log("Downloading video with random name:", randomName);
    await ytdlp(videoUrl, {
      format: formatId,
      output: outputTemplate
    });
    const files = fs.readdirSync(outputDir);
    const downloadedFile = files.find(file => file.startsWith(randomName));

    if (downloadedFile) {
      const filePath = path.join(outputDir, downloadedFile);
      res.download(filePath, err => {
        if (err) {
          console.error("Error sending file:", err.message);
          res.status(500).json({ error: "Failed to send file." });
        }
        fs.unlink(filePath, err => {
          if (err) console.error("Error deleting file:", err.message);
        });
      });
    } else {
      res.status(500).json({ error: "Downloaded file not found." });
    }
  } catch (error) {
    console.error("Error during download:", error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
