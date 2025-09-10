function getNextLocalNov14(now = new Date()) {
  const year = now.getFullYear();
  // Target: Nov 14, 00:00 in the USER'S local time zone
  const targetThisYear = new Date(year, 10, 14, 0, 0, 0); // month=10 → November

  return now <= targetThisYear
    ? targetThisYear
    : new Date(year + 1, 10, 14, 0, 0, 0);
}

const $ = (id) => document.getElementById(id);
const daysEl = $("days"),
      hoursEl = $("hours"),
      minutesEl = $("minutes"),
      secondsEl = $("seconds"),
      progressEl = $("progress-bar");

let target = getNextLocalNov14();

// Progress starts 8th September, 00:00 local time
const countdownStart = new Date(target.getFullYear(), 8, 8, 0, 0, 0);

function updateProgress() {
  const now = new Date();
  const totalMs = target - countdownStart;
  const elapsedMs = now - countdownStart;
  let percent = Math.min(100, Math.max(0, (elapsedMs / totalMs) * 100));
  progressEl.style.width = percent + "%";
}

function update() {
  const now = new Date();
  if (now >= target) {
    target = getNextLocalNov14(now);
  }

  const diffMs = target - now;
  const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  daysEl.textContent = String(days);
  hoursEl.textContent = String(hours).padStart(2, "0");
  minutesEl.textContent = String(minutes).padStart(2, "0");
  secondsEl.textContent = String(seconds).padStart(2, "0");

  updateProgress();
}

// ⏱ precise ticking
function startTicker() {
  update(); // run immediately
  setInterval(update, 1000); // tick every second
}

startTicker();
