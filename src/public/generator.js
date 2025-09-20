const usernameInput = document.getElementById("username");
const generateBtn = document.getElementById("generateBtn");

const selectedTheme = document.getElementById("theme");
const noName = document.getElementById("noName");
const noScrobbles = document.getElementById("noScrobbles");
const roundit = document.getElementById("roundit");

const resultDiv = document.getElementById("outputSection");

function ThingyFunction() {
  const username = usernameInput.value.trim();
  if (!username) {
    alert("Please enter a Last.fm username.");
    return;
  }
  if (username.length > 15) {
    alert("Username is too long. Maximum length is 15 characters.");
    return;
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    alert(
      "Invalid username. Only letters, numbers, underscores, and hyphens are allowed."
    );
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
}

usernameInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    ThingyFunction();
  }
});

generateBtn.addEventListener("click", () => {
  ThingyFunction();
});
