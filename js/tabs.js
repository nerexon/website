const tabulationMenus = document.getElementsByClassName("tab-nav");
const mainSecret = document.getElementById("secret-0")

function show(element){

}

function hide(element){

}

function execute() {
    if(!tabulationMenus)return;
    if(!mainSecret)return;

    for(let menu of tabulationMenus){
        const buttons = menu.getElementsByTagName("a");

        for(let button of buttons){
            const buttonId = button.id.split("-")[1];
            const matchingSecret = document.getElementById(`secret-${buttonId}`);

            button.addEventListener("click", () => {
                if(matchingSecret.style.display !== "block"){
                    for(let secret of document.getElementsByClassName("secret-section")){
                        hide(secret);
                    }

                    show(matchingSecret)
                } else {
                    hide(matchingSecret)
                    show(mainSecret)
                }
            })
        }
    }
}

execute();