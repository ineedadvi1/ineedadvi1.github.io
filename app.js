const PASSWORD = '9999';
const MAX_LEN = 4;

let entry = '';

const lockScreen = document.getElementById('lock-screen');
const app = document.getElementById('app');
const dots = document.querySelectorAll('.dot');
const wrongMsg = document.getElementById('wrong-msg');
const lockBox = document.getElementById('lock-box');

function updateDots() {
  dots.forEach((d, i) => {
    d.classList.toggle('filled', i < entry.length);
  });
}

function showWrong() {
  wrongMsg.textContent = 'Incorrect password';
  lockBox.classList.add('shake');
  lockBox.addEventListener('animationend', () => {
    lockBox.classList.remove('shake');
  }, { once: true });
  setTimeout(() => { wrongMsg.textContent = ''; }, 1500);
}

function tryUnlock() {
  if (entry === PASSWORD) {
    lockScreen.classList.add('hidden');
    app.classList.remove('hidden');
    entry = '';
    updateDots();
  } else {
    showWrong();
    entry = '';
    updateDots();
  }
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
  if (entry.length === MAX_LEN) {
    setTimeout(tryUnlock, 120);
  }
}

document.querySelectorAll('.num').forEach(btn => {
  btn.addEventListener('click', () => addDigit(btn.dataset.val));
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    lockScreen.classList.remove('hidden');
    app.classList.add('hidden');
    entry = '';
    updateDots();
    wrongMsg.textContent = '';
    return;
  }
  if (/^[0-9]$/.test(e.key)) {
    addDigit(e.key);
  }
  if (e.key === 'Backspace') {
    addDigit('clear');
  }
});
