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

function els(selector) { return document.querySelectorAll(selector); }
function el(selector)  { return els(selector)[0]; }

function forEls(selector, callback) {
    [].forEach.call(els(selector), callback);
}

function getAudio() {
    return document.getElementsByTagName("audio")[0];
}

function fileReady(filename) {
    el(".download-file").addEventListener("click", function(e) {
        e.preventDefault();
        download(filename);
    }, false);

    forEls(".hidden-until-ready", function(el) {
        el.classList.remove("hidden");
    });
    el(".dropbox").classList.add("hidden");

    getAudio().addEventListener("loadeddata", playerReady(filename), false);

    loadTranscript(filename);
    document.querySelector(".transcript").focus();
}

function playerReady(filename) {
    return function(e) {
        loadPosition(filename);

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
    };
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
dropbox.addEventListener("dragover", function(e) {
    e.preventDefault();
    this.classList.add("hover");
}, false);

dropbox.addEventListener("dragend", function(e) {
    e.preventDefault();
    this.classList.remove("hover");
}, false);

dropbox.addEventListener("drop", function(e) {
    e.preventDefault();
    this.classList.remove("hover");

    var file = e.dataTransfer.files[0],
        reader = new FileReader();

    reader.onload = function(event) {
        getAudio().src = event.target.result;
        fileReady(file.name);
    };
    reader.readAsDataURL(file);
}, false);

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
        var t = el(".transcript")
        // Set value, move caret to end, focus
        t.value = transcript;
        t.selectionStart = t.selectionEnd = t.value.length;
        t.focus();
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
    var rate = Math.round((getAudio().playbackRate + amount) * 10) / 10;
    if (rate >= 0.5 && rate <= 1.5) {
        getAudio().playbackRate = rate;
        el(".playback-rate").innerHTML = rate + 'x';
    }
}

// Listeners for both keydown and keypress are required because of
// how differently Chrome and Firefox handle keyboard events and codes.

document.addEventListener("keydown", function(e) {
    if (e.shiftKey && e.keyCode === KEYCODES.tab) {
        e.preventDefault();
        getAudio().currentTime += 5;
        return;
    }

    if (e.keyCode === KEYCODES.tab) { // tab
        e.preventDefault();
        getAudio().currentTime -= 5;
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
