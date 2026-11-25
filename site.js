const progress = document.querySelector('.road-progress');
function updateProgress() {
  const distance = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = 'scaleX(' + (distance > 0 ? scrollY / distance : 0) + ')';
}
addEventListener('scroll', updateProgress, { passive: true });
addEventListener('resize', updateProgress);
updateProgress();

const image = document.querySelector('#situation-image');
const situations = [...document.querySelectorAll('[data-image]')];
const track = document.querySelector('.situation-track');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
let revision = 0;

async function showSituation(situation, index) {
  const request = ++revision;
  track.dataset.step = index;
  const frame = new Image();
  frame.src = situation.dataset.image;
  try { await frame.decode(); } catch { return; }
  if (request !== revision) return;
  image.src = frame.src;
  image.getAnimations().forEach(animation => animation.cancel());
  if (!reduceMotion.matches) {
    image.animate([
      { clipPath: 'inset(0 0 0 28%)', opacity: .45, scale: 1.07 },
      { clipPath: 'inset(0)', opacity: 1, scale: 1 }
    ], { duration: 540, easing: 'cubic-bezier(.22,1,.36,1)' });
  }
}

situations.forEach((situation, index) => {
  situation.addEventListener('toggle', () => {
    if (situation.open) showSituation(situation, index);
  });
});
