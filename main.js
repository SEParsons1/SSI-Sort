let inputTimer; // Timer to delay final processing on input

// A threshold to decide when the keyboard is "fully" open.
const KEYBOARD_THRESHOLD = 150;

function handleInput() {
  clearTimeout(inputTimer);
  const input = document.getElementById('myInput');

  // Keep only up to 3 uppercase characters (or if 4th typed, keep only the 4th).
  if (input.value.length > 3) {
    input.value = input.value.slice(-1).toUpperCase();
  } else {
    input.value = input.value.toUpperCase().slice(-3);
  }

  // After 3 chars, display area with a short delay
  if (input.value.length === 3) {
    inputTimer = setTimeout(() => {
      displayArea(input.value);
    }, 100);
  } else {
    clearAreaDisplay(); 
  }
}

function displayArea(postalCode) {
  const areaDisplay = document.getElementById('areaDisplay');
  const area = areas[postalCode] || "INVALID";
  areaDisplay.textContent = area;
  fitAreaDisplayText();
}

function clearAreaDisplay() {
  document.getElementById('areaDisplay').textContent = "";
  // Reset any transforms if text is cleared
  document.body.style.transform = "none";
}

/* Dynamically fit the text to the body width. */
function fitAreaDisplayText() {
  const areaDisplay = document.getElementById('areaDisplay');
  let fontSize = 200;
  areaDisplay.style.fontSize = fontSize + "px";

  const bodyWidth = document.body.clientWidth;
  while (areaDisplay.scrollWidth > bodyWidth && fontSize > 0) {
    fontSize--;
    areaDisplay.style.fontSize = fontSize + "px";
  }
  if (fontSize > 0) {
    fontSize -= 5; 
    areaDisplay.style.fontSize = fontSize + "px";
  }
}

/**
 * We only shift the page up if the keyboard is "fully" open. 
 * (We measure how much smaller visualViewport is than innerHeight.)
 */
function adjustViewport() {
  const body = document.body;
  const inputField = document.getElementById("myInput");

  const vh = window.visualViewport.height;
  const diff = window.innerHeight - vh;

  // If the phone's keyboard is "fully" open enough (at least KEYBOARD_THRESHOLD px):
  if (diff > KEYBOARD_THRESHOLD) {
    // We measure the offset needed so the bottom of the input is ~20px above the bottom of the viewport
    const rect = inputField.getBoundingClientRect();
    const bottomOfInput = rect.bottom;
    if (bottomOfInput > vh - 20) {
      const overlap = bottomOfInput - (vh - 20);
      body.style.transform = `translateY(-${overlap}px)`;
      return; 
    }
  }
  // Otherwise, if the keyboard is not fully open or no overlap, reset
  body.style.transform = "none";
}

/**
 * Manual recenter. If the user sees the field is stuck after returning from Home,
 * they tap this. We try multiple times to see if the keyboard has fully opened.
 */
function recenter() {
  const body = document.body;
  body.style.transform = "none";
  
  // We'll do repeated checks for up to ~1 second.
  let attempts = 0;
  const maxAttempts = 5;

  const interval = setInterval(() => {
    adjustViewport();
    fitAreaDisplayText();

    attempts++;
    // If transform is no longer "none" or we've tried enough times, stop.
    if (body.style.transform !== "none" || attempts >= maxAttempts) {
      clearInterval(interval);
    }
  }, 200);
}

// ------------- Kiosk / Focus Logic -------------
function refocusInputIfNeeded(e) {
  const inputField = document.getElementById('myInput');
  if (!inputField.contains(e.target)) {
    e.preventDefault();
    inputField.focus();
  }
}
document.addEventListener("touchstart", refocusInputIfNeeded, { passive: false });
document.addEventListener("mousedown", refocusInputIfNeeded);

// ------------- Events -------------
window.addEventListener("orientationchange", fitAreaDisplayText);
window.addEventListener("resize", handleResize);
window.visualViewport.addEventListener("resize", handleResize);

// We'll call adjustViewport only after a short delay each time 
// the phone's viewport changes, so we don't jump too soon.
let resizeTimeout;
function handleResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    adjustViewport();
  }, 150);
}

// When returning from the home screen, reset and then re-check
window.addEventListener("pageshow", () => {
  document.body.style.transform = "none";
  setTimeout(() => {
    adjustViewport();
    fitAreaDisplayText();
  }, 300);
});

// Prevent scrolling on touch
document.addEventListener("touchmove", (event) => {
  event.preventDefault();
}, { passive: false });