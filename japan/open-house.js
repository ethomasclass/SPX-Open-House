/* Open House wrapper for the Folk Housing tour: Japan (gassho-zukuri) only.
 * Loaded at the end of index.html. Talks to the original tour only through its DOM,
 * so the tour code itself stays as it is in the classroom version. */
(function () {
  const $ = (s) => document.querySelector(s);

  // ---- hide the parts of the classroom app we don't use at the open house ----
  const css = document.createElement('style');
  css.textContent = `
    #home, #btn-home, #btn-switch, #btn-skip, #btn-vr, #btn-motion, #simple-vr-wrap, #vr-note { display: none !important; }
    .chips .spx-glow { background: var(--spx-gold) !important; color: var(--spx-navy) !important; border-color: var(--spx-navy) !important; animation: none !important; box-shadow: none !important; }
    .oh-task { position: fixed; top: 150px; left: 50%; transform: translateX(-50%); z-index: 7; max-width: min(560px, calc(100vw - 720px)); min-width: 260px; text-align: center; box-shadow: 0 8px 20px rgba(0,0,0,.3); }
    .oh-task[hidden] { display: none; }
    #hud .topbar { top: 52px; }
    #hud .progress { top: 114px; }
    .oh-screen { position: fixed; inset: 52px 0 0 0; z-index: 60; overflow-y: auto; display: grid; place-items: center; padding: 24px 16px;
      background: radial-gradient(1200px 600px at 70% 20%, #1d4572 0%, var(--spx-navy) 60%); color: var(--spx-cream); font-family: var(--spx-body); box-sizing: border-box; }
    .oh-screen[hidden] { display: none; }
    .oh-card { width: min(980px, 100%); display: grid; grid-template-columns: 1.1fr 1fr; gap: 28px; align-items: center; }
    .oh-art { background: var(--spx-cream); border: 3px solid var(--spx-gold); border-radius: 16px; padding: 18px; }
    .oh-art svg { display: block; width: 100%; height: auto; }
    .oh-kicker { font: 800 12px var(--spx-display); letter-spacing: .08em; color: var(--spx-gold-2); }
    .oh-card h1 { margin: 8px 0 12px; font: 900 34px/1.1 var(--spx-display); }
    .oh-card p { margin: 0 0 12px; font-size: 18px; line-height: 1.45; }
    .oh-how { background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.18); border-radius: 10px; padding: 12px 14px; font-size: 15px; line-height: 1.5; margin: 14px 0; }
    .oh-how b { color: var(--spx-gold-2); }
    .oh-how kbd { display: inline-block; min-width: 18px; padding: 0 5px; border-radius: 4px; background: var(--spx-cream); color: var(--spx-navy); font: 800 12px/18px var(--spx-body); text-align: center; }
    .oh-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .oh-toggle { display: inline-flex; gap: 8px; align-items: center; font-weight: 700; font-size: 15px; cursor: pointer; }
    .oh-toggle input { width: 20px; height: 20px; accent-color: var(--spx-gold); }
    .oh-list { margin: 0 0 12px; padding-left: 20px; font-size: 17px; line-height: 1.5; }
    .oh-box { background: var(--spx-cream); color: var(--spx-navy); border-left: 6px solid var(--spx-gold); border-radius: 10px; padding: 12px 14px; font-size: 16px; line-height: 1.45; margin-bottom: 14px; }
    .oh-box .lbl { font: 800 11px var(--spx-display); letter-spacing: .07em; color: var(--spx-muted); margin-bottom: 3px; }
    #oh-finish { background: var(--spx-gold); color: var(--spx-navy); border-color: var(--spx-gold); font-weight: 800; }
    @media (max-width: 820px) { .oh-card { grid-template-columns: 1fr; } }
  `;
  document.head.appendChild(css);
  document.title = 'Housing Around the World: Japan · SPX Open House';

  SPX.bar({ title: 'Housing Around the World: Japan', subtitle: 'AP Human Geography · Shirakawa-go, Japan' });
  const idle = SPX.idle({ seconds: 120, warn: 20 });

  const hunt = SPX.hunt({
    title: 'Scavenger Hunt', side: 'left',
    items: [
      { id: 'roof', locked: true, q: 'Why is the roof so steep?', hint: 'Keep watching the house get built.',
        choices: ['So it can hold more people', 'So heavy snow slides off', 'So it looks taller'], answer: 1,
        why: 'This village gets a LOT of snow. A steep roof lets it slide off, so the house doesn’t get crushed.' },
      { id: 'yui', locked: true, q: 'Who helps put a new grass roof on a family’s house?', hint: 'Keep watching the house get built.',
        choices: ['A building company', 'The government', 'Neighbors, for free'], answer: 2,
        why: 'Neighbors help each other for free. In Japanese, this teamwork is called yui.' },
      { id: 'silk', locked: true, q: 'What did families raise in the big attic to make money?', hint: 'After the house is built, click “Silkworm floor” at the bottom. Then click the gold i.',
        choices: ['Silkworms', 'Chickens', 'Rice'], answer: 0,
        why: 'Silkworms make silk, and families sold the silk to earn money.' },
    ],
    onComplete: () => { const f = $('#oh-finish'); if (f) f.textContent = '🎉 All found! Finish →'; },
  });

  // ---- start screen ----
  const art = document.querySelector('.card[data-house="gassho"] .art svg');
  const start = document.createElement('section');
  start.className = 'oh-screen';
  start.innerHTML = `
    <div class="oh-card">
      <div class="oh-art">${art ? art.outerHTML : ''}</div>
      <div>
        <div class="oh-kicker">AP HUMAN GEOGRAPHY · ABOUT 5 MINUTES</div>
        <h1>Housing Around the World: Japan</h1>
        <p>Visit <b>Shirakawa-go</b>, a farm village in the mountains of Japan. Watch an old farmhouse get built, step by step. Then walk around inside it!</p>
        <p>This kind of house is called <b>folk housing</b>. That means local people built it by hand, using things found nearby, in a shape that fits the local weather.</p>
        <div class="oh-how">
          <b>Walk:</b> arrow keys <kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd> &nbsp;·&nbsp;
          <b>Look around:</b> click and drag on the trackpad<br>
          <b>Move to a spot:</b> click a blue ring &nbsp;·&nbsp; <b>Learn more:</b> click a gold <b>i</b> button
        </div>
        <div class="oh-row">
          <button class="btn-spx gold" type="button" id="oh-start">Start the tour →</button>
          <label class="oh-toggle"><input type="checkbox" id="oh-voice" checked> Narration voice</label>
        </div>
      </div>
    </div>`;
  document.body.appendChild(start);
  hunt.el.hidden = true;
  $('#oh-start').focus();
  $('#oh-voice').addEventListener('change', (e) => { const o = $('#opt-sound'); if (o) { o.checked = e.target.checked; o.dispatchEvent(new Event('change', { bubbles: true })); } });
  $('#oh-start').addEventListener('click', () => {
    const go = document.querySelector('button.start[data-house="gassho"]');
    start.hidden = true;
    hunt.el.hidden = false;
    go.click(); // inside our click, so the narration voice is allowed to speak
  });

  // ---- wrap-up screen ----
  const end = document.createElement('section');
  end.className = 'oh-screen';
  end.hidden = true;
  end.innerHTML = `
    <div class="oh-card" style="grid-template-columns:1fr;max-width:720px">
      <div>
        <div class="oh-kicker">WHAT YOU LEARNED</div>
        <h1>Folk housing in Shirakawa-go</h1>
        <ul class="oh-list">
          <li>The <b>weather</b> shaped the house: a steep roof so heavy snow slides off.</li>
          <li>Builders used <b>things found nearby</b>: wood from the hills, grass for the roof, and rope instead of nails.</li>
          <li><b>Neighbors</b> worked together for free to build the roof. This is called <i>yui</i>.</li>
          <li>Families raised <b>silkworms</b> in the attic to make money.</li>
        </ul>
        <div class="oh-box" id="oh-score"></div>
        <div class="oh-box"><div class="lbl">IN CLASS, WE GO FURTHER</div>Students also explore a 1949 American house that was built thousands of times, the same way each time, like on an assembly line. Then they compare the two houses: who built them, what they are made of, and why they look the way they do.</div>
        <div class="oh-row">
          <button class="btn-spx gold" type="button" id="oh-home">Back to menu</button>
          <button class="btn-spx" type="button" id="oh-back" style="border-color:var(--spx-cream)">Keep exploring</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(end);
  $('#oh-home').addEventListener('click', () => SPX.goHome());
  $('#oh-back').addEventListener('click', () => { end.hidden = true; hunt.el.hidden = false; });

  const finish = document.createElement('button');
  finish.className = 'btn';
  finish.id = 'oh-finish';
  finish.type = 'button';
  finish.textContent = 'I’m finished →';
  $('#btn-replay').parentElement.appendChild(finish);
  finish.addEventListener('click', () => {
    const n = hunt.solvedCount();
    $('#oh-score').innerHTML = n === hunt.total
      ? '<div class="lbl">SCAVENGER HUNT</div>🎉 You found all ' + n + ' answers!'
      : `<div class="lbl">SCAVENGER HUNT</div>You answered ${n} of ${hunt.total}. Click “Keep exploring” to finish the rest.`;
    try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {}
    hunt.el.hidden = true;
    end.hidden = false;
    $('#oh-home').focus();
  });

  // ---- unlock scavenger hunt questions from what the tour shows ----
  const unlockFor = (text) => {
    if (/Winter arrives|60° roof/i.test(text)) hunt.unlock('roof');
    if (/Neighbors build the roof/i.test(text)) hunt.unlock('yui');
    if (/^Silkworms$/i.test(text.trim())) hunt.unlock('silk');
  };
  const watch = (sel) => {
    const node = $(sel);
    if (!node) return;
    new MutationObserver(() => unlockFor(node.textContent || '')).observe(node, { childList: true, characterData: true, subtree: true });
  };
  watch('#progress-label');
  watch('#info-title');

  // Watching the narrated build counts as "using it", so the idle timer doesn't reset mid-tour.
  setInterval(() => {
    const building = !$('#hud').hidden && !$('#controls-build').hidden && $('#btn-pause').textContent.trim() === 'Pause';
    if (building) idle.poke();
  }, 1000);
  // ---- "what do I do next?" guidance ----
  const task = document.createElement('div');
  task.className = 'oh-task spx-turn';
  task.hidden = true;
  document.body.appendChild(task);
  const setTask = (html) => {
    if (!html) { task.hidden = true; return; }
    const full = '<span class="spx-turn-lbl">👉 YOUR TURN</span>' + html;
    if (task.innerHTML !== full) task.innerHTML = full;
    task.hidden = false;
  };
  const shown = (sel) => { const n = $(sel); return n && !n.hidden && !n.closest('[hidden]'); };
  const solved = (id) => hunt.el.querySelector(`.hunt-item[data-id="${id}"]`)?.classList.contains('done');
  const locked = (id) => hunt.el.querySelector(`.hunt-item[data-id="${id}"]`)?.classList.contains('locked');
  let lastChip = null;
  setInterval(() => {
    if (!start.hidden) { setTask(''); SPX.guide($('#oh-start'), 'Click to start', 'bottom'); return; }
    if (!end.hidden) { setTask(''); SPX.guide($('#oh-home'), 'All done!', 'right'); return; }
    if ($('#hud').hidden) { setTask(''); SPX.guide(null); return; }
    if (shown('#controls-build')) {
      setTask('Read along (or listen) as the house is built. Click <b>Next step</b> to go faster.');
      SPX.guide($('#caption'), 'Read this', 'top');
      return;
    }
    if (shown('#info')) { setTask(''); SPX.guide($('#info'), 'Read this', 'left'); return; }
    if (locked('silk')) {
      const chip = [...document.querySelectorAll('#chips button')].find((b) => /Silkworm floor/.test(b.textContent));
      if (chip && chip.getAttribute('aria-current') !== 'true') {
        if (chip !== lastChip) { chip.scrollIntoView({ block: 'nearest', inline: 'nearest' }); lastChip = chip; }
        setTask('Go up to the attic! Click <b>Silkworm floor</b> at the bottom of the screen.');
        SPX.guide(chip, 'Click here', 'top');
      } else {
        setTask('Find the <b>gold i</b> button near the trays and click it.');
        SPX.guide(null);
      }
      return;
    }
    if (['roof', 'yui', 'silk'].some((id) => !solved(id))) { setTask('Answer the scavenger hunt question on the left.'); SPX.guide(null); return; }
    setTask('Great job! Explore more, or click <b>I’m finished</b>.');
    SPX.guide($('#oh-finish'), 'Click when done', 'right');
  }, 300);
})();
