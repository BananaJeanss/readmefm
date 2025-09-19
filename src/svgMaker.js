export default function svgMaker(
  data,
  whosListening,
  theme,
  hideUsername,
  scrobbleCount,
  roundit,
  albumDataUri,
  logoDataUri,
  fontDataUri
) {
  // escape XML entities
  const escapeXml = (value) =>
    String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");

  const track = data.recenttracks.track[0]; // latest track
  const artist = escapeXml(track.artist["#text"]);
  const song = escapeXml(track.name);
  const album = escapeXml(track.album["#text"]);
  const imageUrl = escapeXml(track.image[3]["#text"]);
  const isNowPlaying = track["@attr"] && track["@attr"].nowplaying === "true";
  let playStatus = isNowPlaying
    ? whosListening
      ? `${whosListening} is listening to`
      : "Now Playing"
    : `${whosListening}'s Last Played`;
  if (hideUsername) {
    playStatus = isNowPlaying ? "Now Playing" : "Last Played";
  }
  const bgColor = theme === "light" ? "#FFFFFF" : "#000000";
  const textColor = theme === "light" ? "#000000" : "#FFFFFF";
  let useScrobbles = true;
  if (scrobbleCount == "nope") {
    useScrobbles = false;
  } else {
    if (scrobbleCount == "N/A") {
      useScrobbles = false;
    }
  }

  const lastfmcolor = "#E31B23";
  const logoUrl = logoDataUri || "";

  let scrobbleText = `<text x="170" y="125" fill="${textColor}" font-size="14">Scrobbles: ${escapeXml(scrobbleCount)}</text>`;

  let baseRect = `<rect width="100%" height="100%" fill="${bgColor}" rx="16" ry="16" />`;
  let topRectThingy = `<path d="M0,16 A16,16 0 0 1 16,0 H784 A16,16 0 0 1 800,16 V40 H0 Z" fill="#E31B23" />`;
  if (!roundit) {
    baseRect = `<rect width="100%" height="100%" fill="${bgColor}" />`;
    topRectThingy = `<rect width="100%" height="40" fill="#E31B23" />`;
  }

  // inline album art or fallback
  const albumBlock = albumDataUri
    ? `<image href="${escapeXml(albumDataUri)}" x="20" y="60" width="120" height="120" />`
    : `
        <rect x="20" y="60" width="120" height="120" fill="#333"/>
        <text x="80" y="125" text-anchor="middle" fill="#bbb" font-size="12" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif;">No Art</text>
      `;

  const logoBlock = logoUrl
    ? `<image href="${escapeXml(logoUrl)}" x="20" y="6" width="30" height="30" />`
    : "";

  const fontFaceCss = fontDataUri
    ? `@font-face{font-family:'Montserrat';font-style:normal;font-weight:500;src:url(${fontDataUri}) format('woff2');font-display:swap;}`
    : "";

  let cookupSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200" role="img" aria-label="${escapeXml(playStatus)}: ${song} - ${artist}">
        <style>
                ${fontFaceCss}
                text { font-family: 'Montserrat', 'Segoe UI', SegoeUI, -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', Arial, sans-serif; font-weight: 500; }
        </style>
  ${baseRect}
  ${topRectThingy}
  ${logoBlock}
  <text x="65" y="28" fill="white" font-size="20">${escapeXml(playStatus)}</text>
  ${albumBlock}
  <text x="170" y="75" fill="${textColor}" font-size="16">${song} - ${artist}</text>
  <text x="170" y="95" fill="${textColor}" font-size="14">${album}</text>
  <line x1="170" y1="105" x2="470" y2="105" stroke="${textColor}" stroke-width="2"/>
  ${useScrobbles ? scrobbleText : ""}
</svg>`;
  return cookupSvg;
}
