function isFirefox() {
    return window.navigator.userAgent.indexOf("Firefox") !== -1;
}

var KEYCODES = (function(platform, isFirefox) {
    return {
        tab: 9,
        plus: isFirefox ? 171 : 187,
        minus: isFirefox ? 173 : 189
    }
}(window.navigator.platform, isFirefox()));

var CHARCODES = {
    toggle: 167
};

function checkCompatibility() {
    // TODO: do feature detection
}

function el(selector) {
    return document.querySelector(selector);
}

function getMedia() {
    return el(".media");
}

function fileReady(filename) {
    getMedia().addEventListener("loadeddata",
        playerReady(filename), false);

    el(".intro").classList.add("hidden");
    el(".dropbox").classList.add("hidden");
    el(".transcript").classList.remove("hidden");
    loadTranscript(filename);
    document.querySelector(".transcript").focus();
}

function showUI() {
    if (!isFirefox()) {
        el(".download-file").classList.remove("hidden");
        el(".download-file").addEventListener("click", function(e) {
            e.preventDefault();
            download(filename);
        }, false);
    }

    el(".duration-container").classList.add("ready");
    el(".help").classList.remove("hidden");
    el(".count").classList.remove("hidden");
}

function playerReady(filename) {
    return function(e) {
        loadPosition(filename);
        setMarker(".end-time", this.duration);

        // Save current progress till the end of time
        setInterval(function() {
            savePosition(filename);
            saveTranscript(filename);
        }, 1000);

        var playing = false;
        this.addEventListener("play", function(e) {
            playing = true;
            (function animationLoop() {
                if (playing) {
                    requestAnimationFrame(animationLoop);
                }
                updateProgress();
            }());
        }, false);

        this.addEventListener("pause", function(e) {
            playing = false;
        }, false);

        this.addEventListener("seeked", updateProgress, false);

        showUI();
    };
}

function setMarker(sel, time) {
    function pad(number) {
        return (number < 10 ? '0' + number : number);
    }
    var mins = Math.floor(time / 60);
    var seconds = parseInt(time % 60, 10);
    el(sel).innerHTML = pad(mins) + ':' + pad(seconds);
}

function updateProgress() {
    el(".duration").style.width =
        (getMedia().currentTime * 100 / getMedia().duration) + '%';
    setMarker(".current-time", getMedia().currentTime);
}

function togglePlayState() {
    var audio = getMedia();
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }
}

var dropbox = el(".dropbox");
dropbox.addEventListener("dragover", function(e) {
    e.preventDefault();
    this.classList.add("hover");
}, false);

dropbox.addEventListener("dragleave", function(e) {
    this.classList.remove("hover");
});

dropbox.addEventListener("dragend", function(e) {
    e.preventDefault();
    this.classList.remove("hover");
}, false);

dropbox.addEventListener("drop", function(e) {
    e.preventDefault();
    this.classList.remove("hover");
    el(".dropbox-info").innerHTML = "Loading...";

    var file = e.dataTransfer.files[0],
        reader = new FileReader();

    reader.onload = function(event) {
        getMedia().src = event.target.result;
        fileReady(file.name);
    };
    reader.readAsDataURL(file);
}, false);


function getDurationClickSeconds(e) {
    var percent = e.clientX / el(".duration-container").offsetWidth;
    return percent * getMedia().duration;
}

el(".duration-container").addEventListener("mousemove", function(e) {
    var currentSeconds = getDurationClickSeconds(e);
    setMarker(".current-time", currentSeconds);
}, false);

el(".duration-container").addEventListener("mouseout", function(e) {
    setMarker(".current-time", getMedia().currentTime);
}, false);

el(".duration-container").addEventListener("click", function(e) {
    var currentSeconds = getDurationClickSeconds(e);
    getMedia().currentTime = currentSeconds;
    el(".transcript").focus();
});

function loadPosition(filename) {
    var position = localStorage.getItem("position_" + filename);
    if (position !== null) {
        getMedia().currentTime = parseFloat(position, 10);
    }
}

function savePosition(filename) {
    localStorage.setItem("position_" + filename,
        "" + getMedia().currentTime);
}

function loadTranscript(filename) {
    var transcript = localStorage.getItem("transcript_" + filename);
    if (transcript !== null) {
        el(".transcript").value = transcript;
        positionCaretAndFocus();
        updateWordCount();
    }
}

function positionCaretAndFocus() {
    var t = el(".transcript");
    t.selectionStart = t.selectionEnd || t.value.length;
    t.focus();
}

function saveTranscript(filename) {
    localStorage.setItem("transcript_" + filename, el(".transcript").value);
}

function updateWordCount() {
    var count = el(".transcript").value.trim().split(/\s+/).length;
    el(".word-count").innerHTML = count;
}

// Doesn't work on Firefox :-(
function download(filename) {
    var filename = 'transcript_' + filename + '.txt';
    var text = el(".transcript").value;
    var pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    pom.setAttribute('download', filename);
    pom.click();
}

function adjustPlaybackRate(amount) {
    var rate = Math.round((getMedia().playbackRate + amount) * 10) / 10;
    if (rate >= 0.5 && rate <= 1.5) {
        getMedia().playbackRate = rate;
        el(".playback-rate").innerHTML = rate + 'x';
    }
}

// Listeners for both keydown and keypress are required because of
// how differently Chrome and Firefox handle keyboard events and codes.

document.addEventListener("keydown", function(e) {
    if (e.shiftKey && e.keyCode === KEYCODES.tab) {
        e.preventDefault();
        getMedia().currentTime += 5;
        return;
    }

    if (e.keyCode === KEYCODES.tab) { // tab
        e.preventDefault();
        getMedia().currentTime -= 5;
        return;
    }

    if (e.altKey && e.keyCode === KEYCODES.plus) {
        e.preventDefault();
        return adjustPlaybackRate(.1);
    }

    if (e.altKey && e.keyCode === KEYCODES.minus) {
        e.preventDefault();
        return adjustPlaybackRate(-.1);
    }

}, false);

document.addEventListener("keypress", function(e) {
    // §: Firefox only returns e.charCode on keypress, not keydown.
    // Also, keyCode doesn't work for this character, because in FF it's 0.
    if (e.charCode === CHARCODES.toggle) {
        e.preventDefault();
        togglePlayState();
        return;
    }

    // Other than [a..zA..Z]. keyCode would have been cooler, but it
    // only works in Chrome. Luckily, it doesn't hurt if we update the
    // word count a bit more often than required.
    if (e.charCode < 65 || e.charCode > 122) {
        updateWordCount();
    }
}, false);

document.onreadystatechange = function() {
    if (document.readyState == "complete") {
        console.log("Ready!");
        checkCompatibility();
    }
}
