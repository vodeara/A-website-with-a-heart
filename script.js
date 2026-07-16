/* ==========================================================
    Моей любимой Сонечке ❤️
    script.js (с улучшенной обработкой музыки)
========================================================== */

const heart = document.getElementById("heart");
const mainText = document.getElementById("mainText");
const hint = document.getElementById("hint");
const flash = document.getElementById("flash");
const particles = document.getElementById("particles");
const music = document.getElementById("music");
const heartContainer = document.getElementById("heartContainer");

const phrases = [
    "Моей любимой Сонечке ❤️",
    "Ты — самое прекрасное, что случилось со мной ❤️",
    "Спасибо, что ты есть ❤️",
    "Каждый день с тобой — маленькое счастье ❤️",
    "Ты делаешь мой мир ярче ❤️",
    "Люблю тебя всё сильнее ❤️",
    "Ты моё вдохновение ❤️",
    "Навсегда рядом ❤️"
];

let lastPhrase = 0;

/* ============ МУЗЫКА ============ */
let musicStarted = false;
let musicAvailable = false; // флаг, что аудио загружено

// Проверяем, загрузилось ли аудио
music.addEventListener("canplaythrough", () => {
    musicAvailable = true;
    console.log("✅ Музыка загружена");
});

music.addEventListener("error", (e) => {
    console.warn("⚠️ Музыка не загружена (файл не найден или не поддерживается)");
    musicAvailable = false;
});

function startMusic() {
    if (musicStarted) return;
    if (!musicAvailable) {
        // Можно показать сообщение, но необязательно
        console.warn("Музыка недоступна, пропускаем");
        return;
    }

    musicStarted = true;
    music.volume = 0;
    music.play()
        .then(() => {
            // Плавно увеличиваем громкость
            let volume = 0;
            const fade = setInterval(() => {
                volume += 0.02;
                if (volume >= 0.35) {
                    volume = 0.35;
                    clearInterval(fade);
                }
                music.volume = volume;
            }, 100);
        })
        .catch(err => {
            console.warn("Не удалось запустить музыку (ошибка воспроизведения):", err);
            musicStarted = false; // сбросим, чтобы можно было повторить попытку
        });
}

/* ============ ФРАЗЫ ============ */
function randomPhrase() {
    let index;
    do {
        index = Math.floor(Math.random() * phrases.length);
    } while (index === lastPhrase);
    lastPhrase = index;

    mainText.classList.add("text-hide");
    setTimeout(() => {
        mainText.innerHTML = phrases[index];
        mainText.classList.remove("text-hide");
        mainText.classList.add("text-show");
        setTimeout(() => {
            mainText.classList.remove("text-show");
        }, 400);
    }, 250);
}

function flashHeart() {
    flash.classList.remove("flash-active");
    void flash.offsetWidth;
    flash.classList.add("flash-active");
}

function clickBeat() {
    heart.classList.remove("heart-click");
    void heart.offsetWidth;
    heart.classList.add("heart-click");
}

/* ============ СЕРДЕЧКИ ============ */
function createHeartParticle(boost = false) {
    const p = document.createElement("div");
    p.className = "particle";
    p.innerHTML = "❤";

    const hue = 330 + Math.random() * 30;
    const sat = 100;
    const light = 60 + Math.random() * 20;
    p.style.color = `hsl(${hue}, ${sat}%, ${light}%)`;

    const rect = heart.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;
    p.style.left = startX + "px";
    p.style.top = startY + "px";

    const angle = Math.random() * 2 * Math.PI;
    const distance = 180 + Math.random() * 250;
    const x = Math.cos(angle) * distance;
    const y = Math.sin(angle) * distance;
    const rotate = (-180 + Math.random() * 360) + "deg";

    p.style.setProperty("--x", `${x}px`);
    p.style.setProperty("--y", `${y}px`);
    p.style.setProperty("--r", rotate);

    const size = boost ? 32 + Math.random() * 20 : 22 + Math.random() * 18;
    p.style.fontSize = size + "px";

    const duration = boost ? 1.4 + Math.random() * 0.6 : 2 + Math.random();
    p.style.animationDuration = duration + "s";

    particles.appendChild(p);
    setTimeout(() => p.remove(), duration * 1000 + 200);
}

/* Фоновые сердечки */
setInterval(() => {
    createHeartParticle(false);
    createHeartParticle(false);
}, 800);

/* Взрыв при клике */
function burstHearts() {
    const count = 28;
    for (let i = 0; i < count; i++) {
        setTimeout(() => createHeartParticle(true), i * 30);
    }
}

/* ============ КЛИК ============ */
let firstClick = true;

heart.addEventListener("click", () => {
    clickBeat();
    flashHeart();
    randomPhrase();
    burstHearts();

    if (firstClick) {
        hint.style.opacity = "0";
        firstClick = false;
    }

    startMusic();
});

/* ============ ПАРАЛЛАКС ============ */
let targetX = 0, targetY = 0, currentX = 0, currentY = 0;

document.addEventListener("mousemove", e => {
    targetX = (e.clientX / window.innerWidth - .5) * 12;
    targetY = (e.clientY / window.innerHeight - .5) * 12;
});

window.addEventListener("deviceorientation", e => {
    if (e.gamma == null) return;
    targetX = (e.gamma / 5) * 1.2;
    targetY = (e.beta / 12) * 1.2;
});

function smoothParallax() {
    currentX += (targetX - currentX) * .08;
    currentY += (targetY - currentY) * .08;
    heartContainer.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(smoothParallax);
}
smoothParallax();

/* ============ IDLE ============ */
let idleTimer;

function resetIdle() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        clickBeat();
        for (let i = 0; i < 5; i++) {
            setTimeout(() => createHeartParticle(false), i * 50);
        }
    }, 18000);
}
document.addEventListener("mousemove", resetIdle);
document.addEventListener("click", resetIdle);
document.addEventListener("touchstart", resetIdle);
resetIdle();

/* ============ СВЕЧЕНИЕ ============ */
let pulseTime = 0;

function animateHeart() {
    pulseTime += 0.025;
    const breathe = Math.sin(pulseTime) * 0.015;
    heart.style.filter = `
        drop-shadow(0 0 ${18 + breathe * 200}px rgba(255,80,140,.45))
        drop-shadow(0 0 ${40 + breathe * 300}px rgba(255,110,170,.35))
    `;
    requestAnimationFrame(animateHeart);
}
animateHeart();

/* ============ ИСКОРКИ ============ */
function sparkle() {
    const s = document.createElement("div");
    s.innerHTML = "✦";
    s.style.position = "absolute";
    const rect = heart.getBoundingClientRect();
    s.style.left = rect.left + rect.width / 2 + (Math.random() - .5) * 260 + "px";
    s.style.top = rect.top + rect.height / 2 + (Math.random() - .5) * 220 + "px";
    s.style.color = "rgba(255,255,255,.9)";
    s.style.fontSize = (8 + Math.random() * 8) + "px";
    s.style.pointerEvents = "none";
    s.style.transition = "2s linear";
    particles.appendChild(s);
    requestAnimationFrame(() => {
        s.style.opacity = "0";
        s.style.transform = `translateY(${-25 - Math.random() * 20}px) scale(1.6)`;
    });
    setTimeout(() => s.remove(), 2000);
}
setInterval(() => { if (!document.hidden) sparkle(); }, 3000);

/* ============ ВКЛАДКА НЕ АКТИВНА ============ */
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        if (musicStarted) music.pause();
    } else {
        if (musicStarted) {
            music.play().catch(() => {});
        }
    }
});

window.addEventListener("load", () => {
    console.log("❤️ Love Site Loaded ❤️");
});