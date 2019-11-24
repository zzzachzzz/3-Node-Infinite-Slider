const app = (function() {
  const sliderItems = [
    "https://i.imgur.com/ZZX0bVz.jpg",
    "https://i.imgur.com/1nT9vem.jpg",
    "https://i.imgur.com/L9BiiXr.jpg",
    "https://i.imgur.com/3xAR3LR.jpg",
    "https://i.imgur.com/P8hVhjC.jpg"
  ];

  let prev = sliderItems.length-1;
  let next = 1;
  const sliderTransitionDuration = 0.4;

  const calcTotalSliderWidth = () => Number(window.getComputedStyle(document.querySelector('.slider')).width.match(/\d+/)[0]);
  const calcSlideWidth = (totalSliderWidth) => totalSliderWidth / 3;
  let totalSliderWidth = calcTotalSliderWidth();
  let slideWidth = calcSlideWidth(totalSliderWidth);

  // Initial render
  (function() {
    updateSliderOffset('current', this);  // Show .current
    setTimeout(() => this.classList.remove('no-transition'), 30);
    this.style.transition = `all ${sliderTransitionDuration}s`;
  }).call(document.querySelector('.slider'));
  document.querySelector('.prev > img').src = sliderItems[prev];
  document.querySelector('.prev > img').src = sliderItems[prev];
  document.querySelector('.current > img').src = sliderItems[0];
  document.querySelector('.current > img').src = sliderItems[0];
  document.querySelector('.next > img').src = sliderItems[next];
  document.querySelector('.next > img').src = sliderItems[next];

  /**
   * Updates `prev` and `next` in the outer scope with the wrapping indices for `sliderItems`
   * @param {boolean=} decrement - whether to decrement or increment the indices
   * @return {Array<number>} [prev, next] updated indices
   */
  function calcWrappingIndices(decrement = false) {
    return [prev, next] = [prev, next].map(n => {
      decrement ? n-- : n++;
      if (n < 0) {
        n = sliderItems.length + n;
      } else if (n > sliderItems.length-1) {
        n = n - sliderItems.length;
      }
      return n;
    });
  }

  let onClickPrevNextRunning = false;

  /**
   * @param {boolean=} goToPrev - whether to go to previous slider item or next
   * @return {undefined}
   */
  function onClickPrevNext(goToPrev = false) {
    if (onClickPrevNextRunning) return;
    onClickPrevNextRunning = true;
    // Perform transform on slider
    updateSliderOffset(goToPrev ? 'prev' : 'next');

    setTimeout(() => {
      // Update nodes adjacent to current
      (function() {
        this.classList.add('no-transition');
        const nodeToMove = this.querySelector(goToPrev ? '.next' : '.prev');
        goToPrev ? this.prepend(nodeToMove) : this.append(nodeToMove);
        updateSliderOffset('current', this);  // Show .current
        [prev, next] = goToPrev ? calcWrappingIndices(decrement = true) : calcWrappingIndices();
        // Update item for recycled node
        nodeToMove.querySelector('img').src = sliderItems[goToPrev ? prev : next];
      }).call(document.querySelector('.slider'));

      [document.querySelector('.prev'), document.querySelector('.current'), document.querySelector('.next')]
      .forEach((e, i) => {
        let oldClass, newClass;
        switch (i) {
          case 0:
            oldClass = 'prev';
            newClass = goToPrev ? 'current' : 'next';
            break;
          case 1:
            oldClass = 'current';
            newClass = goToPrev ? 'next' : 'prev';
            break;
          case 2:
            oldClass = 'next';
            newClass = goToPrev ? 'prev' : 'current';
            break;
        }
        e.className = e.className.replace(oldClass, newClass);
        e.setAttribute('aria-hidden', newClass === 'current' ? 'false' : 'true');
      });
      setTimeout(() => {
        document.querySelector('.slider').classList.remove('no-transition');
        onClickPrevNextRunning = false;
      }, 30);
    }, sliderTransitionDuration * 1000);  // Convert from seconds to milliseconds
  }

  /**
   * @param {number} offset - the translateX offset to apply
   * @param {Element=} el - the element for `.slider`, otherwise it will be selected
   * @return {undefined}
   */
  function updateSliderOffset(target, el = null) {
    totalSliderWidth = calcTotalSliderWidth();
    slideWidth = calcSlideWidth(totalSliderWidth);
    let offset;
    switch (target) {
      case 'prev':
        offset = 0;
        break
      case 'current':
        offset = slideWidth;
        break
      case 'next':
        offset = totalSliderWidth - slideWidth;
        break
    }
    const el_ = el || document.querySelector('.slider');
    el_.style.transform = `translateX(-${offset}px)`;
  }

  /**
   * Update the slider offset upon resizing the window. Deactivates transitions during this.
   * @return {undefined}
   */
  window.onresize = () => {
    (function() {
      this.classList.add('no-transition');
      updateSliderOffset('current', this);
      setTimeout(() => this.classList.remove('no-transition'), 30);
    }).call(document.querySelector('.slider'));
  };

  return {
    onClickPrevNext: onClickPrevNext
  };
})();
