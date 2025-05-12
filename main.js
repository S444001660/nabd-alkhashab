document.addEventListener("DOMContentLoaded", function () {
  // ========================
  //    ScrollReveal Init
  // ========================
  ScrollReveal().reveal('[data-sr]', {
    duration: 1000,
    origin: 'bottom',
    distance: '50px',
    easing: 'ease-in-out',
    reset: false
  });

  // ========================
  //        SLIDER
  // ========================
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const progressBar = document.getElementById('progressBar');
  const nextBtn = document.getElementById('next');
  const prevBtn = document.getElementById('prev');

  let currentIndex = 0;
  let autoSlideInterval = null;

  function showSlide(index) {
    if (!slides.length || !dots.length) return;

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      dots[i].classList.toggle('active', i === index);
    });

    if (progressBar) {
      progressBar.style.transition = 'none';
      progressBar.style.width = '0%';
      setTimeout(() => {
        progressBar.style.transition = 'width 8s linear';
        progressBar.style.width = '100%';
      }, 50);
    }

    currentIndex = index;
  }

  function nextSlide() {
    showSlide((currentIndex + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((currentIndex - 1 + slides.length) % slides.length);
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideInterval = setInterval(nextSlide, 8000);
  }

  function stopAutoSlide() {
    clearInterval(autoSlideInterval);
  }

  function animateButton(button) {
    if (!button) return;
    button.style.transform = 'scale(1.2)';
    setTimeout(() => {
      button.style.transform = 'scale(1)';
    }, 200);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoSlide();
      nextSlide();
      animateButton(nextBtn);
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      stopAutoSlide();
      prevSlide();
      animateButton(prevBtn);
      startAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const index = parseInt(dot.dataset.index);
      if (!isNaN(index)) {
        stopAutoSlide();
        showSlide(index);
        startAutoSlide();
      }
    });

    dot.addEventListener('mouseenter', () => {
      dot.style.transform = 'scale(1.3)';
    });

    dot.addEventListener('mouseleave', () => {
      dot.style.transform = 'scale(1)';
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      stopAutoSlide();
      nextSlide();
      startAutoSlide();
    } else if (e.key === 'ArrowLeft') {
      stopAutoSlide();
      prevSlide();
      startAutoSlide();
    }
  });

  // ========================
  //     NAV TOGGLE MOBILE
  // ========================
  const menuToggle = document.getElementById("menuToggle");
  const navList = document.querySelector(".nav-list");

  if (menuToggle && navList) {
    menuToggle.addEventListener("click", function () {
      navList.classList.toggle("show");
    });
  }

  // Start
  showSlide(currentIndex);
  startAutoSlide();
});
