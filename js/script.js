//  DOM Elements 
const image = document.getElementById('cover');
const title = document.getElementById('title');
const artist = document.getElementById('artist');
const audio = document.querySelector('audio');
const currentTime = document.getElementById('current-time');
const durationElem = document.getElementById('duration');
const progress = document.getElementById('progress');
const progressContainer = document.getElementById('progress-container');
const prev = document.getElementById('prev');
const play = document.getElementById('play');
const next = document.getElementById('next');
const background = document.getElementById('background');
const ellipsis = document.getElementById('ellipsis');
const topIcon = document.querySelector('.top-icon');
const playerContainer = document.querySelector('.player-container');


//  Music Data 
const musics = [{
        path: 'media/1.mp3',
        displayName: 'Despacito',
        artist: 'Fonsi',
        cover: 'images/pic1.jpg'
    }, {
        path: 'media/2.mp3',
        displayName: 'Ring My Bells',
        artist: 'Enrique Iglesias',
        cover: 'images/pic2.jpg'
    },
    {
        path: 'media/3.mp3',
        displayName: 'Loca Loca Loca',
        artist: 'Shakira',
        cover: 'images/pic3.jpg'
    },
]


function pauseSong() {
    isplaying = false;
    play.classList.replace('bi-pause-circle-fill', 'bi-play-circle-fill');
    audio.pause();
}

function playSong() {
    isplaying = true;
    play.classList.replace('bi-play-circle-fill', 'bi-pause-circle-fill');
    audio.play();
}

let isplaying = false;
play.addEventListener('click', () => {
    if (isplaying) {
        pauseSong();
    } else {
        playSong();
    }
});


function changCover(cover) {
    image.classList.remove('active');
    setTimeout(() => {
        image.src = cover;
        image.classList.add('active');
    }, 100);
    background.src = cover;
}


function loadSong(song) {
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    audio.src = song.path;
    changCover(song.cover);
}

let songIndex = 0;
loadSong(musics[songIndex]);


function nextSong() {
    songIndex++;
    if (songIndex > musics.length - 1) {
        songIndex = 0;
    }
    loadSong(musics[songIndex]);
    playSong();
}


function prevSong() {
    songIndex--;
    if (songIndex < 0) {
        songIndex = musics.length - 1;
    }
    loadSong(musics[songIndex]);
    playSong();
}


function updateProgressbar(e) {
    if (isplaying) {
        const duration = e.srcElement.duration;
        const currentTime = e.srcElement.currentTime;


        const progressPersent = currentTime / duration * 100;
        progress.style.width = progressPersent + '%';


        const durationMinnets = Math.floor(duration / 60);
        let durationSecents = Math.floor(duration % 60);
        if (durationSecents < 10) {
            durationSecents = '0' + durationSecents;
        }
        if (durationSecents) {
            durationElem.textContent = durationMinnets + ':' + durationSecents;
        }
    }
}


function setProgressbar(e) {
    let width = this.clientWidth;
    console.log(width);
    let clickX = e.offsetX;
    console.log(clickX);
    let duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
}


function updateProgressbar(e) {
    if (isplaying) {
        const duration = e.srcElement.duration;
        const current = e.srcElement.currentTime;

        const progressPercent = (current / duration) * 100;
        progress.style.width = `${progressPercent}%`;

        const durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);
        if (durationSeconds < 10) durationSeconds = '0' + durationSeconds;

        if (duration) {
            durationElem.textContent = `${durationMinutes}:${durationSeconds}`;
        }

        const currentMinutes = Math.floor(current / 60);
        let currentSeconds = Math.floor(current % 60);
        if (currentSeconds < 10) currentSeconds = '0' + currentSeconds;

        currentTime.textContent = `${currentMinutes}:${currentSeconds}`;
    }
}

let lastVolume = audio.volume;

function toggleVolumeControl(e) {
    e.stopPropagation();

    let volumeHolder = document.querySelector('.volume-holder');

    if (!volumeHolder) {
        const section = document.createElement('section');
        section.classList.add('volume-holder');

        const newDiv = document.createElement('div');
        newDiv.classList.add('volume-container');

        const newI = document.createElement('i');
        newI.style.color = '#fff';
        newI.classList.add('bi', 'bi-volume-up-fill', 'volume-icon');
        newDiv.appendChild(newI);

        const input = document.createElement('input');
        input.type = 'range';
        input.classList.add('volume-slider');
        input.min = '0';
        input.max = '1';
        input.step = '0.01';
        input.value = audio.volume;


        newI.addEventListener('click', () => {
            if (audio.volume > 0) {
                lastVolume = audio.volume;
                audio.volume = 0;
                input.value = 0;
                newI.classList.remove('bi-volume-up-fill');
                newI.classList.add('bi-volume-mute-fill');
            } else {
                audio.volume = lastVolume || 1;
                input.value = lastVolume || 1;
                newI.classList.remove('bi-volume-mute-fill');
                newI.classList.add('bi-volume-up-fill');
            }
        });


        input.addEventListener('input', () => {
            audio.volume = input.value;

            if (audio.volume == 0) {
                newI.classList.remove('bi-volume-up-fill');
                newI.classList.add('bi-volume-mute-fill');
            } else {
                newI.classList.remove('bi-volume-mute-fill');
                newI.classList.add('bi-volume-up-fill');
                lastVolume = audio.volume;
            }
        });

        newDiv.appendChild(input);
        section.appendChild(newDiv);
        playerContainer.appendChild(section);
        setTimeout(() => {
            section.classList.add('show');
        }, 10);
    } else {
        volumeHolder.classList.toggle('show');
    }
}

function hideVolumeControlOnClickOutside(e) {
    const volumeHolder = document.querySelector('.volume-holder');

    if (volumeHolder && volumeHolder.classList.contains('show')) {
        if (
            !volumeHolder.contains(e.target) &&
            !ellipsis.contains(e.target)
        ) {
            volumeHolder.classList.remove('show');
        }
    }
}

next.addEventListener('click', nextSong);
prev.addEventListener('click', prevSong);
audio.addEventListener('ended', nextSong);
audio.addEventListener('timeupdate', updateProgressbar);
progressContainer.addEventListener('click', setProgressbar);
ellipsis.addEventListener('click', toggleVolumeControl);
document.addEventListener('click', hideVolumeControlOnClickOutside);