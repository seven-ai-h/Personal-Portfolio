// script.js - Enhanced Personal Portfolio

/**
 * Initialize all functionality when DOM is loaded
 */
document.addEventListener('DOMContentLoaded', function() {
  // Initialize components
  initFeatures();
  
  // Set current year in footer
  updateFooterYear();
  
  // Handle page loader
  handlePageLoader();
});

/**
 * Initialize all main features
 */
function initFeatures() {
  try {
    // Create animated stars background
    setupStarsBackground();
    
    // Setup scroll reveal animations
    setupScrollReveal();
    
    // Setup sidebar toggle functionality
    setupSidebar();
    
    // Setup contact form handling
    setupContactForm();
    
    // Setup back to top button if exists
    setupBackToTop();
    
    // Check for reduced motion preference
    checkMotionPreference();
    
  } catch (error) {
    console.error('Initialization error:', error);
  }
}

/**
 * Create and manage animated stars background
 */
function setupStarsBackground() {
  const starsContainer = document.querySelector('.stars');
  if (!starsContainer) return;

  // Initial creation
  createStars(100);
  
  // Optimized resize handling with observer
  const starsObserver = new ResizeObserver(() => createStars(100));
  starsObserver.observe(document.body);
}

function createStars(numStars = 80) {
  const starsContainer = document.querySelector('.stars');
  if (!starsContainer) return;
  
  // Clear only if needed (better for performance)
  if (starsContainer.children.length > numStars * 1.5) {
    starsContainer.innerHTML = '';
  }
  
  const { width, height } = starsContainer.getBoundingClientRect();
  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    
    // Size based on screen size
    const sizeBase = Math.min(width, height) / 500;
    const size = (Math.random() * 2 + 0.5) * sizeBase;
    
    Object.assign(star.style, {
      width: `${size}px`,
      height: `${size}px`,
      top: `${Math.random() * height}px`,
      left: `${Math.random() * width}px`,
      opacity: (Math.random() * 0.5 + 0.5).toFixed(2),
      animationDuration: `${2 + Math.random() * 3}s`,
      animationDelay: `${Math.random() * 2}s`
    });
    
    fragment.appendChild(star);
  }
  
  starsContainer.appendChild(fragment);
}

/**
 * Setup scroll reveal animations
 */
function setupScrollReveal() {
  // Initial check
  revealOnScroll();
  
  // Debounced scroll event
  let isScrolling;
  window.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(revealOnScroll, 100);
  });
}

function revealOnScroll() {
  const reveals = document.querySelectorAll('.reveal:not(.visible)');
  const windowHeight = window.innerHeight;
  const triggerPoint = windowHeight * 0.8;
  
  reveals.forEach(section => {
    const sectionTop = section.getBoundingClientRect().top;
    if (sectionTop < triggerPoint) {
      section.classList.add('visible');
    }
  });
}

/**
 * Setup sidebar toggle functionality
 */
function setupSidebar() {
  const sidebarToggle = document.querySelector('.sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  if (!sidebarToggle || !sidebar) return;

  // Toggle click handler
  sidebarToggle.addEventListener('click', function() {
    toggleSidebar(sidebar, sidebarToggle);
  });

  // Close when clicking a link
  sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeSidebar(sidebar, sidebarToggle));
  });

  // Close when clicking outside
  document.addEventListener('click', function(e) {
    const isSidebarClick = sidebar.contains(e.target) || e.target === sidebarToggle;
    if (!isSidebarClick && sidebar.classList.contains('open')) {
      closeSidebar(sidebar, sidebarToggle);
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar(sidebar, sidebarToggle);
    }
  });
}

function toggleSidebar(sidebar, toggle) {
  const isOpen = sidebar.classList.toggle('open');
  toggle.setAttribute('aria-expanded', isOpen);
  sidebar.setAttribute('aria-hidden', !isOpen);
  document.body.classList.toggle('sidebar-open', isOpen);
}

function closeSidebar(sidebar, toggle) {
  sidebar.classList.remove('open');
  toggle.setAttribute('aria-expanded', false);
  sidebar.setAttribute('aria-hidden', true);
  document.body.classList.remove('sidebar-open');
}

/**
 * Setup contact form handling
 */
function setupContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const formMessage = document.getElementById('form-message');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Store original button text
    const originalBtnText = submitBtn.textContent;
    
    try {
      // UI feedback while submitting
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
      formMessage.textContent = '';
      formMessage.style.color = '';
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real implementation, you would use:
      // const formData = new FormData(form);
      // const response = await fetch('your-endpoint.php', {
      //   method: 'POST',
      //   body: formData
      // });
      // if (!response.ok) throw new Error('Network response was not ok');
      
      // Success feedback
      formMessage.textContent = 'Thank you for your message!';
      formMessage.style.color = 'green';
      form.reset();
    } catch (error) {
      // Error feedback
      formMessage.textContent = 'Failed to send message. Please try again.';
      formMessage.style.color = 'red';
      console.error('Error:', error);
    } finally {
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
    }
  });
}

/**
 * Setup back to top button
 */
function setupBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', function() {
    backToTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });
  
  backToTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Check for reduced motion preference
 */
function checkMotionPreference() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.documentElement.classList.add('reduced-motion');
  }
}

/**
 * Update footer year automatically
 */
function updateFooterYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Handle page loader transition
 */
function handlePageLoader() {
  const loader = document.querySelector('.loader');
  if (loader) {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => loader.remove(), 300);
    }, 500);
  }
}

/**
 * Basic performance monitoring
 */
window.addEventListener('load', function() {
  if ('performance' in window) {
    const navTiming = performance.getEntriesByType('navigation')[0];
    if (navTiming) {
      console.log('Page load time:', navTiming.loadEventEnd - navTiming.startTime, 'ms');
    }
  }
});