document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
    mobileMenuButton.querySelector('svg').innerHTML = mobileMenu.classList.contains('hidden')
      ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>'
      : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>';
  });

  // FAQ toggle
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const toggle = item.querySelector('.faq-toggle');
    const answer = item.querySelector('.faq-answer');
    
    toggle.addEventListener('click', () => {
      const isOpen = !answer.classList.contains('hidden');
      faqItems.forEach(i => {
        i.querySelector('.faq-answer').classList.add('hidden');
        i.querySelector('.faq-toggle').textContent = '+';
      });
      
      if (!isOpen) {
        answer.classList.remove('hidden');
        toggle.textContent = '−';
      }
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Intersection Observer for animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-slide-up');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.glass-card, .faq-item').forEach(item => {
    observer.observe(item);
  });

  // Back to top button
  const backToTop = document.createElement('button');
  backToTop.innerHTML = '↑';
  backToTop.className = 'fixed bottom-8 right-8 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 hidden';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('hidden', window.scrollY < 300);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});
