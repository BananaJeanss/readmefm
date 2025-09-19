export default function svgMaker(
  data,
  whosListening,
  theme,
  hideUsername,
  scrobbleCount,
  roundit
) {
  const track = data.recenttracks.track[0]; // latest track
  const artist = track.artist["#text"];
  const song = track.name;
  const album = track.album["#text"];
  const imageUrl = track.image[3]["#text"];
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
  const logoUrl =
    "https://www.last.fm/static/images/lastfm_avatar_twitter.52a5d69a85ac.png";

  let scrobbleText = `<text x="170" y="125" fill="${textColor}" font-size="14">Scrobbles: ${scrobbleCount}</text>`;

  let baseRect = `<rect width="100%" height="100%" fill="${bgColor}" rx="16" ry="16" />`;
  let topRectThingy = `<path d="M0,16 A16,16 0 0 1 16,0 H784 A16,16 0 0 1 800,16 V40 H0 Z" fill="#E31B23" />`;
  if (!roundit) {
    baseRect = `<rect width="100%" height="100%" fill="${bgColor}" />`;
    topRectThingy = `<rect width="100%" height="40" fill="#E31B23" />`;
  }

  let cookupSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="200">
            <style>
                    @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
                    text { font-family: 'Montserrat', Arial, sans-serif; }
            </style>
            ${baseRect}
            ${topRectThingy}
            <image href="${logoUrl}" x="20" y="6" width="30" height="30" />
            <text x="65" y="28" fill="white" font-size="20">${playStatus}</text>
            <image href="${imageUrl}" x="20" y="60" width="120" height="120" />
            <text x="170" y="75" fill="${textColor}" font-size="16">${song} - ${artist}</text>
            <text x="170" y="95" fill="${textColor}" font-size="14">${album}</text>
            <line x1="170" y1="105" x2="470" y2="105" stroke="${textColor}" stroke-width="2"/>
            ${useScrobbles ? scrobbleText : ""}
    </svg>
    `;
  return cookupSvg;
}
