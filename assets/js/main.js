// Check browser type
var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
var isFirefox = typeof InstallTrigger !== 'undefined';


// Update the displayed date and time on the page.
function updateDateAndTime() {
  var dateString = moment().format('LL'),
  timeString = moment().format('LTS');

  document.getElementById('js-date').innerText = dateString;
  document.getElementById('js-time').innerText = timeString;

  // Request animation frame for next update
  requestAnimationFrame(updateDateAndTime);
}


// Start updating
moment.locale(navigator.language);
updateDateAndTime();

// Set background to a random one
var backgroundElement = document.getElementById('js-bg');
var selected = Math.floor(Math.random() * 31);

backgroundElement.onload = function () {
  backgroundElement.style.opacity = 1;
}

// Finally put the last touch on demo page
document.addEventListener('DOMContentLoaded', function(){
  backgroundElement.style.backgroundImage = 'url(\'assets/images/backgrounds/background' + selected + '.jpg\')';
}, false);
