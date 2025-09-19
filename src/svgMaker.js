export default function svgMaker(data, whosListening, theme, hideUsername, scrobbleCount) {
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

  let scrobbleText = `<text x="170" y="120" fill="${textColor}" font-size="14">Scrobbles: ${scrobbleCount}</text>`;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="200">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap');
            text { font-family: 'Montserrat', Arial, sans-serif; }
        </style>
        <rect width="100%" height="100%" fill="${bgColor}" />
        <rect width="100%" height="20%" fill="#E31B23" />
        <image href="${logoUrl}" x="10" y="6" width="30" height="30" />
        <text x="50" y="28" fill="white" font-size="20">${playStatus}</text>
        <image href="${imageUrl}" x="10" y="50" width="140" height="140" />
        <text x="170" y="70" fill="${textColor}" font-size="16">${song} - ${artist}</text>
        <text x="170" y="90" fill="${textColor}" font-size="14">${album}</text>
        <line x1="170" y1="100" x2="470" y2="100" stroke="${textColor}" stroke-width="2"/>
        ${useScrobbles ? scrobbleText : ''}
    </svg>
`;
}
