const usernameInput = document.getElementById("username");
const generateBtn = document.getElementById("generateBtn");

const selectedTheme = document.getElementById("theme");
const noName = document.getElementById("noName");
const noScrobbles = document.getElementById("noScrobbles");
const roundit = document.getElementById("roundit");

const resultDiv = document.getElementById("outputSection");

generateBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
    if (!username) {
      alert("Please enter a Last.fm username.");
      return;
    }

    const theme = selectedTheme.value || "dark";
    const noNameChecked = noName.checked;
    const noScrobblesChecked = noScrobbles.checked;
    const rounditChecked = roundit.checked;

  const thisSiteUrl = window.location.origin;

  const params = new URLSearchParams();
  params.set("username", username);
  params.set("theme", theme);
  if (noNameChecked) params.set("noName", "true");
  if (noScrobblesChecked) params.set("noScrobbles", "true");
  if (rounditChecked) params.set("roundit", "true");

  const queryString = `?${params.toString()}`;

  // generate markdown
  const generatedCode = `![${username}](${thisSiteUrl}/songdisplay${queryString})`;

  // update preview img
  const previewImg = document.getElementById("previewImg");
  previewImg.src = `/songdisplay${queryString}`;

    // display
    resultDiv.style.display = "block";
    resultDiv.querySelector("#outputText").textContent = generatedCode;
});