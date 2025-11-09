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
    if (after) after.setAttribute('aria-hidden', pct === 0 ? 'true' : 'false');
  }
  function hideGesture(){
    if (!gesture) return;
    gesture.classList.add('hidden');
    gesture.setAttribute('aria-hidden','true');
  }
  if (range){
    range.addEventListener('input', e => { hideGesture(); updateBA(e.target.value); });
    range.addEventListener('focus', hideGesture);
    updateBA(range.value);
  }
  if (container){
    let dragging=false;
    function setFromPointer(clientX, cont){
      const rect = cont.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      if (range){ range.value = Math.max(0, Math.min(100, pct)); updateBA(range.value); }
    }
    container.addEventListener('pointerdown', e => { hideGesture(); dragging=true; try{ container.setPointerCapture(e.pointerId); }catch(err){} setFromPointer(e.clientX, container); });
    container.addEventListener('pointermove', e => { if (!dragging) return; setFromPointer(e.clientX, container); });
    container.addEventListener('pointerup', e => { dragging=false; try{ container.releasePointerCapture(e.pointerId); }catch(err){} });
    container.addEventListener('pointercancel', () => { dragging = false; });
  }

  // Simple carousel setup
  function setupCarousel({ trackId, prevId, nextId, dotsContainerId, carouselId, autoplayInterval = 4500 }){
    const track = document.getElementById(trackId);
    if (!track) return;
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    const dotsContainer = document.getElementById(dotsContainerId);
    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.carousel-dot')) : [];
    const carouselEl = document.getElementById(carouselId);
    const slidesCount = track.children.length;
    if (!slidesCount) return;

    let idx = 0;
    function goTo(index){
      idx = ((index % slidesCount) + slidesCount) % slidesCount;
      track.style.transform = `translateX(-${idx * 100}%)`;
      if (dots.length) {
        dots.forEach(d => d.classList.remove('active'));
        if (dots[idx]) dots[idx].classList.add('active');
      }
    }
    if (prevBtn) prevBtn.addEventListener('click', () => goTo(idx - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(idx + 1));
    dots.forEach(d => d.addEventListener('click', e => goTo(Number(e.currentTarget.dataset.index))));
    dots.forEach(d => d.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goTo(Number(d.dataset.index)); }}));

    let autoPlayTimer = setInterval(() => goTo(idx + 1), autoplayInterval);
    if (carouselEl){
      carouselEl.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
      carouselEl.addEventListener('mouseleave', () => { clearInterval(autoPlayTimer); autoPlayTimer = setInterval(() => goTo(idx + 1), autoplayInterval); });
      carouselEl.addEventListener('focusin', () => clearInterval(autoPlayTimer));
      carouselEl.addEventListener('focusout', () => { clearInterval(autoPlayTimer); autoPlayTimer = setInterval(() => goTo(idx + 1), autoplayInterval); });
    }

    goTo(0);
  }

  setupCarousel({ trackId:'insta-track-1', prevId:'insta-prev-1', nextId:'insta-next-1', dotsContainerId:'insta-dots-1', carouselId:'insta-carousel-1' });
  setupCarousel({ trackId:'couple-track-1', prevId:'couple-prev-1', nextId:'couple-next-1', dotsContainerId:'couple-dots-1', carouselId:'couple-carousel-1' });

  // small enhancement: allow tapping the video thumbnail to open YouTube (already anchor) and optionally swap iframe on larger screens
  const videoThumbLink = document.querySelector('.video-thumb-link');
  const videoIframe = document.querySelector('.video-iframe');
  function enableInlineVideoOnWide(){
    if (!videoThumbLink || !videoIframe) return;
    if (window.innerWidth >= 900){
      // show inline iframe instead of static thumbnail when user clicks
      videoThumbLink.addEventListener('click', function(e){
        e.preventDefault();
        videoThumbLink.style.display = 'none';
        videoIframe.style.display = 'block';
      });
    }
  }
  enableInlineVideoOnWide();
  window.addEventListener('resize', enableInlineVideoOnWide);
})(); 
