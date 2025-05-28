document.addEventListener("DOMContentLoaded", function () {
    // ========================
    //    ScrollReveal Init
    // ========================
    if (typeof ScrollReveal !== 'undefined') {
        ScrollReveal().reveal('[data-sr]', {
            duration: 1000,
            origin: 'bottom',
            distance: '50px',
            easing: 'ease-in-out',
            reset: false
        });
    }

    // ========================
    //        SLIDER
    // ========================
    const slides = document.querySelectorAll('.slide');
    const dotsContainer = document.getElementById('dots');
    let dots = [];
    const progressBar = document.getElementById('progressBar');
    const nextBtn = document.getElementById('next');
    const prevBtn = document.getElementById('prev');
    const pausePlayBtn = document.getElementById('pausePlay');

    let currentIndex = 0;
    let autoSlideInterval = null; // المؤقت الزمني للانتقال بين الشرائح
    let autoSlideRunning = true; // حالة التشغيل التلقائي للسلايدر

    const SLIDE_DURATION = 8000; // مدة عرض الشريحة بالمللي ثانية (8 ثوانٍ)

    // متغيرات لتتبع حالة العداد
    let remainingTime = SLIDE_DURATION; // الوقت المتبقي للشريحة الحالية
    let animationFrameId = null; // لتتبع requestAnimationFrame الخاص بالعداد

    // دالة إنشاء النقاط
    function generateDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';

        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.dataset.index = index;
            dot.setAttribute('aria-label', `الشريحة ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dotsContainer.appendChild(dot);
        });

        dots = document.querySelectorAll('.dot');

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const wasRunning = autoSlideRunning;
                resetSlideAndAutoPlay(); // إعادة تعيين كاملة عند النقر على نقطة
                showSlide(parseInt(dot.dataset.index));
                if (wasRunning) {
                    setTimeout(startAutoSlide, 500); // استئناف أسرع بعد الانتقال اليدوي
                }
            });

            dot.addEventListener('mouseenter', () => {
                dot.style.transform = 'scale(1.3)';
            });

            dot.addEventListener('mouseleave', () => {
                dot.style.transform = 'scale(1)';
            });
        });
    }

    // دالة لتحديث أيقونة زر الإيقاف/التشغيل
    function updatePausePlayButton() {
        if (pausePlayBtn) {
            pausePlayBtn.innerHTML = autoSlideRunning ? '❚❚' : '▶';
            pausePlayBtn.setAttribute('aria-label', autoSlideRunning ? 'إيقاف السلايدر التلقائي' : 'تشغيل السلايدر التلقائي');
        }
    }

    // دالة تحديث شريط التقدم البصري
    function updateProgressBar(progress) {
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
    }

    // دالة بدء حركة شريط التقدم
    function animateProgressBar(duration) {
        if (!progressBar) return;

        // تأكد من أن الـ transition مضبوط بشكل صحيح
        progressBar.style.transition = `width ${duration / 1000}s linear`;
        progressBar.style.width = '100%'; // يبدأ من النقطة الحالية ويصل إلى 100%

        // هذه الدالة الآن مسؤولة فقط عن الحركة البصرية
    }

    // دالة عرض الشريحة (إعادة تعيين كامل للعداد)
    function showSlide(index) {
        if (!slides.length || !dots.length) return;

        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
            dots[i].classList.toggle('active', i === index);
        });

        currentIndex = index;

        // إعادة تعيين العداد بصرياً إلى الصفر وبدء دورة جديدة إذا كان التشغيل التلقائي فعالاً
        if (progressBar) {
            progressBar.style.transition = 'none'; // إزالة أي انتقال سابق
            progressBar.style.width = '0%'; // إعادة العداد للصفر

            remainingTime = SLIDE_DURATION; // إعادة تعيين الوقت المتبقي للشريحة الجديدة

            if (autoSlideRunning) {
                // بدء حركة العداد للشريحة الجديدة
                startProgressBarAnimation(SLIDE_DURATION);
            }
        }
    }

    // دالة لإدارة حركة شريط التقدم بناءً على remainingTime
    function startProgressBarAnimation(duration) {
        if (!progressBar) return;

        // إلغاء أي requestAnimationFrame سابق
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }

        const startTime = Date.now();
        const startWidth = (SLIDE_DURATION - remainingTime) / SLIDE_DURATION * 100; // النسبة المئوية التي توقف عندها الشريط (أو 0 إذا كانت شريحة جديدة)

        const animate = () => {
            const elapsedTime = Date.now() - startTime;
            const currentProgress = startWidth + (elapsedTime / duration) * (100 - startWidth);

            if (currentProgress >= 100) {
                updateProgressBar(100);
                // هنا يمكن أن نضيف منطق للانتقال للشريحة التالية إذا لم يكن هناك setInterval
            } else {
                updateProgressBar(currentProgress);
                animationFrameId = requestAnimationFrame(animate);
            }
        };
        animationFrameId = requestAnimationFrame(animate);
    }

    // دالة الشريحة التالية
    function nextSlide() {
        showSlide((currentIndex + 1) % slides.length);
    }

    // دالة الشريحة السابقة
    function prevSlide() {
        showSlide((currentIndex - 1 + slides.length) % slides.length);
    }

    // دالة بدء التشغيل التلقائي (والعداد)
    function startAutoSlide() {
        stopAutoSlide(true); // نوقف أي مؤقتات سابقة ونعد للتوقيت المتبقي

        // بدأ المؤقت الزمني لتبديل الشرائح
        autoSlideInterval = setInterval(() => {
            nextSlide();
        }, SLIDE_DURATION); // دائماً المؤقت يعمل بكامل المدة

        autoSlideRunning = true;
        updatePausePlayButton();

        // بدء حركة العداد من الوقت المتبقي (أو من الصفر إذا كانت شريحة جديدة)
        startProgressBarAnimation(remainingTime);
    }

    // دالة إيقاف التشغيل التلقائي (والعداد)
    function stopAutoSlide(isResuming = false) {
        clearInterval(autoSlideInterval); // إيقاف المؤقت الزمني لتبديل الشرائح
        cancelAnimationFrame(animationFrameId); // إيقاف حركة العداد البصرية

        autoSlideRunning = false;
        updatePausePlayButton();

        if (progressBar && !isResuming) { // إذا لم نكن نستأنف، نحفظ الوقت المتبقي
            const currentWidth = parseFloat(getComputedStyle(progressBar).width);
            const progressBarParentWidth = progressBar.parentElement.clientWidth;
            const currentProgressPercentage = (currentWidth / progressBarParentWidth) * 100;

            // حساب الوقت المتبقي بناءً على النسبة المئوية الحالية
            remainingTime = SLIDE_DURATION * (1 - (currentProgressPercentage / 100));
            if (remainingTime < 0) remainingTime = 0; // التأكد من عدم وجود قيمة سلبية
        } else if (isResuming) {
            // لا تفعل شيء خاص بـ remainingTime هنا، ستُستخدم في startAutoSlide
        } else {
            // إذا كان الإيقاف حقيقيًا وليس استئنافًا، نعيد تعيين remainingTime بالكامل للشريحة الجديدة
            remainingTime = SLIDE_DURATION; // إذا كان الإيقاف نهائيا وليس مؤقتا
        }
    }

    // دالة لإعادة تعيين حالة السلايدر والعداد بالكامل
    function resetSlideAndAutoPlay() {
        stopAutoSlide(false); // إيقاف كامل للعداد
        remainingTime = SLIDE_DURATION; // إعادة تعيين الوقت المتبقي
        if (progressBar) {
            progressBar.style.transition = 'none'; // إزالة الانتقال
            progressBar.style.width = '0%'; // إعادة العداد للصفر
        }
    }


    // إضافة مستمع لزر الإيقاف/التشغيل
    if (pausePlayBtn) {
        pausePlayBtn.addEventListener('click', () => {
            if (autoSlideRunning) {
                stopAutoSlide(false); // إيقاف حقيقي، نحفظ الوقت المتبقي
            } else {
                startAutoSlide(); // استئناف من حيث توقف
            }
        });
    }

    // دالة تأثير الأزرار
    function animateButton(button) {
        if (!button) return;
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = 'scale(1)';
        }, 200);
    }

    // مستمع لزر التالي
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const wasRunning = autoSlideRunning;
            resetSlideAndAutoPlay(); // إعادة تعيين كاملة عند الانتقال اليدوي
            nextSlide();
            animateButton(nextBtn);
            if (wasRunning) {
                setTimeout(startAutoSlide, 500);
            }
        });
    }

    // مستمع لزر السابق
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const wasRunning = autoSlideRunning;
            resetSlideAndAutoPlay(); // إعادة تعيين كاملة عند الانتقال اليدوي
            prevSlide();
            animateButton(prevBtn);
            if (wasRunning) {
                setTimeout(startAutoSlide, 500);
            }
        });
    }

    // مستمع لأزرار لوحة المفاتيح
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            const wasRunning = autoSlideRunning;
            resetSlideAndAutoPlay();
            nextSlide();
            if (wasRunning) {
                setTimeout(startAutoSlide, 500);
            }
        } else if (e.key === 'ArrowLeft') {
            const wasRunning = autoSlideRunning;
            resetSlideAndAutoPlay();
            prevSlide();
            if (wasRunning) {
                setTimeout(startAutoSlide, 500);
            }
        }
    });

    // ========================
    //    NAV TOGGLE MOBILE
    // ========================
    const menuToggle = document.getElementById("menuToggle");
    const navList = document.querySelector(".nav-list");

    if (menuToggle && navList) {
        menuToggle.addEventListener("click", function () {
            navList.classList.toggle("show");
        });
    }

    // بداية السلايدر عند تحميل الصفحة
    generateDots();
    showSlide(currentIndex); // لعرض الشريحة الأولى وبدء العداد لها
    startAutoSlide(); // ابدأ التشغيل التلقائي عند التحميل
    updatePausePlayButton(); // تأكد من تحديث أيقونة الزر عند التحميل الأولي
});