let title = "Hello, Maram.";
let message = "Today isn't just a normal day...";
let message2 = "Someone prepared something especially for you.";

const titleEl = document.getElementById("title");
const textEl = document.getElementById("text");

textEl.style.display = "none";

function typeInto(element, text, speed = 100, callback) {
    let i = 0;
    element.textContent = "";

    function step() {
        if (i < text.length) {
            element.textContent += text[i];
            i++;
            setTimeout(step, speed);
        } else if (callback) {
            callback();
        }
    }

    step();
}

function showMessages() {
    textEl.style.display = "block";
    textEl.innerHTML = "";

    const firstLine = document.createElement("div");
    const secondLine = document.createElement("div");

    textEl.appendChild(firstLine);
    textEl.appendChild(secondLine);

    typeInto(firstLine, message, 50, () => {
        setTimeout(() => {
            typeInto(secondLine, message2, 40);
        }, 500);
    });
}

typeInto(titleEl, title, 80, () => {
    setTimeout(showMessages, 800);
});

document.getElementById("startBtn").onclick = function () {
    if (window.startBackgroundMusic) {
        window.startBackgroundMusic();
    }

    document.getElementById("glitchSound").play();
    document.getElementById("glitch").classList.add("glitch-active");

    setTimeout(() => {
        window.location.href ="pages/mission.html";
    },500);
};
