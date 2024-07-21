import { validateEmployeeForm } from './validation.js';

let currentRecordId = 1;
let currentState = 'normal'; // Possible states: 'normal', 'edit', 'new'
let hasUnsavedChanges = false;


document.addEventListener('DOMContentLoaded', () => {
    fetchFirstRecord();
    setupEventListeners();
});

function setupEventListeners() {
  document.getElementById('prevButton').addEventListener('click', getPreviousRecord);
  document.getElementById('nextButton').addEventListener('click', getNextRecord);
  document.getElementById('newButton').addEventListener('click', createNewRecord);
  document.getElementById('editButton').addEventListener('click', editRecord);
  document.getElementById('saveButton').addEventListener('click', saveRecord);
  document.getElementById('clearButton').addEventListener('click', clearForm);
  document.getElementById('searchButton').addEventListener('click', searchRecords);
  document.getElementById('printButton').addEventListener('click', printRecord);
  document.getElementById('exitButton').addEventListener('click', exit);

  // Add event listeners for form inputs to track changes
  const formInputs = document.querySelectorAll('input, select, textarea');
  formInputs.forEach(input => {
      input.addEventListener('change', () => {
          hasUnsavedChanges = true;
          updateButtonStates();
      });
  });
}

function updateButtonStates() {
    const buttons = {
        prevButton: document.getElementById('prevButton'),
        nextButton: document.getElementById('nextButton'),
        newButton: document.getElementById('newButton'),
        editButton: document.getElementById('editButton'),
        saveButton: document.getElementById('saveButton'),
        clearButton: document.getElementById('clearButton'),
        searchButton: document.getElementById('searchButton'),
        printButton: document.getElementById('printButton'),
        exitButton: document.getElementById('exitButton')
    };

    switch (currentState) {
        case 'normal':
            buttons.prevButton.disabled = false;
            buttons.nextButton.disabled = false;
            buttons.newButton.disabled = false;
            buttons.editButton.disabled = false;
            buttons.saveButton.disabled = true;
            buttons.clearButton.disabled = true;
            buttons.searchButton.disabled = false;
            buttons.printButton.disabled = false;
            buttons.exitButton.disabled = false;
            break;
        case 'edit':
        case 'new':
            buttons.prevButton.disabled = true;
            buttons.nextButton.disabled = true;
            buttons.newButton.disabled = true;
            buttons.editButton.disabled = true;
            buttons.saveButton.disabled = false;
            buttons.clearButton.disabled = false;
            buttons.searchButton.disabled = true;
            buttons.printButton.disabled = true;
            buttons.exitButton.disabled = true;
            break;
    }

    // If there are unsaved changes, enable the save button
    if (hasUnsavedChanges) {
        buttons.saveButton.disabled = false;
    }
}

async function fetchData(id) {
    try {
        const response = await fetch(`/dbData?table=Employees&id=${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

async function fetchFirstRecord() {
    try {
        const data = await fetchData(currentRecordId);
        if (data) {
            console.log('First record loaded successfully');
            populateForm(data);
            displayMessage('First record loaded successfully', 'success');
        } else {
            console.log('No data found for the first record.');
            displayMessage('No data found for the first record.', 'info');
        }
    } catch (error) {
        console.error('Error fetching first record:', error);
        displayMessage('Error fetching first record: ' + error.message, 'error');
    }
    currentState = 'normal';
    hasUnsavedChanges = false;
    updateButtonStates();
}

function populateForm(record) {
    const fields = [
        'ID', 'EmployeeID', 'EmployeeName', 'EmployeeAddress', 'EmployeeCity',
        'EmployeeState', 'EmployeeZipcode', 'EmployeePhone', 'EmployeeEmail',
        'DateOfHire'
    ];

    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.value = record[field] ?? '';
        }
    });

    const activeCheckbox = document.getElementById('EmployeeActive');
    if (activeCheckbox) {
        activeCheckbox.checked = Boolean(record.EmployeeActive);
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }
}

function displayMessage(message, type = 'info') {
    const messageArea = document.getElementById('messageArea');
    if (messageArea) {
        messageArea.textContent = message;
        messageArea.className = `message-area ${type}`;
        setTimeout(() => {
            messageArea.textContent = '';
            messageArea.className = 'message-area';
        }, 5000);
    } else {
        console.log(`${type}: ${message}`);
    }
}

async function getPreviousRecord() {
    if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to navigate away?')) {
        return;
    }
    if (currentRecordId > 1) {
        try {
            const data = await fetchData(currentRecordId - 1);
            if (data) {
                currentRecordId--;
                populateForm(data);
                console.log('Previous record loaded successfully');
                displayMessage('Previous record loaded successfully', 'success');
            } else {
                console.log('No data found for the previous record.');
                displayMessage('No data found for the previous record.', 'info');
            }
        } catch (error) {
            console.error('Error fetching previous record:', error);
            displayMessage('Error fetching previous record: ' + error.message, 'error');
        }
    } else {
        console.log('Already at the first record.');
        displayMessage('You are already at the first record.', 'info');
    }
    currentState = 'normal';
    hasUnsavedChanges = false;
    updateButtonStates();
}

async function getNextRecord() {
    if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to navigate away?')) {
        return;
    }
    try {
        const data = await fetchData(currentRecordId + 1);
        if (data) {
            currentRecordId++;
            populateForm(data);
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
    currentState = 'normal';
    hasUnsavedChanges = false;
    updateButtonStates();
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
        
        resultItem.textContent = `ID: ${result.EmployeeID || 'N/A'}, ${result.EmployeeName || 'N/A'}, ${result.EmployeeAddress || 'N/A'}`;

        resultItem.addEventListener('click', () => {
            fetchData(result.ID).then(data => {
                if (data) {
                    populateForm(data);
                    currentRecordId = data.ID;
                    currentState = 'normal';
                    hasUnsavedChanges = false;
                    updateButtonStates();
                }
            });
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

function clearForm() {
    const fields = [
        'ID', 'EmployeeID', 'EmployeeName', 'EmployeeAddress', 'EmployeeCity',
        'EmployeeState', 'EmployeeZipcode', 'EmployeePhone', 'EmployeeEmail',
        'EmployeeActive', 'DateOfHire'
    ];

    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            if (element.type === 'checkbox') {
                element.checked = false;
            } else {
                element.value = '';
            }
        }
    });

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
    }

    displayMessage('Form cleared', 'info');
    hasUnsavedChanges = false;
    updateButtonStates();
}

function createNewRecord() {
    if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to create a new record?')) {
        return;
    }
    clearForm();
    currentRecordId = null; // Indicate that we're creating a new record
    currentState = 'new';
    hasUnsavedChanges = false;
    updateButtonStates();
    displayMessage('Creating a new record. Fill in the details and click Save.', 'info');
}

function editRecord() {
    currentState = 'edit';
    hasUnsavedChanges = false;
    updateButtonStates();

    const fields = [
        'EmployeeID', 'EmployeeName', 'EmployeeAddress', 'EmployeeCity',
        'EmployeeState', 'EmployeeZipcode', 'EmployeePhone', 'EmployeeEmail',
        'EmployeeActive', 'DateOfHire'
    ];

    fields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.disabled = false;
        }
    });

    displayMessage('You can now edit the record. Click Save when done.', 'info');
}

async function saveRecord() {
  const record = {
      ID: currentRecordId,
      EmployeeID: document.getElementById('EmployeeID').value,
      EmployeeName: document.getElementById('EmployeeName').value,
      EmployeeAddress: document.getElementById('EmployeeAddress').value,
      EmployeeCity: document.getElementById('EmployeeCity').value,
      EmployeeState: document.getElementById('EmployeeState').value,
      EmployeeZipcode: document.getElementById('EmployeeZipcode').value,
      EmployeePhone: document.getElementById('EmployeePhone').value,
      EmployeeEmail: document.getElementById('EmployeeEmail').value,
      EmployeeActive: document.getElementById('EmployeeActive').checked,
      DateOfHire: document.getElementById('DateOfHire').value
  };

  const validationResult = validateEmployeeForm(record);

  if (!validationResult.isValid) {
      displayValidationErrors(validationResult.errors);
      return;
  }

  try {
      const response = await fetch('/saveData', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              table: 'Employees',
              data: validationResult.formData,
              operation: currentState === 'new' ? 'insert' : 'update'
          }),
      });

      if (!response.ok) {
          throw new Error('Failed to save record');
      }

      const result = await response.json();
      currentRecordId = result.id;
      populateForm(validationResult.formData);
      displayMessage('Record saved successfully', 'success');
      currentState = 'normal';
      hasUnsavedChanges = false;
      updateButtonStates();
  } catch (error) {
      console.error('Error saving record:', error);
      displayMessage('Error saving record: ' + error.message, 'error');
  }
}

function printRecord() {
    window.print();
}

function exit() {
    if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to exit?')) {
        return;
    }
    window.location.href = '/';
}