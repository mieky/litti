document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        document.querySelector(".transcript").focus()
    }
}

document.onkeydown = function(e) {
    if (e.altKey && e.keyCode === 9) {
        e.preventDefault();
        getAudio().currentTime -= 5;
        return;
    }
    if (e.keyCode === 9) {
        e.preventDefault();
        togglePlayState();
    }

}

function getAudio() {
    return document.getElementsByTagName("audio")[0];
}

function togglePlayState() {
    var audio = getAudio();
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}
