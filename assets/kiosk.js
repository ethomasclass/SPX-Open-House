/* St. Pius X Social Studies — Open House kiosk helpers
 *
 * SPX.bar({ title, subtitle, home })     top bar with a Home button
 * SPX.idle({ home, seconds, warn })       send the Chromebook back to the menu when nobody is using it
 * SPX.hunt({ title, items, onComplete })  scavenger-hunt card; returns { unlock(id), found(id), done() }
 */
(function () {
  const SPX = (window.SPX = {});
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

  SPX.goHome = (home) => { location.href = home || '../index.html'; };

  SPX.bar = function ({ title, subtitle, home = '../index.html', homeLabel = '← Home' }) {
    const bar = el('header', 'spx-bar');
    bar.innerHTML = `
      <button class="spx-home" type="button">${homeLabel}</button>
      <div class="spx-crest" aria-hidden="true">SPX</div>
      <div class="spx-title"><b></b><span></span></div>
      <div class="spx-dept">St. Pius X Social Studies Department</div>`;
    bar.querySelector('.spx-title b').textContent = title;
    bar.querySelector('.spx-title span').textContent = subtitle || '';
    bar.querySelector('.spx-home').addEventListener('click', () => SPX.goHome(home));
    document.body.appendChild(bar);
    return bar;
  };

  // After `seconds` with no input, show a "Still here?" countdown for `warn` seconds, then go home.
  SPX.idle = function ({ home = '../index.html', seconds = 120, warn = 20 } = {}) {
    const ov = el('div', 'idle');
    ov.hidden = true;
    ov.innerHTML = `<div class="idle-card" role="alertdialog" aria-live="assertive">
      <h2>Still exploring?</h2>
      <p>This experience will restart for the next visitor in</p>
      <div class="idle-n">20</div>
      <div class="row"><button class="btn-spx gold" type="button" data-k="stay">I'm still here</button><button class="btn-spx ghost" type="button" data-k="home">Back to menu</button></div>
    </div>`;
    document.body.appendChild(ov);
    const n = ov.querySelector('.idle-n');
    let last = Date.now(), warnAt = null;
    const poke = () => { last = Date.now(); if (warnAt) { warnAt = null; ov.hidden = true; } };
    ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart'].forEach((t) => window.addEventListener(t, poke, { passive: true, capture: true }));
    ov.querySelector('[data-k=stay]').addEventListener('click', poke);
    ov.querySelector('[data-k=home]').addEventListener('click', () => SPX.goHome(home));
    const api = { busyUntil: 0, poke };
    setInterval(() => {
      const now = Date.now();
      if (now < api.busyUntil) { last = Math.max(last, now); return; }
      if (!warnAt && now - last > seconds * 1000) { warnAt = now; ov.hidden = false; ov.querySelector('[data-k=stay]').focus(); }
      if (warnAt) {
        const left = Math.max(0, warn - Math.floor((now - warnAt) / 1000));
        n.textContent = left;
        if (left <= 0) SPX.goHome(home);
      }
    }, 250);
    return api;
  };

  // items: [{ id, q, hint, choices: [..], answer: index, why, locked: bool }]
  SPX.hunt = function ({ title = 'Scavenger Hunt', items, onComplete, collapsed = false, side = 'right' }) {
    const box = el('aside', 'hunt' + (side === 'left' ? ' hunt-left' : '') + (collapsed ? ' collapsed' : ''));
    box.setAttribute('aria-label', title);
    const head = el('button', 'hunt-head');
    head.type = 'button';
    head.innerHTML = `<span class="hunt-icon" aria-hidden="true">🔎</span><b></b><span class="hunt-count"></span><span class="hunt-caret" aria-hidden="true">▾</span>`;
    head.querySelector('b').textContent = title.toUpperCase();
    head.addEventListener('click', () => box.classList.toggle('collapsed'));
    const body = el('div', 'hunt-body');
    box.append(head, body);
    document.body.appendChild(box);

    const state = items.map((it) => ({ ...it, open: !it.locked, solved: false }));
    const count = head.querySelector('.hunt-count');
    let completeFired = false;

    function render() {
      body.innerHTML = '';
      state.forEach((it, i) => {
        const card = el('div', 'hunt-item' + (it.solved ? ' done' : it.open ? '' : ' locked'));
        card.dataset.id = it.id;
        const q = el('div', 'hunt-q');
        q.append(el('span', 'hunt-num', it.solved ? '✓' : String(i + 1)), Object.assign(el('span'), { textContent: it.q }));
        card.append(q);
        if (!it.open) {
          card.append(Object.assign(el('div', 'hunt-hint'), { textContent: it.hint }));
        } else if (it.solved) {
          card.append(Object.assign(el('div', 'hunt-fb ok'), { innerHTML: `<b>✓ ${it.choices[it.answer]}.</b> ` }));
          card.lastChild.append(it.why);
        } else {
          const ch = el('div', 'hunt-choices');
          it.choices.forEach((c, k) => {
            const b = el('button');
            b.type = 'button';
            b.textContent = c;
            if (it.solved && k === it.answer) b.className = 'right';
            if (it.tried && it.tried.has(k) && k !== it.answer) { b.className = 'wrong'; b.disabled = true; }
            if (it.solved) b.disabled = true;
            b.addEventListener('click', () => pick(it, k));
            ch.append(b);
          });
          card.append(ch);
          if (it.tried && it.tried.size) card.append(Object.assign(el('div', 'hunt-fb no'), { textContent: 'Not quite. Try another answer!' }));
        }
        body.append(card);
      });
      const solved = state.filter((s) => s.solved).length;
      count.textContent = `${solved} / ${state.length}`;
      if (solved === state.length) {
        body.append(el('div', 'hunt-done-msg', '🎉 You finished the scavenger hunt!'));
        if (!completeFired) { completeFired = true; onComplete && onComplete(); }
      }
    }
    function pick(it, k) {
      it.tried = it.tried || new Set();
      it.tried.add(k);
      if (k === it.answer) it.solved = true;
      render();
      if (it.solved) {
        body.querySelector(`[data-id="${it.id}"]`)?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        // nothing left to answer right now: tuck the card away so it doesn't cover the scene
        clearTimeout(collapseT);
        if (!state.some((s) => s.open && !s.solved)) collapseT = setTimeout(() => box.classList.add('collapsed'), 4000);
      }
    }
    let collapseT = null;
    render();
    return {
      el: box,
      unlock(id) {
        const it = state.find((s) => s.id === id);
        if (!it || it.open) return;
        it.open = true;
        clearTimeout(collapseT);
        box.classList.remove('collapsed');
        render();
        const card = body.querySelector(`[data-id="${id}"]`);
        if (card) { card.classList.add('flash'); card.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
      },
      solvedCount: () => state.filter((s) => s.solved).length,
      total: state.length,
      collapse(on) { box.classList.toggle('collapsed', on); },
    };
  };
})();
