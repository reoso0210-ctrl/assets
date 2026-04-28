// =========================
// お客様の声カルーセル
// SP：ボタン操作
// PC：自動スライド（無限ループ）
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const voiceSection = document.querySelector('.voice');
  if (!voiceSection) return;

  const next = voiceSection.querySelector('#next');
  const prev = voiceSection.querySelector('#prev');
  const wrapper = voiceSection.querySelector('.swiper-wrapper');
  const track = voiceSection.querySelector('.swiper-wrapper ol');
  const dots = voiceSection.querySelectorAll('.slide-dot');

  if (!wrapper || !track || !next || !prev) return;

  const desktopMq = window.matchMedia('(min-width: 768px)');

  let currentIndex = 0;
  let autoSlideTimer = null;
  let isAnimating = false;
  let clonedSlide = null;

  function getOriginalSlides() {
    return Array.from(track.children).filter((slide) => !slide.dataset.clone);
  }

  function getAllSlides() {
    return Array.from(track.children);
  }

  function getSlideWidth() {
    return wrapper.getBoundingClientRect().width;
  }

  function setTransition(enable) {
    track.style.transition = enable ? 'transform 0.5s ease' : 'none';
  }

  function updateDots() {
    const originalSlides = getOriginalSlides();

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentIndex);
      dot.disabled = i >= originalSlides.length;
    });
  }

  function updateButtons() {
    const originalSlides = getOriginalSlides();

    if (desktopMq.matches) return;

    prev.disabled = currentIndex === 0;
    next.disabled = currentIndex === originalSlides.length - 1;
    updateDots();
  }

  function moveSlides(withTransition = true) {
    const slideWidth = getSlideWidth();
    setTransition(withTransition);
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    updateButtons();
  }

  function createCloneForDesktop() {
    if (clonedSlide) return;

    const firstOriginalSlide = getOriginalSlides()[0];
    if (!firstOriginalSlide) return;

    clonedSlide = firstOriginalSlide.cloneNode(true);
    clonedSlide.dataset.clone = 'true';
    track.appendChild(clonedSlide);
  }

  function removeCloneForMobile() {
    if (!clonedSlide) return;
    clonedSlide.remove();
    clonedSlide = null;
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  function startAutoSlide() {
    if (!desktopMq.matches) return;

    stopAutoSlide();

    autoSlideTimer = setInterval(() => {
      if (isAnimating) return;

      const allSlides = getAllSlides();
      if (allSlides.length <= 1) return;

      isAnimating = true;
      currentIndex += 1;
      moveSlides(true);
    }, 3000);
  }

  track.addEventListener('transitionend', () => {
    if (!desktopMq.matches) {
      isAnimating = false;
      return;
    }

    const originalSlides = getOriginalSlides();

    // 複製スライドまで進んだら、瞬時に1枚目へ戻す
    if (currentIndex === originalSlides.length) {
      setTransition(false);
      currentIndex = 0;
      track.style.transform = 'translateX(0px)';

      // transitionを復活させるために再描画を挟む
      track.offsetHeight;
      setTransition(true);
    }

    isAnimating = false;
  });

  next.addEventListener('click', () => {
    if (desktopMq.matches) return;

    const originalSlides = getOriginalSlides();
    if (currentIndex < originalSlides.length - 1) {
      currentIndex += 1;
      moveSlides(true);
    }
  });

  prev.addEventListener('click', () => {
    if (desktopMq.matches) return;

    if (currentIndex > 0) {
      currentIndex -= 1;
      moveSlides(true);
    }
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      if (desktopMq.matches) return;

      const index = Number(dot.dataset.slideIndex);
      const originalSlides = getOriginalSlides();

      if (
        Number.isFinite(index) &&
        index >= 0 &&
        index < originalSlides.length
      ) {
        currentIndex = index;
        moveSlides(true);
      }
    });
  });

  // PC時にホバーで自動スライド停止
  wrapper.addEventListener('mouseenter', () => {
    if (desktopMq.matches) stopAutoSlide();
  });

  wrapper.addEventListener('mouseleave', () => {
    if (desktopMq.matches) startAutoSlide();
  });

  function applyMode() {
    stopAutoSlide();
    isAnimating = false;

    if (desktopMq.matches) {
      createCloneForDesktop();

      const originalSlides = getOriginalSlides();
      if (currentIndex >= originalSlides.length) {
        currentIndex = 0;
      }

      moveSlides(false);
      startAutoSlide();
    } else {
      removeCloneForMobile();

      const originalSlides = getOriginalSlides();
      if (currentIndex >= originalSlides.length) {
        currentIndex = originalSlides.length - 1;
      }
      if (currentIndex < 0) {
        currentIndex = 0;
      }

      moveSlides(false);
      updateButtons();
    }
  }

  window.addEventListener('resize', () => {
    applyMode();
  });

  window.addEventListener('load', () => {
    applyMode();
  });

  applyMode();
});


// =========================
// FAQ 開閉
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const faqItems = document.querySelectorAll('.faq dt');

  faqItems.forEach((dt) => {
    dt.addEventListener('click', () => {
      const dd = dt.nextElementSibling;
      if (!dd) return;

      dd.classList.toggle('open');

      const verticalLine = dt.querySelector('.vertical');

      if (verticalLine) {
        if (dd.classList.contains('open')) {
          verticalLine.style.opacity = '0';
          verticalLine.style.transform = 'scaleY(0)';
        } else {
          verticalLine.style.opacity = '1';
          verticalLine.style.transform = 'scaleY(1)';
        }
      }
    });
  });
});
