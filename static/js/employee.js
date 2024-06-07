let currentRecordId = 1; // Initialize with the first record ID

document.addEventListener('DOMContentLoaded', function() {
    fetchData('Employees', currentRecordId);
// document.getElementById('prevButton').addEventListener('click', getPreviousRecord);
// document.getElementById('nextButton').addEventListener('click', getNextRecord);
});

function exit() {
    window.location.href = '/';
}

async function getPreviousRecord() {
    if (currentRecordId > 1) {
      currentRecordId--;
      try {
        const data = await fetchData('Employees', currentRecordId);
        populateForm(data);
      } catch (error) {
        console.error('Error fetching previous record:', error);
      }
    } else {
      console.log('Already at the first record.');
    }
  }
  
  async function getNextRecord() {
    try {
      const data = await fetchData('Employees', currentRecordId + 1);
      if (data) {
        currentRecordId++; // Increment the ID only if a record is found
        populateForm(data);
      } else {
        console.log('No more records found.');
      }
    } catch (error) {
      console.error('Error fetching next record:', error);
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
        // Remove the setCookie line if not needed
        // setCookie('currentEmployeeId', primaryKey);
      } else {
        console.log('No data found');
      }
  
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  
  
function populateForm(record) {
    document.getElementById('ID').value = record[0]; // Primary key
    document.getElementById('EmployeeID').value = record[1]; // EmployeeID
    document.getElementById('EmployeeName').value = record[2];
    document.getElementById('EmployeeAddress').value = record[3];
    document.getElementById('EmployeeCity').value = record[4];
    document.getElementById('EmployeeState').value = record[5];
    document.getElementById('EmployeeZipcode').value = record[6];
    document.getElementById('EmployeePhone').value = record[7];
    document.getElementById('EmployeeEmail').value = record[8];
    document.getElementById('EmployeeActive').checked = Boolean(record[9]);
  }
  
  function searchRecords() {
    // Implement the logic to search for records based on the search input
    console.log('Search button clicked');
  }
  
  function createNewRecord() {
    // Implement the logic to create a new record
    console.log('New button clicked');
  }
  
  function editRecord() {
    // Implement the logic to edit the current record
    console.log('Edit button clicked');
  }
  
  function saveRecord() {
    // Implement the logic to save the current record
    console.log('Save button clicked');
  }
  
  function printRecord() {
    // Implement the logic to print the current record
    console.log('Print button clicked');
  }
  
  function clearForm() {
    // Implement the logic to clear the form fields
    console.log('Clear button clicked');
  }
  