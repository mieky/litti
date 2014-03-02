litti
=====

Transcript an audio file in the comfort of your browser.

![](https://raw.github.com/mieky/litti/master/litti.png)

### Features

- upload custom audio file by drag & drop
- play audio & write stuff
- comfortable hotkeys for play & pause, rewind & fast forward, set speed
- automatically store playhead position & transcript progress in localStorage
- count words
- download transcript as UTF-8 plaintext
- progress bar

### Demo

There's an instance running at http://mike.fi/litti/. Everything happens inside the browser, so if you find it useful, nothing prevents you from doing actual work with it. Have fun!

### Running

Tested and should work with an up-to-date Google Chrome, both on OS X and Windows.

More specifically, litti uses the following HTML5 features:

- [&lt;audio&gt; element](http://caniuse.com/audio)
- [FileReader API](http://caniuse.com/filereader)
- [classList API](http://caniuse.com/classlist)
- [requestAnimationFrame](http://caniuse.com/requestanimationframe)

(If you were to serve the audio from the server in the src tag instead of letting the user upload it, you would need a HTTP server which supports HTTP 1.1 byte ranges to enable audio seeking
&mdash; for lightweight development purposes, [https://github.com/smgoller/rangehttpserver](rangehttpserver) does it right!)

### Todo:

- browser support detection
- seeking with progress bar
- fix Firefox compatibility issues: play/pause button, textarea height, etc.

### FAQ

Q. **What's with the name and the logo?**

A. [Jari 'Litti' Litmanen](https://en.wikipedia.org/wiki/Jari_Litmanen) has his own special way of doing a 'thumbs up'. Also, transscription is called *litterointi* in Finnish.

### License

MIT

The sample Roswell sound is from [freesound.org](http://www.freesound.org/people/ERH/sounds/36105/).
