import express from "express";
import { configDotenv } from "dotenv";
import path from "path";
import fetch from "node-fetch";

configDotenv();

const app = express();
const PORT = process.env.PORT || 3000;
const lastfmApiKey = process.env.LASTFM_API_KEY;
const lastfmSharedSecret = process.env.LASTFM_SHARED_SECRET;

if (!lastfmApiKey || !lastfmSharedSecret) {
  console.error(
    "Error: LASTFM_API_KEY and LASTFM_SHARED_SECRET must be set in environment variables."
  );
  process.exit(1);
}

const pubFolder = path.join(process.cwd(), "public");

app.get("/", (req, res) => {
  res.sendFile(path.join(pubFolder, "index.html"));
});

app.get("/songdisplay", (req, res) => {
  const username = req.query.username;
  const lastfmRecentTrackUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${lastfmApiKey}&format=json`;

  if (!username) {
    return res.status(400).send("Username query parameter is required");
  }

  let apiResponse = fetch(lastfmRecentTrackUrl)
    .then((response) => response.json())
    .then((data) => {
      if (data.error) {
        return res.status(500).send("Error fetching data from Last.fm API");
      }
      res.json(data);
    });
  
    console.log("API Response:\n", apiResponse);
});

app.listen(PORT, () => {
  console.log(`readmefm is running on port ${PORT}`);
});
