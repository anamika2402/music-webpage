const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    mainAudio = wrapper.querySelector("#main-audio"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = wrapper.querySelector(".progress-bar"),
    musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    hideMusicBtn = musicList.querySelector("#close");



//to load random music on refresh page
let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
window.addEventListener("load", () => {
    loadMusic(musicIndex); //calling load music function once window loade
    playingNow();
});
//load music function
function loadMusic(indexNumb) {
    //for changing song name
    musicName.innerText = allMusic[indexNumb - 1].name;
    //for changing artist name
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb-1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb-1].src}.mp3`;
}

//play music function
function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//pause music function
function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();
}
//next music function
function nextMusic() {
    //here we'll just increment of index by 1
    musicIndex++;
    //if the index exceed the music number limit it will again play from music 1
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
//prev music function
function prevMusic() {
    //here we'll just decrement of index by 1
    musicIndex--;
    //if the index is at the first song we will go back to last song 
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
//play or music button event/
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    //if isMusicPaused is treue then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
});
//next music btn event
nextBtn.addEventListener("click", () => {
    nextMusic(); //calling next music function

});
//prev music btn event
prevBtn.addEventListener("click", () => {
    prevMusic(); //calling prev music function

});

//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; //getting current time of song
    const duration = e.target.duration; //getting total duration of song
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;
    let musicCurrentTime = wrapper.querySelector(".current-time"), //--------------------------
        musicDuration = wrapper.querySelector(".max-duration");
    mainAudio.addEventListener("loadeddata", () => {


        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) { //adding 0 if sec is less than 10
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`; //--------------


    });
    //update playing song current time

    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) { //adding 0 if sec is less than 10
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});
//lets update the current song timebar as user can start and stopor navigate to any part of the music and jump to any part and music plays from that part and time bar also changes
progressArea.addEventListener("click", (e) => {
    let progressWidthval = progressArea.clientWidth //getting width for the jumped part as where to jump
    let clickedOffSetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration; //getting song total duration

    mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration;
    //to pause and forward the music and autoplay 
    playMusic();
    playingNow();
});

//let's work on repeat,shuffle song according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    //first we get the innerText of the icon then we'll change accordingly
    let getText = repeatBtn.innerText; //getting innerText of icon
    //let's do different changes on different icon click using switch
    switch (getText) {
        case "repeat": //if this icon is repeat
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one": //f icon is repeate_one then change t to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle": //if icon icon is shuffle then change it to repeat
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});
//above we just changed theicon,now let's work on what to do
//after the song ended

mainAudio.addEventListener("ended", () => {
    //we'll do accordingly to the icon means if user has set icon to loop song then we'll repeat
    //the current song and will do further accordingly
    let getText = repeatBtn.innerText; //getting innerTexxt of icon
    //let's do different changes on different icon click using switch
    switch (getText) {
        case "repeat": //if this icon is repeat then simply we call the nextMusic functio n so the next song will be played
            nextMusic();
            break;
        case "repeat_one": //if icon is repeat_one then we'll change the current plying song time to again 0 as it will restart and play again from begining
            mainAudio.currentTime = 0;
            loadMusic(musicIndex); //load the same song as we made its time 0 again to repeat 
            playMusic(); //to play the repeated loaded song
            break;
        case "shuffle": //if icon is shuffle thenn change it to repeat as this will play any random song and not in order
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randIndex); //this loop run until the next random number won't be the same of current music index
            musicIndex = randIndex; //passing random index to music index so the random song will play
            loadMusic(musicIndex); //calling loadMusic function
            playMusic(); //calling play music function
            playingNow();
            break;
    }
});

//to show the music list bar
showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

//to cut the music list bar
hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

//let's create li according to the array length

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index ="${i+1}" id="${i+1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <span id="${allMusic[i].src.split(" ")[0]}" class="audio-duration"></span>
                    <audio class="${allMusic[i].src.split(" ")[0]}" src="songs/${allMusic[i].src}.mp3"></audio>
                </li>`;
    //ulTag.insertAdjacentHTML("beforeend", liTag);
    ulTag.innerHTML += liTag;
    let liAudioDuaration = ulTag.querySelector(`#${allMusic[i].src.split(" ")[0]}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src.split(" ")[0]}`);
    //console.log(liAudioDuaration)

    liAudioTag.addEventListener("loadeddata", () => {
        //update song total duration
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) { //adding 0 if sec is less than 10
            totalSec = `0${totalSec}`;
        };
        liAudioDuaration.innerText = `${totalMin}:${totalSec}`;
        document.getElementById(`${i+1}`).querySelector(".audio-duration").setAttribute("t-audioDuration", `${totalMin}:${totalSec}`);
        document.getElementById(`${i+1}`).querySelector(".audio-duration").textContent = `${totalMin}:${totalSec}`;
    });
}

//lets's work on playparticular song on clickk

// console.log(allLiTags);
function playingNow() {
    const allLiTags = ulTag.querySelectorAll("li");
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        //console.log(audioTag)
        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            let adDuration = audioTag.getAttribute("t-audioDuration");
            audioTag.innerText = adDuration; //passing song time
        }
        if (allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing");
            audioTag.innerText = "Playing";
        }
        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }

}

function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}