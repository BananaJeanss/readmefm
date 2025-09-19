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

    let additionalParams;
    additionalParams = `?theme=${theme}`;
    if (noNameChecked) additionalParams += `&noName=true`;
    if (noScrobblesChecked) additionalParams += `&noScrobbles=true`;
    if (rounditChecked) additionalParams += `&roundit=true`;

    // generate markdown
    const generatedCode = `![${username}](${thisSiteUrl}/songdisplay/${username}${additionalParams})`;

    // display
    resultDiv.style.display = "block";
    resultDiv.querySelector("#outputText").textContent = generatedCode;
});