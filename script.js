function getNextNov14(now = new Date()) {
  const year = now.getFullYear();
  const targetThisYear = new Date(Date.UTC(year, 10, 14, 0, 0, 0)); // Nov 14 00:00 UTC
  return now <= targetThisYear
    ? targetThisYear
    : new Date(Date.UTC(year + 1, 10, 14, 0, 0, 0));
}

function getCountdownStart(now) {
  const start = new Date(now);
  start.setUTCHours(19, 0, 0, 0); // 21:00 CET = 19:00 UTC
  if (now < start) {
    // if before 21:00 CET today → use yesterday 21:00 CET
    start.setUTCDate(start.getUTCDate() - 1);
  }
  return start;
}

const $ = (id) => document.getElementById(id);
const daysEl = $("days"),
      hoursEl = $("hours"),
      minutesEl = $("minutes"),
      secondsEl = $("seconds"),
      progressEl = $("progress-bar");

let now = new Date();
let target = getNextNov14(now);
let countdownStart = getCountdownStart(now);

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
    target = getNextNov14(now);
    countdownStart = getCountdownStart(now);
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

// Keep ticks aligned to wall clock seconds
let timeoutId;
function scheduleNextTick() {
  clearTimeout(timeoutId);
  const now = Date.now();
  const delay = 1000 - (now % 1000);
  timeoutId = setTimeout(() => {
    update();
    scheduleNextTick();
  }, delay);
}

update();
scheduleNextTick();
