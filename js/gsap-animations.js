// ==========================================
// GSAP ANIMATIONS - HERO SECTION
// Professional entrance animations for main/hero section
// ==========================================

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  
  // Register ScrollTrigger plugin
  gsap.registerPlugin(ScrollTrigger);
  
  // ==========================================
  // HERO SECTION ANIMATIONS
  // ==========================================
  
  const initHeroAnimations = () => {
    // Create a timeline for coordinated animations
    const heroTimeline = gsap.timeline({
      defaults: {
        ease: 'power3.out',
        duration: 1
      }
    });
    
    // 1. Main heading - fade in and slide up
    heroTimeline.from('.main__heading', {
      opacity: 0,
      y: 50,
      duration: 1.2
    });
    
    // 2. Subheading with dynamic text - fade in
    heroTimeline.from('.main__subheading', {
      opacity: 0,
      y: 30,
      duration: 0.8
    }, '-=0.6'); // Start 0.6s before previous animation ends
    
    // 3. Description text - fade in
    heroTimeline.from('.main__description', {
      opacity: 0,
      y: 30,
      duration: 0.8
    }, '-=0.4');
    
    // 4. Icons - stagger animation (appear one by one)
    heroTimeline.from('.main__icon--link', {
      opacity: 0,
      scale: 0,
      rotation: -180,
      stagger: 0.1, // 0.1s delay between each icon
      duration: 0.6,
      ease: 'back.out(1.7)' // Bouncy effect
    }, '-=0.4');
    
    // 5. Images - fade in and scale
    heroTimeline.from('.main__img', {
      opacity: 0,
      scale: 0.8,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.6');
    
    // 6. Spiral animation - fade in and rotate
    heroTimeline.from('.spiral_1', {
      opacity: 0,
      scale: 0.5,
      rotation: -360,
      duration: 1.5,
      ease: 'power1.out'
    }, '-=1'); // Start while images are animating
  };
  
  // ==========================================
  // SCROLL-TRIGGERED PARALLAX EFFECTS
  // ==========================================
  
  const initHeroParallax = () => {
    // Only enable parallax on desktop
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 768px)", () => {
      // Images move up slightly as you scroll down
      gsap.to('.main__img', {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: '.main',
          start: 'top top',
          end: 'bottom top',
          scrub: 1, // Smooth scrubbing effect
          markers: false // Set to true for debugging
        }
      });
      
      // Spiral rotates as you scroll
      gsap.to('.spiral_1', {
        rotation: 180,
        ease: 'none',
        scrollTrigger: {
          trigger: '.main',
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });
      
      // Content fades out slightly as you scroll past
      gsap.to('.main__content', {
        opacity: 0.3,
        y: -50,
        ease: 'none',
        scrollTrigger: {
          trigger: '.main',
          start: 'center top',
          end: 'bottom top',
          scrub: 1
        }
      });
    });
  };
  
  // ==========================================
  // ENHANCED ICON HOVER EFFECTS
  // ==========================================
  
  const initIconHoverEffects = () => {
    const icons = document.querySelectorAll('.main__icon--link');
    
    icons.forEach(icon => {
      // Hover in
      icon.addEventListener('mouseenter', () => {
        gsap.to(icon, {
          scale: 1.2,
          rotation: 10,
          duration: 0.3,
          ease: 'back.out(2)'
        });
      });
      
      // Hover out
      icon.addEventListener('mouseleave', () => {
        gsap.to(icon, {
          scale: 1,
          rotation: 0,
          duration: 0.3,
          ease: 'power2.inOut'
        });
      });
    });
  };
  
  // ==========================================
  // IMAGE HOVER EFFECTS
  // ==========================================
  
  const initImageHoverEffects = () => {
    const images = document.querySelectorAll('.main__img');
    
    images.forEach(image => {
      // Hover in - smooth scale with slight rotation
      image.addEventListener('mouseenter', () => {
        gsap.to(image, {
          scale: 1.08,
          rotation: 2,
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      
      // Hover out
      image.addEventListener('mouseleave', () => {
        gsap.to(image, {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: 'power2.inOut'
        });
      });
    });
  };
  
  // ==========================================
  // INITIALIZE ALL HERO ANIMATIONS
  // ==========================================
  
  // Check if we're on a page with the hero section
  if (document.querySelector('.main')) {
    initHeroAnimations();
    initHeroParallax();
    initIconHoverEffects();
    initImageHoverEffects();
    
    console.log('✨ Hero GSAP animations initialized');
  }
  
  // ==========================================
  // JOURNEY/TIMELINE SECTION ANIMATIONS
  // ==========================================
  
  const initJourneyAnimations = () => {
    // 1. Section heading - fade in on scroll
    gsap.from('.journey__heading', {
      opacity: 0,
      y: 50,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.journey',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    // 2. Subheading - fade in with delay
    gsap.from('.journey__subheading', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.2,
      scrollTrigger: {
        trigger: '.journey',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    // 3. Timeline bars - draw from top to bottom
    gsap.from('.timeline::before', {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 1.5,
      ease: 'power2.inOut',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    });
    
    gsap.from('.timeline::after', {
      scaleY: 0,
      transformOrigin: 'top center',
      duration: 1.5,
      ease: 'power2.inOut',
      delay: 0.1,
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top 70%',
        toggleActions: 'play none none none'
      }
    });
    
    // 4. Timeline cards - slide in from left/right with stagger
    const timelineContainers = gsap.utils.toArray('.timeline .container');
    
    timelineContainers.forEach((container, index) => {
      const isEducation = container.classList.contains('education');
      
      gsap.from(container, {
        opacity: 0,
        x: isEducation ? -100 : 100, // Education from left, Job from right
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });
      
      // 5. Dots pop in when card appears
      gsap.from(container, {
        scale: 0,
        rotation: 180,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }, '+=0.3'); // Start 0.3s after card starts animating
    });
  };
  
  // ==========================================
  // ENHANCED TIMELINE CARD HOVER EFFECTS
  // ==========================================
  
  const initTimelineHoverEffects = () => {
    const cards = document.querySelectorAll('.timeline .container .desc');
    
    cards.forEach(card => {
      // Hover in - smooth lift with slight rotation
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -10,
          scale: 1.03,
          rotation: 1,
          boxShadow: '0 10px 30px rgba(255, 69, 0, 0.3)',
          duration: 0.3,
          ease: 'power2.out'
        });
      });
      
      // Hover out
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          rotation: 0,
          boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
          duration: 0.3,
          ease: 'power2.inOut'
        });
      });
    });
  };
  
  // ==========================================
  // INITIALIZE JOURNEY ANIMATIONS
  // ==========================================
  
  if (document.querySelector('.journey')) {
    initJourneyAnimations();
    initTimelineHoverEffects();
    
    console.log('✨ Journey GSAP animations initialized');
  }
  
  // ==========================================
  // CV PAGE ANIMATIONS
  // ==========================================
  
  const initCVAnimations = () => {
    // 1. CV Title and intro - fade in
    gsap.from('.cv__container h1', {
      opacity: 0,
      y: 50,
      duration: 1,
      ease: 'power3.out'
    });
    
    gsap.from('.cv__intro', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      delay: 0.3
    });
    
    // 2. Ribbon animation - slide in
    gsap.from('.cv__ribbon', {
      scaleX: 0,
      duration: 1.2,
      ease: 'power2.inOut',
      delay: 0.5,
      stagger: 0.3
    });
    
    // 3. "Strengths" heading
    gsap.from('.cv__container h2', {
      opacity: 0,
      y: 30,
      duration: 0.8,
      scrollTrigger: {
        trigger: '.cv__skills-grid',
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
    
    // 4. SKILL CARDS - Grid stagger animation ⭐
    gsap.from('.skill-card', {
      opacity: 0,
      y: 60,
      scale: 0.8,
      rotation: -5,
      stagger: {
        amount: 0.8,      // Total time for all staggers
        grid: [2, 4],     // 2 rows, 4 columns (adjust based on your grid)
        from: 'start',    // Start from top-left
        ease: 'power2.out'
      },
      duration: 0.6,
      ease: 'back.out(1.4)',
      scrollTrigger: {
        trigger: '.cv__skills-grid',
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    });
    
    // 5. Icons pop in after cards
    gsap.from('.skill-card i', {
      scale: 0,
      rotation: -360,
      stagger: {
        amount: 0.8,
        grid: [2, 4],
        from: 'start'
      },
      duration: 0.5,
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: '.cv__skills-grid',
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    });
    
    // 6. PDF Frame - fade in
    gsap.from('.cv__frame--wrapper', {
      opacity: 0,
      y: 50,
      duration: 1,
      scrollTrigger: {
        trigger: '.cv__frame--wrapper',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
    
    // 7. Request button - pulse effect
    gsap.from('.cv__request-btn', {
      scale: 0,
      rotation: -180,
      duration: 0.8,
      ease: 'back.out(2)',
      delay: 0.5,
      scrollTrigger: {
        trigger: '.cv__overlay',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  };
  
  // ==========================================
  // SKILL CARD HOVER EFFECTS
  // ==========================================
  
  const initSkillCardHoverEffects = () => {
    const skillCards = document.querySelectorAll('.skill-card');
    
    skillCards.forEach(card => {
      // Hover in - lift and glow
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -12,
          scale: 1.05,
          boxShadow: '0 12px 30px rgba(255, 140, 0, 0.4)',
          duration: 0.3,
          ease: 'power2.out'
        });
        
        // Icon rotate on hover
        const icon = card.querySelector('i');
        gsap.to(icon, {
          rotation: 360,
          scale: 1.2,
          duration: 0.5,
          ease: 'back.out(1.7)'
        });
      });
      
      // Hover out
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 6px 15px rgba(0,0,0,0.4)',
          duration: 0.3,
          ease: 'power2.inOut'
        });
        
        // Reset icon
        const icon = card.querySelector('i');
        gsap.to(icon, {
          rotation: 0,
          scale: 1,
          duration: 0.3
        });
      });
    });
  };
  
  // ==========================================
  // INITIALIZE CV ANIMATIONS
  // ==========================================
  
  if (document.querySelector('.cv')) {
    initCVAnimations();
    initSkillCardHoverEffects();
    
    console.log('✨ CV GSAP animations initialized');
  }
  
});

// ==========================================
// UTILITY: Refresh ScrollTrigger on window resize
// ==========================================
window.addEventListener('resize', () => {
  ScrollTrigger.refresh();
});