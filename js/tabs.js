/**
 * @const {HTMLCollectionOf<Element>} tabulationMenus - A collection of all elements with the class "tab-nav" that contain tab navigation.
 * @const {HTMLElement} mainSecret - The main secret content element with ID "secret-0".
 */
const tabulationMenus = document.getElementsByClassName("tab-nav");
const mainSecret = document.getElementById("secret-0");

/**
 * Shows the specified element with a transition effect.
 * 
 * @param {HTMLElement} element - The element to be shown.
 */
function show(element) {
    element.style.display = "block";
    element.style.opacity = 0;
    element.style.transform = "scale(0.9)";
    element.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    setTimeout(() => {
        element.style.opacity = 1;
        element.style.transform = "scale(1)";
    }, 10);
}

/**
 * Hides the specified element with a transition effect and executes a callback once completed.
 * 
 * @param {HTMLElement} element - The element to be hidden.
 * @param {function} [callback] - The callback function to execute once the hiding transition is complete.
 */
function hide(element, callback) {
    element.style.opacity = 0;
    element.style.transform = "scale(0.9)";
    setTimeout(() => {
        element.style.display = "none";
        if (callback) callback();
    }, 300);
}

/**
 * Initializes the tabulation menu interactions and binds event listeners to the buttons.
 * It shows and hides content sections based on user interaction with the tab buttons.
 */
function execute() {
    if (!tabulationMenus) return;
    if (!mainSecret) return;

    mainSecret.style.display = "block";
    mainSecret.style.opacity = 1;
    mainSecret.style.transform = "scale(1)";
    mainSecret.style.transition = "opacity 0.3s ease, transform 0.3s ease";

    for (let menu of tabulationMenus) {
        const buttons = menu.getElementsByTagName("a");

        for (let button of buttons) {
            const buttonId = button.id.split("-")[1];
            const matchingSecret = document.getElementById(`secret-${buttonId}`);

            button.addEventListener("click", (event) => {
                event.preventDefault();
                
                const activeSecret = document.querySelector(".secret-section[style*='display: block']");
                
                if (activeSecret === matchingSecret) {
                    hide(matchingSecret, () => show(mainSecret));
                } else {
                    if (activeSecret) {
                        hide(activeSecret, () => show(matchingSecret));
                    } else {
                        show(matchingSecret);
                    }
                }
            });
        }
    }
}

// Initialize the tabulation menu after the DOM content is loaded.
document.addEventListener("DOMContentLoaded", execute);
