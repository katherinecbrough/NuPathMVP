const express = require("express");
const multer = require("multer");
const ffmpeg = require("fluent-ffmpeg");
const stream = require("stream");
const cors = require("cors");

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const port = 5000;

ffmpeg.setFfmpegPath(
  "C:/ffmpeg-master-latest-win64-gpl-shared/ffmpeg-master-latest-win64-gpl-shared/bin/ffmpeg.exe"
);

app.use(cors());
app.use(express.json());

app.post("/convert", upload.single("audio"), async (req, res) => {
  if (!req.file) {
    console.error("No file uploaded");
    return res.status(400).send("No audio file received");
  }

  console.log("Received file:", req.file.originalname);

  const inputBuffer = req.file.buffer;
  const inputStream = new stream.PassThrough();
  inputStream.end(inputBuffer); // ✅ Properly push the buffer into the stream

  const outputStream = new stream.PassThrough();

  ffmpeg()
    .input(inputStream)
    .inputFormat("m4a") // Explicitly set input format
    .audioCodec("pcm_s16le") // Use WAV codec
    .audioChannels(1) // Mono audio channel
    .audioFrequency(16000) // Google Speech-to-Text recommended frequency
    .format("wav") // Output as WAV
    .on("start", (cmd) => console.log("FFmpeg Command:", cmd)) // Debugging FFmpeg command
    .on("error", (err) => {
      console.error("FFmpeg error:", err);
      res.status(500).send("FFmpeg processing error");
    })
    .on("end", () => console.log("Conversion complete"))
    .pipe(outputStream, { end: true }); // Ensure to close the output stream

  res.set({
    "Content-Type": "audio/wav",
    "Content-Disposition": "attachment; filename=converted.wav",
  });

  outputStream.pipe(res); // Stream directly without saving to disk
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
