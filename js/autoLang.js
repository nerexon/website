const language = localStorage.getItem("language");
const splittedPath = window.location.pathname.split("/");
const hostname = window.location.hostname
const port = window.location.port;
const protocol = window.location.protocol;

function execute(){
    if(hostname !== "nerexon.com"){
        window.location.href = "https://nerexon.com/";
        return;
    }

    if(!splittedPath)return;
    if(!language)return;

    const pathLanguage = splittedPath[2] || null;

    if(pathLanguage){
        if(pathLanguage === language)return;

        splittedPath[0] = window.location.hostname + (port ? ":" + port : "");
        splittedPath[2] = language;
        
        const fullPath = protocol + "//" + splittedPath.join("/");
        window.location.href = fullPath;
        
    } else {
        splittedPath[0] = hostname + (port ? ":" + port : "");
        splittedPath[1] = "page";
        splittedPath[2] = language;

        const fullPath = protocol + "//" + splittedPath.join("/") + "/home.html";
        window.location.href = fullPath;
    }
}

execute();