(function () {
    const STORAGE_KEY = "birthdayBgMusicState";
    let music = document.getElementById("bgMusic");
    let antent = document.getElementById("antent");
    const isInPagesFolder = window.location.pathname.includes("/pages/");
    const getSoundPath = file => isInPagesFolder ? `../assets/sounds/${file}` : `assets/sounds/${file}`;

    if (!music) {
        music = document.createElement("audio");
        music.id = "bgMusic";
        music.src = getSoundPath("background.mp3");
        music.preload = "auto";
        document.body.appendChild(music);
    }

    if (!antent) {
        antent = document.createElement("audio");
        antent.id = "antent";
        antent.src = isInPagesFolder ? "../assets/audio/antent.mp3" : "assets/audio/antent.mp3";
        antent.preload = "auto";
        document.body.appendChild(antent);
    }

    function saveState() {
        if (!music && !antent) return;

        const state = {
            playing: music ? !music.paused : false,
            currentTime: music ? music.currentTime : 0,
            antentPlaying: antent ? !antent.paused : false,
            antentCurrentTime: antent ? antent.currentTime : 0
        };

        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }

    function restoreState() {
        if (!music && !antent) return;

        let state = {};

        try {
            state = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "{}");
        } catch (error) {
            state = {};
        }

        if (music && typeof state.currentTime === "number") {
            music.currentTime = state.currentTime;
        }

        if (state.playing && music) {
            music.loop = false;
            music.volume = 0.2;

            const playPromise = music.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {});
            }
        }

        if (antent && typeof state.antentCurrentTime === "number") {
            antent.currentTime = state.antentCurrentTime;
        }

        if (state.antentPlaying && antent) {
            antent.loop = false;
            antent.volume = 0.1;

            const playPromise = antent.play();
            if (playPromise && typeof playPromise.catch === "function") {
                playPromise.catch(() => {
                    document.body.addEventListener('click', function oncePlay() {
                        antent.play().catch(() => {});
                        document.body.removeEventListener('click', oncePlay);
                    });
                });
            }
        }
    }

    function startAntent() {
        if (!antent) return;
        antent.loop = false;
        antent.volume = 0.1;

        const playPromise = antent.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {
                document.body.addEventListener('click', function oncePlay() {
                    antent.play().catch(() => {});
                    document.body.removeEventListener('click', oncePlay);
                });
            });
        }
    }

    window.startBackgroundMusic = function () {
        if (!music) return;

        music.loop = false;
        music.volume = 0.2;

        if (typeof music.currentTime !== "number") {
            music.currentTime = 0;
        }

        const playPromise = music.play();
        if (playPromise && typeof playPromise.catch === "function") {
            playPromise.catch(() => {});
        }

        saveState();
    };

    if (music) {
        music.addEventListener("timeupdate", saveState);
    }

    document.addEventListener("visibilitychange", function () {
        if (document.visibilityState === "hidden") {
            saveState();
        }
    });

    window.addEventListener("pagehide", saveState);
    window.addEventListener("beforeunload", saveState);

    document.addEventListener("DOMContentLoaded", function () {
        restoreState();
        startAntent();
    });
})();
