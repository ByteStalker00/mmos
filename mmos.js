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
        return { lite: light, base: base,
          red: light ? 'rgba(190,25,32,.55)' : 'rgba(229,72,77,.5)',
          navy: light ? 'rgba(27,35,64,.5)' : 'rgba(120,140,220,.45)',
          gray: light ? 'rgba(100,95,85,.5)' : 'rgba(150,145,135,.35)',
          black: 'rgba(25,22,19,.6)' };
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
            col: r < .58 ? 'base' : (r < .7 ? 'red' : (r < .8 ? 'navy' : (r < .9 ? 'gray' : (C.lite ? 'black' : 'base'))))
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
      var t = null, el = null;
      function toast() {
        if (!el) {
          el = document.createElement('div');
          el.className = 'deny';
          el.setAttribute('role', 'alert');
          el.textContent = 'Azione non consentita!';
          document.body.appendChild(el);
        }
        el.classList.add('show');
        if (t) clearTimeout(t);
        t = setTimeout(function () { el.classList.remove('show'); }, 1800);
      }
      document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        toast();
      });
      window.mmosDeny = toast;
    })();
    (function () {
      function blocked(e) {
        if (e.key === 'F12') return true;
        var k = (e.key || '').toUpperCase();
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && (k === 'I' || k === 'J' || k === 'C' || k === 'K')) return true;
        if ((e.ctrlKey || e.metaKey) && k === 'U') return true;
        return false;
      }
      document.addEventListener('keydown', function (e) {
        if (blocked(e)) {
          e.preventDefault();
          if (window.mmosDeny) window.mmosDeny();
        }
      });
    })();
    (function () {
      var fab = document.getElementById('chatFab');
      var panel = document.getElementById('chatPanel');
      var close = document.getElementById('chatClose');
      var log = document.getElementById('chatLog');
      var chips = document.getElementById('chatChips');
      var form = document.getElementById('chatForm');
      var input = document.getElementById('chatInput');
      var wa = document.getElementById('chatWa');
      var WA_BASE = 'https://wa.me/393755236202?text=';
      if (!fab || !panel) return;
      var KB = [
        { k: ['dove', 'zona', 'zone', 'san benedetto', 'porto', 'ascoli', 'domicilio', 'raggiung', 'venite', 'sede'],
          a: 'Opero in studio e a domicilio solo a <b>Porto d\u2019Ascoli e San Benedetto del Tronto</b>. Da remoto ovunque, ma solo ottimizzazione e debug.' },
        { k: ['prezzo', 'prezzi', 'costo', 'costi', 'tariff', 'quanto', 'pagare', 'listino'],
          a: 'Installazione SO €48 · Ripristino, primo avvio, programmi, pulizia €34 · Virus €41 · Backup/trasferimento da €34 · Online €21/h · Uscita €21 · Privati €21/h · Aziende €28/h. Dettagli in <a href="#listino">Listino</a>.' },
        { k: ['build', 'assembl', 'computer nuovo', 'pc nuovo', 'pc gaming', 'gaming', 'configura'],
          a: 'Build 1080p, 2K, 4K e top di gamma RTX 5090 in <a href="#build">Build</a>. Da privato non vendo pezzi: ti dico cosa comprare, tu acquisti, io assemblo e testo.' },
        { k: ['remoto', 'distanza', 'online', 'teamviewer', 'da casa'],
          a: 'Da remoto faccio solo <b>ottimizzazione e debug software</b> (€21/h): pulizia, avvio, errori e rallentamenti. Niente formattazioni a distanza.' },
        { k: ['virus', 'malware', 'sicurezza', 'hacker', 'popup', 'antivirus'],
          a: 'Rimozione virus €41 con analisi e protezione. Consigli base in <a href="#guide">Guide</a>: aggiornamenti, allegati sospetti, password diverse.' },
        { k: ['lento', 'lentezza', 'avvio', 'veloc', 'ssd', 'impiega'],
          a: 'Pulizia e ottimizzazione avvio €34. Se il disco è meccanico, un SSD cambia più di qualsiasi pulizia: chiedimi un preventivo.' },
        { k: ['backup', 'dati', 'foto', 'documenti', 'persi', 'recuper'],
          a: 'Backup da €34 con copia su disco esterno (verificata). Mai formattare senza backup: lo facciamo insieme prima.' },
        { k: ['formatta', 'formattazione', 'installazione', 'windows', 'sistema operativo', 'so ', 'ripristino', 'reinstalla'],
          a: 'Installazione pulita €48 (driver + aggiornamenti + base), ripristino €34. Sempre con backup verificato prima.' },
        { k: ['programmi', 'installare', 'software', 'office', 'primo avvio', 'nuovo pc'],
          a: 'Primo avvio e installazione programmi €34 con test finale.' },
        { k: ['usato', 'seconda mano', 'ricondizionat'],
          a: 'La sezione <a href="#usato">Usato</a> arriva a breve: pezzi testati, con noi come tramite col venditore.' },
        { k: ['whatsapp'],
          a: 'Tocca il tasto verde qui sotto: si apre WhatsApp al 375 523 6202 con la tua domanda già scritta.' },
        { k: ['facebook', 'contatto', 'contatti', 'telefono', 'chiamare', 'chiamata', 'scrivere', 'parlare', 'prenotare', 'appuntamento'],
          a: 'Scrivimi su <a href="https://www.facebook.com/profile.php?id=61594506196534" target="_blank" rel="noopener">Facebook</a>, <a href="https://discord.gg/v6fb4zrPfK" target="_blank" rel="noopener">Discord</a> o <a href="https://wa.me/393755236202" target="_blank" rel="noopener">WhatsApp</a>: diagnosi e preventivo senza impegno.' },
        { k: ['discord', 'server', 'community'],
          a: 'Il server è qui: <a href="https://discord.gg/v6fb4zrPfK" target="_blank" rel="noopener">MMOS • Assistenza Privata su Discord</a>.' },
        { k: ['github', 'codice', 'repository', 'progett'],
          a: 'Questo sito è open: <a href="https://github.com/ByteStalker00" target="_blank" rel="noopener">github.com/ByteStalker00</a>.' },
        { k: ['playlist', 'musica', 'spotify', 'canzoni'],
          a: 'C\u2019è il tasto verde a sinistra: apre la playlist Spotify del sito.' },
        { k: ['tema', 'chiaro', 'scuro', 'dark', 'light', 'notte'],
          a: 'Usa il sole/luna in alto per il tema chiaro o scuro, e il play per le particelle animate.' },
        { k: ['orari', 'orario', 'aperto', 'quando'],
          a: 'Scrivimi su Facebook o Discord e concordiamo giorno e ora, anche serali su appuntamento.' },
        { k: ['ciao', 'buongiorno', 'buonasera', 'salve', 'ehi'],
          a: 'Ciao! Sono l\u2019assistente MMOS: chiedimi di zone, prezzi, build o assistenza.' },
        { k: ['grazie'],
          a: 'Prego! Per un preventivo diretto scrivimi su Facebook.' }
      ];
      var FALLBACK = 'Non ho capito: prova con parole come <b>prezzi</b>, <b>zona</b>, <b>build</b>, <b>virus</b> o <b>contatti</b> — oppure chiedi su <a href="https://www.facebook.com/profile.php?id=61594506196534" target="_blank" rel="noopener">Facebook</a>.';
      function norm(s) {
        return s.toLowerCase().replace(/[\u00e0\u00e1]/g, 'a').replace(/[\u00e8\u00e9]/g, 'e')
          .replace(/\u00ec/g, 'i').replace(/[\u00f2\u00f3]/g, 'o').replace(/\u00f9/g, 'u');
      }
      function answer(q) {
        var n = ' ' + norm(q) + ' ';
        var best = null, bestScore = 0;
        for (var i = 0; i < KB.length; i++) {
          var s = 0, ks = KB[i].k;
          for (var j = 0; j < ks.length; j++) if (n.indexOf(ks[j]) !== -1) s += ks[j].length;
          if (s > bestScore) { bestScore = s; best = KB[i]; }
        }
        return best ? best.a : FALLBACK;
      }
      function add(text, who, html) {
        var d = document.createElement('div');
        d.className = 'msg ' + who;
        if (html) d.innerHTML = text; else d.textContent = text;
        log.appendChild(d);
        log.scrollTop = log.scrollHeight;
      }
      var AI_CTX = 'Sei l\u2019assistente di MMOS \u2022 Assistenza Privata a Porto d\u2019Ascoli e San Benedetto del Tronto. Prezzi: installazione SO 48\u20ac; ripristino, primo avvio, programmi, pulizia 34\u20ac; rimozione virus 41\u20ac; backup/trasferimento da 34\u20ac; assistenza online 21\u20ac/h; uscita in zona 21\u20ac; privati 21\u20ac/h; aziende 28\u20ac/h. Studio e domicilio solo in zona; da remoto solo ottimizzazione e debug software, mai formattazioni a distanza. Rispondi in italiano, massimo 60 parole, tono cordiale. Per preventivi personalizzati invita a scrivere su WhatsApp al 375 523 6202.';
      function askAI(q, done) {
        var ctrl = null;
        try { ctrl = new AbortController(); } catch (e) {}
        var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 25000);
        var url = 'https://text.pollinations.ai/' + encodeURIComponent(AI_CTX + '\nDomanda: ' + q) + '?model=openai';
        function fin(txt) { clearTimeout(timer); done(txt); }
        fetch(url, ctrl ? { signal: ctrl.signal } : undefined).then(function (r) {
          if (!r.ok) throw new Error('http ' + r.status);
          return r.text();
        }).then(function (txt) {
          fin((txt || '').trim().slice(0, 800) || null);
        }).catch(function () { fin(null); });
      }
      function ask(q) {
        if (!q) return;
        add(q, 'user', false);
        if (wa) wa.href = WA_BASE + encodeURIComponent('Ciao MMOS! ' + q);
        var t = document.createElement('div');
        t.className = 'msg bot typing';
        t.innerHTML = '<i></i><i></i><i></i>';
        log.appendChild(t);
        log.scrollTop = log.scrollHeight;
        var kb = answer(q);
        if (kb !== FALLBACK) {
          setTimeout(function () { t.remove(); add(kb, 'bot', true); }, 450);
          return;
        }
        askAI(q, function (txt) {
          t.remove();
          if (txt) add(txt + ' (risposta IA sperimentale: verifica prezzi e zone sul sito.)', 'bot', false);
          else add(FALLBACK, 'bot', true);
        });
      }
      var greeted = false;
      function set(open) {
        panel.classList.toggle('open', open);
        fab.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open && !greeted) {
          greeted = true;
          add('Ciao! Chiedimi di <b>prezzi</b>, <b>zona</b>, <b>build</b> o <b>contatti</b> — oppure qualsiasi altra cosa, ci pensa l\u2019IA gratis.', 'bot', true);
        }
        if (open) setTimeout(function () { input.focus(); }, 50);
      }
      fab.addEventListener('click', function () { set(!panel.classList.contains('open')); });
      close.addEventListener('click', function () { set(false); });
      document.addEventListener('keydown', function (e) {
        if ((e.key === 'Escape' || e.key === 'Esc') && panel.classList.contains('open')) set(false);
      });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var q = input.value.trim();
        input.value = '';
        ask(q);
      });
      var CHIP_Q = ['Dove operate?', 'Quanto costa?', 'Fate build?', 'Contatti?'];
      for (var c = 0; c < CHIP_Q.length; c++) {
        (function (q) {
          var b = document.createElement('button');
          b.type = 'button'; b.className = 'chip'; b.textContent = q;
          b.addEventListener('click', function () { ask(q); });
          chips.appendChild(b);
        })(CHIP_Q[c]);
      }
    })();
    (function () {
      var tab = document.getElementById('musicTab');
      var panel = document.getElementById('musicPanel');
      var close = document.getElementById('musicClose');
      var SPOTIFY_SRC = 'https://open.spotify.com/embed/playlist/3QA5MeyQuxplbsEOfG2JNg?utm_source=generator&si=04b7cf1c3373494f';
      if (!tab || !panel) return;
      function set(open) {
        panel.classList.toggle('open', open);
        tab.setAttribute('aria-expanded', open ? 'true' : 'false');
        tab.style.display = open ? 'none' : '';
        if (open) {
          var frame = panel.querySelector('iframe');
          if (frame && !frame.getAttribute('src')) frame.setAttribute('src', SPOTIFY_SRC + '&autoplay=1');
        }
      }
      tab.addEventListener('click', function () { set(true); });
      if (close) close.addEventListener('click', function () { set(false); });
    })();
