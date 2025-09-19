import express from "express";
import { configDotenv } from "dotenv";
import path from "path";
import fetch from "node-fetch";
import svgMaker from "./svgMaker.js";
import fs from "fs";

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

const pubFolder = path.join(process.cwd(), "src", "public");

app.use(express.static(pubFolder));

let LOGO_DATA_URL = "";
try {
  const logoPath = path.join(pubFolder, "image.png");
  const logoBuffer = fs.readFileSync(logoPath);
  const base64 = logoBuffer.toString("base64");
  LOGO_DATA_URL = `data:image/png;base64,${base64}`;
} catch (e) {
  console.warn("Could not preload local logo image; SVG will omit logo.", e?.message || e);
}

async function toDataUrl(url) {
  if (!url) return null;
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const contentType = resp.headers.get("content-type") || "image/jpeg";
    const buf = Buffer.from(await resp.arrayBuffer());
    const b64 = buf.toString("base64");
    return `data:${contentType};base64,${b64}`;
  } catch (err) {
    console.error("Error fetching image for data URI:", err?.message || err);
    return null;
  }
}

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
    // Prepare album art as data URI to avoid broken images inside <img>-embedded SVGs
    let albumImageUrl = apiData?.recenttracks?.track?.[0]?.image?.[3]?.["#text"] || "";
    if (!albumImageUrl) {
      // fallback to smaller sizes if needed
      const images = apiData?.recenttracks?.track?.[0]?.image || [];
      for (let i = images.length - 1; i >= 0; i--) {
        if (images[i]?.["#text"]) { albumImageUrl = images[i]["#text"]; break; }
      }
    }
    const albumDataUri = await toDataUrl(albumImageUrl);

    const svgResponse = svgMaker(
      apiData,
      username,
      theme,
      hideUsername,
      scrobbleCount,
      roundit,
      albumDataUri,
      LOGO_DATA_URL
    ); // cook up svg
  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8"); // set content type
  res.setHeader("Cache-Control", "public, max-age=300, s-maxage=300"); // cache for 5 minutes
  res.setHeader("X-Content-Type-Options", "nosniff");
  return res.send(typeof svgResponse === "string" ? svgResponse.trimStart() : svgResponse); // return svg without leading whitespace
  } catch (error) {
    console.error("Error fetching data from Last.fm API:", error);
    return res.status(500).send("Error fetching data from Last.fm API");
  }
});

app.listen(PORT, () => {
  console.log(`readmefm is running on port ${PORT}`);
});
