var currentFileName = null,
    autosaveTimer = null;

function el(selector) {
    return document.querySelector(selector);
}

function focusTranscript() {
    document.querySelector(".transcript").focus();
}

function getAudio() {
    return document.getElementsByTagName("audio")[0];
}

function ready(filename) {
    currentFileName = filename;

    getAudio().classList.remove("hidden");
    el(".help").classList.remove("hidden");
    holder.classList.add("hidden");


    getAudio().onloadeddata = function() {
        loadPosition(filename);

        delete autosaveTimer;
        autosaveTimer = setInterval(function() {
            console.log("Saving...");
            savePosition(filename);
            saveTranscript(filename);
        }, 1000);
    }
    loadTranscript(filename);
    focusTranscript();
}

function togglePlayState() {
    var audio = getAudio();
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

var holder = document.getElementById('holder');
holder.ondragover = function() {
    this.className = 'hover';
    return false;
};

holder.ondragend = function() {
    this.className = '';
    return false;
};

holder.ondrop = function(e) {
    this.className = '';
    e.preventDefault();

    var file = e.dataTransfer.files[0],
        reader = new FileReader();

    reader.onload = function(event) {
        getAudio().src = event.target.result;
        ready(file.name);
    };
    reader.readAsDataURL(file);

  return false;
};

function loadPosition(filename) {
    var position = localStorage.getItem("position_" + filename);
    if (position !== null) {
        getAudio().currentTime = parseFloat(position, 10);
    }
}

function savePosition(filename) {
    localStorage.setItem("position_" + filename,
        "" + getAudio().currentTime);
}

function loadTranscript(filename) {
    var transcript = localStorage.getItem("transcript_" + filename);
    if (transcript !== null) {
        el(".transcript").value = transcript;
    }
}

function saveTranscript(filename) {
    localStorage.setItem("transcript_" + filename, el(".transcript").value);
}

document.onkeydown = function(e) {
    if (e.altKey && e.keyCode === 9) { // alt-tab
        e.preventDefault();
        getAudio().currentTime -= 5;
        return;
    }

    if (e.keyCode === 9) { // tab
        e.preventDefault();
        togglePlayState();
    }
}

if (typeof window.FileReader !== 'undefined') {
    holder.classList.remove("hidden");
}

document.onreadystatechange = function() {
    if (document.readyState == "complete") {
        focusTranscript();
    }
}
