litti
=====

Transcript an audio file in the comfort of your browser.

![](https://raw.github.com/mieky/litti/master/litti.png)

### Features

- upload custom audio file by dragging it on the holder
- comfortable hotkeys for play & pause, rewind & fast forward
- write stuff
- automatically stores playhead position & transcript progress in localStorage

### Running

You need:
- a HTTP server which supports HTTP 1.1 byte ranges (to enable audio seeking)
&mdash; for lightweight development purposes, [https://github.com/smgoller/rangehttpserver](rangehttpserver) does it right!
- a modern web browser; a recent Google Chrome will do fine

More specifically, litti uses the following HTML5 features:

- [&lt;audio&gt; element](http://caniuse.com/audio)
- [FileReader API](http://caniuse.com/filereader)
- [classList API](http://caniuse.com/classlist)

### Todo:

- count words
- show nice progress bar
- browser support detection
- load & save/export

### FAQ

Q. **What's with the name and the logo?**

A. [Jari 'Litti' Litmanen](https://en.wikipedia.org/wiki/Jari_Litmanen) has his own special way of doing a 'thumb up'.

### License

MIT

The sample Roswell sound is from [freesound.org](http://www.freesound.org/people/ERH/sounds/36105/).
