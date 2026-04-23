// カルーセル
{
  // 1. 要素の取得
  const next = document.getElementById('next');  // 次へボタン
  const prev = document.getElementById('prev');  // 前へボタン
  const ul = document.querySelector('ol');       // スライド全体の入れ物
  const slides = ul.children;                    // スライド１枚１枚（li要素など）
  const dots = document.querySelectorAll('.voice .slide-dot');

  //   HTMLでid="next"とid="prev"があるボタン、
  // olタグ（番号付きリスト）内のスライドを操作対象にします。


  // 2. スライドの横幅を取得
  const slideWidth = slides[0].getBoundingClientRect().width;

  // スライドの1枚目（slides[0]）の横幅を測って、スライドの移動量を決めます。
  // → スライドを横に何px移動させるか計算するため
  // getBoundingClientRect() は、要素の サイズや画面上の位置 を調べる関数


  // 3. 現在のスライド番号
  let currentIndex = 0;

  // 最初は0番目のスライド（左端）を表示。


  // 4. ボタンとドットの状態を更新
  function updateButtons() {
    prev.disabled = currentIndex === 0;
    next.disabled = currentIndex === slides.length - 1;

    dots.forEach((dot, i) => {
      const active = i === currentIndex;
      dot.classList.toggle('is-active', active);
    });
  }

  // 例えば3枚スライドがある場合、最初は「前へ」が disabled、最後は「次へ」が disabled。ドットの見た目も currentIndex に合わせる。


  // 5. スライドの位置を変える
  function moveSlides() {
    updateButtons();  // ボタンの表示状態を更新
    ul.style.transform = `translateX(${-1 * slideWidth * currentIndex}px)`;
  }

  //   translateX()でスライドを横にずらします。
  // 例：currentIndex = 1なら、-1 * slideWidth * 1 = -スライド1枚分だけ左に動きます。


  updateButtons();// ボタンの表示状態を更新


  // 6. ボタンクリックの動作
  next.addEventListener('click', () => {
    currentIndex++;
    moveSlides();
  });
  prev.addEventListener('click', () => {
    currentIndex--;
    moveSlides();
  });

  // 「次へ」クリック → currentIndex を増やしてスライドを右に動かす
  // 「前へ」クリック → currentIndex を減らしてスライドを左に戻す

  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const i = Number(dot.dataset.slideIndex);
      if (Number.isFinite(i) && i >= 0 && i < slides.length) {
        currentIndex = i;
        moveSlides();
      }
    });
  });

}