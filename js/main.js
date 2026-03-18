/* ═══════════════════════════════════════
   BIRTHDAY SITE — main.js
   Requires GSAP + ScrollTrigger (CDN)
═══════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ══ SUPABASE INIT ════════════════════════ */
const SUPABASE_URL = 'https://uhnynivvdiyptfqafqda.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVobnluaXZ2ZGl5cHRmcWFmcWRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NjkzMzAsImV4cCI6MjA4OTQ0NTMzMH0.uun0-0cekYqHSjPQHJSHR1W4XC5lO40a7Euxo44_Y_k';
const supabaseClient = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

/* ══ CURSOR ══════════════════════════════ */
(function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
    }

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    const dx = (mouseX - cx) * 0.05;
    const dy = (mouseY - cy) * 0.05;

    // Hero Orbs parallax
    gsap.to('.hero-orb-1', { x: dx, y: dy, duration: 1, ease: 'power2.out' });
    gsap.to('.hero-orb-2', { x: -dx * 1.5, y: -dy * 1.5, duration: 1.5, ease: 'power2.out' });
    gsap.to('.hero-orb-3', { x: dx * 0.8, y: dy * 1.2, duration: 2, ease: 'power2.out' });

    // Photo decor parallax
    gsap.to('.pd-1', { x: -dx * 0.5, y: -dy * 0.5, duration: 1, ease: 'power1.out' });
    gsap.to('.pd-2', { x: dx * 0.6, y: -dy * 0.6, duration: 1.2, ease: 'power1.out' });
    gsap.to('.pd-3', { x: -dx * 0.4, y: dy * 0.7, duration: 1.5, ease: 'power1.out' });
  });

  // Smooth follower
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hide on mobile
  if (window.matchMedia('(pointer: coarse)').matches) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    document.body.style.cursor = 'auto';
  }
})();


/* ══ LOADER ══════════════════════════════ */
(function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('loader-bar');
  const chars = document.querySelectorAll('#loader-text span:not(.loader-gap)');
  const date = loader.querySelector('.loader-date');

  // Animate bar
  let progress = 0;
  const barInterval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) { progress = 100; clearInterval(barInterval); }
    bar.style.width = progress + '%';
  }, 80);

  // Chars stagger in
  gsap.to(chars, {
    y: 0, opacity: 1,
    duration: 0.6,
    stagger: 0.045,
    ease: 'power3.out',
    delay: 0.2,
    onComplete: () => {
      gsap.to(date, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
    }
  });

  // Set initial state
  gsap.set(chars, { y: 60, opacity: 0 });
  gsap.set(date, { opacity: 0, y: 10 });

  let exited = false;
  const exitLoader = () => {
    if (exited) return;
    exited = true;
    gsap.to(loader, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        initReveal();
      }
    });
  };

  // After ~2s, exit
  setTimeout(exitLoader, 2200);

  // Fallback 4s
  setTimeout(exitLoader, 4000);
})();


/* ══ COUNTDOWN ═══════════════════════════ */
(function initCountdown() {
  const target = new Date('2026-03-23T14:00:00');
  function tick() {
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      document.getElementById('countdown').innerHTML =
        '<div style="font-family:\'Syne\',sans-serif;font-size:2rem;font-weight:800;color:var(--rose)">🎉 Сегодня!</div>';
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    document.getElementById('cd-d').textContent = String(d).padStart(2, '0');
    document.getElementById('cd-h').textContent = String(h).padStart(2, '0');
    document.getElementById('cd-m').textContent = String(m).padStart(2, '0');
    document.getElementById('cd-s').textContent = String(s).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
})();


/* ══ SCROLL REVEAL ═══════════════════════ */
function initReveal() {
  const items = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach((el, i) => {
    // Stagger siblings
    const parent = el.parentElement;
    const siblings = [...parent.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')];
    const idx = siblings.indexOf(el);
    el.style.transitionDelay = (idx * 0.1) + 's';
    observer.observe(el);
  });

  // Easter egg
  const title = document.getElementById('hero-title');
  if (title) {
    title.addEventListener('click', () => {
      let clicks = parseInt(title.getAttribute('data-clicks') || '0') + 1;
      title.setAttribute('data-clicks', clicks);
      if (clicks >= 5) {
        title.setAttribute('data-clicks', '0');
        playTick();
        launchConfetti();
      }
    });
  }

  // Hero items reveal immediately
  document.querySelectorAll('.hero .reveal-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), 300 + i * 120);
  });

  // Timeline Dot Pop
  document.querySelectorAll('.t-dot').forEach(el => {
    gsap.fromTo(el,
      { scale: 0 },
      {
        scale: 1,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: el, start: 'top 85%' }
      }
    );
  });

  // Timeline Scroll progress
  const tLine = document.querySelector('.timeline-line');
  if (tLine) {
    gsap.fromTo(tLine,
      { background: 'var(--border)' },
      {
        background: 'var(--rose)',
        scrollTrigger: {
          trigger: '.timeline',
          start: 'top center',
          end: 'bottom center',
          scrub: true
        }
      }
    );
  }

  // Window scroll features
  const header = document.querySelector('.site-header');
  const scrollTopBtn = document.getElementById('scroll-top');
  const scrollProg = document.getElementById('scroll-progress');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = [...navLinks].map(link => document.querySelector(link.getAttribute('href')));

  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;

    // Progress bar
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProg) scrollProg.style.width = (y / maxScroll * 100) + '%';

    // Scroll To Top
    if (scrollTopBtn) {
      if (y > 500) scrollTopBtn.classList.add('visible');
      else scrollTopBtn.classList.remove('visible');
    }

    // Nav Sticky
    if (header) {
      if (y > 100 && y > lastScrollY) {
        header.classList.add('nav-hidden');
      } else {
        header.classList.remove('nav-hidden');
      }
    }
    lastScrollY = y;

    // Active link highlighting
    let current = '';
    sections.forEach(sec => {
      if (!sec) return;
      const top = sec.offsetTop - 150;
      if (y >= top) current = '#' + sec.getAttribute('id');
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === current) {
        link.classList.add('active');
      }
    });

  }, { passive: true });
}


/* ══ 3D CARD TILT ════════════════════════ */
(function initTilt() {
  const cards = document.querySelectorAll('.tilt-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2); // -1 to 1
      const dy = (e.clientY - cy) / (rect.height / 2); // -1 to 1
      const rotX = -dy * 12;
      const rotY = dx * 12;
      card.style.transform =
        `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => card.style.transition = '', 500);
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.15s ease';
    });
  });
})();


/* ══ MAGNETIC BUTTONS ═════════════════════ */
(function initMagnetic() {
  const btns = document.querySelectorAll('.magnetic-btn');
  btns.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.3;
      const dy = (e.clientY - cy) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s ease';
      setTimeout(() => btn.style.transition = '', 400);
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.transition = 'transform 0.1s ease';
    });
  });
})();


/* ══ TAG BUTTONS ═════════════════════════ */
function toggleTag(el) {
  el.classList.toggle('active');
}


/* ══ FORM SUBMIT ═════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  ['f-name', 'f-note', 'm-track', 'm-author'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', function () {
      if (this.value.trim().length > 0) this.classList.add('valid');
      else this.classList.remove('valid');
    });
  });
});

async function submitForm() {
  const name = document.getElementById('f-name').value.trim();
  if (!name) {
    const input = document.getElementById('f-name');
    input.focus();
    input.style.borderColor = 'var(--rose)';
    input.style.boxShadow = '0 0 0 3px rgba(240,62,110,0.25)';
    gsap.to(input, {
      x: [-8, 8, -6, 6, -4, 4, 0],
      duration: 0.4,
      ease: 'none'
    });
    return;
  }

  const alco = [...document.querySelectorAll('#alco-group .active')].map(e => e.textContent.trim()).join(', ');
  const food = [...document.querySelectorAll('#food-group .active')].map(e => e.textContent.trim()).join(', ');
  const note = document.getElementById('f-note').value.trim();

  // Telegram Notification
  const text = `🎉 *Новая анкета\!*\n\n👤 *Имя:* ${name}\n🍷 *Алкоголь:* ${alco || 'Нет'}\n🥩 *Еда:* ${food || 'Нет'}\n📝 *Пожелания:* ${note || 'Нет'}`;
  try {
    fetch('https://api.telegram.org/bot8604572335:AAFzNyOFVntFymyKo73LH70ZOXf3S-3vew8/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: '482123499', text, parse_mode: 'MarkdownV2' })
    });
    if (supabaseClient) {
      supabaseClient.from('rsvps').insert([{ name, alco, food, note }]).then();
    }
  } catch (e) { console.error('Submit error:', e); }

  // Transition
  const formBody = document.getElementById('form-body');
  const success = document.getElementById('success');

  gsap.to(formBody, {
    opacity: 0, y: -20, duration: 0.3, ease: 'power2.in',
    onComplete: () => {
      formBody.style.display = 'none';
      success.style.display = 'block';
      gsap.from(success, { opacity: 0, y: 20, duration: 0.5, ease: 'power3.out' });
      launchConfetti();
    }
  });
}


/* ══ CONFETTI ════════════════════════════ */
function launchConfetti() {
  const colors = ['#F03E6E', '#FF85A8', '#C9A76C', '#fff', '#FFD6E7'];
  const count = 80;

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position: fixed;
      width: ${4 + Math.random() * 6}px;
      height: ${4 + Math.random() * 6}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      left: ${30 + Math.random() * 40}vw;
      top: 60vh;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(el);

    gsap.to(el, {
      x: (Math.random() - 0.5) * 400,
      y: -(200 + Math.random() * 400),
      rotation: Math.random() * 720,
      opacity: 0,
      duration: 1.2 + Math.random() * 0.8,
      ease: 'power2.out',
      delay: Math.random() * 0.3,
      onComplete: () => el.remove()
    });
  }
}


/* ══ SAKURA PETALS ═══════════════════════ */
function initSakura() {
  const container = document.getElementById('hero');
  if (!container) return;

  const petalCount = 35;
  for (let i = 0; i < petalCount; i++) {
    const petal = document.createElement('div');
    petal.className = 'sakura-petal';

    const size = 12 + Math.random() * 14;
    petal.style.width = size + 'px';
    petal.style.height = size + 'px';

    const startX = Math.random() * 100 + 'vw';
    const startY = -50 - Math.random() * 500;

    container.appendChild(petal);

    gsap.fromTo(petal, {
      x: startX,
      y: startY,
      rotation: Math.random() * 360,
      rotationX: Math.random() * 360,
      rotationY: Math.random() * 360
    }, {
      y: '120vh',
      x: `+=${(Math.random() - 0.5) * 300}`,
      rotation: '+=720',
      rotationX: '+=360',
      rotationY: '+=360',
      duration: 6 + Math.random() * 8,
      ease: 'none',
      repeat: -1,
      delay: -(Math.random() * 15)
    });
  }
}

/* ══ MUSIC QUEUE ═════════════════════════ */
let musicQueueState = [];

function initMusicQueue() {
  if (supabaseClient) {
    loadMusicQueue();
    supabaseClient.channel('public:music_queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'music_queue' }, loadMusicQueue)
      .subscribe();
  } else {
    // Fallback to local storage if Supabase fails
    try { musicQueueState = JSON.parse(localStorage.getItem('bd_music') || '[]'); } catch (e) { }
    renderQueue();
  }
}

async function loadMusicQueue() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient.from('music_queue').select('*');
  if (!error && data) {
    musicQueueState = data;
    renderQueue();
  }
}

function getMusic() {
  return musicQueueState;
}

async function likeTrack(id) {
  const track = musicQueueState.find(m => m.id === id);
  if (track) {
    // Optimistic UI update
    track.likes = (track.likes || 0) + 1;
    renderQueue();
    // Server update
    if (supabaseClient) {
      await supabaseClient.from('music_queue').update({ likes: track.likes }).eq('id', id);
    } else {
      try { localStorage.setItem('bd_music', JSON.stringify(musicQueueState)); } catch (e) { }
    }
  }
}

function addTrack() {
  const tInput = document.getElementById('m-track');
  const aInput = document.getElementById('m-author');
  const track = tInput.value.trim();
  const author = aInput.value.trim() || 'Аноним';

  if (!track) {
    tInput.style.borderColor = 'var(--rose)';
    gsap.fromTo(tInput, { x: -8 }, { x: 8, yoyo: true, repeat: 5, duration: 0.05, ease: "none", onComplete: () => { gsap.set(tInput, { x: 0 }); } });
    return;
  }

  const trackObj = {
    id: Date.now().toString(),
    track,
    author,
    addedAt: Date.now(), // Real timestamp for relative time
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    played: false,
    likes: 0
  };

  // Optimistic update
  musicQueueState.push(trackObj);
  renderQueue();

  if (supabaseClient) {
    supabaseClient.from('music_queue').insert([trackObj]).then();
  } else {
    try { localStorage.setItem('bd_music', JSON.stringify(musicQueueState)); } catch (e) { }
  }

  tInput.value = '';
  aInput.value = '';
  tInput.style.borderColor = 'var(--border)';
  tInput.classList.remove('valid');
  aInput.classList.remove('valid');

  const success = document.getElementById('m-success');
  success.style.display = 'block';
  gsap.fromTo(success, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });
  setTimeout(() => {
    gsap.to(success, {
      opacity: 0, duration: 0.3, onComplete: () => {
        success.style.display = 'none';
      }
    });
  }, 2500);
}

function isHost() {
  return sessionStorage.getItem('bd_host') === 'true';
}

function timeAgo(ts) {
  if (!ts) return '';
  const diff = Math.floor((Date.now() - ts) / 60000);
  if (diff < 1) return 'только что';
  if (diff === 1) return '1 мин назад';
  return diff + ' мин назад';
}

function renderQueue() {
  const music = getMusic();
  const queueList = document.getElementById('music-list');
  const playedList = document.getElementById('music-played-list');
  const countSpan = document.getElementById('queue-count');
  if (!queueList) return;

  const queue = music.filter(m => !m.played);
  const played = music.filter(m => m.played);
  const host = isHost();

  countSpan.textContent = `В очереди: ${queue.length}`;

  if (queue.length === 0) {
    queueList.innerHTML = `<div class="music-empty"><span>🎵</span>Пока тишина... Закажи первый трек</div>`;
  } else {
    // Sort queue by likes descending (hot tracks), then by time added
    queue.sort((a, b) => (b.likes || 0) - (a.likes || 0) || a.addedAt - b.addedAt);

    queueList.innerHTML = queue.map((m, idx) => {
      const isFirst = idx === 0;
      const isHot = (m.likes || 0) >= 3;
      const badge = isFirst ? `<div class="m-playing-badge"><div class="m-pulse-dot"></div> 🎵 Сейчас:</div>` : '';
      const hotBadge = isHot ? `<span style="color:var(--rose); font-size: 0.7rem; font-weight:800; border: 1px solid var(--rose); padding: 2px 6px; border-radius: 4px; margin-left: 8px;">🔥 HOT</span>` : '';
      const hostControls = host ? `
        <div class="host-actions">
          <button class="host-btn btn-play" onclick="markPlayed('${m.id}')">✓ Сыграл</button>
          <button class="host-btn btn-del" onclick="deleteTrack('${m.id}')">✕ Удал.</button>
        </div>
      ` : '';

      return `
        <div class="music-item ${isFirst ? 'is-first' : ''}" style="${isHot ? 'border-color: var(--rose-dim); box-shadow: 0 0 15px rgba(240,62,110,0.1)' : ''}">
          <div class="music-item-info">
            ${badge}
            <div class="m-track-name">${m.track} ${hotBadge}</div>
            <div class="m-author">👤 ${m.author} &nbsp;·&nbsp; 🕒 ${timeAgo(m.addedAt) || m.timestamp}</div>
          </div>
          <div style="display:flex; align-items:center; gap: 8px;">
            <button class="tag-btn" onclick="likeTrack('${m.id}')" style="min-width: 44px; padding: 4px 8px;">🔥 ${m.likes || 0}</button>
            ${hostControls}
          </div>
        </div>
      `;
    }).join('');
  }

  if (played.length > 0) {
    playedList.style.display = 'flex';
    playedList.innerHTML = '<div style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-dim);margin-bottom:8px">Уже играли</div>' + played.map(m => {
      const hostControls = host ? `
        <div class="host-actions">
          <button class="host-btn btn-del" onclick="deleteTrack('${m.id}')">✕ Очистить</button>
        </div>
      ` : '';
      return `
        <div class="music-item played">
          <div class="music-item-info">
            <div class="m-track-name">${m.track}</div>
            <div class="m-author">👤 ${m.author}</div>
          </div>
          ${hostControls}
        </div>
      `;
    }).reverse().join('');
  } else {
    playedList.style.display = 'none';
    playedList.innerHTML = '';
  }

  document.getElementById('host-controls').style.display = host ? 'block' : 'none';
}

async function markPlayed(id) {
  const track = musicQueueState.find(m => m.id === id);
  if (track) {
    track.played = true;
    renderQueue();
    if (supabaseClient) {
      await supabaseClient.from('music_queue').update({ played: true }).eq('id', id);
    } else {
      try { localStorage.setItem('bd_music', JSON.stringify(musicQueueState)); } catch (e) { }
    }
  }
}

async function deleteTrack(id) {
  musicQueueState = musicQueueState.filter(m => m.id !== id);
  renderQueue();
  if (supabaseClient) {
    await supabaseClient.from('music_queue').delete().eq('id', id);
  } else {
    try { localStorage.setItem('bd_music', JSON.stringify(musicQueueState)); } catch (e) { }
  }
}

async function clearPlayedTracks() {
  const toDelete = musicQueueState.filter(m => m.played).map(m => m.id);
  musicQueueState = musicQueueState.filter(m => !m.played);
  renderQueue();

  if (supabaseClient && toDelete.length > 0) {
    await supabaseClient.from('music_queue').delete().in('id', toDelete);
  } else {
    try { localStorage.setItem('bd_music', JSON.stringify(musicQueueState)); } catch (e) { }
  }
}

function openHostModal() { document.getElementById('host-modal').style.display = 'flex'; }
function closeHostModal() { document.getElementById('host-modal').style.display = 'none'; document.getElementById('host-pwd').value = ''; document.getElementById('host-pwd').style.borderColor = 'var(--border)'; }

function loginHost() {
  const pwd = document.getElementById('host-pwd');
  if (pwd.value === 'host2026') {
    sessionStorage.setItem('bd_host', 'true');
    closeHostModal();
    renderQueue();
  } else {
    pwd.style.borderColor = 'var(--rose)';
    gsap.fromTo(pwd, { x: -8 }, { x: 8, yoyo: true, repeat: 5, duration: 0.05, ease: "none", onComplete: () => { gsap.set(pwd, { x: 0 }); } });
  }
}

function exitHostMode() {
  sessionStorage.removeItem('bd_host');
  renderQueue();
}

/* ══ WHEEL OF FORTUNE ════════════════════ */
let wItems = [];
let wheelHistoryState = [];
const DEFAULT_WHEEL = [
  "Штрафной тост 🍷", "Танцует 30 сек 💃", "Загадывает желание ⭐", "Комплимент соседу 💌",
  "Признание вечера 🎤", "Выбирает следующий трек 🎵", "Фото на память 📸", "Задаёт вопрос имениннице 🎀"
];
const W_COLORS = ['#F03E6E', '#2A1018', '#C9507A', '#160D16', '#FF6B9D', '#0F080F', '#E91E8C', '#1E111E'];
let currentRotation = 0;
let isSpinning = false;
let audioCtx;

function initWheel() {
  try {
    const saved = localStorage.getItem('bd_wheel');
    wItems = saved ? JSON.parse(saved) : [...DEFAULT_WHEEL];
  } catch (e) {
    wItems = [...DEFAULT_WHEEL];
  }
  renderWheelList();
  drawWheel();

  if (supabaseClient) {
    loadWheelHistory();
    supabaseClient.channel('public:wheel_history')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wheel_history' }, loadWheelHistory)
      .subscribe();
  } else {
    try { wheelHistoryState = JSON.parse(localStorage.getItem('bd_wheel_history') || '[]'); } catch (e) { }
    renderWheelHistory();
  }

  const btn = document.getElementById('spin-btn');
  if (btn) {
    const newBtn = btn.cloneNode(true);
    btn.parentNode.replaceChild(newBtn, btn);
    newBtn.addEventListener('click', startWheelCountdown);
  }
}

async function loadWheelHistory() {
  if (!supabaseClient) return;
  const { data, error } = await supabaseClient.from('wheel_history')
    .select('result_text')
    .order('created_at', { ascending: false })
    .limit(5);
  if (!error && data) {
    wheelHistoryState = data.map(d => d.result_text);
    renderWheelHistory();
  }
}

function renderWheelHistory() {
  const hist = getWheelHistory();
  const el = document.getElementById('wheel-history');
  if (!el) return;
  if (hist.length > 0) {
    el.style.display = 'block';
    el.innerHTML = '<div>История:</div>' + hist.map(h => `<span>${h}</span>`).join('');
  } else {
    el.style.display = 'none';
  }
}

function getWheelHistory() {
  return wheelHistoryState;
}

function saveWheelHistory(res) {
  let h = getWheelHistory();
  if (h[0] === res) return; // ignore immediate duplicates in history

  // Optimistic UI update
  wheelHistoryState.unshift(res);
  if (wheelHistoryState.length > 5) wheelHistoryState = wheelHistoryState.slice(0, 5);
  renderWheelHistory();

  if (supabaseClient) {
    supabaseClient.from('wheel_history').insert([{ result_text: res }]).then();
  } else {
    try { localStorage.setItem('bd_wheel_history', JSON.stringify(wheelHistoryState)); } catch (e) { }
  }
}

function saveWheel() {
  try { localStorage.setItem('bd_wheel', JSON.stringify(wItems)); } catch (e) { }
  renderWheelList();
  drawWheel();
}

function renderWheelList() {
  const list = document.getElementById('we-list');
  if (!list) return;
  list.innerHTML = wItems.map((item, i) => `
    <div class="we-item">
      <span>${item}</span>
      <button class="we-item-del" onclick="deleteWheelItem(${i})" ${wItems.length <= 1 ? 'disabled' : ''}>✕</button>
    </div>
  `).join('');
}

function deleteWheelItem(i) {
  if (wItems.length <= 1) return;
  wItems.splice(i, 1);
  saveWheel();
}

function addWheelItem() {
  const input = document.getElementById('we-input');
  const val = input.value.trim();
  if (val) {
    wItems.push(val);
    saveWheel();
    input.value = '';
  }
}

function drawWheel() {
  const canvas = document.getElementById('wheel-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const size = canvas.width;
  const center = size / 2;
  const radius = center - 8;

  ctx.clearRect(0, 0, size, size);

  const n = wItems.length;
  const arc = Math.PI * 2 / n;
  const fontSize = Math.min(14, Math.max(10, Math.floor(120 / n)));
  const maxTextWidth = radius - 55;

  for (let i = 0; i < n; i++) {
    const angle = i * arc;

    // Draw segment
    ctx.beginPath();
    ctx.fillStyle = W_COLORS[i % W_COLORS.length];
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, angle, angle + arc, false);
    ctx.fill();
    ctx.closePath();

    // Text — flip on left half so it's always readable
    ctx.save();
    ctx.translate(center, center);

    const midAngle = angle + arc / 2;
    const isLeft = midAngle > Math.PI / 2 && midAngle < Math.PI * 1.5;

    if (isLeft) {
      ctx.rotate(midAngle + Math.PI);
      ctx.textAlign = "right";
    } else {
      ctx.rotate(midAngle);
      ctx.textAlign = "left";
    }

    ctx.fillStyle = "#fff";
    ctx.font = `bold ${fontSize}px 'Syne', sans-serif`;
    ctx.textBaseline = "middle";
    ctx.shadowColor = "rgba(0,0,0,0.9)";
    ctx.shadowBlur = 3;

    let text = wItems[i];
    // Trim text to fit within the segment
    while (ctx.measureText(text).width > maxTextWidth && text.length > 1) {
      text = text.slice(0, -2) + "…";
    }

    if (isLeft) {
      ctx.fillText(text, -(40), 0);
    } else {
      ctx.fillText(text, 40, 0);
    }
    ctx.restore();
  }
}

function playTick() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.02);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.02);
  } catch (e) { }
}

function startWheelCountdown() {
  if (isSpinning || wItems.length === 0) return;
  isSpinning = true;

  const btn = document.getElementById('spin-btn');
  btn.disabled = true;
  const span = btn.querySelector('span');
  const origText = span.textContent;

  let count = 3;
  span.textContent = count;
  gsap.fromTo(span, { scale: 0.5, opacity: 0 }, { scale: 1.5, opacity: 1, duration: 0.4, yoyo: true, repeat: 1, onComplete: nextCount });

  function nextCount() {
    count--;
    if (count > 0) {
      span.textContent = count;
      gsap.fromTo(span, { scale: 0.5, opacity: 0 }, { scale: 1.5, opacity: 1, duration: 0.4, yoyo: true, repeat: 1, onComplete: nextCount });
    } else {
      span.textContent = 'Крутится...';
      performSpin(origText);
    }
  }
}

// Global hook if called from modal "Spin again"
function spinWheel() {
  startWheelCountdown();
}

function performSpin(origText) {
  const canvas = document.getElementById('wheel-canvas');
  const btn = document.getElementById('spin-btn');
  const totalItems = wItems.length;

  const spins = 6;
  const sliceDegrees = 360 / totalItems;
  let randomWinner = Math.floor(Math.random() * totalItems);

  // Auto-respin if duplicate from last
  const hist = getWheelHistory();
  if (hist.length > 0 && wItems[randomWinner] === hist[0] && totalItems > 1) {
    randomWinner = (randomWinner + 1) % totalItems;
  }

  const rotationToWinner = randomWinner * sliceDegrees + (sliceDegrees / 2);
  const targetRotation = (360 * spins) + (270 - rotationToWinner) + (Math.random() * sliceDegrees * 0.6 - sliceDegrees * 0.3);

  const startRotation = currentRotation;
  const finalRotation = startRotation + targetRotation;

  const duration = 5000;
  let lastTickAngle = startRotation;

  gsap.to({ val: startRotation }, {
    val: finalRotation,
    duration: duration / 1000,
    ease: "power2.out",
    onUpdate: function () {
      const angle = this.targets()[0].val;
      canvas.style.transform = `rotate(${angle}deg)`;

      if (Math.abs(angle - lastTickAngle) >= sliceDegrees) {
        playTick();
        lastTickAngle = angle;
      }
    },
    onComplete: () => {
      currentRotation = finalRotation % 360;
      isSpinning = false;
      btn.disabled = false;
      btn.querySelector('span').textContent = origText;
      canvas.style.transform = `rotate(${currentRotation}deg)`;

      saveWheelHistory(wItems[randomWinner]);
      showWheelModal(wItems[randomWinner]);
    }
  });
}

function showWheelModal(resultText) {
  const modal = document.getElementById('wheel-modal');
  document.getElementById('wm-result').textContent = resultText;
  modal.style.display = 'flex';
  launchWheelConfetti();
}

function closeWheelModal() {
  document.getElementById('wheel-modal').style.display = 'none';
}

function launchWheelConfetti() {
  const colors = ['#F03E6E', '#fff', '#C9A76C'];
  const modal = document.getElementById('wheel-modal');
  let particles = [];

  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.style.cssText = `
      position: absolute;
      width: ${6 + Math.random() * 6}px;
      height: ${6 + Math.random() * 6}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      top: 50%; left: 50%;
      pointer-events: none;
      z-index: 10001;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    modal.appendChild(el);
    particles.push({
      el,
      x: 0, y: 0,
      vx: (Math.random() - 0.5) * 20,
      vy: (Math.random() - 0.5) * 20 - 10,
      rot: Math.random() * 360,
      vrot: Math.random() * 10 - 5
    });
  }

  let frame;
  function animate() {
    let active = false;
    for (let p of particles) {
      p.vy += 0.5; // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;
      p.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg)`;

      if (p.y < 800) active = true;
    }
    if (active && modal.style.display !== 'none') {
      frame = requestAnimationFrame(animate);
    } else {
      particles.forEach(p => p.el.remove());
    }
  }
  animate();
}

/* ══ GSAP SCROLL ANIMATIONS ══════════════ */
// These run after loader exits and augment the CSS reveal
document.addEventListener('DOMContentLoaded', () => {
  initSakura();
  initMusicQueue();
  initWheel();

  // Game title gradient animation
  gsap.to('.game-title-main', {
    backgroundPosition: '200% center',
    duration: 4,
    repeat: -1,
    ease: 'none',
    yoyo: true
  });
});
