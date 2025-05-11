// ScrollReveal لجميع العناصر التي تحتوي على data-sr
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

// عرض شريحة معيّنة
function showSlide(index) {
  if (!slides.length || !dots.length) return;

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
    dots[i].classList.toggle('active', i === index);
  });

  // تحديث شريط التقدم
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

// التنقل بين الشرائح
const nextSlide = () => showSlide((currentIndex + 1) % slides.length);
const prevSlide = () => showSlide((currentIndex - 1 + slides.length) % slides.length);

// بدء / إيقاف التحريك التلقائي
const startAutoSlide = () => {
  stopAutoSlide();
  autoSlideInterval = setInterval(nextSlide, 8000);
};

const stopAutoSlide = () => clearInterval(autoSlideInterval);

// تأثير بسيط عند الضغط على الزر
function animateButton(button) {
  if (!button) return;
  button.style.transform = 'scale(1.2)';
  setTimeout(() => {
    button.style.transform = 'scale(1)';
  }, 200);
}

// تفعيل أزرار التالي / السابق
[nextBtn, prevBtn].forEach((btn, isNext) => {
  if (!btn) return;
  btn.addEventListener('click', () => {
    stopAutoSlide();
    isNext ? nextSlide() : prevSlide();
    startAutoSlide();
    animateButton(btn);
  });
});

// تفعيل النقط للتنقل المباشر
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    const index = Number(dot.dataset.index);
    if (!isNaN(index)) {
      stopAutoSlide();
      showSlide(index);
      startAutoSlide();
    }
  });

  // تحسين المظهر عند المرور
  dot.addEventListener('mouseenter', () => {
    dot.style.transform = 'scale(1.3)';
  });

  dot.addEventListener('mouseleave', () => {
    dot.style.transform = 'scale(1)';
  });
});

// دعم التنقل بلوحة المفاتيح
document.addEventListener('keydown', e => {
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

// بدء العرض
showSlide(currentIndex);
startAutoSlide();
