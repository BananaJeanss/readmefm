import express from "express";
import { configDotenv } from "dotenv";
import path from "path";
import fetch from "node-fetch";
import svgMaker from "./svgMaker.js";

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

app.get("/", (req, res) => { // index thingy
  res.sendFile(path.join(pubFolder, "index.html"));
});

app.get("/songdisplay", async (req, res) => {
  // query params
  const username = req.query.username;
  const theme = req.query.theme || "dark";
  const hideUsername = req.query.noName === "true";
  const noScrobbles = req.query.noScrobbles === "true";
  const roundit = req.query.roundit === "true";

  // last track url
  const lastfmRecentTrackUrl = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${lastfmApiKey}&format=json`;

  if (!username) { // no username provided
    return res.status(400).send("Username query parameter is required");
  }

  try { // get last song from last.fm
    const apiResponse = await fetch(lastfmRecentTrackUrl);
    if (!apiResponse.ok) {
      return res
        .status(apiResponse.status)
        .send(`Error from Last.fm API: ${apiResponse.statusText}`);
    }
    const apiData = await apiResponse.json();

    // get scrobbles count for that song
    let scrobbleCount = "nope";
    if (!noScrobbles) {
      try {
        const scrobbleCountApi = await fetch(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&artist=${encodeURIComponent(apiData.recenttracks.track[0].artist["#text"])}&track=${encodeURIComponent(apiData.recenttracks.track[0].name)}&user=${username}&api_key=${lastfmApiKey}&format=json`);
        const scrobbleCountData = await scrobbleCountApi.json();
        if (scrobbleCountData && scrobbleCountData.track && scrobbleCountData.track.userplaycount) {
          scrobbleCount = scrobbleCountData.track.userplaycount;
        } else {
          scrobbleCount = 0;
        }
      } catch (error) {
        console.error("Error fetching scrobble count:", error);
        scrobbleCount = "N/A";
      }
    }
    const svgResponse = svgMaker(apiData, username, theme, hideUsername, scrobbleCount, roundit); // cook up svg
    return res.send(svgResponse); // return svg
  } catch (error) {
    console.error("Error fetching data from Last.fm API:", error);
    return res.status(500).send("Error fetching data from Last.fm API");
  }
});

app.listen(PORT, () => {
  console.log(`readmefm is running on port ${PORT}`);
});
