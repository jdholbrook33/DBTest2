class EmployeeManager extends BaseManager {
  constructor() {
      super('Employees');
      this.currentRecordId = 1; // Start with the first employee
  }

  populateForm(record) {
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

  // Override any methods from BaseManager if you need employee-specific behavior
  // For example:
  // searchRecords() {
  //     console.log('Employee-specific search');
  //     // Implement employee-specific search logic
  // }
}

const employeeManager = new EmployeeManager();

// Event listeners and function calls
document.addEventListener('DOMContentLoaded', function() {
  employeeManager.fetchData(employeeManager.currentRecordId);
});

function exit() { employeeManager.exit(); }
function getPreviousRecord() { employeeManager.getPreviousRecord(); }
function getNextRecord() { employeeManager.getNextRecord(); }
function searchRecords() { employeeManager.searchRecords(); }
function createNewRecord() { employeeManager.createNewRecord(); }
function editRecord() { employeeManager.editRecord(); }
function saveRecord() { employeeManager.saveRecord(); }
function printRecord() { employeeManager.printRecord(); }
function clearForm() { employeeManager.clearForm(); }