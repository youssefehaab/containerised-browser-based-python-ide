window.nightMode = true;

function changeTheme() {
    if(window.nightMode) {
        //css file
        document.getElementById('css').setAttribute("href", "dayMode.css");
        //code editor theme
        editor.setOption("theme", "idea");
        //theme button
        let themeButton = document.getElementById('themeButton');
        themeButton.innerHTML = "☽";
        //set nightMode to false
        window.nightMode = false;
    } else {
        //css file
        document.getElementById('css').setAttribute("href", "nightMode.css");
        //code editor theme
        editor.setOption("theme", "dracula");
        //theme button
        let themeButton = document.getElementById('themeButton');
        themeButton.innerHTML = "☀";
        //set nightMode to true
        window.nightMode = true;
    }
}

const label = document.getElementById('label')
const accordion = document.getElementsByClassName('contentBox');
label.addEventListener('click', function(){
    accordion[0].classList.toggle('active');
})