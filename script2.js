let audioElement = document.getElementById("audio");
let imageElement = document.getElementById("image");
let songElement = document.getElementById("song_title");
let artistElement = document.getElementById("artist_name");
let playButton = document.getElementById("pl");
let nextButton = document.getElementById("nex");
let prevButton = document.getElementById("pr");
let bodyElement = document.body;
let timeElement = document.querySelector(".time");
let playControlButton = document.querySelector(".play");
let prevTrackButton = document.querySelector(".prev");
let nextTrackButton = document.querySelector(".next");
let logoElements = document.getElementsByClassName('logo');

let playlist = ['loreen-tattoo.mp3', 'Krij_-_Cha_Cha_Cha.mp3', 'Marco_Mengoni_-_Due_Vite.mp3', 'Luke_Black_-_Samo_Mi_Se_Spava.mp3'];
let images = ['picture5.jpeg', 'picture3.jpg', 'picture2.jpg', 'Rs23.webp'];
let songs = ['Tatto', 'Cha Cha Cha', 'Due Vite', 'Samo Mi Se Spava'];
let artists = ['Loreen', 'Kaarija', 'Marco Mengoni', 'Luke Black'];
let colors = ['#E290BA', '#00af01', '#fdfdfd', '#fbc8cb'];
let isPlaying = true;
let currentTrackIndex = 0;

window.onload = function() {
    currentTrackIndex = 0;
}

timeElement.max = 100;

timeElement.oninput = function() {
    let progress = timeElement.value;
    let audioLength = Math.round(audioElement.duration);
    let currentTime = (progress / 100) * audioLength;
    audioElement.currentTime = currentTime;
};

audioElement.addEventListener('timeupdate', function() {
    let audioTime = Math.round(audioElement.currentTime);
    let audioLength = Math.round(audioElement.duration);
    let progress = (audioTime / audioLength) * 100;
    timeElement.value = progress;
});



let frequencyArray = new Uint8Array(64);
let height, analyser, audioContext;

// Подготовка аудио контекста
function prepareAudioContext() {
    audioContext = new AudioContext();
    analyser = audioContext.createAnalyser();
    let source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);
}

// Визуализация аудио
function visualizeAudio() {
    if (!audioElement.paused) {
        window.requestAnimationFrame(visualizeAudio);
    }
    analyser.getByteFrequencyData(frequencyArray);
    for (var i = 0; i < 32; i++) {
        height = frequencyArray[i + 32];
        logoElements[i].style.height = height / 3 + 'px';
        logoElements[i].style.opacity = 0.003 * height;
    }
}

// Переключение трека
function switchTrack(trackIndex) {
    audioElement.src = './picture/' + playlist[trackIndex];
    imageElement.src = './picture/' + images[trackIndex];
    songElement.textContent = songs[trackIndex];
    artistElement.textContent = artists[trackIndex];
    timeElement.style.backgroundColor = colors[trackIndex];
    nextButton.src = 'picture/fast-arrow-right (' + (trackIndex + 1) + ').svg';
    prevButton.src = 'picture/fast-arrow-left (' + (trackIndex + 1) + ').svg';
    bodyElement.style.backgroundColor = colors[trackIndex];
    audioElement.currentTime = 0;
    isPlaying = false;
    playButton.src = 'picture/pause (' + (trackIndex + 1) + ').svg';
    audioElement.play();
    visualizeAudio();
}

// Обработчик события клика на кнопку проигрывания/паузы
playControlButton.addEventListener("click", function() {
    if (isPlaying) {
        isPlaying = false;
        playButton.src = 'picture/pause (' + (currentTrackIndex + 1) + ').svg';
        if (!audioContext)
            prepareAudioContext();
        audioElement.play();
        visualizeAudio();
        audioPlay = setInterval(function() {
            let audioTime = Math.round(audioElement.currentTime);
            let audioLength = Math.round(audioElement.duration)
            timeElement.value = (audioTime * 100) / audioLength;
            if (audioTime === audioLength && currentTrackIndex < 3) {
                currentTrackIndex++;
                switchTrack(currentTrackIndex);
            } else if (audioTime === audioLength && currentTrackIndex >= 3) {
                currentTrackIndex = 0;
                switchTrack(currentTrackIndex);
            }
        }, 10);
    } else {
        isPlaying = true;
        playButton.src = 'picture/play (' + (currentTrackIndex + 1) + ').svg';
        audioElement.pause();
        clearInterval(audioPlay);
    }
});

// Обработчик события клика на кнопку предыдущего трека
prevTrackButton.addEventListener("click", function() {
    if (currentTrackIndex > 0) {
        currentTrackIndex--;
        switchTrack(currentTrackIndex);
    } else {
        currentTrackIndex = 3;
        switchTrack(currentTrackIndex);
    }
});

// Обработчик события клика на кнопку следующего трека
nextTrackButton.addEventListener("click", function() {
    if (currentTrackIndex < 3) {
        currentTrackIndex++;
        switchTrack(currentTrackIndex);
    } else {
        currentTrackIndex = 0;
        switchTrack(currentTrackIndex);
    }
});

audioElement.addEventListener("timeupdate", function() {
    let progress = (audioElement.currentTime / audioElement.duration) * 100;
    timeElement.value = progress;
});
