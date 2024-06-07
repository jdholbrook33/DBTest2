// Generic function to clear an input field and reset an indicator
function clearInputAndIndicator(inputId, indicatorId) {
  document.getElementById(inputId).value = '';
  document.getElementById(indicatorId).innerText = '';
}

// Function to set a cookie
function setCookie(name, value, days) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/;SameSite=None;Secure`;
}


// Function to get a cookie value by name
function getCookie(name) {
  var cookies = document.cookie.split('; ');
  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].split('=');
      if (cookie[0] === name) {
          return decodeURIComponent(cookie[1]);
      }
  }
  return null;
}

function showErrorModal() {
  var modal = document.getElementById("errorModal");
  modal.style.display = "flex";
  setTimeout(() => {
      modal.style.display = "none";
  }, 2000);  // Modal will be displayed for 2 seconds
}

// JavaScript function to navigate to the Work Order page
function gotoEmployee() {
  window.location.href = '/employee';
}
