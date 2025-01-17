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

if(englishButton){
    englishButton.addEventListener("click", handleEnglish);
}

if(frenchButton){
    frenchButton.addEventListener("click", handleFrench);
}