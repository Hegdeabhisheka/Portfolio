/**
 * 3D Portfolio Interactive Script
 * Handles cube rotation, mouse tracking, and smooth animations
 */

// ============================================
// INITIALIZATION & DOM ELEMENTS
// ============================================

const cube = document.getElementById('cube');
const profileImage = document.querySelector('.profile-placeholder');
const projectCards = document.querySelectorAll('.project-card');
const skillItems = document.querySelectorAll('.skill-item');
const timelineItems = document.querySelectorAll('.timeline-item');
const navLinks = document.querySelectorAll('.nav-links a');

// ============================================
// MOUSE TRACKING & 3D CUBE INTERACTION
// ============================================

let mouseX = 0;
let mouseY = 0;
let targetRotationX = 0;
let targetRotationY = 0;
let currentRotationX = 0;
let currentRotationY = 0;

// Track mouse movement for 3D effect
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = (e.clientY / window.innerHeight) * 2 - 1;

  // Calculate target rotation based on mouse position
  targetRotationY = mouseX * 15;
  targetRotationX = -mouseY * 15;
});

// Smooth animation loop for cube rotation
function animateCube() {
  // Smoothly interpolate towards target rotation
  currentRotationX += (targetRotationX - currentRotationX) * 0.1;
  currentRotationY += (targetRotationY - currentRotationY) * 0.1;

  // Apply rotation to cube
  if (cube) {
    cube.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg)`;
  }

  requestAnimationFrame(animateCube);
}

// Start animation loop
animateCube();

// ============================================
// INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
// ============================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe project cards
projectCards.forEach((card) => {
  card.style.opacity = '0';
  observer.observe(card);
});

// Observe skill items
skillItems.forEach((item) => {
  item.style.opacity = '0';
  observer.observe(item);
});

// Observe timeline items
timelineItems.forEach((item) => {
  item.style.opacity = '0';
  observer.observe(item);
});

// Add fade-in animation class styling dynamically
const style = document.createElement('style');
style.textContent = `
  .fade-in {
    animation: fadeInUp 0.6s ease-out forwards !important;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Stagger animation for multiple elements */
  .project-card.fade-in {
    animation-delay: calc(var(--index, 0) * 100ms);
  }

  .skill-item.fade-in {
    animation-delay: calc(var(--index, 0) * 50ms);
  }

  .timeline-item.fade-in {
    animation-delay: calc(var(--index, 0) * 150ms);
  }
`;
document.head.appendChild(style);

// Set stagger index for animations
projectCards.forEach((card, index) => {
  card.style.setProperty('--index', index);
});

skillItems.forEach((item, index) => {
  item.style.setProperty('--index', index);
});

timelineItems.forEach((item, index) => {
  item.style.setProperty('--index', index);
});

// ============================================
// ENHANCED HOVER EFFECTS
// ============================================

// Profile image hover effect
if (profileImage) {
  profileImage.addEventListener('mouseenter', () => {
    profileImage.style.transform = 'scale(1.05)';
  });

  profileImage.addEventListener('mouseleave', () => {
    profileImage.style.transform = 'scale(1)';
  });

  profileImage.style.transition = 'transform 0.3s ease';
}

// ============================================
// SMOOTH SCROLL FOR NAVIGATION
// ============================================

navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// ============================================
// PARALLAX EFFECT FOR HERO SECTION
// ============================================

let scrollProgress = 0;

window.addEventListener('scroll', () => {
  const heroSection = document.querySelector('.hero-section');
  if (heroSection) {
    const scrolled = window.scrollY;
    const windowHeight = window.innerHeight;
    scrollProgress = Math.min(scrolled / windowHeight, 1);

    // Apply parallax effect to cube
    if (cube) {
      cube.style.opacity = Math.max(1 - scrollProgress * 1.5, 0);
      cube.style.transform = `rotateX(${currentRotationX}deg) rotateY(${currentRotationY}deg) translateZ(${-scrollProgress * 50}px)`;
    }
  }
});

// ============================================
// ACTIVE NAVIGATION LINK
// ============================================

const updateActiveLink = () => {
  const sections = [
    { id: '#about', element: document.querySelector('.hero-section') },
    { id: '#projects', element: document.querySelector('.projects-section') },
    { id: '#skills', element: document.querySelector('.skills-section') },
    { id: '#contact', element: document.querySelector('.contact-section') }
  ];

  const scrollPosition = window.scrollY + 100;

  sections.forEach(({ id, element }) => {
    if (element) {
      const { offsetTop, offsetHeight } = element;
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === id) {
            link.classList.add('active');
          }
        });
      }
    }
  });
};

// Add active link styling
const activeStyle = document.createElement('style');
activeStyle.textContent = `
  .nav-links a.active {
    color: var(--accent) !important;
  }

  .nav-links a.active::after {
    width: 100% !important;
  }
`;
document.head.appendChild(activeStyle);

window.addEventListener('scroll', updateActiveLink);

// ============================================
// PROFILE IMAGE UPLOAD FUNCTIONALITY
// ============================================

// Make profile placeholder clickable for image upload (optional)
if (profileImage) {
  profileImage.style.cursor = 'pointer';

  profileImage.addEventListener('click', () => {
    // You can add file upload functionality here
    console.log('Profile image placeholder clicked - ready for image upload');
  });
}

// ============================================
// PAGE LOAD ANIMATIONS
// ============================================

window.addEventListener('load', () => {
  // Add loaded class to body for animation triggers
  document.body.classList.add('page-loaded');
});

// ============================================
// DYNAMIC STATS COUNTER
// ============================================

const animateCounter = (element, target, duration = 1000) => {
  let current = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current) + (element.textContent.includes('+') ? '+' : '');
  }, 16);
};

// Observe stats and animate when in view
const stats = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
  if (entries[0].isIntersecting && !statsAnimated) {
    statsAnimated = true;
    stats.forEach((stat) => {
      const text = stat.textContent;
      const number = parseInt(text.replace(/[^0-9]/g, ''));
      animateCounter(stat, number);
    });
    statsObserver.unobserve(entries[0].target);
  }
});

if (stats.length > 0) {
  statsObserver.observe(stats[0].parentElement);
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', (e) => {
  // Home key - scroll to top
  if (e.key === 'Home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // End key - scroll to bottom
  if (e.key === 'End') {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
});

// ============================================
// PERFORMANCE OPTIMIZATION: Throttle mouse tracking
// ============================================

let mouseTrackingEnabled = true;
const throttleMouseTracking = () => {
  if (!mouseTrackingEnabled) return;
  mouseTrackingEnabled = false;
  setTimeout(() => {
    mouseTrackingEnabled = true;
  }, 16);
};

document.addEventListener('mousemove', throttleMouseTracking, { passive: true });

// ============================================
// ACCESSIBILITY: ARIA LIVE REGION UPDATES
// ============================================

// Create live region for screen readers
const liveRegion = document.createElement('div');
liveRegion.setAttribute('aria-live', 'polite');
liveRegion.setAttribute('aria-atomic', 'true');
liveRegion.className = 'sr-only';
liveRegion.style.position = 'absolute';
liveRegion.style.left = '-10000px';
document.body.appendChild(liveRegion);

// ============================================
// SMOOTH COLOR TRANSITIONS ON SCROLL
// ============================================

const handleColorTransition = () => {
  const scrolled = window.scrollY;
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = scrolled / maxScroll;

  // Optional: Update header background opacity based on scroll
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.style.backdropFilter = `blur(${Math.min(scrollPercent * 20, 10)}px)`;
  }
};

window.addEventListener('scroll', handleColorTransition, { passive: true });

// ============================================
// INITIALIZATION COMPLETE
// ============================================

console.log('✨ 3D Portfolio loaded successfully!');
console.log('🎯 Features: Interactive 3D cube, smooth animations, and dynamic content loading');
