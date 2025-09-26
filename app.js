const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar__menu');
const navLogo = document.querySelector('#navbar__logo');
const navLinks = document.querySelectorAll('.navbar__links');
const sections = document.querySelectorAll('section[id]');

// Toggle mobile menu
const mobileMenu = () => {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
};
menu.addEventListener('click', mobileMenu);

// Highlight menu on scroll
const highlightMenu = () => {
    let scrollPos = window.scrollY + 200; // offset for navbar
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');

        if(scrollPos >= top && scrollPos < top + height) {
            navLinks.forEach(link => {
                link.classList.remove('highlight');
                if(link.getAttribute('href') === `#${id}`) {
                    link.classList.add('highlight');
                }
            });
        }
    });
};
window.addEventListener('scroll', highlightMenu);
window.addEventListener('click', highlightMenu);

// Hide mobile menu on link click
const hideMobileMenu = () => {
    if(window.innerWidth <= 900 && menu.classList.contains('is-active')) {
        menu.classList.remove('is-active');
        menuLinks.classList.remove('active');
    }
};
navLinks.forEach(link => link.addEventListener('click', hideMobileMenu));
navLogo.addEventListener('click', hideMobileMenu);

const slides = document.querySelectorAll('.carousel__slide');
let currentSlide = 0;

// Function to show a specific slide
function showSlide(index) {
    slides.forEach((slide, i) => slide.classList.toggle('active', i === index));
    currentSlide = index;
}

// Show next slide
function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
}

// Show previous slide
function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
}

// Automatic slide change every 5s
let slideInterval = setInterval(nextSlide, 5000);

// Event listeners for buttons
document.querySelector('.carousel__btn--next').addEventListener('click', () => {
    nextSlide();
    resetInterval();
});
document.querySelector('.carousel__btn--prev').addEventListener('click', () => {
    prevSlide();
    resetInterval();
});

// Reset interval after manual navigation
function resetInterval() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
}

// Dynamic Text
const words = ["an Adventurer", "a Risk-taker", "an Innovator", "a Competitor"," Active", "Fearless", "Stoic"];
let wordIndex = 0;
let letterIndex = 0;
const textEl = document.getElementById("dynamic-text");
let typingSpeed = 150; // ms per letter
let deletingSpeed = 150; // ms per letter
let delayBetweenWords = 1500; // pause before deleting

function typeWord() {
  if (letterIndex < words[wordIndex].length) {
    textEl.textContent += words[wordIndex][letterIndex];
    letterIndex++;
    setTimeout(typeWord, typingSpeed);
  } else {
    setTimeout(deleteWord, delayBetweenWords);
  }
}

function deleteWord() {
  if (letterIndex > 0) {
    textEl.textContent = words[wordIndex].substring(0, letterIndex - 1);
    letterIndex--;
    setTimeout(deleteWord, deletingSpeed);
  } else {
    wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeWord, typingSpeed);
  }
}

// start the loop
typeWord();


