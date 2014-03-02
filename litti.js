var TOGGLE_KEY_CODE = (function(platform) {
    return platform === "MacIntel" ? 192 : 220;
}(window.navigator.platform));

function els(selector) {
    return document.querySelectorAll(selector);
}

function el(selector) {
    return els(selector)[0];
}

function forEls(selector, callback) {
    [].forEach.call(els(selector), callback);
}

function getAudio() {
    return document.getElementsByTagName("audio")[0];
}

function ready(filename) {
    el(".download-file").addEventListener("click", function(e) {
        e.preventDefault();
        download(filename);
    }, false);

    forEls(".hidden-until-ready", function(el) { el.classList.remove("hidden"); });
    el(".dropbox").classList.add("hidden");

    var audio = getAudio();
    audio.addEventListener("loadeddata", function() {
        loadPosition(filename);

        // Save current progress till the end of time
        setInterval(function() {
            savePosition(filename);
            saveTranscript(filename);
        }, 1000);

        var playing = false;
        audio.addEventListener("play", function(e) {
            playing = true;
            (function animationLoop() {
                if (playing) {
                    requestAnimationFrame(animationLoop);
                }
                updateProgress();
            }());
        }, false);

        audio.addEventListener("pause", function(e) {
            playing = false;
        }, false);

        audio.addEventListener("seeked", updateProgress, false);
    }, false);

    loadTranscript(filename);
    document.querySelector(".transcript").focus();
}

function updateProgress() {
    el(".duration").style.width =
        (getAudio().currentTime * 100 / getAudio().duration) + '%';
}

function togglePlayState() {
    var audio = getAudio();
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

var dropbox = el(".dropbox");
dropbox.ondragover = function() {
    this.classList.add("hover");
    return false;
};

dropbox.ondragend = function() {
    this.classList.remove("hover");
    return false;
};

dropbox.ondrop = function(e) {
    this.classList.remove("hover");
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

function download(filename) {
    var filename = 'transcript_' + filename + '.txt';
    var text = el(".transcript").value;
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
}

function adjustPlaybackRate(amount) {
    var rate = Math.round((getAudio().playbackRate + amount) * 10) / 10;
    if (rate >= 0.5 && rate <= 1.5) {
        getAudio().playbackRate = rate;
        el(".playback-rate").innerHTML = rate + 'x';
    }
}

document.addEventListener("keydown", function(e) {
    if (e.shiftKey && e.keyCode === 9) { // shift-tab
        e.preventDefault();
        getAudio().currentTime += 5;
        return;
    }

    if (e.altKey && e.keyCode === 187) {
        e.preventDefault();
        return adjustPlaybackRate(.1);
    }

    if (e.altKey && e.keyCode === 189) {
        e.preventDefault();
        return adjustPlaybackRate(-.1);
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
}, false);

document.onreadystatechange = function() {
    if (document.readyState == "complete") {
        console.log("Ready!");
    }
}
