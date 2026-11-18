/* aurevv: hampers, cart, orders, elephant + bee, section transition.
   Plain JavaScript, no dependencies. Cart and orders are stored in the visitor's browser (localStorage). */
(function () {
'use strict';

var IG = 'https://ig.me/m/aurevv.co';
var KEYS = { cart: 'aurevv_cart_v1', orders: 'aurevv_orders_v1', note: 'aurevv_note_v1' };
var MAX_QTY = 20;

/* ---------- helpers ---------- */
var reduceMq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
function reduced() { return !!(reduceMq && reduceMq.matches); }
function load(k, fb) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : fb; } catch (e) { return fb; } }
function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } }
function $(id) { return document.getElementById(id); }
function esc(s) {
return String(s).replace(/[&<>"']/g, function (c) {
return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
});
}
function inr(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

/* ---------- data ---------- */
var ICON = {
cookie: 'M12 3a9 9 0 1 0 9 9a4.5 4.5 0 0 1-4.5-4.5A4.5 4.5 0 0 1 12 3z M8.5 10h.01 M11.5 15h.01 M15.5 13.5h.01 M8 14.5h.01',
card: 'M4 5h16v14H4z M8 10h8 M8 14h5',
quote: 'M5 4h14v16H5z M8.5 9h2.5v3H8.5z M13 9h2.5v3H13z M8.5 12l-1 3 M13 12l-1 3',
choc: 'M5 3h14v18H5z M5 9h14 M5 15h14 M12 3v18',
key: 'M7.5 3a4.5 4.5 0 1 0 0 9a4.5 4.5 0 0 0 0-9z M7.5 6.5h.01 M11 11l9 9 M16 16l2-2 M18.5 18.5l2-2',
teddy: 'M12 8.5a5.5 5.5 0 1 0 0 11a5.5 5.5 0 0 0 0-11z M6 4.5a2.5 2.5 0 1 0 0 5 M18 4.5a2.5 2.5 0 1 1 0 5 M10 13h.01 M14 13h.01 M11 16h2',
book: 'M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3z M21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z',
crayon: 'M6 21V9l2.5-5L11 9v12z M13 21v-8l2.5-4 2.5 4v8z',
pencil: 'M4 20l1-4L16 5l3 3L8 19z M14 7l3 3 M4 20l4-1',
scrunchie: 'M12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16z M12 9a3 3 0 1 0 0 6a3 3 0 0 0 0-6z',
star: 'M12 3l2.6 5.6 6.1.8-4.5 4.2 1.1 6.1L12 16.8 6.7 19.7l1.1-6.1L3.3 9.4l6.1-.8z',
car: 'M2.5 15v-3l2.5-4h9l4 4h3.5v3z M6.5 14.5a2 2 0 1 0 0 4a2 2 0 0 0 0-4z M16.5 14.5a2 2 0 1 0 0 4a2 2 0 0 0 0-4z',
blocks: 'M3 13h8v8H3z M13 13h8v8h-8z M8 4h8v9H8z',
puzzle: 'M5 5h4.5a2 2 0 1 1 4 0H18v4.5a2 2 0 1 0 0 4V18h-4.5a2 2 0 1 0-4 0H5v-4.5a2 2 0 1 1 0-4z',
mug: 'M4 7h11v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z M15 9h2a2.5 2.5 0 0 1 0 5h-2 M7 3v2 M11 3v2',
frame: 'M3 4h18v16H3z M7 8h10v8H7z',
photos: 'M3 6h13v11H3z M8 20h13V10 M5.5 14l3-3 2.5 2.5 2-2 2.5 2.5',
candle: 'M12 2.5c2 2 2 3.5 0 5c-2-1.5-2-3 0-5z M8 11h8v10H8z M12 7.5V11 M6 21h12',
flower: 'M12 13v8 M12 13c-3.5-1-4.5-4.5-3.5-8c3.5 1 4.5 4.5 3.5 8z M12 13c3.5-1 4.5-4.5 3.5-8c-3.5 1-4.5 4.5-3.5 8z M12 13c-4 0-6-2.5-6-5.5c3 0 6 2 6 5.5z M9 21h6',
collector: 'M6 3h12v18H6z M9 7h6v6H9z M9 16.5h6',
pendant: 'M6 2.5l6 6.5 6-6.5 M12 21s-5.5-3.5-5.5-7.5a3 3 0 0 1 5.5-1.7a3 3 0 0 1 5.5 1.7c0 4-5.5 7.5-5.5 7.5z',
album: 'M5 3h14v18H5z M5 3v18 M10 9h6v6h-6z',
letter: 'M3 6h18v12H3z M3 7l9 6.5L21 7'
};
var KIND = {
heart: 'M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z',
star: 'M12 2l2.9 6.6 7.1.7-5.4 4.8 1.6 7L12 17.3 5.8 21.1l1.6-7L2 9.3l7.1-.7z',
dot: 'M12 4a8 8 0 1 0 0 16a8 8 0 0 0 0-16z'
};
function light(c) {
return {
bg: 'linear-gradient(180deg, ' + c.bg1 + ' 0%, ' + c.bg2 + ' 100%)', tone: c.bg1,
ink: c.ink, muted: c.muted, line: c.ink + '33', card: '#FFFFFF',
box: c.box, boxDark: c.boxDark, inner: c.inner, ribbon: '#FFFFFF',
tokenBg: '#FFFFFF', tokenInk: c.accent, selBg: c.accent, selInk: '#FFFFFF', ring: c.accent + '66',
accent: c.accent, accentInk: '#FFFFFF', rowSel: c.accent + '1A',
tabBorder: c.ink + '40', tabOnBg: c.accent, tabOnInk: '#FFFFFF',
bubbleBg: '#FFFFFF', bubbleInk: c.ink, pillBg: '#FFFFFF', pillInk: c.ink,
deco: c.deco, kind: c.kind, logo: c.logo || c.accent, thumbBg: c.bg1
};
}
function love(c) {
return {
bg: 'linear-gradient(160deg, #4A0A24 0%, #7E1840 55%, #A3234F 100%)', tone: '#7E1840',
ink: '#FFF1F5', muted: '#F7CDD9', line: 'rgba(255,255,255,0.3)', card: 'rgba(255,255,255,0.12)',
box: c.box, boxDark: c.boxDark, inner: c.inner, ribbon: c.ribbon,
tokenBg: '#FFF1F5', tokenInk: '#A21D48', selBg: '#FFE3EA', selInk: '#6B0F2C', ring: 'rgba(255,227,234,0.75)',
accent: '#FFE3EA', accentInk: '#6B0F2C', rowSel: 'rgba(255,255,255,0.16)',
tabBorder: 'rgba(255,241,245,0.45)', tabOnBg: '#FFE3EA', tabOnInk: '#6B0F2C',
bubbleBg: '#FFF1F5', bubbleInk: '#4A0A24', pillBg: 'rgba(255,255,255,0.14)', pillInk: '#FFF1F5',
deco: 'rgba(255,143,176,0.28)', kind: 'heart', logo: '#A21D48', thumbBg: '#7E1840'
};
}
var THEMES = {
everyday: light({ bg1: '#E4F1FC', bg2: '#F8FBFF', ink: '#16314B', muted: '#3F5A78', box: '#9FCBEF', boxDark: '#7DB5E3', inner: '#5F9ED3', accent: '#1F6FB2', deco: '#CBE3F7', kind: 'dot', logo: '#172B4D' }),
princess: light({ bg1: '#FFE8F1', bg2: '#FFF8FB', ink: '#4B1D36', muted: '#6E3C56', box: '#F8C1D8', boxDark: '#F2A2C3', inner: '#E985B0', accent: '#B8386B', deco: '#FBCFE1', kind: 'heart' }),
prince: light({ bg1: '#E3EAFF', bg2: '#F6F8FF', ink: '#0F1E4D', muted: '#3B4A78', box: '#1E3A8A', boxDark: '#162C6B', inner: '#0F1F55', accent: '#1E3A8A', deco: '#C6D3FF', kind: 'star' }),
parents: light({ bg1: '#FAEFD7', bg2: '#FFFBF2', ink: '#3A2B0F', muted: '#5F4C22', box: '#E7CF98', boxDark: '#D4B672', inner: '#B9974C', accent: '#8A6414', deco: '#F0DDB0', kind: 'dot' }),
boyfriend: love({ box: '#D92D55', boxDark: '#B11F43', inner: '#6E0E2B', ribbon: '#FFD9E2' }),
girlfriend: love({ box: '#F7A8BF', boxDark: '#EF86A5', inner: '#C4466D', ribbon: '#FFFFFF' })
};
var HAMPERS = [
{ id: 'everyday', tab: 'Everyday', name: 'The Everyday Hamper', eyebrow: 'Hamper A', title: 'The Everyday Hamper', tagline: 'A little something for anyone, any day.', priceNum: 599, vary: false, items: [
{ name: 'Cookies or biscuits', icon: 'cookie' },
{ name: 'Personalised message card', icon: 'card' },
{ name: 'Quote card', icon: 'quote' },
{ name: 'Chocolate treat', icon: 'choc' },
{ name: 'Decorative keychain', icon: 'key' } ] },
{ id: 'princess', tab: 'Lil Princess', name: 'Lil Princess Hamper', eyebrow: 'Hamper B', title: 'For Your Lil Princess', tagline: 'A box of sweet surprises for your little princess.', priceNum: 699, vary: false, items: [
{ name: 'Mini plush teddy', icon: 'teddy' },
{ name: 'Cute colouring book', icon: 'book' },
{ name: 'Crayon or colour pencil set', icon: 'crayon' },
{ name: 'Cute stationery set', icon: 'pencil' },
{ name: 'Hair clips or scrunchies', icon: 'scrunchie' },
{ name: 'Stickers collection', icon: 'star' },
{ name: 'Chocolates!', icon: 'choc' },
{ name: 'Personalised greeting card', icon: 'card' } ] },
{ id: 'prince', tab: 'Lil Prince', name: 'Lil Prince Hamper', eyebrow: 'Hamper B', title: 'For Your Lil Prince', tagline: 'A box of fun surprises for your little prince.', priceNum: 699, vary: false, items: [
{ name: 'Mini toy car', icon: 'car' },
{ name: 'Mini building blocks set', icon: 'blocks' },
{ name: "Kids' colouring/activity book", icon: 'book' },
{ name: 'Crayon or colour pencil set', icon: 'crayon' },
{ name: 'Mini puzzle', icon: 'puzzle' },
{ name: 'Fun stickers', icon: 'star' },
{ name: 'Chocolates!', icon: 'choc' },
{ name: 'Personalised greeting card', icon: 'card' } ] },
{ id: 'parents', tab: "Parents' Anniversary", name: "Parents' Anniversary Hamper", eyebrow: 'Hamper C', title: "For Your Parents' Anniversary", tagline: 'A keepsake box to celebrate their years together.', priceNum: 1599, vary: true, items: [
{ name: 'Matching couple mugs', icon: 'mug' },
{ name: 'Personalised photo frame', icon: 'frame' },
{ name: 'Personalised anniversary message', icon: 'card' },
{ name: 'Small pictures of unforgettable memories', sub: '3 pictures', icon: 'photos' },
{ name: 'Scented candle', icon: 'candle' },
{ name: 'Chocolate assortment', icon: 'choc' },
{ name: 'Mini dried flower bouquet', icon: 'flower' } ] },
{ id: 'boyfriend', tab: 'Boyfriend', name: 'Boyfriend Hamper', eyebrow: 'Hamper D', title: 'For Your Boyfriend', tagline: 'Little things, big feelings, with a letter from you.', priceNum: 1299, vary: true, items: [
{ name: 'Three Hot Wheels cars', sub: 'Two regular + one Mainline or Premium', icon: 'car' },
{ name: 'Chocolates!', icon: 'choc' },
{ name: 'Keychain', sub: "Of his girlfriend's choice", icon: 'key' },
{ name: 'A personalised letter from his girl', icon: 'letter' },
{ name: "Collector's card", sub: 'From us', icon: 'collector' } ] },
{ id: 'girlfriend', tab: 'Girlfriend', name: 'Girlfriend Hamper', eyebrow: 'Hamper E', title: 'For Your Girlfriend', tagline: 'A box of keepsakes and a love letter, just for her.', priceNum: 1299, vary: true, items: [
{ name: 'Minimal heart pendant', icon: 'pendant' },
{ name: 'Mini memory album', icon: 'album' },
{ name: 'Mini plush teddy', icon: 'teddy' },
{ name: 'Chocolates!', icon: 'choc' },
{ name: 'Personalised love letter', icon: 'letter' } ] }
];
var LAYOUT = {
5: { w: 19, pos: [[24, 26], [50, 23], [76, 26], [37, 50], [63, 48]] },
7: { w: 18, pos: [[17, 26], [39, 23], [61, 23], [83, 26], [28, 51], [50, 49], [72, 51]] },
8: { w: 18, pos: [[17, 26], [39, 23], [61, 23], [83, 26], [17, 51], [39, 49], [61, 49], [83, 51]] }
};
var DECO = [[6, 5, 38], [88, 4, 28], [10, 30, 22], [91, 28, 44], [4, 58, 30], [89, 55, 26], [9, 82, 40], [86, 80, 32], [48, 2, 20]];
var ROTS = [-6, 4, -3, 6, -5, 3, -4, 5];

var STATUS = {
payment: ['Awaiting payment', 'Payment verified'],
preparation: ['Order received', 'Being prepared', 'Ready for delivery'],
delivery: ['Not dispatched', 'Out for delivery', 'Delivered']
};
var STATUS_LABEL = { payment: 'Payment', preparation: 'Preparation', delivery: 'Delivery' };

function hamperById(id) { for (var i = 0; i < HAMPERS.length; i++) if (HAMPERS[i].id === id) return HAMPERS[i]; return null; }

/* ---------- state ---------- */
var st = { hid: 'everyday', sel: -1 };
var cart = (function () {
var raw = load(KEYS.cart, []);
var out = [];
if (Array.isArray(raw)) raw.forEach(function (r) {
if (r && hamperById(r.id)) out.push({ id: r.id, qty: Math.max(1, Math.min(MAX_QTY, parseInt(r.qty, 10) || 1)) });
});
return out;
})();
var orders = (function () {
var raw = load(KEYS.orders, []);
return Array.isArray(raw) ? raw.filter(function (o) { return o && typeof o.id === 'string' && Array.isArray(o.items); }) : [];
})();
var note = (function () { var n = load(KEYS.note, ''); return typeof n === 'string' ? n : ''; })();
var statusMap = {};

function cartCount() { return cart.reduce(function (s, r) { return s + r.qty; }, 0); }
function cartTotal() { return cart.reduce(function (s, r) { return s + r.qty * hamperById(r.id).priceNum; }, 0); }
function qtyOf(id) { for (var i = 0; i < cart.length; i++) if (cart[i].id === id) return cart[i].qty; return 0; }
function persistCart() { save(KEYS.cart, cart); }

/* ---------- toast ---------- */
var toastTimer = null;
function toast(html) {
var t = $('toast');
t.innerHTML = html;
t.classList.add('show');
clearTimeout(toastTimer);
toastTimer = setTimeout(function () { t.classList.remove('show'); }, 5200);
}

/* ---------- clipboard ---------- */
function copyText(text) {
try {
if (navigator.clipboard && navigator.clipboard.writeText) {
navigator.clipboard.writeText(text).catch(function () { legacyCopy(text); });
return;
}
} catch (e) { /* fall through */ }
legacyCopy(text);
}
function legacyCopy(text) {
try {
var ta = document.createElement('textarea');
ta.value = text;
ta.setAttribute('readonly', '');
ta.style.cssText = 'position:fixed;left:-9999px;top:0';
document.body.appendChild(ta);
ta.select();
document.execCommand('copy');
document.body.removeChild(ta);
} catch (e) { /* copy not available */ }
}
function openInstagram() { window.open(IG, '_blank', 'noopener'); }

/* ---------- section transition (particles) ---------- */
var morphCanvas = $('morph');
var morphRaf = 0;
function hexToRgb(h) {
h = String(h).replace('#', '');
if (h.length === 3) h = h.replace(/(.)/g, '$1$1');
var n = parseInt(h, 16);
if (isNaN(n)) return [248, 244, 237];
return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
function morph(fromHex, toHex) {
if (reduced() || !morphCanvas || !morphCanvas.getContext || fromHex === toHex) return;
var ctx = morphCanvas.getContext('2d');
if (!ctx) return;
cancelAnimationFrame(morphRaf);
var dpr = Math.min(window.devicePixelRatio || 1, 2);
var w = window.innerWidth, h = window.innerHeight;
morphCanvas.width = Math.round(w * dpr);
morphCanvas.height = Math.round(h * dpr);
ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
morphCanvas.style.display = 'block';
var a = hexToRgb(fromHex), b = hexToRgb(toHex);
var N = w < 640 ? 34 : 56;
var ps = [];
for (var i = 0; i < N; i++) {
ps.push({ x: Math.random() * w, y: Math.random() * h, r: 6 + Math.random() * 16, d: Math.random() * 0.3, sx: 10 + Math.random() * 26, ph: Math.random() * 6.28, vy: -24 - Math.random() * 46 });
}
var DUR = 1000;
var t0 = performance.now();
function frame(now) {
var t = Math.min(1, (now - t0) / DUR);
ctx.clearRect(0, 0, w, h);
for (var i = 0; i < ps.length; i++) {
var p = ps[i];
var q = Math.max(0, Math.min(1, (t - p.d) / (1 - p.d)));
var mix = q * q * (3 - 2 * q);
var env = Math.sin(Math.PI * q);
var r = Math.round(a[0] + (b[0] - a[0]) * mix), g = Math.round(a[1] + (b[1] - a[1]) * mix), bl = Math.round(a[2] + (b[2] - a[2]) * mix);
ctx.globalAlpha = 0.5 * env;
ctx.fillStyle = 'rgb(' + r + ',' + g + ',' + bl + ')';
ctx.beginPath();
ctx.arc(p.x + Math.sin(p.ph + q * 5) * p.sx, p.y + p.vy * q, p.r * (0.6 + 0.6 * env), 0, 6.2832);
ctx.fill();
}
ctx.globalAlpha = 1;
if (t < 1) { morphRaf = requestAnimationFrame(frame); }
else { ctx.clearRect(0, 0, w, h); morphCanvas.style.display = 'none'; }
}
morphRaf = requestAnimationFrame(frame);
}
function currentTone() {
var secs = document.querySelectorAll('main > section[data-tone]');
var mid = window.innerHeight * 0.4;
for (var i = 0; i < secs.length; i++) {
var r = secs[i].getBoundingClientRect();
if (r.top <= mid && r.bottom >= mid) return secs[i].getAttribute('data-tone');
}
return '#F8F4ED';
}
function goTo(id, push) {
$('toast').classList.remove('show');
var target = $(id);
if (!target) return;
morph(currentTone(), target.getAttribute('data-tone') || '#F8F4ED');
if (id === 'top') window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
else target.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
if (push !== false && window.history && history.replaceState) { try { history.replaceState(null, '', '#' + id); } catch (e) { /* ignore */ } }
}

/* ---------- hampers ---------- */
function thumb(t) {
return '<svg viewBox="0 0 64 64" width="60" height="60" aria-hidden="true"><rect x="8" y="26" width="48" height="30" rx="7" fill="' + t.box + '"/><rect x="5" y="19" width="54" height="12" rx="6" fill="' + t.box + '"/><rect x="5" y="19" width="54" height="12" rx="6" fill="rgba(0,0,0,.07)"/><rect x="28" y="19" width="8" height="37" fill="' + t.ribbon + '"/><path d="M32 19c-3-8-12-8-12-3s7 4 12 3zM32 19c3-8 12-8 12-3s-7 4-12 3z" fill="' + t.ribbon + '"/></svg>';
}
function renderHampers(restoreKey) {
var cur = hamperById(st.hid) || HAMPERS[0];
var t = THEMES[cur.id];
var sel = st.sel;
var slots = LAYOUT[cur.items.length];
var labelPath = t.kind === 'dot' ? KIND.heart : KIND[t.kind];
var sec = $('hampers');
sec.style.background = t.bg;
sec.style.color = t.ink;
sec.setAttribute('data-tone', t.tone);
document.documentElement.style.setProperty('--logo', t.logo);

$('hamperDeco').innerHTML = DECO.map(function (d, i) {
return '<svg class="fl" viewBox="0 0 24 24" aria-hidden="true" style="left:' + d[0] + '%;top:' + d[1] + '%;width:' + d[2] + 'px;height:' + d[2] + 'px;animation-delay:' + (i * 0.7) + 's"><path d="' + KIND[t.kind] + '" fill="' + t.deco + '"></path></svg>';
}).join('');

var tabs = HAMPERS.map(function (h) {
var on = h.id === cur.id;
return '<button class="tab" data-act="tab" data-k="tab-' + h.id + '" data-hid="' + h.id + '" aria-pressed="' + on + '" style="font-weight:' + (on ? 600 : 500) + ';background:' + (on ? t.tabOnBg : 'transparent') + ';color:' + (on ? t.tabOnInk : t.ink) + ';border:1.5px solid ' + (on ? t.tabOnBg : t.tabBorder) + '">' + esc(h.tab) + '</button>';
}).join('');

var tokens = cur.items.map(function (it, i) {
var on = sel === i, p = slots.pos[i], rot = ROTS[i % 8];
var tf = on ? 'translate(-50%, -50%) translateY(-26%) scale(1.22) rotate(0deg)' : 'translate(-50%, -50%) rotate(' + rot + 'deg)';
var just = p[0] < 30 ? 'flex-start' : (p[0] > 70 ? 'flex-end' : 'center');
var sh = on ? '0 0 0 5px ' + t.ring + ', 0 22px 36px rgba(0,0,0,0.28)' : '0 10px 20px rgba(0,0,0,0.16)';
var bubble = '';
if (on) {
bubble = '<span class="bubble-wrap" aria-hidden="true" style="justify-content:' + just + '"><span class="bubble pop" style="background:' + t.bubbleBg + ';color:' + t.bubbleInk + '"><span style="display:block">' + esc(it.name) + '</span>' + (it.sub ? '<small>' + esc(it.sub) + '</small>' : '') + '</span></span>';
}
return '<button class="tok' + (on ? ' sel' : '') + '" data-act="pick" data-k="item-' + i + '" data-i="' + i + '" aria-pressed="' + on + '" aria-label="' + esc(it.name) + '" style="--r:' + rot + 'deg;left:' + p[0] + '%;top:' + p[1] + '%;width:' + slots.w + '%;transform:' + tf + ';z-index:' + (on ? 6 : 2) + ';background:' + (on ? t.selBg : t.tokenBg) + ';color:' + (on ? t.selInk : t.tokenInk) + ';box-shadow:' + sh + '">' +
'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + ICON[it.icon] + '"></path></svg>' +
'<span class="num" aria-hidden="true" style="background:' + (on ? t.tokenBg : t.accent) + ';color:' + (on ? t.tokenInk : t.accentInk) + '">' + (i + 1) + '</span>' + bubble + '</button>';
}).join('');

var rows = cur.items.map(function (it, i) {
var on = sel === i;
return '<button class="row" data-act="pick" data-k="row-' + i + '" data-i="' + i + '" aria-pressed="' + on + '" style="background:' + (on ? t.rowSel : 'transparent') + '">' +
'<span class="n" aria-hidden="true" style="background:' + (on ? t.accent : t.line) + ';color:' + (on ? t.accentInk : t.ink) + '">' + (i + 1) + '</span>' +
'<span class="t"><span style="font-weight:' + (on ? 700 : 500) + '">' + esc(it.name) + '</span>' + (it.sub ? '<small style="color:' + t.muted + '">' + esc(it.sub) + '</small>' : '') + '</span></button>';
}).join('');

var inCart = qtyOf(cur.id);
var hint = sel >= 0 ? 'Tap it again to tuck it back in' : 'Tap any item to see it pop out of the box';

var html =
'<div class="hamp-head"><span class="pill" style="background:' + t.pillBg + ';color:' + t.pillInk + '"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="' + labelPath + '" fill="currentColor"></path></svg>Customised gift hampers</span>' +
'<h2>Choose a hamper</h2><p style="color:' + t.muted + '">Tap what\'s inside, then add it to your cart.</p></div>' +
'<div class="tabs" role="group" aria-label="Hampers">' + tabs + '</div>' +
'<div class="hamp-main">' +
'<div class="box-col"><div class="box">' +
'<svg class="layer" viewBox="0 0 600 612" aria-hidden="true" style="z-index:0"><ellipse cx="300" cy="600" rx="250" ry="12" fill="rgba(0,0,0,0.12)"></ellipse><rect x="50" y="44" width="500" height="330" rx="30" fill="' + t.boxDark + '"></rect><rect x="70" y="70" width="460" height="300" rx="24" fill="' + t.inner + '"></rect></svg>' +
tokens +
'<svg class="layer" viewBox="0 0 600 612" aria-hidden="true" style="z-index:4;pointer-events:none"><rect x="36" y="360" width="528" height="236" rx="30" fill="' + t.box + '"></rect><rect x="36" y="360" width="528" height="236" rx="30" fill="rgba(0,0,0,0.05)"></rect><rect x="26" y="340" width="548" height="44" rx="22" fill="' + t.box + '"></rect><rect x="38" y="344" width="524" height="8" rx="4" fill="rgba(255,255,255,0.35)"></rect><rect x="36" y="384" width="528" height="12" fill="rgba(0,0,0,0.08)"></rect><rect x="272" y="340" width="56" height="256" fill="' + t.ribbon + '"></rect><circle cx="300" cy="478" r="38" fill="' + t.ribbon + '"></circle><circle cx="300" cy="478" r="38" fill="none" stroke="' + t.box + '" stroke-width="3" stroke-dasharray="3 6" stroke-linecap="round"></circle><g transform="translate(282 460) scale(1.5)"><path d="' + labelPath + '" fill="' + t.boxDark + '"></path></g></svg>' +
'</div><div class="hint" style="color:' + t.muted + '">' + hint + '</div></div>' +
'<div class="info-col">' +
'<div class="eyebrow" style="color:' + t.muted + '">' + esc(cur.eyebrow) + '</div>' +
'<h3>' + esc(cur.title) + '</h3>' +
'<p class="tag" style="color:' + t.muted + '">' + esc(cur.tagline) + '</p>' +
'<div class="price-row"><span class="price" style="background:' + t.accent + ';color:' + t.accentInk + '">' + inr(cur.priceNum) + '</span>' + (cur.vary ? '<span class="price-note" style="color:' + t.muted + '">Price may vary with add-ons</span>' : '') + '</div>' +
'<div class="list-head" style="border-color:' + t.line + '"><strong>What\'s in the box</strong><span style="font-size:14px;color:' + t.muted + '">' + cur.items.length + ' items</span></div>' +
'<div class="rows">' + rows + '</div>' +
'<div class="cta-row">' +
'<button class="btn btn-theme" data-act="add" data-k="add" data-id="' + cur.id + '" style="background:' + t.accent + ';color:' + t.accentInk + '">' + (inCart ? 'Add another to cart' : 'Add to cart') + '</button>' +
'<a class="btn btn-ghost" href="' + IG + '" target="_blank" rel="noopener" style="color:' + t.ink + ';border-color:' + t.tabBorder + '">Order on Instagram</a></div>' +
(inCart ? '<p style="font-size:14px;color:' + t.muted + '">' + inCart + ' in your cart. <a href="#cart" style="font-weight:700">View cart</a></p>' : '<p style="font-size:14px;color:' + t.muted + '">Add it to your cart now and place the order whenever you\'re ready.</p>') +
'</div></div>';

$('hamperRoot').innerHTML = html;
if (restoreKey) {
var el = $('hamperRoot').querySelector('[data-k="' + restoreKey + '"]');
if (el && el.focus) el.focus({ preventScroll: true });
}
}

/* ---------- cart ---------- */
function renderCart(restoreKey) {
var root = $('cartRoot');
if (!cart.length) {
root.innerHTML = '<div class="empty"><p>Your cart is empty. Pick a hamper you like and add it here. It stays in your cart until you place the order.</p><a class="btn btn-navy" href="#hampers">Explore Hampers</a></div>';
return;
}
var anyVary = false;
var items = cart.map(function (r) {
var h = hamperById(r.id), t = THEMES[r.id];
if (h.vary) anyVary = true;
return '<article class="cart-item">' +
'<div class="ci-thumb" style="background:' + t.thumbBg + '">' + thumb(t) + '</div>' +
'<div class="ci-main"><h3>' + esc(h.name) + '</h3><span class="each">' + inr(h.priceNum) + ' each</span>' + (h.vary ? '<span class="vary">Price may vary with add-ons</span>' : '') +
'<div class="qty" role="group" aria-label="Quantity of ' + esc(h.name) + '"><button data-act="dec" data-k="dec-' + r.id + '" data-id="' + r.id + '" aria-label="Decrease quantity of ' + esc(h.name) + '">−</button><span aria-live="polite">' + r.qty + '</span><button data-act="inc" data-k="inc-' + r.id + '" data-id="' + r.id + '" aria-label="Increase quantity of ' + esc(h.name) + '">+</button></div></div>' +
'<div class="ci-side"><strong>' + inr(r.qty * h.priceNum) + '</strong><button class="link-btn" data-act="remove" data-k="rm-' + r.id + '" data-id="' + r.id + '" aria-label="Remove ' + esc(h.name) + ' from cart">Remove</button></div>' +
'</article>';
}).join('');
root.innerHTML = '<div class="cart-grid"><div class="cart-list">' + items + '</div>' +
'<aside class="summary" aria-label="Order summary"><h3>Order summary</h3>' +
'<div class="sum-row"><span>Subtotal (' + cartCount() + (cartCount() === 1 ? ' hamper' : ' hampers') + ')</span><span>' + inr(cartTotal()) + '</span></div>' +
'<div class="sum-row" style="color:#4D5B78;font-size:14px"><span>Add-ons and delivery</span><span>Confirmed on Instagram</span></div>' +
'<div class="sum-row total"><span>' + (anyVary ? 'Total (starting)' : 'Total') + '</span><span>' + inr(cartTotal()) + '</span></div>' +
'<label for="cartNote">Personalisation details</label>' +
'<textarea id="cartNote" placeholder="Names, message for the cards, photos you will send, delivery city">' + esc(note) + '</textarea>' +
'<button class="btn btn-navy" data-act="place" data-k="place">Place order</button>' +
'<p class="fineprint" style="color:#4D5B78">Placing the order saves it under My Orders and opens Instagram so you can send it to us. aurevv confirms the price and payment in the chat.</p>' +
'</aside></div>';
if (restoreKey) {
var el = root.querySelector('[data-k="' + restoreKey + '"]');
if (el && el.focus) el.focus({ preventScroll: true });
}
}
function updateBadges() {
var c = cartCount();
var cb = $('cartBadge'), ob = $('ordersBadge');
cb.textContent = c; cb.hidden = c === 0;
ob.textContent = orders.length; ob.hidden = orders.length === 0;
}
function addToCart(id, key) {
var q = qtyOf(id);
if (q >= MAX_QTY) { toast('That is the most we can take in one order. For bigger orders, message us on Instagram.'); return; }
if (q) { cart.forEach(function (r) { if (r.id === id) r.qty += 1; }); } else { cart.push({ id: id, qty: 1 }); }
persistCart(); updateBadges(); renderCart(); renderHampers(key);
toast('Added to your cart. <a href="#cart">View cart</a>');
}
function changeQty(id, d, key) {
cart.forEach(function (r) { if (r.id === id) r.qty = Math.max(1, Math.min(MAX_QTY, r.qty + d)); });
persistCart(); updateBadges(); renderCart(key); renderHampers();
}
function removeFromCart(id) {
cart = cart.filter(function (r) { return r.id !== id; });
persistCart(); updateBadges(); renderCart(); renderHampers();
toast('Removed from your cart.');
}

/* ---------- orders ---------- */
function newOrderId() {
var d = new Date();
var yy = String(d.getFullYear()).slice(2), mm = ('0' + (d.getMonth() + 1)).slice(-2), dd = ('0' + d.getDate()).slice(-2);
var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', s = '';
for (var i = 0; i < 4; i++) s += chars.charAt(Math.floor(Math.random() * chars.length));
return 'AUR-' + yy + mm + dd + '-' + s;
}
function orderMessage(o) {
var lines = ["Hi aurevv! I'd like to place an order.", '', 'Order ID: ' + o.id];
o.items.forEach(function (it) { lines.push('- ' + it.qty + ' x ' + it.name + ' (' + inr(it.price) + ' each)'); });
lines.push('Total: ' + inr(o.total) + (o.vary ? ' (may vary with add-ons)' : ''));
if (o.note) { lines.push('', 'Personalisation: ' + o.note); }
return lines.join('\n');
}
function placeOrder() {
if (!cart.length) return;
var anyVary = false;
var o = {
id: newOrderId(),
ts: Date.now(),
items: cart.map(function (r) { var h = hamperById(r.id); if (h.vary) anyVary = true; return { id: r.id, name: h.name, qty: r.qty, price: h.priceNum }; }),
total: cartTotal(),
vary: false,
note: (note || '').trim(),
payment: STATUS.payment[0], preparation: STATUS.preparation[0], delivery: STATUS.delivery[0]
};
o.vary = anyVary;
orders.unshift(o);
cart = []; note = '';
save(KEYS.orders, orders); persistCart(); save(KEYS.note, '');
copyText(orderMessage(o));
openInstagram();
updateBadges(); renderCart(); renderOrders(); renderHampers();
goTo('orders');
toast('Order ' + esc(o.id) + ' saved. The message is copied. Paste it in the Instagram chat and send.');
}
function effective(o) {
var ov = statusMap[o.id] || {};
var out = {};
['payment', 'preparation', 'delivery'].forEach(function (k) {
out[k] = STATUS[k].indexOf(ov[k]) >= 0 ? ov[k] : (STATUS[k].indexOf(o[k]) >= 0 ? o[k] : STATUS[k][0]);
});
return out;
}
var SEGMENTS = { payment: 2, preparation: 3, delivery: 3 };
var FILLED = { payment: [0, 2], preparation: [1, 2, 3], delivery: [0, 2, 3] };
function track(key, value) {
var list = STATUS[key], idx = list.indexOf(value), bar = '';
for (var i = 0; i < SEGMENTS[key]; i++) bar += '<i class="' + (i < FILLED[key][idx] ? 'on' : '') + '"></i>';
return '<div class="track"><span class="lab">' + STATUS_LABEL[key] + '</span><span class="st">' + esc(value) + '</span><div class="bar" aria-hidden="true">' + bar + '</div></div>';
}
function renderOrders() {
var root = $('ordersRoot');
if (!orders.length) {
root.innerHTML = '<div class="empty"><p>No orders yet. Orders appear here only after you place them from My Cart.</p><a class="btn btn-navy" href="#cart">Go to My Cart</a></div>';
return;
}
var list = orders.map(function (o) {
var s = effective(o);
var date = new Date(o.ts);
var when = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + date.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
var lines = o.items.map(function (it) { return '<li><span>' + it.qty + ' × ' + esc(it.name) + '</span><span>' + inr(it.qty * it.price) + '</span></li>'; }).join('');
return '<article class="order"><div class="order-top"><div><h3>' + esc(o.id) + '</h3><span class="date">' + esc(when) + '</span></div><span class="tot">' + inr(o.total) + (o.vary ? '<span style="display:block;font-size:12px;font-weight:500;color:#4D5B78;text-align:right">starting total</span>' : '') + '</span></div>' +
'<ul class="order-items">' + lines + '</ul>' +
(o.note ? '<p class="order-note"><strong>Personalisation:</strong> ' + esc(o.note) + '</p>' : '') +
'<div class="tracks">' + track('payment', s.payment) + track('preparation', s.preparation) + track('delivery', s.delivery) + '</div>' +
'<div class="order-actions"><button class="btn btn-navy" data-act="sendorder" data-oid="' + esc(o.id) + '">Send on Instagram</button><button class="btn btn-outline" data-act="copyorder" data-oid="' + esc(o.id) + '">Copy order message</button></div></article>';
}).join('');
root.innerHTML = '<div class="order-list">' + list + '</div><p class="status-note">Statuses start as "Awaiting payment", "Order received" and "Not dispatched". They change here once aurevv confirms payment and progress with you on Instagram. Orders are saved on this device and browser.</p>';
}
function findOrder(id) { for (var i = 0; i < orders.length; i++) if (orders[i].id === id) return orders[i]; return null; }
function fetchStatuses() {
if (!window.fetch) return;
fetch('status-updates.json?v=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.ok ? r.json() : {}; }).then(function (j) {
if (j && typeof j === 'object' && !Array.isArray(j)) { statusMap = j; renderOrders(); }
}).catch(function () { /* file not available, keep default statuses */ });
}

/* ---------- custom request ---------- */
function onCustomSubmit(e) {
e.preventDefault();
var form = $('customForm');
var who = $('cfWho').value, budget = $('cfBudget').value.trim(), notes = $('cfNotes').value.trim();
var picks = [].slice.call(form.querySelectorAll('input[type=checkbox]:checked')).map(function (c) { return c.value; });
var lines = ["Hi aurevv! I'd like a custom hamper.", '', 'For: ' + who];
if (budget) lines.push('Budget: ₹' + budget.replace(/[^\d,]/g, ''));
if (picks.length) lines.push('I would like: ' + picks.join(', '));
if (notes) lines.push('Details: ' + notes);
copyText(lines.join('\n'));
openInstagram();
toast('Your request is copied. Paste it in the Instagram chat and send.');
}

/* ---------- elephant and bee ---------- */
function initElephant() {
var stage = $('elephantStage'), ele = $('elephant'), bee = $('bee');
if (!stage || !ele) return;
var beeStarted = false;
function startBee() {
if (beeStarted || !bee) return;
beeStarted = true;
bee.hidden = false;
setTimeout(function () { bee.hidden = true; if (bee.parentNode) bee.parentNode.removeChild(bee); }, 10000);
}
function visible(v) {
if (v) { ele.classList.add('is-visible'); startBee(); } else { ele.classList.remove('is-visible'); }
}
if ('IntersectionObserver' in window) {
new IntersectionObserver(function (entries) { visible(entries[0].isIntersecting); }, { threshold: 0.4 }).observe(stage);
} else { visible(true); }
}

/* ---------- events ---------- */
document.addEventListener('click', function (e) {
var link = e.target.closest ? e.target.closest('a[href^="#"]') : null;
if (link) {
var id = link.getAttribute('href').slice(1);
if (id && $(id)) { e.preventDefault(); goTo(id); return; }
}
var el = e.target.closest ? e.target.closest('[data-act]') : null;
if (!el) return;
var act = el.getAttribute('data-act');
var key = e.detail === 0 ? el.getAttribute('data-k') : null;
if (act === 'tab') { st = { hid: el.getAttribute('data-hid'), sel: -1 }; renderHampers(key); }
else if (act === 'pick') { var i = parseInt(el.getAttribute('data-i'), 10); st.sel = st.sel === i ? -1 : i; renderHampers(key); }
else if (act === 'add') { addToCart(el.getAttribute('data-id'), key); }
else if (act === 'inc') { changeQty(el.getAttribute('data-id'), 1, key); }
else if (act === 'dec') { changeQty(el.getAttribute('data-id'), -1, key); }
else if (act === 'remove') { removeFromCart(el.getAttribute('data-id')); }
else if (act === 'place') { placeOrder(); }
else if (act === 'sendorder') { var o = findOrder(el.getAttribute('data-oid')); if (o) { copyText(orderMessage(o)); openInstagram(); toast('Order message copied. Paste it in the Instagram chat and send.'); } }
else if (act === 'copyorder') { var o2 = findOrder(el.getAttribute('data-oid')); if (o2) { copyText(orderMessage(o2)); toast('Order message copied.'); } }
});
document.addEventListener('input', function (e) {
if (e.target && e.target.id === 'cartNote') { note = e.target.value; save(KEYS.note, note); }
});
$('customForm').addEventListener('submit', onCustomSubmit);

/* ---------- start ---------- */
renderHampers();
renderCart();
renderOrders();
updateBadges();
initElephant();
fetchStatuses();
})();
