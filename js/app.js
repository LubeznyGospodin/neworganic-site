(() => {
const P = window.PRODUCTS, byId = id => P.find(p => p.id === id);
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const rub = n => n.toLocaleString('ru-RU') + ' ₽';
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const inStock = p => p.stock !== 'Нет в наличии';
const photo = id => `img/shot2/${String(id).padStart(2, '0')}.webp`;
const SCENE = { 0: 'ritual', 9: 'cordyceps', 20: 'reishi', 85: 'ashwa' };
// категории как на текущем сайте, у позиции их может быть несколько
const CAT = { dobavki: 'Пищевые добавки', ezhovik: 'Ежовик гребенчатый', pamyat: 'Для памяти и концентрации', immunitet: 'Для иммунитета', adaptogeny: 'Адаптогены', vitaminy: 'Витамины и БАДы', griby: 'Сушёные грибы', masla: 'Сыродавленные масла', sorbenty: 'Сорбенты', chay: 'Чай', 'palo-santo': 'Пало санто', naruzhnoe: 'Для наружного применения' };
const GOAL = { focus: 'Фокус', energy: 'Энергия', calm: 'Спокойствие', immune: 'Иммунитет', beauty: 'Красота', detox: 'Детокс' };
const FOR = { focus: 'Для ясной головы', energy: 'Для сил и выносливости', calm: 'Для спокойствия', immune: 'Для иммунитета', beauty: 'Для кожи и волос', detox: 'Для мягкого детокса' };
const STOCK = { 'Много': '#3d5444', 'Достаточно': '#7f8f63', 'Мало': '#b4846a', 'Нет в наличии': '#b9b2a6' };
const isCatalog = !!$('#catalogGrid');

/* Шапка, подвал, карточка, корзина: общие для страниц */
$('[data-header]').outerHTML = `
<header class="hbar${isCatalog ? ' solid' : ''}" id="hbar"><div class="wrap hbar__in">
  <nav class="hbar__nav" aria-label="Меню">${[['katalog.html', 'Каталог'], ['podbor.html', 'Подбор курса'], ['o-kompanii.html', 'О компании'], ['dostavka.html', 'Доставка'], ['blog.html', 'Блог'], ['kontakty.html', 'Контакты']].map(([h, t]) => `<a href="${h}"${location.pathname.endsWith(h) ? ' class="on" aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
  <button class="hbar__burger" type="button" id="burger" aria-expanded="false" aria-label="Меню"><i></i><i></i></button>
  <a class="hbar__logo" href="index.html" aria-label="New Organic, на главную"><img src="img/logo.svg" alt="New Organic"></a>
  <div class="hbar__right"><a class="hbar__tel" href="tel:+79875432546">+7 987 543-25-46</a><button class="hbar__cart" type="button" id="cartBtn" aria-label="Корзина"><svg class="bag" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg><span class="hbar__txt">Корзина (</span><span class="hbar__n" id="cartCount">0</span><span class="hbar__txt">)</span></button></div>
</div></header>
<div class="fab" id="fab"><button class="fab__menu" type="button" id="fabMenu" aria-label="Меню"><i></i><i></i></button><button class="fab__cart" type="button" id="fabCart" aria-label="Корзина"><svg class="bag" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg><span class="hbar__n" id="fabCount">0</span></button></div>`;
$('[data-footer]').outerHTML = `
<footer class="foot"><div class="wrap">
  <div class="foot__grid">
    <div><img class="foot__logo" src="img/logo.svg" alt="New Organic"><span>Грибы и травы для ясной головы и спокойного сна.</span></div>
    <div><b>Магазин</b><a href="katalog.html">Каталог</a><a href="podbor.html">Подбор курса</a><a href="dostavka.html">Доставка и оплата</a><a href="bonusy.html">Бонусная программа</a></div>
    <div><b>Компания</b><a href="o-kompanii.html">О компании</a><a href="blog.html">Блог</a><a href="kontakty.html">Контакты</a><a href="https://t.me/neworganics" target="_blank" rel="noopener">Сообщество</a></div>
    <div><b>Связь</b><a href="tel:+79875432546">+7 987 543-25-46</a><a href="mailto:hello@neworganic.online">hello@neworganic.online</a><a href="https://t.me/neworganic_support_bot" target="_blank" rel="noopener">Поддержка в Telegram</a><span>ежедневно 9:00–21:00</span></div>
    
  </div>
  <div class="foot__word" aria-hidden="true">New Organic</div>
  <div class="foot__bad">ИП Самосудов А. М., ИНН 370264492333. <a href="https://neworganic.shop/offer/" target="_blank" rel="noopener">Публичная оферта</a>. БАД. Не является лекарственным средством. Перед применением проконсультируйтесь со специалистом.</div>
</div></footer>
<div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="mName" hidden><div class="modal__box">
  <button class="x" type="button" data-close aria-label="Закрыть"></button>
  <div class="modal__img"><img id="mImg" alt=""></div>
  <div class="modal__copy"><div class="label" id="mCat"></div><h3 id="mName"></h3><div class="muted" id="mSub"></div><p id="mDesc"></p>
    <span class="pcard__stock" id="mStock"></span>
    <div class="modal__buy"><b id="mPrice"></b><button class="btn btn--solid btn--sm" type="button" id="mAdd">В корзину</button></div></div>
</div></div>
<aside class="drawer" id="drawer" aria-label="Корзина" hidden><div class="drawer__box">
  <button class="x" type="button" data-close aria-label="Закрыть"></button>
  <div class="drawer__head"><h3>Корзина</h3></div>
  <div class="ship"><div id="shipTxt"></div><div class="ship__bar"><i id="shipBar"></i></div></div>
  <div class="drawer__list" id="cartList"></div>
  <form class="drawer__form" id="order">
    <div class="drawer__total"><span>Итого</span><b id="cartTotal">0 ₽</b></div>
    <div class="seg"><label><input type="radio" name="ship" value="ozon" checked> Ozon, 250 ₽</label><label><input type="radio" name="ship" value="cdek"> СДЭК, 350 ₽</label></div>
    <input class="field" name="name" placeholder="Имя" required autocomplete="name">
    <input class="field" name="phone" type="tel" placeholder="Телефон" required autocomplete="tel">
    <label class="check"><input type="checkbox" required> <span>Согласен на обработку персональных данных</span></label>
    <button class="btn btn--solid" type="submit">Оформить заказ</button>
  </form>
  <div class="drawer__done" id="done" hidden><b>Спасибо, заказ принят</b><p class="muted">Мы напишем вам в течение часа и пришлём ссылку на оплату.</p></div>
</div></aside>
<div class="toast" id="toast" role="status"></div>`;

/* Карточка товара в сетке */
const card = (p, big) => `
  <article class="pcard${inStock(p) ? '' : ' out'}" data-reveal>
    <button class="pcard__img" type="button" data-open="${p.id}" aria-label="${p.name}, подробнее"><img src="${photo(p.id)}" alt="${p.name}, ${p.sub}" loading="lazy">${big && SCENE[p.id] ? `<img src="img/scene/s/${SCENE[p.id]}.webp" srcset="img/scene/s/${SCENE[p.id]}.webp 760w, img/scene/${SCENE[p.id]}.webp 1450w" sizes="(max-width: 820px) 100vw, 34vw" alt="" loading="lazy">` : ''}</button>
    <div class="pcard__meta"><div><div class="pcard__name">${p.name}</div><div class="pcard__for">${big ? FOR[p.goals[0]] || p.sub : p.sub}</div></div><div class="pcard__price">${rub(p.price)}</div></div>
    <div class="pcard__actions"><span class="pcard__stock" style="--sc:${STOCK[p.stock] || '#3d5444'}">${inStock(p) ? 'В наличии' : 'Нет в наличии'}</span><button class="addtext" type="button" data-add="${p.id}" ${inStock(p) ? '' : 'disabled'}>${inStock(p) ? 'В корзину' : 'Ожидаем'}</button></div>
  </article>`;

/* Карточка-модалка */
const modal = $('#modal'), drawer = $('#drawer');
function openModal(id) {
  const p = byId(id);
  $('#mImg').src = photo(id); $('#mImg').alt = p.name;
  $('#mCat').textContent = p.cats.map(c => CAT[c]).join(', '); $('#mName').textContent = p.name; $('#mSub').textContent = p.sub;
  $('#mDesc').textContent = p.desc || 'Состав и схему приёма куратор пришлёт в Telegram.';
  $('#mStock').textContent = inStock(p) ? 'В наличии' : 'Нет в наличии'; $('#mStock').style.setProperty('--sc', STOCK[p.stock] || '#3d5444');
  $('#mPrice').textContent = rub(p.price);
  const b = $('#mAdd'); b.disabled = !inStock(p); b.textContent = inStock(p) ? 'В корзину' : 'Ожидаем поставку';
  b.onclick = () => { add(id); close(); };
  modal.hidden = false; document.body.style.overflow = 'hidden';
  $('.modal__box').scrollTop = 0; $('.modal__box').style.transform = '';
}
function close() { modal.hidden = true; drawer.hidden = true; document.body.style.overflow = ''; }
$$('[data-close]').forEach(b => b.onclick = close);
[modal, drawer].forEach(el => el.addEventListener('click', e => { if (e.target === el) close(); }));
addEventListener('keydown', e => e.key === 'Escape' && close());
// телефон: карточку можно смахнуть вниз, если она пролистана к самому верху
{
  const box = $('.modal__box'); let y0 = null, dy = 0;
  box.addEventListener('touchstart', e => { y0 = box.scrollTop <= 0 ? e.touches[0].clientY : null; dy = 0; box.style.transition = 'none'; }, { passive: true });
  box.addEventListener('touchmove', e => { if (y0 == null) return; dy = Math.max(0, e.touches[0].clientY - y0); if (dy > 0) box.style.transform = `translateY(${dy}px)`; }, { passive: true });
  box.addEventListener('touchend', () => {
    if (y0 == null) return; y0 = null; box.style.transition = 'transform .45s var(--soft)';
    if (dy > 110) { box.style.transform = 'translateY(100%)'; setTimeout(close, 300); } else box.style.transform = '';
  });
}
document.addEventListener('click', e => {
  const o = e.target.closest('[data-open]'), a = e.target.closest('[data-add]');
  if (o) openModal(+o.dataset.open);
  if (a && !a.disabled) add(+a.dataset.add);
});

/* Корзина */
const FREE = 4000;
let cart = JSON.parse(localStorage.getItem('no_cart') || '{}');
const save = () => localStorage.setItem('no_cart', JSON.stringify(cart));
function add(id, q = 1, quiet) {
  if (!inStock(byId(id))) return;
  cart[id] = (cart[id] || 0) + q; if (cart[id] <= 0) delete cart[id];
  save(); renderCart();
  if (!quiet && q > 0) toast(`${byId(id).name} в корзине`);
}
function renderCart() {
  const ids = Object.keys(cart).map(Number).filter(byId), total = ids.reduce((s, id) => s + byId(id).price * cart[id], 0);
  const nItems = ids.reduce((s, id) => s + cart[id], 0);
  $('#cartCount').textContent = $('#fabCount').textContent = nItems;
  $('#hbar').classList.toggle('has-items', nItems > 0); $('#fab').classList.toggle('has-items', nItems > 0);
  $('#cartList').innerHTML = ids.length ? ids.map(id => { const p = byId(id); return `<div class="line"><img src="${photo(id)}" alt=""><div><b>${p.name}</b><small>${p.sub}, ${rub(p.price)}</small></div><div class="qty"><button type="button" data-q="${id}" data-d="-1" aria-label="Меньше">−</button>${cart[id]}<button type="button" data-q="${id}" data-d="1" aria-label="Больше">+</button></div></div>`; }).join('') : '<div class="empty">В корзине пока пусто</div>';
  $('#cartTotal').textContent = rub(total);
  const left = FREE - total;
  $('#shipTxt').textContent = left > 0 ? `До бесплатной доставки ${rub(left)}` : 'Доставка бесплатная';
  $('#shipBar').style.width = clamp(total / FREE * 100, 0, 100) + '%';
  $('#order').hidden = !ids.length;
}
$('#cartList').onclick = e => { const b = e.target.closest('[data-q]'); if (b) add(+b.dataset.q, +b.dataset.d, true); };
$('#cartBtn').onclick = () => { $('#done').hidden = true; renderCart(); drawer.hidden = false; document.body.style.overflow = 'hidden'; };
$('#order').onsubmit = e => {
  e.preventDefault();
  // ponytail: заказ лежит в localStorage, в рабочей версии форма уйдёт в CRM магазина
  const f = new FormData(e.target), orders = JSON.parse(localStorage.getItem('no_orders') || '[]');
  orders.push({ at: new Date().toISOString(), cart, name: f.get('name'), phone: f.get('phone'), ship: f.get('ship') });
  localStorage.setItem('no_orders', JSON.stringify(orders));
  cart = {}; save(); renderCart(); e.target.reset(); $('#order').hidden = true; $('#done').hidden = false;
};
renderCart();
let tt; function toast(t) { const el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => el.classList.remove('on'), 2200); }

/* Шапка и проявления */
const hbar = $('#hbar');
$('#burger').onclick = () => { const o = hbar.classList.toggle('open'); $('#burger').setAttribute('aria-expanded', o); hbar.classList.add('solid'); };
$$('.hbar__nav a').forEach(a => a.addEventListener('click', () => hbar.classList.remove('open')));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
const reveal = () => $$('[data-reveal]:not(.in)').forEach(el => io.observe(el));

/* Телефон: шапка уезжает вверх, пока листаете вниз, и возвращается при прокрутке вверх.
   Вместо неё внизу справа плавает стеклянная капсула с меню и корзиной, место под контент освобождается */
const mqPhone = matchMedia('(max-width: 820px)'); let lastY = scrollY;
addEventListener('scroll', () => {
  const y = scrollY; if (Math.abs(y - lastY) < 8) return;
  document.documentElement.classList.toggle('hdr-hide', mqPhone.matches && y > 140 && y > lastY && !hbar.classList.contains('open'));
  lastY = y;
}, { passive: true });
$('#fabMenu').onclick = () => { document.documentElement.classList.remove('hdr-hide'); lastY = scrollY; if (!hbar.classList.contains('open')) $('#burger').click(); };
$('#fabCart').onclick = () => $('#cartBtn').click();

/* Жидкое стекло: преломление фона по краям. Карта смещения растягивается на кнопку целиком.
   url() в backdrop-filter понимает только Chromium, остальным оставляем обычное стекло. */
if (/Chrome\//.test(navigator.userAgent)) {
  document.body.insertAdjacentHTML('beforeend', '<svg width="0" height="0" style="position:absolute" aria-hidden="true"><filter id="lglass" x="0" y="0" width="1" height="1" primitiveUnits="objectBoundingBox" color-interpolation-filters="sRGB"><feImage href="img/glass-map.png" x="0" y="0" width="1" height="1" preserveAspectRatio="none" result="map"/><feDisplacementMap in="SourceGraphic" in2="map" scale="0.14" xChannelSelector="R" yChannelSelector="G"/></filter></svg>');
  document.documentElement.classList.add('refract');
}
/* Жидкое стекло: блик на кнопке плывёт за курсором */
document.addEventListener('pointermove', e => {
  const b = e.target.closest?.('.btn'); if (!b) return;
  const r = b.getBoundingClientRect();
  b.style.setProperty('--mx', (e.clientX - r.left) + 'px'); b.style.setProperty('--my', (e.clientY - r.top) + 'px');
}, { passive: true });

/* ===== Каталог ===== */
if (isCatalog) {
  const st = { cat: 'all', goal: 'all', q: '', sort: 'pop', stock: false };
  const params = new URLSearchParams(location.search);
  if (GOAL[params.get('goal')]) st.goal = params.get('goal');
  if (CAT[params.get('cat')]) st.cat = params.get('cat');
  const chip = (k, t, on) => `<button class="fchip" type="button" data-k="${k}" aria-pressed="${on}">${t}</button>`;
  $('#cats').innerHTML = [['all', 'Все'], ...Object.entries(CAT)].map(([k, t]) => chip(k, t, k === st.cat)).join('');
  $('#goals').innerHTML = [['all', 'Любая'], ...Object.entries(GOAL)].map(([k, t]) => chip(k, t, k === st.goal)).join('');
  $('#sort').innerHTML = [['pop', 'Сначала популярные'], ['asc', 'Сначала дешевле'], ['desc', 'Сначала дороже']].map(([k, t]) => chip(k, t, k === st.sort)).join('');
  const plural = n => n % 10 === 1 && n % 100 !== 11 ? 'позиция' : [2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100) ? 'позиции' : 'позиций';
  function render() {
    let L = P.filter(p => (st.cat === 'all' || p.cats.includes(st.cat)) && (st.goal === 'all' || p.goals.includes(st.goal)) && (!st.stock || inStock(p)) && (!st.q || (p.name + ' ' + p.full + ' ' + p.sub).toLowerCase().includes(st.q)));
    // популярность: сначала хиты по числу оценок на WB, дальше как на текущем сайте
    const TOP = [0, 1, 32, 9, 10, 20, 85, 16, 40, 4, 6, 24], rank = p => { const i = TOP.indexOf(p.id); return i < 0 ? 100 + p.id : i; };
    if (st.sort === 'pop') L = [...L].sort((a, b) => rank(a) - rank(b));
    if (st.sort === 'asc') L = [...L].sort((a, b) => a.price - b.price);
    if (st.sort === 'desc') L = [...L].sort((a, b) => b.price - a.price);
    $('#count').textContent = `${L.length} ${plural(L.length)}`;
    $('#reset').hidden = st.cat === 'all' && st.goal === 'all' && !st.q && !st.stock && st.sort === 'pop';
    $('#catalogGrid').innerHTML = L.length ? L.map(p => card(p)).join('') : '<div class="empty-res">Ничего не нашли. Напишите куратору в Telegram, и мы подскажем.</div>';
    reveal();
  }
  const press = (box, k) => $$(`${box} button`).forEach(b => b.setAttribute('aria-pressed', b.dataset.k === k));
  [['#cats', 'cat'], ['#goals', 'goal'], ['#sort', 'sort']].forEach(([box, key]) => $(box).onclick = e => { const b = e.target.closest('button'); if (!b) return; st[key] = b.dataset.k; press(box, st[key]); render(); });
  $('#stockOnly').onchange = e => { st.stock = e.target.checked; render(); };
  $('#q').oninput = e => { st.q = e.target.value.trim().toLowerCase(); render(); };
  $('#reset').onclick = () => { Object.assign(st, { cat: 'all', goal: 'all', q: '', sort: 'pop', stock: false }); $('#q').value = ''; $('#stockOnly').checked = false; press('#cats', 'all'); press('#goals', 'all'); press('#sort', 'pop'); render(); };
  const fbar = $('#fbar'), more = $('#fmore'), tog = $('#ftoggle');
  const setOpen = o => { more.classList.toggle('open', o); tog.setAttribute('aria-expanded', o); };
  tog.onclick = () => setOpen(!more.classList.contains('open'));
  if (st.goal !== 'all') setOpen(true);
  document.addEventListener('pointerdown', e => { if (!fbar.contains(e.target)) setOpen(false); });
  const sentinel = document.createElement('div'); fbar.before(sentinel);
  new IntersectionObserver(([e]) => fbar.classList.toggle('stuck', !e.isIntersecting), { rootMargin: '-90px 0px 0px 0px' }).observe(sentinel);
  render();
  return;
}

/* ===== Блоки страниц: каждый включается, только если он есть на странице ===== */
const solid = () => hbar.classList.toggle('solid', !$('#hero') || scrollY > innerHeight * .6 || hbar.classList.contains('open'));
addEventListener('scroll', solid, { passive: true }); solid();
const onScroll = [];
let ticking = false;
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; onScroll.forEach(f => f()); }); } }, { passive: true });


/* С главной внутренние страницы открываются в новой вкладке (и меню, и карточки, что дорисовываются позже) */
if ($('#hero')) document.addEventListener('click', e => {
  const a = e.target.closest('a[href]'); if (!a) return;
  const u = new URL(a.href, location.href);
  if (u.origin === location.origin && /\.html$/.test(u.pathname) && !/index\.html$/.test(u.pathname)) { a.target = '_blank'; a.rel = 'noopener'; }
}, true);

/* Герой: за курсором ходит тёплое солнце, в луче плавает золотая пыль.
   Наведите на банку (или тапните): крышка откручивается, банка наклоняется, выпадают капсулы, сцена так и остаётся.
   Открытие играет отдельный ролик поверх фона, потом его сменяет зацикленный хвост (последние секунды вперёд-назад). */
if ($('#hero')) {
  const heroEl = $('#hero'), media = $('.hero__media'), hv = $('#heroVideo'), poster = $('#heroPoster'), sun = $('#heroSun');
  const cv = $('#motes'), cx = cv.getContext('2d'), hint = $('#mushHint'), jar = $('#jarHit');
  const vOpen = $('#heroOpen'), vRest = $('#heroRest'), endImg = $('#heroEnd');
  // на телефоне свои ролики: кадр обрезан под вертикальный экран (x 560–1720 из 1920) и ужат до 720 px, они в 3 раза легче
  const MOB = matchMedia('(max-width: 820px)').matches, DIR = MOB ? 'media/hero/m/' : 'media/hero/';
  const G = MOB ? { cx: 560, k: 720 / 1160, w: 720, h: 670 } : { cx: 0, k: 1, w: 1920, h: 1080 };
  const loadOpen = () => { if (!vOpen.src) { vOpen.src = DIR + 'open.mp4'; vOpen.preload = 'auto'; vRest.src = DIR + 'open_rest.mp4'; vRest.preload = 'auto'; } };
  if (!reduce) {
    hv.src = DIR + 'leaf.mp4';
    hv.addEventListener('canplaythrough', () => hv.play().catch(() => {}), { once: true });
    // ролики банки качаем сразу за фоном, лес ждёт их (см. heroReady). iOS заранее видео не грузит, поэтому там ждём недолго
    hv.addEventListener('canplaythrough', loadOpen, { once: true }); setTimeout(loadOpen, 2500);
    window.heroReady = new Promise(r => { vOpen.addEventListener('canplaythrough', r, { once: true }); setTimeout(r, MOB ? 2500 : 5000); });
  }
  let heroOn = true, inside = false, sx = .72, sy = .32, tsx = .72, tsy = .32, opened = false;
  const live = () => opened ? (vRest.classList.contains('on') ? vRest : vOpen) : hv;
  new IntersectionObserver(([e]) => { heroOn = e.isIntersecting; if (!reduce) heroOn ? live().play().catch(() => {}) : live().pause(); }).observe(heroEl);
  const fine = matchMedia('(pointer: fine)').matches, dpr = Math.min(2, devicePixelRatio || 1);

  // где банка в кадре видео 1920×1080; для телефонного ролика пересчитываем через G
  const R0 = { x: 1215, y: 280, w: 345, h: 590 };
  const R = { x: (R0.x - G.cx) * G.k, y: R0.y * G.k, w: R0.w * G.k, h: R0.h * G.k };
  let W, H;
  const layout = () => {
    W = cv.width = heroEl.clientWidth * dpr; H = cv.height = heroEl.clientHeight * dpr;
    const cw = media.clientWidth, ch = media.clientHeight, s = Math.max(cw / G.w, ch / G.h);
    const [px, py] = getComputedStyle(hv).objectPosition.split(' ').map(v => parseFloat(v) / 100);
    const ox = (cw - G.w * s) * px, oy = media.offsetTop + (ch - G.h * s) * py;
    Object.assign(jar.style, { left: ox + R.x * s + 'px', top: oy + R.y * s + 'px', width: R.w * s + 'px', height: R.h * s + 'px' });
    hint.style.left = (ox + (R.x + 30 * G.k) * s) + 'px'; hint.style.top = (oy + (R.y - 120 * G.k) * s) + 'px';
  };
  let lastCW = 0, lastCH = 0;
  addEventListener('resize', layout);

  // если видео не заиграло (iOS в энергосбережении запрещает), показываем финальный кадр картинкой
  const showEnd = () => { if (vOpen.classList.contains('on')) return; endImg.src = DIR + 'open_end.webp'; endImg.onload = () => endImg.classList.add('on'); };
  function openJar() {
    if (opened || reduce) return; opened = true;
    hint.classList.remove('on'); jar.style.cursor = 'default';
    loadOpen();
    vOpen.currentTime = 0;
    vOpen.addEventListener('playing', () => vOpen.classList.add('on'), { once: true });
    vOpen.play().catch(showEnd);
    setTimeout(showEnd, 6000);
  }
  vOpen.addEventListener('ended', () => { vRest.currentTime = 0; vRest.play().catch(() => {}); vRest.classList.add('on'); hv.pause(); });
  jar.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') openJar(); });
  jar.addEventListener('click', openJar);
  // подсказку показываем, только когда ролик открытия уже скачан, иначе наведение ничего не даст
  const showHint = () => { if (!opened && !reduce) hint.classList.add('on'); };
  vOpen.addEventListener('canplaythrough', () => setTimeout(showHint, 800), { once: true });
  if (!fine) setTimeout(showHint, 2600); // на телефоне ролик грузится по тапу, ждать его не нужно
  heroEl.addEventListener('pointermove', e => {
    const hr = heroEl.getBoundingClientRect(); tsx = (e.clientX - hr.left) / hr.width; tsy = (e.clientY - hr.top) / hr.height; inside = true;
  });
  heroEl.addEventListener('pointerleave', () => { inside = false; });

  const motes = Array.from({ length: innerWidth < 820 ? 36 : 80 }, () => ({ x: Math.random(), y: Math.random(), r: .5 + Math.random() * 1.6, vx: 0, vy: -.00005 - Math.random() * .00012, ph: Math.random() * 6.28 }));
  const frame = t => {
    requestAnimationFrame(frame);
    if (!heroOn) return;
    if (media.clientWidth !== lastCW || media.clientHeight !== lastCH) { lastCW = media.clientWidth; lastCH = media.clientHeight; layout(); }
    if (reduce) return;
    // солнце и пыль
    if (!fine || !inside) { tsx = .68 + Math.sin(t / 6000) * .14; tsy = .3 + Math.cos(t / 8000) * .1; }
    sx += (tsx - sx) * .045; sy += (tsy - sy) * .045;
    sun.style.setProperty('--sx', (sx * 100).toFixed(1) + '%'); sun.style.setProperty('--sy', (sy * 100).toFixed(1) + '%');
    cx.clearRect(0, 0, W, H);
    for (const m of motes) {
      const dx = m.x - sx, dy = (m.y - sy) * 1.4, d = Math.hypot(dx, dy);
      if (d < .12) { m.vx += dx * .0003; m.vy += dy * .0002; }
      m.vx *= .97; m.vy = m.vy * .985 - .0000025;
      m.x += m.vx + Math.sin(t / 2600 + m.ph) * .0001; m.y += m.vy;
      if (m.y < -.03) { m.y = 1.03; m.x = Math.random(); } if (m.x < -.03) m.x = 1.03; if (m.x > 1.03) m.x = -.03;
      const a = clamp(.06 + (1 - d * 2.2) * .75, 0, .8) * (.75 + .25 * Math.sin(t / 900 + m.ph));
      if (a <= .01) continue;
      cx.beginPath(); cx.fillStyle = `rgba(255, 232, 186, ${a.toFixed(3)})`; cx.arc(m.x * W, m.y * H, m.r * dpr, 0, 6.283); cx.fill();
    }
  };
  requestAnimationFrame(frame);
}

/* О нас: лес на весь экран, камера идёт к ежовику, фразы внизу сменяются по ходу */
if ($('#about')) {
  const about = $('#about'), lines = $$('.about__line');
  const wide = innerWidth > 820;
  const forest = new ScrollFrames({ canvas: $('#forestCanvas'), scroller: about, dir: wide ? 'media/forest/w' : 'media/forest/m', meta: { frames: 160, pattern: 'frame_%04d.webp', width: wide ? 1280 : 960, height: wide ? 720 : 540 }, fit: 'cover', mobileStride: 2 });
  // лес (12 МБ кадров) начинаем качать, когда первый экран и банка готовы, или раньше, если до леса уже докрутили
  let fStarted = false; const fStart = () => { if (!fStarted) { fStarted = true; forest.start(); } };
  (window.heroReady || Promise.resolve()).then(fStart);
  // блок стоит вплотную под первым экраном, поэтому «рядом» считаем только после настоящей прокрутки
  onScroll.push(() => { if (!fStarted && scrollY > 40 && about.getBoundingClientRect().top < innerHeight * 1.5) fStart(); });
  let ln = -1;
  onScroll.push(() => {
    const p = clamp(-about.getBoundingClientRect().top / (about.offsetHeight - innerHeight), 0, 1);
    const k = Math.min(lines.length - 1, Math.floor(p * lines.length * .999));
    if (k !== ln) { ln = k; lines.forEach((l, i) => l.classList.toggle('on', i === k)); }
    $('#aboutBar').style.transform = `scaleX(${p.toFixed(3)})`;
  });
}

/* Хиты */
if ($('#trio')) $('#trio').innerHTML = [0, 9, 20].map(id => card(byId(id), true)).join('');

/* История: фото слева меняется по шагам справа */
if ($('#story')) {
  const sImgs = $$('#storyMedia img'), steps = $$('.step');
  // на телефоне у каждого шага своя фотография над текстом
  steps.forEach((st, i) => { const im = sImgs[i].cloneNode(); im.className = 'step__img'; im.loading = 'lazy'; st.prepend(im); });
  let sNow = 0;
  onScroll.push(() => {
    let k = 0; steps.forEach((s, i) => { if (s.getBoundingClientRect().top < innerHeight * .55) k = i; });
    if (k !== sNow) { sNow = k; sImgs.forEach((im, i) => im.classList.toggle('on', i === k)); }
  });
}

/* Подбор по цели: на главной и на странице подбора */
if ($('#goals') && $('#kit')) {
  const HOW_EZH = 'Ежовик утром за 30 минут до завтрака и до 14:00.';
  const HOW_ASK = 'Схему под ваш режим бесплатно подскажет куратор.';
  const GOALS = [
    { k: 'focus', t: 'Фокус', s: 'ежовик и гинкго', h: 'Ясная голова на работе и учёбе', x: 'Ежовик выбирают те, кто держит в голове десятки задач. Гинкго добавляют, когда много приходится запоминать.', kit: [0, 16], how: HOW_EZH },
    { k: 'energy', t: 'Энергия', s: 'кордицепс и ежовик', h: 'Силы до вечера', x: 'Кордицепс любят спортсмены и все, у кого запал заканчивается к обеду. С ежовиком его можно пить в один приём.', kit: [9, 1], how: HOW_ASK },
    { k: 'sleep', t: 'Сон', s: 'рейши и ашваганда', h: 'Спокойный крепкий сон', x: 'Рейши и ашваганду берут, когда трудно уснуть, а утром встаёшь разбитым.', kit: [20, 85], how: HOW_ASK },
    { k: 'calm', t: 'Спокойствие', s: 'ежовик и ашваганда', h: 'Меньше нервов', x: 'Покупатели пишут, что с ежовиком стали спокойнее и реже срываются по мелочам. К нему часто берут ашваганду.', kit: [1, 86], how: HOW_EZH },
    { k: 'immune', t: 'Иммунитет', s: 'шиитаке и траметес', h: 'Своя защита в сезон простуд', x: 'Шиитаке и траметес Восток ценит веками. Осенью наши покупатели берут их чаще всего.', kit: [40, 21], how: HOW_ASK },
    { k: 'beauty', t: 'Красота', s: 'коллаген и комплекс', h: 'Кожа, волосы, ногти', x: 'Коллаген с витамином С и комплекс для волос, кожи и ногтей покупатели берут вместе, курсом.', kit: [6, 22], how: HOW_ASK },
  ];
  let kitIds = [], kt;
  $('#goals').innerHTML = GOALS.map((g, i) => `<button class="goal" type="button" role="tab" data-i="${i}">${g.t}<small>${g.s}</small></button>`).join('');
  const pick = (i, first) => {
    const g = GOALS[i], kit = $('#kit');
    $$('.goal').forEach((b, k) => { b.classList.toggle('on', k === i); b.setAttribute('aria-selected', k === i); });
    kit.classList.add('fade'); clearTimeout(kt);
    kt = setTimeout(() => {
      kitIds = g.kit;
      $('#kImgs').innerHTML = g.kit.map(id => `<button type="button" data-open="${id}" aria-label="${byId(id).name}"><img src="${photo(id)}" alt="${byId(id).name}"></button>`).join('');
      $('#kTitle').textContent = g.h; $('#kText').textContent = g.x; $('#kHow').textContent = g.how;
      $('#kSum').textContent = rub(g.kit.reduce((s, id) => s + byId(id).price, 0));
      kit.classList.remove('fade');
    }, first || reduce ? 0 : 450);
  };
  // на главной секция закреплена, и цель выбирает скролл; клик по цели прокручивает к её месту
  const pin = $('#pick.pin'), pinOn = () => pin && matchMedia('(min-width: 821px) and (min-height: 640px)').matches;
  let cur = -1;
  const pinPos = () => { const r = pin.getBoundingClientRect(); return [r.top, pin.offsetHeight - innerHeight]; };
  if (pin) onScroll.push(() => {
    if (!pinOn()) return;
    const [top, len] = pinPos(), i = Math.min(GOALS.length - 1, Math.floor(clamp(-top / len, 0, .999) * GOALS.length));
    if (i !== cur) { cur = i; pick(i); }
  });
  // телефон: цели лентой под карточкой; какая цель встала по центру ленты, тот набор и показываем
  const gl = $('#goals'), phone = () => matchMedia('(max-width: 820px)').matches;
  let gt, gCur = 0;
  const centerChip = b => gl.scrollTo({ left: b.offsetLeft - (gl.clientWidth - b.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
  gl.addEventListener('scroll', () => {
    if (!phone()) return; clearTimeout(gt);
    gt = setTimeout(() => {
      const mid = gl.scrollLeft + gl.clientWidth / 2; let best = 0, bd = 1e9;
      gl.querySelectorAll('.goal').forEach((b, k) => { const d = Math.abs(b.offsetLeft + b.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = k; } });
      if (best !== gCur) { gCur = best; pick(best); }
    }, 110);
  }, { passive: true });
  $('#goals').onclick = e => {
    const b = e.target.closest('.goal'); if (!b) return;
    const i = +b.dataset.i;
    if (phone()) { gCur = i; pick(i); return centerChip(b); }
    if (!pinOn()) return pick(i);
    const [top, len] = pinPos();
    scrollTo({ top: scrollY + top + len * (i + .5) / GOALS.length, behavior: reduce ? 'auto' : 'smooth' });
  };
  $('#kAdd').onclick = () => { kitIds.forEach(id => add(id, 1, true)); toast('Набор в корзине'); };
  const want = GOALS.findIndex(g => g.k === location.hash.slice(1));
  pick(want < 0 ? 0 : want, true);
}

/* Отзывы: одна цитата, мягкая смена */
if ($('#quote')) {
  const Q = [
    ['Нет тумана в голове и хорошая концентрация в работе и за рулём.', 'Ежовик, ноябрь 2025'],
    ['Сны снятся очень интересные, будто фильм всю ночь смотришь. Я стала крепко спать и высыпаться.', 'Кордицепс, ноябрь 2025'],
    ['Не ожидал, но реально рабочая штука. Стал спокойнее, и сон получше.', 'Ежовик в таблетках, май 2026'],
    ['Чувствую себя более энергичной и выносливой, особенно во время силовых тренировок и плавания.', 'Кордицепс, декабрь 2024'],
    ['Прислали не ту позицию. Написал в поддержку, ребята сразу ответили и бесплатно отправили новую баночку.', 'Ежовик'],
    ['Пью на марафоне от New Organic. Поддержка экспертов, быстро отвечают на все вопросы.', 'Марафон по биохакингу, март 2025'],
  ];
  $('#quote').innerHTML = Q.map(([t, c]) => `<figure><blockquote>«${t}»</blockquote><figcaption>${c}</figcaption></figure>`).join('');
  $('#qdots').innerHTML = Q.map((_, i) => `<button type="button" aria-label="Отзыв ${i + 1}"></button>`).join('');
  const qf = $$('#quote figure'), qd = $$('#qdots button');
  let qi = 0, qt;
  const quote = i => { qi = (i + Q.length) % Q.length; qf.forEach((f, k) => f.classList.toggle('on', k === qi)); qd.forEach((d, k) => d.classList.toggle('on', k === qi)); clearTimeout(qt); if (!reduce) qt = setTimeout(() => quote(qi + 1), 7000); };
  $('#qdots').onclick = e => { const b = e.target.closest('button'); if (b) quote(qd.indexOf(b)); };
  quote(0);
}

onScroll.forEach(f => f());
reveal();
})();
