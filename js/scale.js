const scaleContainer = document.getElementsByClassName("list-nav")

function implement() {
    if(!scaleContainer)return;
    
    for(let containers of scaleContainer){
        for(let item of containers.getElementsByTagName("a")){
            item.addEventListener("mouseover", () => {
                item.style.fontSize = "1.2em";
            });

            item.addEventListener("mouseout", () => {
                item.style.fontSize = "1em";
            });
        }
    }
}

implement();