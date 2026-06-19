/* PrismLabs Studio — temporary live design panel.
   Enable: add ?studio to the URL (e.g. /index.html?studio). It then persists.
   Disable: click "Disable studio" in the panel, or run localStorage.removeItem('pl_studio').
   To remove for good: delete studio.js and its <script> tag in index.html. */
(function () {
  var qs = new URLSearchParams(location.search);
  if (qs.has('studio')) localStorage.setItem('pl_studio', '1');
  if (localStorage.getItem('pl_studio') !== '1') return;

  var DISPLAY = ['Archivo','Space Grotesk','Sora','Manrope','Inter Tight','Hanken Grotesk','Instrument Sans','Bricolage Grotesque','Syne','Unbounded','Familjen Grotesk','Schibsted Grotesk','Figtree','Anton'];
  var BODY = ['Archivo','Inter','Inter Tight','Manrope','Hanken Grotesk','DM Sans','Figtree','Onest','IBM Plex Sans','Schibsted Grotesk'];
  var MONO = ['Space Mono','JetBrains Mono','IBM Plex Mono','DM Mono','Spline Sans Mono','Red Hat Mono','Martian Mono'];

  var loaded = {};
  function loadFont(name) {
    if (!name || loaded[name]) return; loaded[name] = 1;
    var l = document.createElement('link'); l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=' + name.replace(/ /g, '+') + ':wght@300;400;500;600;700;800;900&display=swap';
    document.head.appendChild(l);
  }

  var rootStyle = document.documentElement.style;
  var DEF = { display:'Archivo', body:'Archivo', mono:'Space Mono', hero:1, head:1, bodys:1, weight:800, stretch:106, track:-2.5, beam:'#F2A65A' };
  var S = Object.assign({}, DEF, JSON.parse(localStorage.getItem('pl_studio_state') || '{}'));

  function apply() {
    loadFont(S.display); loadFont(S.body); loadFont(S.mono);
    rootStyle.setProperty('--font-display', "'" + S.display + "'");
    rootStyle.setProperty('--font-body', "'" + S.body + "'");
    rootStyle.setProperty('--font-mono', "'" + S.mono + "'");
    rootStyle.setProperty('--hero-scale', S.hero);
    rootStyle.setProperty('--head-scale', S.head);
    rootStyle.setProperty('--body-scale', S.bodys);
    rootStyle.setProperty('--disp-weight', S.weight);
    rootStyle.setProperty('--disp-stretch', S.stretch + '%');
    rootStyle.setProperty('--disp-tracking', (S.track / 100) + 'em');
    rootStyle.setProperty('--beam', S.beam);
    localStorage.setItem('pl_studio_state', JSON.stringify(S));
  }
  apply();

  /* ---- UI ---- */
  var css = document.createElement('style');
  css.textContent = [
    '#plgear{position:fixed;right:16px;bottom:16px;z-index:9998;width:46px;height:46px;border-radius:50%;background:#161310;border:1px solid rgba(233,231,224,.25);color:#F2A65A;font:600 11px/46px ui-monospace,monospace;text-align:center;cursor:pointer;letter-spacing:.05em;box-shadow:0 8px 30px -10px #000}',
    '#plgear:hover{border-color:#F2A65A}',
    '#plpanel{position:fixed;right:16px;bottom:72px;z-index:9999;width:300px;max-height:82vh;overflow:auto;background:#100e0c;border:1px solid rgba(233,231,224,.16);border-radius:10px;padding:16px;color:#E9E7E0;font:13px/1.4 ui-sans-serif,system-ui,sans-serif;box-shadow:0 30px 80px -20px #000;display:none}',
    '#plpanel.open{display:block}',
    '#plpanel h4{margin:0 0 2px;font:600 12px/1.3 ui-monospace,monospace;letter-spacing:.12em;text-transform:uppercase;color:#F2A65A}',
    '#plpanel .sub{margin:0 0 14px;font-size:11px;color:#928C80}',
    '#plpanel label{display:block;margin:12px 0 4px;font:600 10px/1.3 ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;color:#928C80}',
    '#plpanel select,#plpanel input[type=range],#plpanel input[type=color]{width:100%;box-sizing:border-box}',
    '#plpanel select{background:#1d1a15;color:#E9E7E0;border:1px solid rgba(233,231,224,.18);border-radius:5px;padding:7px 8px;font-size:12px}',
    '#plpanel input[type=color]{height:30px;background:#1d1a15;border:1px solid rgba(233,231,224,.18);border-radius:5px;padding:2px}',
    '#plpanel .val{float:right;color:#E9E7E0;font-family:ui-monospace,monospace}',
    '#plpanel .row{display:flex;gap:8px;margin-top:14px}',
    '#plpanel button{flex:1;background:#1d1a15;color:#E9E7E0;border:1px solid rgba(233,231,224,.18);border-radius:5px;padding:8px;font:600 11px/1 ui-monospace,monospace;letter-spacing:.04em;cursor:pointer}',
    '#plpanel button.go{background:#F2A65A;color:#100c06;border-color:#F2A65A}',
    '#plpanel button:hover{border-color:#F2A65A}',
    '#plpanel .chk{display:flex;align-items:center;gap:8px;margin-top:14px;font-size:12px;color:#E9E7E0}',
    '#plpanel .chk input{width:auto}',
    '[data-pledit]{outline:1px dashed rgba(242,166,90,.5);outline-offset:3px}',
    '#pltoast{position:fixed;right:16px;bottom:128px;z-index:10000;background:#F2A65A;color:#100c06;font:600 12px ui-monospace,monospace;padding:9px 13px;border-radius:6px;opacity:0;transition:opacity .25s}',
    '#pltoast.show{opacity:1}'
  ].join('');
  document.head.appendChild(css);

  function opts(list, sel) { return list.map(function (n) { return '<option' + (n === sel ? ' selected' : '') + '>' + n + '</option>'; }).join(''); }

  var panel = document.createElement('div');
  panel.id = 'plpanel';
  panel.innerHTML =
    '<h4>PrismLabs Studio</h4><p class="sub">Live tweaks. Nothing here ships.</p>' +
    '<label>Display font</label><select id="ps_display">' + opts(DISPLAY, S.display) + '</select>' +
    '<label>Body font</label><select id="ps_body">' + opts(BODY, S.body) + '</select>' +
    '<label>Mono / label font</label><select id="ps_mono">' + opts(MONO, S.mono) + '</select>' +
    '<label>Hero size <span class="val" id="v_hero"></span></label><input type="range" id="ps_hero" min="0.6" max="1.5" step="0.01" value="' + S.hero + '">' +
    '<label>Heading size <span class="val" id="v_head"></span></label><input type="range" id="ps_head" min="0.6" max="1.5" step="0.01" value="' + S.head + '">' +
    '<label>Body size <span class="val" id="v_bodys"></span></label><input type="range" id="ps_bodys" min="0.8" max="1.4" step="0.01" value="' + S.bodys + '">' +
    '<label>Display weight <span class="val" id="v_weight"></span></label><input type="range" id="ps_weight" min="400" max="900" step="50" value="' + S.weight + '">' +
    '<label>Display width <span class="val" id="v_stretch"></span></label><input type="range" id="ps_stretch" min="75" max="125" step="1" value="' + S.stretch + '">' +
    '<label>Letter spacing <span class="val" id="v_track"></span></label><input type="range" id="ps_track" min="-6" max="2" step="0.1" value="' + S.track + '">' +
    '<label>Accent colour</label><input type="color" id="ps_beam" value="' + S.beam + '">' +
    '<div class="chk"><input type="checkbox" id="ps_edit"><label for="ps_edit" style="margin:0;text-transform:none;letter-spacing:0;font-size:12px;color:#E9E7E0">Edit text (click any heading)</label></div>' +
    '<div class="row"><button class="go" id="ps_export">Copy settings</button><button id="ps_text">Copy text</button></div>' +
    '<div class="row"><button id="ps_reset">Reset</button><button id="ps_off">Disable</button></div>';
  document.body.appendChild(panel);

  var gear = document.createElement('div');
  gear.id = 'plgear'; gear.textContent = 'Aa'; gear.title = 'PrismLabs Studio';
  document.body.appendChild(gear);
  gear.onclick = function () { panel.classList.toggle('open'); };

  var toast = document.createElement('div'); toast.id = 'pltoast'; document.body.appendChild(toast);
  function flash(msg) { toast.textContent = msg; toast.classList.add('show'); setTimeout(function () { toast.classList.remove('show'); }, 1400); }

  function vals() {
    document.getElementById('v_hero').textContent = S.hero + '×';
    document.getElementById('v_head').textContent = S.head + '×';
    document.getElementById('v_bodys').textContent = S.bodys + '×';
    document.getElementById('v_weight').textContent = S.weight;
    document.getElementById('v_stretch').textContent = S.stretch + '%';
    document.getElementById('v_track').textContent = (S.track / 100) + 'em';
  }
  vals();

  function bindSel(id, key) { document.getElementById(id).onchange = function (e) { S[key] = e.target.value; apply(); }; }
  bindSel('ps_display', 'display'); bindSel('ps_body', 'body'); bindSel('ps_mono', 'mono');
  function bindRange(id, key, asNum) { document.getElementById(id).oninput = function (e) { S[key] = asNum ? parseFloat(e.target.value) : e.target.value; apply(); vals(); }; }
  bindRange('ps_hero', 'hero', 1); bindRange('ps_head', 'head', 1); bindRange('ps_bodys', 'bodys', 1);
  bindRange('ps_weight', 'weight', 1); bindRange('ps_stretch', 'stretch', 1); bindRange('ps_track', 'track', 1);
  document.getElementById('ps_beam').oninput = function (e) { S.beam = e.target.value; apply(); };

  var EDIT_SEL = 'h1,h2,h3,.lede,.eyebrow,.team,.cap,.k,.t,.chip,.tag,.btn,.surf';
  document.getElementById('ps_edit').onchange = function (e) {
    document.querySelectorAll(EDIT_SEL).forEach(function (el) {
      el.contentEditable = e.target.checked; if (e.target.checked) el.setAttribute('data-pledit', '1'); else el.removeAttribute('data-pledit');
    });
    flash(e.target.checked ? 'Click headings to edit' : 'Text locked');
  };

  function copy(text, msg) {
    navigator.clipboard.writeText(text).then(function () { flash(msg); }, function () { flash('Copy failed'); });
  }
  document.getElementById('ps_export').onclick = function () {
    var fl = function (n) { return '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=' + n.replace(/ /g, '+') + ':wght@300;400;500;600;700;800;900&display=swap">'; };
    var out = '/* PrismLabs studio settings — paste back to Claude */\n' +
      fl(S.display) + '\n' + fl(S.body) + '\n' + fl(S.mono) + '\n:root{\n' +
      "  --font-display:'" + S.display + "'; --font-body:'" + S.body + "'; --font-mono:'" + S.mono + "';\n" +
      '  --hero-scale:' + S.hero + '; --head-scale:' + S.head + '; --body-scale:' + S.bodys + ';\n' +
      '  --disp-weight:' + S.weight + '; --disp-stretch:' + S.stretch + '%; --disp-tracking:' + (S.track / 100) + 'em;\n' +
      '  --beam:' + S.beam + ';\n}';
    copy(out, 'Settings copied');
  };
  document.getElementById('ps_text').onclick = function () {
    var lines = [];
    document.querySelectorAll('h1,h2,h3,.eyebrow,.lede,.team,.pcard .meta p,.reel .cap .t,.chip').forEach(function (el) {
      var t = (el.innerText || '').trim().replace(/\s+/g, ' '); if (t) lines.push((el.tagName.toLowerCase()) + ': ' + t);
    });
    copy(lines.join('\n'), 'Text copied');
  };
  document.getElementById('ps_reset').onclick = function () { S = Object.assign({}, DEF); apply(); flash('Reset'); setTimeout(function () { location.reload(); }, 300); };
  document.getElementById('ps_off').onclick = function () { localStorage.removeItem('pl_studio'); localStorage.removeItem('pl_studio_state'); location.href = location.pathname; };
})();
