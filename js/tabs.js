const tabulationMenus = document.getElementsByClassName("tab-nav");
const mainSecret = document.getElementById("secret-0");

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

function hide(element, callback) {
    element.style.opacity = 0;
    element.style.transform = "scale(0.9)";
    setTimeout(() => {
        element.style.display = "none";
        if (callback) callback();
    }, 300);
}

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

document.addEventListener("DOMContentLoaded", execute);
