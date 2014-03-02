var currentFileName = null,
    autosaveTimer = null,
    playheadTimer = null;

var TOGGLE_KEY_CODE = (function(platform) {
    if (platform === "MacIntel") {
        return 192;
    }
    return 220;
}(window.navigator.platform));

function els(selector) {
    return document.querySelectorAll(selector);
}

function el(selector) {
    return els(selector)[0];
}

function focusTranscript() {
    document.querySelector(".transcript").focus();
}

function getAudio() {
    return document.getElementsByTagName("audio")[0];
}

function ready(filename) {
    currentFileName = filename;

    [].forEach.call(els(".hidden-until-ready"), function(e) {
        e.classList.remove("hidden");
    });
    holder.classList.add("hidden");

    var audio = getAudio();
    audio.onloadeddata = function() {
        loadPosition(filename);

        delete autosaveTimer;
        autosaveTimer = setInterval(function() {
            savePosition(filename);
            saveTranscript(filename);
        }, 1000);

        delete playheadTimer;
        var durationStyle = el(".duration").style;
        playheadTimer = setInterval(function() {
            durationStyle.width = (audio.currentTime * 100 / audio.duration) + '%';
        }, 50);
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
        updateWordCount();
    }
}

function saveTranscript(filename) {
    localStorage.setItem("transcript_" + filename, el(".transcript").value);
}

function updateWordCount() {
    var count = el(".transcript").value.trim().split(/\s+/).length;
    el(".word-count").innerHTML = count;
}

function download() {
    var filename = 'transcript_' + currentFileName + '.txt';
    var text = el(".transcript").value;
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
}

document.onkeydown = function(e) {
    if (e.shiftKey && e.keyCode === 9) { // shift-tab
        e.preventDefault();
        getAudio().currentTime += 5;
        return;
    }

    if (e.keyCode === 9) { // tab
        e.preventDefault();
        getAudio().currentTime -= 5;
        return;
    }

    if (e.keyCode === TOGGLE_KEY_CODE) { // §
        e.preventDefault();
        togglePlayState();
        return;
    }

    if (e.keyCode < 65 || e.keyCode > 90) { // other than a..z
        updateWordCount();
    }
}

if (typeof window.FileReader !== 'undefined') {
    holder.classList.remove("hidden");
}

document.onreadystatechange = function() {
    if (document.readyState == "complete") {
        el(".download-file").addEventListener("click", download, false);
    }
}
