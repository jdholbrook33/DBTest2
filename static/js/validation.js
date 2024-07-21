// validation.js

export function validateEmployeeID(id) {
    // Must be exactly 4 digits
    const idRegex = /^\d{4}$/;
    if (!idRegex.test(id)) {
        return { isValid: false, message: "Employee ID must be exactly 4 digits." };
    }
    return { isValid: true };
}

export function validateState(state) {
    // Two-letter abbreviation
    // For now, we'll just check if it's 2 uppercase letters
    // In a real application, you'd check against a list of valid state abbreviations
    const stateRegex = /^[A-Z]{2}$/;
    if (!stateRegex.test(state)) {
        return { isValid: false, message: "State must be a two-letter abbreviation." };
    }
    return { isValid: true };
}

export function validateZipcode(zipcode) {
    // Two valid formats: XXXXX or XXXXX-XXXX
    const zipcodeRegex = /^\d{5}(-\d{4})?$/;
    if (!zipcodeRegex.test(zipcode)) {
        return { isValid: false, message: "Zipcode must be in the format XXXXX or XXXXX-XXXX." };
    }
    return { isValid: true };
}

export function validatePhone(phone) {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');
    
    // Check if we have exactly 10 digits
    if (digits.length !== 10) {
        return { isValid: false, message: "Phone number must have exactly 10 digits." };
    }
    
    // Format the phone number as XXX-XXX-XXXX
    const formattedPhone = `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6)}`;
    
    return { isValid: true, formattedValue: formattedPhone };
}

export function validateEmail(email) {
        // This is a simple regex for email validation
        // For production use, consider using a more robust solution
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { isValid: false, message: "Please enter a valid email address." };
        }
        return { isValid: true };
    }

export function validateDateOfHire(date) {
    const hireDate = new Date(date);
    const today = new Date();
    
    if (isNaN(hireDate.getTime())) {
        return { isValid: false, message: "Please enter a valid date." };
    }
    
    if (hireDate > today) {
        return { isValid: false, message: "Date of hire cannot be in the future." };
    }
    
    return { isValid: true };
}

// You can also export a main validation function that calls all of these
export function validateEmployeeForm(formData) {
    const errors = {};
    
    const idValidation = validateEmployeeID(formData.EmployeeID);
    if (!idValidation.isValid) errors.EmployeeID = idValidation.message;
    
    const stateValidation = validateState(formData.EmployeeState);
    if (!stateValidation.isValid) errors.EmployeeState = stateValidation.message;
    
    const zipcodeValidation = validateZipcode(formData.EmployeeZipcode);
    if (!zipcodeValidation.isValid) errors.EmployeeZipcode = zipcodeValidation.message;
    
    const phoneValidation = validatePhone(formData.EmployeePhone);
    if (!phoneValidation.isValid) {
        errors.EmployeePhone = phoneValidation.message;
    } else {
        formData.EmployeePhone = phoneValidation.formattedValue;
    }
    
    const emailValidation = validateEmail(formData.EmployeeEmail);
    if (!emailValidation.isValid) errors.EmployeeEmail = emailValidation.message;
    
    const dateValidation = validateDateOfHire(formData.DateOfHire);
    if (!dateValidation.isValid) errors.DateOfHire = dateValidation.message;
    
    return {
        isValid: Object.keys(errors).length === 0,
        errors: errors,
        formData: formData
    };
}
