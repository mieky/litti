litti
=====

![](https://raw.github.com/mieky/litti/master/litti.png)

Audio transcription in the browser.

Allows you to play an audio file and write the transcript, without having to leave the window.

**Requirements:**

- HTML5 [`audio` element](http://caniuse.com/audio)
- HTML5 [FileReader API](http://caniuse.com/filereader)
- HTML5 [classList API](http://caniuse.com/classlist)

**Running:**

- start up a server and load it in a nice browser (up-to-date Chrome will do)
- seeking requires HTTP 1.1 byte range support, so not just any server will do. [https://github.com/smgoller/rangehttpserver](rangehttpserver) does it right!

**Usage:**

- upload custom audio file by dragging it on the holder
- hit tab to play/pause the audio file
- alt-tab skips backwards a little
- write stuff
- automatically stores playhead position & transcript progress in localStorage

**Todo:**

- count words
- show nice progress bar
- browser support detection
- load & save/export

License: MIT

The sample Roswell sound: http://www.freesound.org/people/ERH/sounds/36105/
