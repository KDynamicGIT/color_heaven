(function(){
  // Before/After slider
  const container = document.getElementById('ba-container-1');
  const range = document.getElementById('ba-range-1');
  const after = document.getElementById('ba-after-1');
  const handle = document.getElementById('ba-handle-1');
  const gesture = document.getElementById('ba-gesture-1');

  function updateBA(value){
    const pct = Math.max(0, Math.min(100, Number(value)));
    if (after) after.style.width = pct + '%';
    if (handle) handle.style.left = pct + '%';
  }
  if (range){
    range.addEventListener('input', e => updateBA(e.target.value));
    updateBA(range.value);
  }

  // Carousel function
  function setupCarousel({ trackId, prevId, nextId, dotsContainerId, carouselId, autoplayInterval = 4500 }){
    const track = document.getElementById(trackId);
    const prev = document.getElementById(prevId);
    const next = document.getElementById(nextId);
    const dots = Array.from(document.getElementById(dotsContainerId).children);
    const slides = track.children;
    let idx = 0;
    function goTo(i){
      idx = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      dots[idx].classList.add('active');
    }
    prev.addEventListener('click',()=>goTo(idx-1));
    next.addEventListener('click',()=>goTo(idx+1));
    dots.forEach((d,i)=>d.addEventListener('click',()=>goTo(i)));
    setInterval(()=>goTo(idx+1),autoplayInterval);
    goTo(0);
  }

  setupCarousel({ trackId:'insta-track-1', prevId:'insta-prev-1', nextId:'insta-next-1', dotsContainerId:'insta-dots-1', carouselId:'insta-carousel-1' });
  setupCarousel({ trackId:'couple-track-1', prevId:'couple-prev-1', nextId:'couple-next-1', dotsContainerId:'couple-dots-1', carouselId:'couple-carousel-1' });

})();
