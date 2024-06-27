class BaseManager {
    constructor(tableName) {
        this.tableName = tableName;
        this.currentRecordId = null;
    }

    async fetchData(id) {
        console.log(`Fetching data for table: ${this.tableName}, primary key: ${id}`);
        try {
            const response = await fetch(`/dbData?table=${this.tableName}&id=${id}`);
            console.log("Response received:", response);
            const data = await response.json();
            console.log("Data received:", data);
            if (data) {
                this.populateForm(data);
                this.currentRecordId = id;
            } else {
                console.log('No data found');
            }
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }

    async getPreviousRecord() {
        if (this.currentRecordId > 1) {
            try {
                const data = await this.fetchData(this.currentRecordId - 1);
                if (data) {
                    this.populateForm(data);
                }
            } catch (error) {
                console.error('Error fetching previous record:', error);
            }
        } else {
            console.log('Already at the first record.');
        }
    }

    async getNextRecord() {
        try {
            const data = await this.fetchData(this.currentRecordId + 1);
            if (data) {
                this.populateForm(data);
            } else {
                console.log('No more records found.');
            }
        } catch (error) {
            console.error('Error fetching next record:', error);
        }
    }

    populateForm(record) {
        throw new Error('populateForm method must be implemented in child class');
    }

    exit() {
        window.location.href = '/';
    }

    searchRecords() {
        console.log('Search button clicked');
        // Implement generic search logic here
    }

    createNewRecord() {
        console.log('New button clicked');
        // Implement generic create logic here
    }

    editRecord() {
        console.log('Edit button clicked');
        // Implement generic edit logic here
    }

    saveRecord() {
        console.log('Save button clicked');
        // Implement generic save logic here
    }

    printRecord() {
        console.log('Print button clicked');
        // Implement generic print logic here
    }

    clearForm() {
        console.log('Clear button clicked');
        // Implement generic clear form logic here
    }
}