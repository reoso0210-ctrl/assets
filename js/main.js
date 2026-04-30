// スクロール追従CV表示（SP / PC 共通）
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const firstview = document.querySelector('.firstview');
  const footer = document.querySelector('footer');
  const mobileCv = document.querySelector('.CV.cs');
  const pcCv = document.querySelector('.pc-CV');

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
// お客様の声カルーセル（完全版）
// PC：自動スライド＋無限ループ
// SP：ボタン操作＋無限ループ
// =========================
document.addEventListener('DOMContentLoaded', () => {

  // voiceセクション取得（カルーセル全体）
  const voiceSection = document.querySelector('.voice');
  if (!voiceSection) return; // なければ処理終了（エラー防止）

  // 必要な要素取得
  const wrapper = voiceSection.querySelector('.swiper-wrapper'); // 表示エリア
  const track = voiceSection.querySelector('.swiper-wrapper ol'); // スライドの横並び部分
  const next = voiceSection.querySelector('#next'); // 次へボタン
  const prev = voiceSection.querySelector('#prev'); // 前へボタン
  const dots = voiceSection.querySelectorAll('.slide-dot'); // 下の丸ボタン

  // 状態管理用変数
  let currentIndex = 0; // 今どのスライドを見ているか
  let timer = null; // 自動スライド用タイマー
  let isAnimating = false; // スライド中かどうか（連打防止）

  // ===== クローン作成（無限ループ用）=====
  function setupClone() {
    if (track.querySelector('.clone')) return; // すでに作っていれば何もしない

    const items = track.children; // スライド一覧取得
    if (!items.length) return; // スライドがなければ終了

    const first = items[0]; // 1枚目
    const last = items[items.length - 1]; // 最後のスライド

    // 1枚目をコピー（最後に配置するため）
    const firstClone = first.cloneNode(true);
    firstClone.classList.add('clone');

    // 最後をコピー（最初に配置するため）
    const lastClone = last.cloneNode(true);
    lastClone.classList.add('clone');

    // 後ろに追加（1→2→3→1 になる）
    track.appendChild(firstClone);

    // 前に追加（3→1→2→3 になる）
    track.insertBefore(lastClone, first);
  }

  // ===== スライド移動 =====
  function goTo(index, smooth = true) {
    const items = track.children;
    if (!items[index]) return; // 存在しない場合は終了

    // 指定したスライドを中央にスクロール
    items[index].scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto', // アニメーション有無
      inline: 'center'
    });

    // ドット（下の丸）のアクティブ状態更新
    // クローンが先頭にあるので index -1 で合わせる
    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index - 1);
    });
  }

  // ===== 自動スライド（PCのみ）=====
  function start() {
    stop(); // すでに動いていたら止める

    if (window.innerWidth < 768) return; // SPでは自動スライドしない

    // 3秒ごとに次へ進む
    timer = setInterval(() => {
      slideNext();
    }, 3000);
  }

  function stop() {
    if (timer) {
      clearInterval(timer); // タイマー停止
      timer = null;
    }
  }

  // ===== 次へ（共通処理）=====
  function slideNext() {
    if (isAnimating) return; // アニメ中は何もしない

    isAnimating = true; // スライド開始
    currentIndex++; // 次のスライドへ
    goTo(currentIndex); // 実際に移動

    const total = track.children.length; // クローン含めた総数

    if (currentIndex === total - 1) {
      // 最後のクローンに到達した場合
      setTimeout(() => {
        currentIndex = 1; // 本物の1枚目へ戻す
        goTo(currentIndex, false); // アニメなしで位置だけ戻す
        isAnimating = false; // スライド終了
      }, 500);
    } else {
      // 通常スライド
      setTimeout(() => {
        isAnimating = false;
      }, 500);
    }
  }

  // ===== 前へ（共通処理）=====
  function slidePrev() {
    if (isAnimating) return; // アニメ中は無効

    isAnimating = true; // スライド開始
    currentIndex--; // 前のスライドへ
    goTo(currentIndex); // 実際に移動

    const total = track.children.length; // 全スライド数

    if (currentIndex === 0) {
      // 最初のクローンに到達した場合
      setTimeout(() => {
        currentIndex = total - 2; // 本物の最後へ移動
        goTo(currentIndex, false); // アニメなしで移動
        isAnimating = false;
      }, 500);
    } else {
      // 通常スライド
      setTimeout(() => {
        isAnimating = false;
      }, 500);
    }
  }

  // ===== ボタン操作 =====
  next?.addEventListener('click', slideNext); // 次へクリック
  prev?.addEventListener('click', slidePrev); // 前へクリック

  // ===== ドット操作 =====
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (isAnimating) return; // アニメ中は無効

      currentIndex = index + 1; // クローン分ずらす
      goTo(currentIndex); // 指定スライドへ移動
    });
  });

  // ===== ホバーで停止（PCのみ）=====
  wrapper.addEventListener('mouseenter', () => {
    if (window.innerWidth >= 768) stop(); // マウス乗せたら停止
  });

  wrapper.addEventListener('mouseleave', () => {
    if (window.innerWidth >= 768) start(); // 離れたら再開
  });

  // ===== 初期化 =====
  function init() {
    setupClone(); // クローン作成（無限ループの準備）

    currentIndex = 1; // 本物1枚目からスタート
    goTo(currentIndex, false); // 初期位置へ（アニメなし）

    start(); // 自動スライド開始（PCのみ）
  }

  window.addEventListener('load', init);   // ページ読み込み時
  window.addEventListener('resize', init); // 画面サイズ変更時

  init(); // 即実行
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
