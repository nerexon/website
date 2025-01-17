const language = localStorage.getItem("language");
const splittedPath = window.location.pathname.split("/");

function execute(){
    if(!splittedPath)return;
    if(!language)return;

    const pathLanguage = splittedPath[2] || null;

    if(pathLanguage){
        if(pathLanguage === language)return;

        const port = window.location.port;
        const protocol = window.location.protocol;
        console.log(protocol)

        splittedPath[0] = window.location.hostname + (port ? ":" + port : "");
        splittedPath[2] = language;
        const fullPath = protocol + "//" + splittedPath.join("/");
        window.location.href = fullPath;
        
    }
}

execute()