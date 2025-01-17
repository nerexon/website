const englishButton = document.getElementById("en");
const frenchButton = document.getElementById("fr");

/**
 * 
 * @param {string} language New language to set
 */
function setLanguage(language) {
    localStorage.setItem("language", language);
}

function handleEnglish () {
    setLanguage("en");
}

function handleFrench () {
    setLanguage("fr");
}

englishButton.addEventListener("click", handleEnglish);
frenchButton.addEventListener("click", handleFrench);