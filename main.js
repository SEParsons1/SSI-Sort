let inputTimer; // Timer to delay final processing on input

function handleInput() {
  clearTimeout(inputTimer);
  const input = document.getElementById('myInput');

  // If a fourth character is entered, keep only that 4th character, uppercase
  if (input.value.length > 3) {
    input.value = input.value.slice(-1).toUpperCase();
  } else {
    // Otherwise keep the last 3 characters, uppercase
    input.value = input.value.toUpperCase().slice(-3);
  }

  // Once we have exactly 3 characters, show area after short delay
  if (input.value.length === 3) {
    inputTimer = setTimeout(() => {
      displayArea(input.value);
    }, 100);
  } else {
    clearAreaDisplay(); 
  }
}

/* Dynamically fit the text inside #areaDisplay to the available width. */
function fitAreaDisplayText() {
  const areaDisplay = document.getElementById('areaDisplay');
  // Start with a very large font size:
  let fontSize = 200;
  areaDisplay.style.fontSize = fontSize + 'px';

  const bodyWidth = document.body.clientWidth;

  // Decrease font size until text fits on one line
  while (areaDisplay.scrollWidth > bodyWidth && fontSize > 0) {
    fontSize--;
    areaDisplay.style.fontSize = fontSize + 'px';
  }

  // Make it just a tad smaller after it fits
  if (fontSize > 0) {
    fontSize -= 5; // Adjust as needed
    areaDisplay.style.fontSize = fontSize + 'px';
  }
}

function displayArea(postalCode) {
  const areaDisplay = document.getElementById('areaDisplay');
  // 'areas' comes from areas.js
  const area = areas[postalCode] || "INVALID";
  areaDisplay.textContent = area;
  
  // After updating text, fit it to the width
  fitAreaDisplayText();
}

function clearAreaDisplay() {
  const areaDisplay = document.getElementById('areaDisplay');
  areaDisplay.textContent = "";

  // FORCE the layout to reset if the text is cleared
  document.body.style.transform = 'none';
}

/**
 * Automatically adjust layout so the input is visible above the keyboard if needed.
 */
function adjustViewport() {
  const body = document.body;
  const inputField = document.getElementById('myInput');
  const viewportHeight = window.visualViewport.height;
  
  // If the viewport is smaller than the full window, keyboard is likely open.
  if (viewportHeight < window.innerHeight) {
    // Get how far down the input is from the top of the screen.
    const rect = inputField.getBoundingClientRect();
    const inputBottom = rect.bottom;
    
    // If the input is covered by the keyboard, shift the body up
    // so that the bottom of the input is ~20px above the bottom of the viewport.
    if (inputBottom > viewportHeight - 20) {
      const overlap = inputBottom - (viewportHeight - 20);
      body.style.transform = `translateY(-${overlap}px)`;
    }
  } else {
    // If keyboard isn't open, reset
    body.style.transform = 'none';
  }
}

/**
 * Manual “Recenter” function for the user to fix layout issues if/when needed
 * (e.g., after returning from Home screen).
 */
function recenter() {
  // Immediately reset any leftover transforms
  document.body.style.transform = 'none';
  
  // Wait a moment for the viewport to settle (especially after re-focusing the input)
  setTimeout(() => {
    adjustViewport();
    fitAreaDisplayText();
  }, 300);
}

// Keep the input focused if a user taps or clicks outside it,
// so the keyboard remains open (kiosk style).
function refocusInputIfNeeded(e) {
  const inputField = document.getElementById('myInput');
  if (!inputField.contains(e.target)) {
    e.preventDefault();  // Prevent losing focus
    inputField.focus();  // Re-focus the input
  }
}

// Re-run kiosk logic when returning to the page
window.addEventListener('pageshow', function() {
  // Immediately reset transforms
  document.body.style.transform = 'none';

  // Let the browser stabilize, then adjust
  setTimeout(() => {
    adjustViewport();
    fitAreaDisplayText();
  }, 300);
});

// Event listeners
// 1. Whenever window size changes or phone orientation changes, try to keep input visible.
window.addEventListener('resize', adjustViewport);
window.visualViewport.addEventListener('resize', adjustViewport);

window.addEventListener('orientationchange', fitAreaDisplayText);
window.addEventListener('resize', fitAreaDisplayText);

// 2. Prevent default scrolling on touch devices (kiosk style).
document.addEventListener('touchmove', function(event) {
  event.preventDefault();
}, { passive: false });

// 3. Keep the keyboard from closing when tapping outside the input.
document.addEventListener('touchstart', refocusInputIfNeeded, { passive: false });
document.addEventListener('mousedown', refocusInputIfNeeded);
