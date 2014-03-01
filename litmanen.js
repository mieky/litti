document.onreadystatechange = function () {
    if (document.readyState == "complete") {
        focusTransscript();
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

function focusTranscript() {
    document.querySelector(".transcript").focus()
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

var holder = document.getElementById('holder'),
    state = document.getElementById('status');

if (typeof window.FileReader !== 'undefined') {
    holder.classList.remove("hidden");
}

holder.ondragover = function () {
    this.className = 'hover';
    return false;
};

holder.ondragend = function () {
    this.className = '';
    return false;
};

holder.ondrop = function (e) {
    this.className = '';
    e.preventDefault();

    var file = e.dataTransfer.files[0],
        reader = new FileReader();

    reader.onload = function (event) {
        getAudio().src = event.target.result;
        getAudio().classList.remove("hidden");
        holder.classList.add("hidden");
        focusTranscript();
    };
    reader.readAsDataURL(file);

  return false;
};
