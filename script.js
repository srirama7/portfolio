// ===== Typing Effect =====
const titles = [
    'Software Engineer',
    'AI Engineer',
    'Full Stack Developer',
    'Problem Solver'
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typedText = document.getElementById('typedText');

function typeEffect() {
    const current = titles[titleIndex];

    if (isDeleting) {
        typedText.textContent = current.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedText.textContent = current.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        speed = 500;
    }

    setTimeout(typeEffect, speed);
}

setTimeout(typeEffect, 1200);

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile Menu =====
const navToggle = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// ===== Scroll Reveal Animation =====
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('skill-card')) {
                const cards = document.querySelectorAll('.skill-card');
                const cardIndex = Array.from(cards).indexOf(entry.target);
                entry.target.style.animationDelay = `${cardIndex * 0.1}s`;
            }

            if (entry.target.classList.contains('project-card')) {
                const cards = document.querySelectorAll('.project-card');
                const cardIndex = Array.from(cards).indexOf(entry.target);
                entry.target.style.animationDelay = `${cardIndex * 0.15}s`;
            }

            if (entry.target.classList.contains('other-project-card')) {
                const cards = document.querySelectorAll('.other-project-card');
                const cardIndex = Array.from(cards).indexOf(entry.target);
                entry.target.style.animationDelay = `${cardIndex * 0.1}s`;
            }

            if (entry.target.classList.contains('timeline-item')) {
                const items = document.querySelectorAll('.timeline-item');
                const itemIndex = Array.from(items).indexOf(entry.target);
                entry.target.style.animationDelay = `${itemIndex * 0.15}s`;
            }

            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll(
    '.section-title, .skill-card, .project-card, .other-project-card, .about-grid, .contact-wrapper, .timeline-item'
).forEach(el => observer.observe(el));

// ===== Counter Animation =====
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-count'));
                let current = 0;
                const increment = target / 40;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.ceil(current);
                    }
                }, 40);
            });
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.about-stats');
if (statsSection) counterObserver.observe(statsSection);

// ===== Floating Particles =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: null, y: null };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
        this.color = ['139,92,246', '59,130,246', '236,72,153', '6,182,212'][
            Math.floor(Math.random() * 4)
        ];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (mouse.x !== null) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                const force = (120 - dist) / 120;
                this.x -= dx * force * 0.01;
                this.y -= dy * force * 0.01;
            }
        }

        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

initParticles();

function drawLines() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                const opacity = (1 - dist / 150) * 0.08;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    drawLines();
    requestAnimationFrame(animate);
}

animate();

// ===== Smooth Scroll =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== Active Nav Link on Scroll =====
const sections = document.querySelectorAll('.section, .hero');
const navLinks = document.querySelectorAll('.nav-links a:not(.nav-resume-btn)');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--accent-purple)';
        }
    });
});

// ===== Custom Cursor =====
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let cursorX = 0, cursorY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursorDot.style.left = cursorX - 4 + 'px';
    cursorDot.style.top = cursorY - 4 + 'px';
});

function animateRing() {
    ringX += (cursorX - ringX) * 0.15;
    ringY += (cursorY - ringY) * 0.15;
    cursorRing.style.left = ringX - 18 + 'px';
    cursorRing.style.top = ringY - 18 + 'px';
    requestAnimationFrame(animateRing);
}
animateRing();

document.querySelectorAll('a, button, .skill-card, .project-card, .other-project-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});

// ===== Ambient Music (Web Audio API) =====
let audioCtx = null;
let musicPlaying = false;
let musicNodes = [];

function createAmbientMusic() {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const master = audioCtx.createGain();
    master.gain.value = 0.06;
    master.connect(audioCtx.destination);

    function createPad(freq, detune) {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filter = audioCtx.createBiquadFilter();
        osc.type = 'sine';
        osc.frequency.value = freq;
        osc.detune.value = detune;
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        filter.Q.value = 1;
        gain.gain.value = 0;
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        osc.start();
        musicNodes.push({ osc, gain, filter });

        function swell() {
            const now = audioCtx.currentTime;
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(gain.gain.value, now);
            gain.gain.linearRampToValueAtTime(0.3 + Math.random() * 0.4, now + 3 + Math.random() * 4);
            gain.gain.linearRampToValueAtTime(0.05, now + 7 + Math.random() * 5);
            setTimeout(swell, (8 + Math.random() * 6) * 1000);
        }
        setTimeout(swell, Math.random() * 3000);
    }

    const notes = [130.81, 196.00, 261.63, 329.63, 392.00];
    notes.forEach((n, i) => createPad(n, i * 3));
}

document.getElementById('musicToggle').addEventListener('click', () => {
    const btn = document.getElementById('musicToggle');
    if (!musicPlaying) {
        if (!audioCtx) createAmbientMusic();
        else audioCtx.resume();
        btn.classList.add('playing');
        musicPlaying = true;
    } else {
        audioCtx.suspend();
        btn.classList.remove('playing');
        musicPlaying = false;
    }
});

// ===== Dark/Light Mode =====
function toggleTheme() {
    document.body.classList.toggle('light-mode');
    return document.body.classList.contains('light-mode') ? 'light' : 'dark';
}

// ===== Font Scale =====
let fontScale = 1;
function changeFontSize(direction) {
    fontScale = Math.max(0.8, Math.min(1.4, fontScale + direction * 0.1));
    document.documentElement.style.setProperty('--font-scale', fontScale);
    return Math.round(fontScale * 100) + '%';
}

// ===== Jimmy AI Assistant =====
const jimmyBtn = document.getElementById('jimmyBtn');
const jimmyChat = document.getElementById('jimmyChat');
const jimmyClose = document.getElementById('jimmyClose');
const jimmyInput = document.getElementById('jimmyInput');
const jimmySend = document.getElementById('jimmySend');
const jimmyMessages = document.getElementById('jimmyMessages');

jimmyBtn.addEventListener('click', () => {
    jimmyChat.classList.toggle('open');
    jimmyBtn.classList.toggle('active');
    if (jimmyChat.classList.contains('open')) jimmyInput.focus();
});

jimmyClose.addEventListener('click', () => {
    jimmyChat.classList.remove('open');
    jimmyBtn.classList.remove('active');
});

jimmySend.addEventListener('click', sendMessage);
jimmyInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(); });

function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = 'jimmy-msg ' + type;
    msg.textContent = text;
    jimmyMessages.appendChild(msg);
    jimmyMessages.scrollTop = jimmyMessages.scrollHeight;
}

function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'jimmy-typing';
    typing.id = 'jimmyTyping';
    typing.innerHTML = '<span></span><span></span><span></span>';
    jimmyMessages.appendChild(typing);
    jimmyMessages.scrollTop = jimmyMessages.scrollHeight;
}

function removeTyping() {
    const t = document.getElementById('jimmyTyping');
    if (t) t.remove();
}

function sendMessage() {
    const text = jimmyInput.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    jimmyInput.value = '';
    showTyping();
    setTimeout(() => {
        removeTyping();
        const reply = getJimmyResponse(text);
        addMessage(reply, 'bot');
    }, 600 + Math.random() * 600);
}

function getJimmyResponse(input) {
    const q = input.toLowerCase();

    // Navigation commands
    if (q.includes('go to') || q.includes('show') || q.includes('open') || q.includes('navigate') || q.includes('take me')) {
        if (q.includes('about')) { document.querySelector('#about').scrollIntoView({behavior:'smooth'}); return 'Taking you to the About section! 🐕'; }
        if (q.includes('experience') || q.includes('work')) { document.querySelector('#experience').scrollIntoView({behavior:'smooth'}); return 'Here\'s Amogha\'s experience! 🐕'; }
        if (q.includes('skill')) { document.querySelector('#skills').scrollIntoView({behavior:'smooth'}); return 'Check out all the skills! 🐕'; }
        if (q.includes('project')) { document.querySelector('#projects').scrollIntoView({behavior:'smooth'}); return 'Here are the amazing projects! 🐕'; }
        if (q.includes('contact')) { document.querySelector('#contact').scrollIntoView({behavior:'smooth'}); return 'Here\'s how to get in touch! 🐕'; }
        if (q.includes('top') || q.includes('home') || q.includes('hero')) { document.querySelector('#hero').scrollIntoView({behavior:'smooth'}); return 'Back to the top! 🐕'; }
        if (q.includes('resume')) { window.open('resume.pdf', '_blank'); return 'Opening Amogha\'s resume for you! 📄'; }
    }

    // Theme toggle
    if (q.includes('dark') || q.includes('light') || q.includes('theme') || q.includes('mode')) {
        const mode = toggleTheme();
        return mode === 'light' ? 'Switched to light mode! ☀️ Woof!' : 'Switched to dark mode! 🌙 Woof!';
    }

    // Font size
    if (q.includes('increase') && (q.includes('font') || q.includes('size') || q.includes('text') || q.includes('bigger'))) {
        const s = changeFontSize(1);
        return 'Font size increased to ' + s + '! 🔍';
    }
    if (q.includes('decrease') && (q.includes('font') || q.includes('size') || q.includes('text') || q.includes('smaller'))) {
        const s = changeFontSize(-1);
        return 'Font size decreased to ' + s + '! 🔎';
    }
    if (q.includes('bigger') || q.includes('larger')) {
        const s = changeFontSize(1);
        return 'Made the text bigger! Now at ' + s + ' 🔍';
    }
    if (q.includes('smaller')) {
        const s = changeFontSize(-1);
        return 'Made the text smaller! Now at ' + s + ' 🔎';
    }
    if (q.includes('reset') && (q.includes('font') || q.includes('size'))) {
        fontScale = 1;
        document.documentElement.style.setProperty('--font-scale', 1);
        return 'Font size reset to default! 🐕';
    }

    // About / Who
    if (q.includes('who') || (q.includes('about') && !q.includes('go')) || q.includes('tell me about') || q.includes('introduce')) {
        return 'Amogha Bhat MR is a Computer Science graduate from NMAM Institute of Technology, Nitte (CGPA: 7.98). He has 9 months of professional experience as an AI Engineer & Software Developer, specializing in full-stack web apps, AI-powered tools, and cross-platform mobile apps. 🐕';
    }

    // Skills
    if (q.includes('skill') || q.includes('tech') || q.includes('language') || q.includes('what can he do') || q.includes('know')) {
        return 'Amogha is skilled in: Python, JavaScript, TypeScript, Java, C/C++, Dart | Frameworks: React.js, Next.js, FastAPI, Node.js, Flutter | Databases: Firebase, MySQL, Firestore | AI: LLMs, Multi-Agent Systems, NLP, Computer Vision | Tools: Git, GitHub, Android Studio, Capacitor, REST APIs 🐕';
    }

    // Experience
    if (q.includes('experience') || q.includes('work') || q.includes('job') || q.includes('career') || q.includes('intern')) {
        return 'Amogha has worked at: 1) Colligence Research (Oct 2025-Mar 2026) as AI Engineer - built Circle collaboration app & Foundry ERP. 2) CDot PSU (Jan-Apr 2025) as Software Developer Intern. 3) Dlithe (Jan-Apr 2025) as Frontend Dev Intern. 4) Internshala (Nov 2023-Jan 2024) as Frontend Dev Intern. 🐕';
    }

    // Projects
    if (q.includes('project') && !q.includes('go')) {
        return 'Featured projects: 1) Grok Notepad - AI-powered notebook with Word/Excel/PowerPoint tools 2) Bhoomitayi - full-stack real estate platform 3) GST Invoice Calculator - with PDF generation & Android app 4) Music App - streaming & download app for Android. Plus Circle, Soap Website, Chatify, Portfolio, and Sticker Maker! 🐕';
    }

    // Specific projects
    if (q.includes('notepad') || q.includes('grok')) {
        return 'Grok Notepad is an AI-powered notebook featuring Groku, an intelligent AI agent. It integrates Word, Excel, and PowerPoint tools in a single workspace. Built with HTML, JavaScript, and AI Agent tech. Live at: srirama7.github.io/grok-notepad/ 🐕';
    }
    if (q.includes('bhoomitayi') || q.includes('real estate') || q.includes('property')) {
        return 'Bhoomitayi is a full-stack real estate platform connecting property sellers and buyers. Features property listings, search, filtering, and transaction management. Built with Next.js, TypeScript, Firebase, and Capacitor. Live at: bhoomitayi.vercel.app 🐕';
    }
    if (q.includes('gst') || q.includes('invoice') || q.includes('calculator')) {
        return 'GST Invoice Calculator handles automated tax computation and PDF invoice generation. Integrated with Firebase for data storage and deployed as an Android app via Capacitor. Built with React, Firebase, Vite, and Tailwind CSS. Live at: srirama7.github.io/gst-calculator/ 🐕';
    }
    if (q.includes('music')) {
        return 'Music App is a streaming and download application with audio playback controls. Built Android APK releases for mobile distribution via GitHub Releases. Website: srirama7.github.io/music-app-download/ 🐕';
    }
    if (q.includes('circle')) {
        return 'Circle is an in-house team collaboration app built at Colligence Research with AI-powered chatbot, real-time video calling, and screen sharing using React, FastAPI, LLMs, and WebRTC. 🐕';
    }

    // Contact
    if (q.includes('contact') || q.includes('email') || q.includes('reach') || q.includes('hire') || q.includes('connect')) {
        return 'You can reach Amogha at: Email: amoghabhat74@gmail.com | GitHub: github.com/srirama7 | LinkedIn: linkedin.com/in/amogha-bhat-555235249 | LeetCode: leetcode.com/u/amogh74 🐕';
    }

    // Education
    if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('university') || q.includes('study')) {
        return 'Amogha graduated with a B.E. in Computer Science & Engineering from NMAM Institute of Technology, Nitte with a CGPA of 7.98. 🎓🐕';
    }

    // Certifications
    if (q.includes('certif')) {
        return 'Amogha holds certifications in: Google Cybersecurity, Google Networks, NPTEL Java, and NPTEL Python. 📜🐕';
    }

    // GitHub
    if (q.includes('github')) {
        return 'Amogha\'s GitHub is github.com/srirama7 - he has 30+ repositories covering web apps, mobile apps, AI tools, and more! 🐕';
    }

    // Resume
    if (q.includes('resume') || q.includes('cv')) {
        window.open('resume.pdf', '_blank');
        return 'Opening the resume for you! 📄🐕';
    }

    // Greetings
    if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('woof') || q === 'yo') {
        return 'Woof woof! 🐕 Hey there! I\'m Jimmy, Amogha\'s digital pup. Ask me about his skills, projects, experience, or I can navigate you around the portfolio!';
    }

    // Thanks
    if (q.includes('thank') || q.includes('thanks')) {
        return 'You\'re welcome! Woof! 🐕 Happy to help! Anything else you\'d like to know?';
    }

    // Who are you
    if (q.includes('who are you') || q.includes('your name') || q.includes('jimmy')) {
        return 'I\'m Jimmy! 🐕 Amogha\'s loyal portfolio assistant. I know everything about this portfolio - skills, projects, experience, and more. I can also toggle dark/light mode, change font size, and navigate you around!';
    }

    // Music
    if (q.includes('music') && (q.includes('play') || q.includes('toggle') || q.includes('stop'))) {
        document.getElementById('musicToggle').click();
        return musicPlaying ? 'Playing some calm ambient music! 🎵🐕' : 'Music paused! 🐕';
    }

    // Catch non-portfolio questions
    if (q.includes('weather') || q.includes('news') || q.includes('joke') || q.includes('story') || q.includes('meaning of life') || q.includes('president') || q.includes('capital') || q.length > 100) {
        return 'Woof! 🐕 I can only help with things related to Amogha\'s portfolio - his skills, projects, experience, and contact info. Try asking me about those!';
    }

    // Default
    return 'Woof! 🐕 I\'m not sure about that, but I can help with: Amogha\'s skills, projects, experience, education, certifications, contact info. I can also navigate sections, toggle dark/light mode, or change font size!';
}
