// employee.js

let currentRecordId = 1; 

document.addEventListener('DOMContentLoaded', async function() {
  async function fetchFirstRecord() {
    try {
      const data = await fetchData('Employees', currentRecordId);
      if (data) {
        console.log('First record loaded successfully');
      } else {
        console.log('No data found for the first record.');
      }
    } catch (error) {
      console.error('Error fetching first record:', error);
    }
  }

  fetchFirstRecord();
});

async function getPreviousRecord() {
  if (currentRecordId > 1) {
    currentRecordId--;
    try {
      const data = await fetchData('Employees', currentRecordId);
      if (data) {
        console.log('Previous record loaded successfully');
        displayMessage('Previous record loaded successfully', 'success');
      } else {
        console.log('No data found for the previous record.');
        displayMessage('No data found for the previous record.', 'info');
        currentRecordId++;
      }
    } catch (error) {
      console.error('Error fetching previous record:', error);
      displayMessage('Error fetching previous record: ' + error.message, 'error');
      currentRecordId++;
    }
  } else {
    console.log('Already at the first record.');
    displayMessage('You are already at the first record.', 'info');
  }
}

async function getNextRecord() {
  try {
    const data = await fetchData('Employees', currentRecordId + 1);
    if (data) {
      currentRecordId++;
      console.log('Next record loaded successfully');
      displayMessage('Next record loaded successfully', 'success');
    } else {
      console.log('No more records found.');
      displayMessage('No more records found. You have reached the last record.', 'info');
    }
  } catch (error) {
    console.error('Error fetching next record:', error);
    displayMessage('Error fetching next record: ' + error.message, 'error');
  }
}

async function fetchData(tableName, primaryKey) {
  console.log(`Fetching data for table: ${tableName}, primary key: ${primaryKey}`);

  try {
    const response = await fetch(`/dbData?table=${tableName}&id=${primaryKey}`);
    console.log("Response received:", response);

    const data = await response.json();
    console.log("Data received:", data);

    if (data) {
      populateForm(data);
      currentRecordId = data.ID; // Update currentRecordId here
      console.log('Record loaded successfully. Current ID:', currentRecordId);
      displayMessage('Record loaded successfully', 'success');
    } else {
      console.log('No data found');
      displayMessage('No data found for this record.', 'info');
    }

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    displayMessage('Error fetching data: ' + error.message, 'error');
    throw error;
  }
}

function displayMessage(message, type = 'info') {
  const messageArea = document.getElementById('messageArea');
  messageArea.textContent = message;
  messageArea.className = `message-area ${type}`;
  
  messageArea.scrollIntoView({ behavior: 'smooth', block: 'end' });
  
  setTimeout(() => {
      messageArea.textContent = '';
      messageArea.className = 'message-area';
  }, 5000);
}

function populateForm(record) {
  document.getElementById('ID').value = record.ID;
  document.getElementById('EmployeeID').value = record.EmployeeID;
  document.getElementById('EmployeeName').value = record.EmployeeName;
  document.getElementById('EmployeeAddress').value = record.EmployeeAddress;
  document.getElementById('EmployeeCity').value = record.EmployeeCity;
  document.getElementById('EmployeeState').value = record.EmployeeState;
  document.getElementById('EmployeeZipcode').value = record.EmployeeZipcode;
  document.getElementById('EmployeePhone').value = record.EmployeePhone;
  document.getElementById('EmployeeEmail').value = record.EmployeeEmail;
  document.getElementById('EmployeeActive').checked = Boolean(record.EmployeeActive);
  document.getElementById('DateOfHire').value = record.DateOfHire || '';

  // Clear the search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.value = '';
  }
}

async function searchRecords() {
  const searchInput = document.getElementById('searchInput');
  if (!searchInput) {
    console.error('Search input element not found');
    displayMessage('Error: Search input not found', 'error');
    return;
  }

  const searchTerm = searchInput.value.trim();
  if (!searchTerm) {
    displayMessage('Please enter a search term', 'info');
    return;
  }

  try {
    const response = await fetch(`/search?table=Employees&term=${encodeURIComponent(searchTerm)}`);
    const data = await response.json();

    if (Array.isArray(data)) {
      if (data.length === 0) {
        showNoResultsPopup(searchTerm);
      } else {
        displaySearchResults(data);
      }
    } else {
      console.error('Unexpected data format received:', data);
      displayMessage('Error: Unexpected data format received from server', 'error');
    }
  } catch (error) {
    console.error('Error searching records:', error);
    displayMessage('Error searching records: ' + error.message, 'error');
  }
}

function showNoResultsPopup(searchTerm) {
  const modal = document.createElement('div');
  modal.className = 'search-modal';
  modal.innerHTML = `
      <div class="search-modal-content">
          <h2>No Results Found</h2>
          <p>No records found matching "${searchTerm}"</p>
          <button onclick="closeModal(this.closest('.search-modal'))">Close</button>
      </div>
  `;
  document.body.appendChild(modal);
}

function displaySearchResults(results) {
  const modal = document.createElement('div');
  modal.className = 'search-modal';
  modal.innerHTML = `
    <div class="search-modal-content">
      <h2>Search Results</h2>
      <div class="search-results-list"></div>
    </div>
  `;

  const resultsList = modal.querySelector('.search-results-list');
  results.forEach(result => {
    const resultItem = document.createElement('div');
    resultItem.className = 'search-result-item';
    
    resultItem.innerHTML = `
      <strong>${result.EmployeeName || 'N/A'}</strong><br>
      ID: ${result.EmployeeID || 'N/A'}<br>
      Address: ${result.EmployeeAddress || 'N/A'}
    `;

    resultItem.addEventListener('click', () => {
      fetchData('Employees', result.ID);
      closeModal(modal);
    });
    resultsList.appendChild(resultItem);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal);
    }
  });

  document.body.appendChild(modal);
}


function closeModal(modal) {
  if (modal && modal.parentNode) {
    modal.parentNode.removeChild(modal);
  }
}

function createNewRecord() {
  console.log('New button clicked');
}

function editRecord() {
  console.log('Edit button clicked');
}

function saveRecord() {
  console.log('Save button clicked');
}

function printRecord() {
  console.log('Print button clicked');
}

function clearForm() {
  console.log('Clear button clicked');
}

function exit() {
  window.location.href = '/';
}