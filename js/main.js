// カルーセル
{
  // 1. 要素の取得
  const next = document.getElementById('next');  // 次へボタン
  const prev = document.getElementById('prev');  // 前へボタン
  const ul = document.querySelector('ol');       // スライド全体の入れ物
  const slides = ul.children;                    // スライド１枚１枚（li要素など）  

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


  // 4. ボタンの表示・非表示を切り替え
  function updateButtons() {
    prev.classList.remove("hidden");
    next.classList.remove("hidden");

    if (currentIndex === 0) {
      prev.classList.add("hidden");  // 最初のスライドなら「前へ」は非表示
    }

    if (currentIndex === slides.length - 1) {
      next.classList.add("hidden");  // 最後のスライドなら「次へ」は非表示
    }
  }

  // 例えば3枚スライドがある場合、最初は「前へ」ボタンを非表示、最後に来たら「次へ」ボタンを非表示にします。


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

}