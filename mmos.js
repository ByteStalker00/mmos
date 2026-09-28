(function () {
      var btn = document.getElementById('themeBtn');
      function label(t) {
        var light = t === 'light';
        btn.setAttribute('aria-label', light ? 'Passa al tema scuro' : 'Passa al tema chiaro');
        btn.setAttribute('title', light ? 'Passa al tema scuro' : 'Passa al tema chiaro');
      }
      var saved = null;
      try { saved = localStorage.getItem('mmos-theme'); } catch (e) {}
      var theme = saved === 'light' ? 'light' : 'dark';
      if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
      label(theme);
      btn.addEventListener('click', function () {
        theme = theme === 'light' ? 'dark' : 'light';
        if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
        else document.documentElement.removeAttribute('data-theme');
        try { localStorage.setItem('mmos-theme', theme); } catch (e) {}
        label(theme);
      });
    })();
    (function () {
      var cv = document.getElementById('fx');
      if (!cv || !cv.getContext) return;
      var ctx = cv.getContext('2d');
      var W = 0, H = 0, parts = [], raf = null;
      var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var fxBtn = document.getElementById('fxBtn');
      var force = null;
      try { force = localStorage.getItem('mmos-fx'); } catch (e) {}
      function motionOK() { return force === 'on' ? true : force === 'off' ? false : !reduced; }
      function syncFxBtn() {
        if (!fxBtn) return;
        var on = motionOK() && !document.hidden;
        fxBtn.classList.toggle('on', on);
        document.documentElement.classList.toggle('fx-on', on);
        fxBtn.setAttribute('aria-label', on ? 'Ferma lo sfondo' : 'Anima lo sfondo');
        fxBtn.setAttribute('title', on ? 'Ferma lo sfondo' : 'Anima lo sfondo');
      }
      var DPR = Math.min(window.devicePixelRatio || 1, 2);
      function themeColors() {
        var light = document.documentElement.getAttribute('data-theme') === 'light';
        var base = getComputedStyle(document.documentElement).getPropertyValue('--dot').trim() || (light ? 'rgba(28,26,23,.5)' : 'rgba(255,255,255,.5)');
        return { base: base, red: light ? 'rgba(210,31,38,.45)' : 'rgba(229,72,77,.5)', navy: light ? 'rgba(27,35,64,.4)' : 'rgba(120,140,220,.45)' };
      }
      var C = themeColors();
      function resize() {
        W = window.innerWidth; H = window.innerHeight;
        cv.width = W * DPR; cv.height = H * DPR;
        cv.style.width = W + 'px'; cv.style.height = H + 'px';
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
        seed();
      }
      function seed() {
        parts = [];
        var n = Math.max(30, Math.min(90, Math.floor(W * H / 18000)));
        for (var i = 0; i < n; i++) {
          var r = Math.random();
          parts.push({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
            rad: .6 + Math.random() * 1.7, ph: Math.random() * 6.28,
            sp: .4 + Math.random() * 1.1,
            col: r < .72 ? 'base' : (r < .87 ? 'red' : 'navy')
          });
        }
      }
      function frame(t) {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < parts.length; i++) {
          var q = parts[i];
          q.x += q.vx; q.y += q.vy;
          if (q.x < -8) q.x = W + 8; if (q.x > W + 8) q.x = -8;
          if (q.y < -8) q.y = H + 8; if (q.y > H + 8) q.y = -8;
          var a = .35 + .65 * Math.abs(Math.sin(t * .001 * q.sp + q.ph));
          ctx.globalAlpha = a;
          ctx.fillStyle = C[q.col];
          ctx.beginPath(); ctx.arc(q.x, q.y, q.rad, 0, 6.283); ctx.fill();
        }
        ctx.globalAlpha = 1;
        raf = requestAnimationFrame(frame);
      }
      function start() {
        if (!motionOK()) { resize(); frame(0); stop(); syncFxBtn(); return; }
        if (raf) { syncFxBtn(); return; }
        raf = requestAnimationFrame(frame);
        syncFxBtn();
      }
      function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } document.documentElement.classList.remove('fx-on'); }
      window.addEventListener('resize', resize);
      document.addEventListener('visibilitychange', function () { document.hidden ? stop() : start(); });
      new MutationObserver(function () { C = themeColors(); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
      if (fxBtn) fxBtn.addEventListener('click', function () {
        force = motionOK() ? 'off' : 'on';
        try { localStorage.setItem('mmos-fx', force); } catch (e) {}
        if (motionOK()) start(); else { stop(); resize(); frame(0); stop(); }
        syncFxBtn();
      });
      resize(); start();
    })();
    (function () {
      var tab = document.getElementById('musicTab');
      var panel = document.getElementById('musicPanel');
      var close = document.getElementById('musicClose');
      if (!tab || !panel) return;
      function set(open) {
        panel.classList.toggle('open', open);
        tab.setAttribute('aria-expanded', open ? 'true' : 'false');
        tab.style.display = open ? 'none' : '';
      }
      tab.addEventListener('click', function () { set(true); });
      if (close) close.addEventListener('click', function () {
        set(false);
        try { sessionStorage.setItem('mmos-music-seen', '1'); } catch (e) {}
      });
      var seen = null;
      try { seen = sessionStorage.getItem('mmos-music-seen'); } catch (e) {}
      if (!seen) setTimeout(function () { set(true); }, 1200);
      // comparsa automatica laterale ridotta + tentativo di auto-avvio
      var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setTimeout(function () {
        if (reduceMotion) return;
        if (sessionStorage.getItem('mmos-music-seen')) return;
        try { sessionStorage.setItem('mmos-music-seen', '1'); } catch (e) {}
        set(true);
        var frame = panel.querySelector('iframe');
        if (frame && frame.src.indexOf('autoplay=1') === -1) {
          frame.src += (frame.src.indexOf('?') === -1 ? '?' : '&') + 'autoplay=1';
        }
      }, 1200);
    })();
