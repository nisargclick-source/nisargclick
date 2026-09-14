// STARK CLICK — script.js (v2)

// ── HERO ENTRANCE ──
(function() {
  function animateIn() {
    var eyebrow = document.getElementById('hero-eyebrow');
    var words   = document.querySelectorAll('.word-inner');
    var tagline = document.getElementById('hero-tagline');
    var actions = document.getElementById('hero-actions');
    var visual  = document.getElementById('hero-visual');
    if (!eyebrow && words.length === 0) return;
    if (eyebrow) eyebrow.classList.add('animate-in');
    words.forEach(function(w) { w.classList.add('animate-in'); });
    if (tagline) tagline.classList.add('animate-in');
    if (actions) actions.classList.add('animate-in');
    if (visual)  visual.classList.add('animate-in');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', animateIn);
  else animateIn();
})();

// ── NAV SCROLL STATE ──
(function() {
  var nav = document.getElementById('site-nav');
  if (!nav) return;
  var ticking = false;
  function update() {
    ticking = false;
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', function() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
})();

// ── MOBILE NAV ──
(function() {
  var toggle = document.getElementById('nav-toggle');
  var links  = document.getElementById('nav-links');
  if (!toggle || !links) return;
  var scrollY = 0;

  function openMenu() {
    scrollY = window.scrollY;
    document.documentElement.style.setProperty('--scroll-lock-y', -scrollY + 'px');
    document.body.classList.add('nav-open');
  }
  function closeMenu() {
    document.body.classList.remove('nav-open');
    window.scrollTo(0, scrollY);
  }

  toggle.addEventListener('click', function() {
    var open = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
    if (open) openMenu(); else closeMenu();
  });
  links.querySelectorAll('a').forEach(function(a) {
    a.addEventListener('click', function() {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      closeMenu();
    });
  });
})();

// ── SCROLL REVEAL ──
(function() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal').forEach(function(el) { el.classList.add('is-visible'); });
    return;
  }
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.reveal').forEach(function(el) { observer.observe(el); });
})();

// ── AUTO-GENERATED PORTFOLIO GALLERY ──
(function() {
  var gallery = window.NISARG_GALLERY;
  var grid = document.querySelector('.filter-grid');
  var bar = document.querySelector('.filter-bar');
  if (!gallery || !grid || !bar) return;

  var countEl = bar.querySelector('.filter-count');
  var allBtn = bar.querySelector('[data-filter="all"]');

  gallery.categories.forEach(function(category) {
    var button = document.createElement('button');
    button.className = 'filter-btn';
    button.type = 'button';
    button.dataset.filter = category.slug;
    button.textContent = category.label;
    bar.insertBefore(button, countEl);

    category.images.forEach(function(image, index) {
      var frame = document.createElement('div');
      frame.className = 'print-frame';
      frame.dataset.category = category.slug;
      frame.setAttribute('role', 'listitem');

      var tilts = ['-1.4deg', '1.6deg', '-.8deg'];
      frame.style.setProperty('--tilt', tilts[index % tilts.length]);

      var inner = document.createElement('div');
      inner.className = 'frame-inner';

      var img = document.createElement('img');
      img.src = image.src;
      img.alt = image.alt || (category.label + ' photography');
      img.loading = 'lazy';
      img.decoding = 'async';
      img.setAttribute('fetchpriority', 'low');
      img.width = 800;
      img.height = 1000;

      var pin = document.createElement('div');
      pin.className = 'print-pin';
      pin.setAttribute('aria-hidden', 'true');

      var caption = document.createElement('span');
      caption.className = 'print-caption';
      caption.textContent = category.label;

      inner.appendChild(img);
      frame.appendChild(inner);
      frame.appendChild(pin);
      frame.appendChild(caption);
      grid.appendChild(frame);
    });
  });

  if (countEl) countEl.textContent = gallery.total + (gallery.total === 1 ? ' image' : ' images');
  if (allBtn) allBtn.classList.add('active');
})();

// ── PRINT-FRAME IMAGE REVEAL (shimmer → light-leak sweep → sharp) ──
(function() {
  var frames = document.querySelectorAll('.print-frame');
  if (!frames.length) return;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function reveal(frame, img) {
    if (reduced) { frame.classList.add('img-ready'); return; }
    frame.classList.add('revealing');
    frame.classList.add('img-ready');
    setTimeout(function() { frame.classList.remove('revealing'); }, 950);
  }

  function watch(frame, img) {
    if (img.complete && img.naturalWidth > 0) { reveal(frame, img); return; }
    img.addEventListener('load', function() { reveal(frame, img); });
    img.addEventListener('error', function() { reveal(frame, img); });
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries, obs) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting) return;
        var frame = entry.target;
        var img = frame.querySelector('img');
        if (img) {
          if (img.loading === 'lazy') img.loading = 'eager';
          watch(frame, img);
        }
        obs.unobserve(frame);
      });
    }, { rootMargin: '1200px 0px' });
    frames.forEach(function(f) { io.observe(f); });
  } else {
    frames.forEach(function(f) {
      var img = f.querySelector('img');
      if (img) watch(f, img);
    });
  }
})();

// ── CONTACT FORM — Formspree ──
(function() {
  var form = document.querySelector('.contact-form');
  var btn  = form ? form.querySelector('.form-submit') : null;
  if (!form || !btn) return;
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    var original = btn.innerHTML;
    btn.textContent = 'Sending…';
    btn.disabled = true;
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(function(res) {
      if (res.ok) {
        btn.textContent = 'Message sent ✓';
        form.reset();
      } else {
        btn.textContent = 'Failed — try again';
        btn.disabled = false;
      }
    }).catch(function() {
      btn.textContent = 'Network error — try again';
      btn.disabled = false;
    });
  });
})();

// ── PORTFOLIO FILTER ──
(function() {
  var bar  = document.querySelector('.filter-bar');
  var grid = document.querySelector('.filter-grid');
  if (!bar || !grid) return;
  var btns   = bar.querySelectorAll('.filter-btn');
  var items  = grid.querySelectorAll('.print-frame');
  var countEl = document.querySelector('.filter-count');

  function updateCount(cat) {
    if (!countEl) return;
    var n = cat === 'all' ? items.length : Array.from(items).filter(function(i) { return i.dataset.category === cat; }).length;
    countEl.textContent = n + (n === 1 ? ' image' : ' images');
  }

  btns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var cat = btn.dataset.filter;
      btns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
      items.forEach(function(item) {
        item.classList.toggle('is-hidden', cat !== 'all' && item.dataset.category !== cat);
      });
      updateCount(cat);
      if (history.replaceState) history.replaceState(null, '', cat === 'all' ? '#portfolio' : '#' + cat);
    });
  });

  var hash = window.location.hash.replace('#', '');
  if (hash) {
    var match = Array.from(btns).find(function(b) { return b.dataset.filter === hash; });
    if (match) match.click(); else updateCount('all');
  } else {
    updateCount('all');
  }
})();

// ── FILMSTRIP DRAG-TO-SCROLL (mouse/trackpad convenience on the slide rail) ──
(function() {
  var track = document.querySelector('.filmstrip-track');
  if (!track) return;
  var isDown = false, startX, scrollLeft;
  track.addEventListener('mousedown', function(e) {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });
  ['mouseleave', 'mouseup'].forEach(function(evt) {
    track.addEventListener(evt, function() { isDown = false; track.style.cursor = 'grab'; });
  });
  track.addEventListener('mousemove', function(e) {
    if (!isDown) return;
    e.preventDefault();
    var x = e.pageX - track.offsetLeft;
    track.scrollLeft = scrollLeft - (x - startX) * 1.4;
  });
  track.style.cursor = 'grab';
})();
