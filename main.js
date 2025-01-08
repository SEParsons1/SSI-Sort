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
    fontSize -= 30; // Adjust this value if you want more or less reduction
    areaDisplay.style.fontSize = fontSize + 'px';
  }
}

function displayArea(postalCode) {
  const areaDisplay = document.getElementById('areaDisplay');
  const area = areas[postalCode] || "INVALID";
  areaDisplay.textContent = area;
  
  // After updating text, fit it to the width
  fitAreaDisplayText();
}

function clearAreaDisplay() {
  const areaDisplay = document.getElementById('areaDisplay');
  areaDisplay.textContent = "";
}

/**
 * Adjust layout when the virtual keyboard is shown or hidden.
 */
function adjustViewport() {
  const currentViewportHeight = window.visualViewport.height;
  const body = document.body;

  // If the viewport height shrinks (keyboard open), move content up
  if (currentViewportHeight < window.innerHeight) {
    const inputField = document.getElementById('myInput');
    const offset = (currentViewportHeight - inputField.offsetHeight) / 2 
                   - inputField.offsetHeight;
    body.style.transform = 'translateY(' + offset + 'px)';
  } else {
    body.style.transform = 'none';
  }
}

// Keep the input focused if a user taps or clicks outside it,
// so the keyboard remains open.
function refocusInputIfNeeded(e) {
  const inputField = document.getElementById('myInput');
  if (!inputField.contains(e.target)) {
    e.preventDefault();  // Prevent losing focus
    inputField.focus();  // Re-focus the input
  }
}

// Re-run kiosk logic when returning to the page
// so the layout and text size are correct after coming back from homescreen.
window.addEventListener('pageshow', function() {
  adjustViewport();
  fitAreaDisplayText();
});

// Event listeners
window.addEventListener('resize', adjustViewport);
window.visualViewport.addEventListener('resize', adjustViewport);

window.addEventListener('orientationchange', fitAreaDisplayText);
window.addEventListener('resize', fitAreaDisplayText);

// Prevent default scrolling on touch devices (kiosk style)
document.addEventListener('touchmove', function(event) {
  event.preventDefault();
}, { passive: false });

// Keep the keyboard from closing when tapping outside the input on touch devices
document.addEventListener('touchstart', refocusInputIfNeeded, { passive: false });
// Also handle mouse/touchpad inputs on non-touch devices
document.addEventListener('mousedown', refocusInputIfNeeded);
