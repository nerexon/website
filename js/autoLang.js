const language = localStorage.getItem("language");
const splittedPath = window.location.pathname.split("/");
const hostname = window.location.hostname
const port = window.location.port;
const protocol = window.location.protocol;

if(hostname !== "nerexon.com"){
    window.location.href = "https://nerexon.com/";
}

function execute(){
    if(!splittedPath)return;

    const pathLanguage = splittedPath[2] || null;

    if(pathLanguage){
        if(!language)return;
        if(pathLanguage === language)return;

        splittedPath[0] = window.location.hostname + (port ? ":" + port : "");
        splittedPath[2] = language;
        
        const fullPath = protocol + "//" + splittedPath.join("/");
        window.location.href = fullPath;
        
    } else {
        if(hostname !== "nerexon.com" && !language){
            window.location.href = "https://nerexon.com/";
            return;
        } else if(language){
            splittedPath[0] = "nerexon.com";
            splittedPath[1] = "page";
            splittedPath[2] = language;

            const fullPath = protocol + "//" + splittedPath.join("/") + "/home.html";
            window.location.href = fullPath;
        }
    }
}

execute();