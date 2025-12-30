/* ============================================
   MAIN APP.JS
   JavaScript for index.html
   ============================================ */

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
const initMobileMenu = () => {
  const menuToggle = document.querySelector('#mobile-menu');
  const menuLinks = document.querySelector('.navbar__menu');
  const navLinks = document.querySelectorAll('.navbar__links');
  const navLogo = document.querySelector('#navbar__logo');

  if (!menuToggle || !menuLinks) return;

  // Toggle mobile menu
  const toggleMenu = () => {
    menuToggle.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
  };

  // Hide mobile menu when link is clicked
  const hideMenu = () => {
    if (window.innerWidth <= 900 && menuToggle.classList.contains('is-active')) {
      menuToggle.classList.remove('is-active');
      menuLinks.classList.remove('active');
    }
  };

  // Event listeners
  menuToggle.addEventListener('click', toggleMenu);
  navLinks.forEach(link => link.addEventListener('click', hideMenu));
  navLogo.addEventListener('click', hideMenu);
};

// ==========================================
// SCROLL HIGHLIGHT
// Highlights navbar link based on current section
// ==========================================
const initScrollHighlight = () => {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__links');

  if (sections.length === 0 || navLinks.length === 0) return;

  const highlightMenu = () => {
    const scrollPos = window.scrollY + 200; // Offset for navbar height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      // Check if we're in this section
      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('highlight');
          
          // Add highlight if link matches section
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('highlight');
          }
        });
      }
    });
  };

  // Event listeners
  window.addEventListener('scroll', highlightMenu);
  window.addEventListener('load', highlightMenu); // Highlight on page load
};

// ==========================================
// CAROUSEL
// Image carousel with quotes
// ==========================================
const initCarousel = () => {
  const slides = document.querySelectorAll('.carousel__slide');
  const prevBtn = document.querySelector('.carousel__btn--prev');
  const nextBtn = document.querySelector('.carousel__btn--next');

  if (slides.length === 0 || !prevBtn || !nextBtn) return;

  let currentSlide = 0;
  let slideInterval;

  // Show specific slide
  const showSlide = (index) => {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    currentSlide = index;
  };

  // Show next slide
  const nextSlide = () => {
    const nextIndex = (currentSlide + 1) % slides.length;
    showSlide(nextIndex);
  };

  // Show previous slide
  const prevSlide = () => {
    const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prevIndex);
  };

  // Reset auto-advance timer
  const resetInterval = () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 5000);
  };

  // Event listeners
  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetInterval();
  });

  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetInterval();
  });

  // Start auto-advance
  slideInterval = setInterval(nextSlide, 5000);
};

// ==========================================
// DYNAMIC TEXT TYPING EFFECT
// Animates words in hero section
// ==========================================
const initDynamicText = () => {
  const textEl = document.getElementById('dynamic-text');
  
  if (!textEl) return;

  const words = [
    "Adventurous",
    "a Risk-taker",
    "Innovative",
    "Competitive",
    "Active",
    "Fearless",
    "Stoic"
  ];

  let wordIndex = 0;
  let letterIndex = 0;
  const typingSpeed = 150;    // ms per letter
  const deletingSpeed = 100;  // ms per letter
  const delayBetweenWords = 1500; // pause before deleting

  // Type out current word
  const typeWord = () => {
    if (letterIndex < words[wordIndex].length) {
      textEl.textContent += words[wordIndex][letterIndex];
      letterIndex++;
      setTimeout(typeWord, typingSpeed);
    } else {
      setTimeout(deleteWord, delayBetweenWords);
    }
  };

  // Delete current word
  const deleteWord = () => {
    if (letterIndex > 0) {
      textEl.textContent = words[wordIndex].substring(0, letterIndex - 1);
      letterIndex--;
      setTimeout(deleteWord, deletingSpeed);
    } else {
      wordIndex = (wordIndex + 1) % words.length;
      setTimeout(typeWord, typingSpeed);
    }
  };

  // Start the animation
  typeWord();
};

// ==========================================
// INITIALIZE ALL FUNCTIONS
// ==========================================
const init = () => {
  initMobileMenu();
  initScrollHighlight();
  initCarousel();
  initDynamicText();
};

// Run on DOM content loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ============================================
   PERFORMANCE NOTES
   ============================================
   
   Improvements made:
   1. Wrapped all functions in init modules
   2. Added null checks to prevent errors
   3. Removed redundant event listeners
   4. Used const instead of let where appropriate
   5. Added comments for clarity
   6. Consolidated similar logic
   7. Improved variable naming
   
   Ready for GSAP integration:
   - Clean selector references
   - Isolated functions
   - No conflicting animations
   
   ============================================ */
