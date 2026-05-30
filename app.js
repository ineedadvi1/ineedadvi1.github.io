const PASSWORD = '9999';
const MAX_LEN = 4;

let entry = '';

const lockScreen = document.getElementById('lock-screen');
const app = document.getElementById('app');
const urlModal = document.getElementById('url-modal');
const urlInput = document.getElementById('url-input');
const dots = document.querySelectorAll('.dot');
const wrongMsg = document.getElementById('wrong-msg');
const lockBox = document.getElementById('lock-box');

function updateDots() {
  dots.forEach((d, i) => d.classList.toggle('filled', i < entry.length));
}

function showWrong() {
  wrongMsg.textContent = 'Incorrect password';
  lockBox.classList.add('shake');
  lockBox.addEventListener('animationend', () => lockBox.classList.remove('shake'), { once: true });
  setTimeout(() => { wrongMsg.textContent = ''; }, 1500);
}

function tryUnlock() {
  if (entry === PASSWORD) {
    lockScreen.classList.add('hidden');
    app.classList.remove('hidden');
  } else {
    showWrong();
  }
  entry = '';
  updateDots();
}

function addDigit(val) {
  if (val === 'clear') {
    entry = entry.slice(0, -1);
    updateDots();
    return;
  }
  if (entry.length >= MAX_LEN) return;
  entry += val;
  updateDots();
  if (entry.length === MAX_LEN) setTimeout(tryUnlock, 120);
}

function lock() {
  lockScreen.classList.remove('hidden');
  app.classList.add('hidden');
  urlModal.classList.add('hidden');
  entry = '';
  updateDots();
  wrongMsg.textContent = '';
}

function navigate(url) {
  // Add https:// if no protocol given
  if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
  window.location.href = url;
}

// Numpad clicks
document.querySelectorAll('.num').forEach(btn => {
  btn.addEventListener('click', () => addDigit(btn.dataset.val));
});

// App icon clicks — same tab navigation
document.querySelectorAll('.app-btn[data-url]').forEach(btn => {
  btn.addEventListener('click', () => navigate(btn.dataset.url));
});

// Custom URL button
document.getElementById('custom-btn').addEventListener('click', () => {
  urlModal.classList.remove('hidden');
  urlInput.value = '';
  setTimeout(() => urlInput.focus(), 50);
});

document.getElementById('url-cancel').addEventListener('click', () => {
  urlModal.classList.add('hidden');
});

document.getElementById('url-go').addEventListener('click', () => {
  const val = urlInput.value.trim();
  if (val) navigate(val);
});

urlInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const val = urlInput.value.trim();
    if (val) navigate(val);
  }
  if (e.key === 'Escape') {
    urlModal.classList.add('hidden');
  }
});

// Close modal clicking backdrop
urlModal.addEventListener('click', e => {
  if (e.target === urlModal) urlModal.classList.add('hidden');
});

// Global keyboard
document.addEventListener('keydown', e => {
  // Don't hijack typing in the URL input
  if (document.activeElement === urlInput) return;

  if (e.key === 'Escape') {
    lock();
    return;
  }
  if (/^[0-9]$/.test(e.key)) addDigit(e.key);
  if (e.key === 'Backspace') addDigit('clear');
});
