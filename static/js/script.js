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
