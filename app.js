//Opening animation using GSAP
const tl = gsap.timeline({ defaults: { ease: 'power1.out' } });
tl.to('.text', { y: '0%', duration: 1.5, stagger: 0.25 });
tl.to('.slider', { y: '-100%', duration: 1.5, delay: 1 });
tl.to('.intro', { y: '-100%', duration: 1.5 }, '-=1');
//Constructor function
class DrumKit {
    constructor() {
        //The squared pads selector
        this.pads = document.querySelectorAll('.pad');
        //Play button selector
        this.playBtn = document.querySelector('.play');
        //Mute button selector
        this.muteBtns = document.querySelectorAll('.mute');
        //Audios (at the bottom of the HTML page)
        this.kickAudio = document.querySelector('.kick-sound');
        this.snareAudio = document.querySelector('.snare-sound');
        this.hihatAudio = document.querySelector('.hihat-sound');
        //Default played sounds
        this.currentKick = ('./audio/kick-classic.wav');
        this.currentSnare = ('./audio/snare-acoustic01.wav');
        this.currentHihat = ('./audio/hihat-acoustic01.wav');
        //Audio selector
        this.selectors = document.querySelectorAll('select');
        //Speed tempo controller
        this.tempoRange = document.querySelector('.tempo-slider');
        //Pads stepper index
        this.index = 0;
        //Step speed default
        this.bpm = 200;
        //Play & Stop controller
        this.isPlaying = null;
    }
    //Adding scale animation to the active pad
    activePad() {
        this.classList.toggle('active');
    }
    //Function that loops over each pad to repeat the sound
    repeat() {
        let step = this.index % 8;
        this.index++;
        const activeBars = document.querySelectorAll(`.b${step}`);
        // Loop over the pads one by one
        activeBars.forEach(bar => {
            //Adding animation to each looped pad
            bar.style.animation = `playTrack 0.3s alternate ease-in-out 2`;
            //Check if the pad is active
            if (bar.classList.contains('active')) {
                //Check each pad sound
                if (bar.classList.contains('kick-pad')) {
                    this.kickAudio.currentTime = 0;
                    this.kickAudio.play();
                }
                if (bar.classList.contains('snare-pad')) {
                    this.snareAudio.currentTime = 0;
                    this.snareAudio.play();
                }
                if (bar.classList.contains('hihat-pad')) {
                    this.hihatAudio.currentTime = 0;
                    this.hihatAudio.play();
                }
            }
        })
    }
    //Starting audio function when the start button is pressed
    start() {
        const interval = (60 / this.bpm) * 1000;
        if (!this.isPlaying) {
            this.isPlaying = setInterval(() => {
                this.repeat();
            }, interval);
            this.playBtn.innerText = "Stop";
            this.playBtn.classList.add('active');
        } else {
            clearInterval(this.isPlaying);
            this.isPlaying = null;
            this.playBtn.innerText = "Play";
            this.playBtn.classList.remove('active');
        }
    }
    //Change sound by changing the selector
    changeSound(e) {
        const soundName = e.target.name;
        const soundValue = e.target.value;
        switch (soundName) {
            case "kick-select":
                this.kickAudio.src = soundValue;
                break;
            case "snare-select":
                this.snareAudio.src = soundValue;
                break;
            case "hihat-select":
                this.hihatAudio.src = soundValue;
                break;
        }
    }
    //Mute button logic
    muteSound(e) {
        const muteBtn = e.target.getAttribute('data-track');
        e.target.classList.toggle('active');
        if (e.target.classList.contains('active')) {
            switch (muteBtn) {
                case "0":
                    this.kickAudio.volume = 0;
                    break;
                case "1":
                    this.snareAudio.volume = 0;
                    break;
                case "2":
                    this.hihatAudio.volume = 0;
                    break;
            }
        } else {
            switch (muteBtn) {
                case "0":
                    this.kickAudio.volume = 1;
                    break;
                case "1":
                    this.snareAudio.volume = 1;
                    break;
                case "2":
                    this.hihatAudio.volume = 1;
                    break;
            }
        }
    }
    //Updating the tempo text by the range using the value of the bpm
    rangeUpdate(e) {
        const tempoNum = document.querySelector('.tempo-nr');

        tempoNum.innerText = e.target.value;
    }
    //Updating the step speed by the tempo range
    speedUpdate(e) {
        this.bpm = e.target.value;
        clearInterval(this.isPlaying);
        this.isPlaying = null;
        const playBtn = document.querySelector('.play');
        if (playBtn.classList.contains('active')) {
            this.start();
        }
    }
}
//Event listeners
const drumKit = new DrumKit();
drumKit.pads.forEach(pad => {
    pad.addEventListener('click', drumKit.activePad);
    pad.addEventListener('animationend', function () {
        this.style.animation = "";
    })
});
drumKit.playBtn.addEventListener('click', () => {
    drumKit.start();
});

drumKit.selectors.forEach(select => {
    select.addEventListener('change', function (e) {
        drumKit.changeSound(e);
    });
});

drumKit.muteBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
        drumKit.muteSound(e);
    })
});

drumKit.tempoRange.addEventListener('input', function (e) {
    drumKit.rangeUpdate(e);
});

drumKit.tempoRange.addEventListener('change', function (e) {
    drumKit.speedUpdate(e);
});