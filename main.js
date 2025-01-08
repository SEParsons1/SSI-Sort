let inputTimer;

function handleInput() {
  clearTimeout(inputTimer);
  const input = document.getElementById('myInput');

  if (input.value.length > 3) {
    input.value = input.value.slice(-1).toUpperCase();
  } else {
    input.value = input.value.toUpperCase().slice(-3);
  }

  if (input.value.length === 3) {
    inputTimer = setTimeout(() => {
      displayArea(input.value);
    }, 100);
  } else {
    clearAreaDisplay();
  }
}

function fitAreaDisplayText() {
  const areaDisplay = document.getElementById('areaDisplay');
  let fontSize = 200;
  areaDisplay.style.fontSize = fontSize + 'px';

  const bodyWidth = document.body.clientWidth;

  while (areaDisplay.scrollWidth > bodyWidth && fontSize > 0) {
    fontSize--;
    areaDisplay.style.fontSize = fontSize + 'px';
  }

  if (fontSize > 0) {
    fontSize -= 5;
    areaDisplay.style.fontSize = fontSize + 'px';
  }
}

function displayArea(postalCode) {
  const areaDisplay = document.getElementById('areaDisplay');
  const area = areas[postalCode] || "INVALID";
  areaDisplay.textContent = area;
  fitAreaDisplayText();
}

function clearAreaDisplay() {
  const areaDisplay = document.getElementById('areaDisplay');
  areaDisplay.textContent = "";
}

function adjustViewport() {
  const currentViewportHeight = window.visualViewport.height;
  const body = document.body;

  if (currentViewportHeight < window.innerHeight) {
    const inputField = document.getElementById('myInput');
    const offset = (currentViewportHeight - inputField.offsetHeight) / 2
                   - inputField.offsetHeight;
    body.style.transform = 'translateY(' + offset + 'px)';
  } else {
    body.style.transform = 'none';
  }
}

function refocusInputIfNeeded(e) {
  const inputField = document.getElementById('myInput');
  if (!inputField.contains(e.target)) {
    e.preventDefault();
    inputField.focus();
  }
}

window.addEventListener('pageshow', function() {
  document.body.style.transform = 'none';

  setTimeout(() => {
    adjustViewport();
    fitAreaDisplayText();

    const areaDisplay = document.getElementById('areaDisplay');
    if (areaDisplay.textContent.trim().length > 0) {
      setTimeout(() => {
        adjustViewport();
        fitAreaDisplayText();
      }, 200);
    }
  }, 300);
});

window.addEventListener('resize', adjustViewport);
window.visualViewport.addEventListener('resize', adjustViewport);

window.addEventListener('orientationchange', fitAreaDisplayText);
window.addEventListener('resize', fitAreaDisplayText);

document.addEventListener('touchmove', function(event) {
  event.preventDefault();
}, { passive: false });

document.addEventListener('touchstart', refocusInputIfNeeded, { passive: false });
document.addEventListener('mousedown', refocusInputIfNeeded);