// =========================
// お客様の声カルーセル
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const voiceSection = document.querySelector('.voice');
  if (!voiceSection) return;

  const next = voiceSection.querySelector('#next');
  const prev = voiceSection.querySelector('#prev');
  const wrapper = voiceSection.querySelector('.swiper-wrapper');
  const track = voiceSection.querySelector('.swiper-wrapper ol');
  const slides = voiceSection.querySelectorAll('.swiper-wrapper ol > li');
  const dots = voiceSection.querySelectorAll('.slide-dot');

  if (!wrapper || !track || slides.length === 0 || !next || !prev) return;

  let currentIndex = 0;

  function updateButtons() {
    prev.disabled = currentIndex === 0;
    next.disabled = currentIndex === slides.length - 1;

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === currentIndex);
    });
  }

  function moveSlides() {
    const slideWidth = wrapper.getBoundingClientRect().width;
    track.style.transform = `translateX(-${slideWidth * currentIndex}px)`;
    updateButtons();
  }

  next.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      moveSlides();
    }
  });

  prev.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      moveSlides();
    }
  });

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const index = Number(dot.dataset.slideIndex);
      if (Number.isFinite(index) && index >= 0 && index < slides.length) {
        currentIndex = index;
        moveSlides();
      }
    });
  });

  // リサイズ時に幅を再計算してズレを防ぐ
  window.addEventListener('resize', moveSlides);

  // 画像読み込み後のレイアウト変化にも対応
  window.addEventListener('load', moveSlides);

  moveSlides();
});



// スクロール追従CV表示（SP / PC 共通）
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const firstview = document.querySelector('.firstview');
  const footer = document.querySelector('footer');
  const mobileCv = document.querySelector('.CV.cs');
  const pcCv = document.querySelector('.pc-CV.pc');

  const firstviewShowWhenBottomWithinPx = 1000;
  const footerHideEarlierPx = 500;

  if (!firstview || !footer) return;

  function updateSingleCvVisibility(target) {
    if (!target) return;

    const fvRect = firstview.getBoundingClientRect();

    const passedFirstview =
      fvRect.top < 0 &&
      fvRect.bottom <= firstviewShowWhenBottomWithinPx;

    const targetH = target.getBoundingClientRect().height || target.offsetHeight || 0;
    const footerTop = footer.getBoundingClientRect().top;

    const beforeFooterOverlap =
      footerTop > window.innerHeight - targetH + footerHideEarlierPx;

    const show = passedFirstview && beforeFooterOverlap;
    target.classList.toggle('show', show);
  }

  function updateAllStickyCvVisibility() {
    updateSingleCvVisibility(mobileCv);
    updateSingleCvVisibility(pcCv);
  }

  window.addEventListener('scroll', updateAllStickyCvVisibility, { passive: true });
  window.addEventListener('resize', updateAllStickyCvVisibility);
  window.addEventListener('load', updateAllStickyCvVisibility);

  updateAllStickyCvVisibility();
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
