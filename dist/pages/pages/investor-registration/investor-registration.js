// ========================================
// INVESTOR REGISTRATION PAGE - VALIDATION & SUBMISSION
// ========================================

// ========================================
// 1. INITIALIZE PAGE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  
  // Setup form validation
  setupFormValidation();
  
  // Setup character counter
  setupCharacterCounter();
  
  // Setup phone number formatting
  setupPhoneFormatting();
  
  // Setup form submission
  setupFormSubmission();
  
  // Setup success modal
  setupSuccessModal();
  
});

// ========================================
// 2. FORM VALIDATION
// ========================================
function setupFormValidation() {
  
  // Real-time validation on blur
  document.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('blur', function() {
      validateField(this);
    });
    
    // Remove error on input
    field.addEventListener('input', function() {
      if (this.classList.contains('error')) {
        this.classList.remove('error');
        const errorMsg = document.getElementById(`error-${this.id || this.name}`);
        if (errorMsg) errorMsg.textContent = '';
      }
    });
  });
  
  // Radio buttons validation
  document.querySelectorAll('input[type="radio"]').forEach(radio => {
    radio.addEventListener('change', function() {
      const errorMsg = document.getElementById('error-investment-range');
      if (errorMsg) errorMsg.textContent = '';
    });
  });
  
  // Checkboxes validation
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      validateAreasOfInterest();
    });
  });
  
}

// ========================================
// 3. VALIDATE INDIVIDUAL FIELD
// ========================================
function validateField(field) {
  const value = field.value.trim();
  const fieldId = field.id || field.name;
  const errorElement = document.getElementById(`error-${fieldId}`);
  
  let isValid = true;
  let errorMessage = '';
  
  // Required field check
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required';
  }
  
  // Full Name validation
  if (field.id === 'full-name' && value) {
    if (value.length < 3) {
      isValid = false;
      errorMessage = 'Name must be at least 3 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(value)) {
      isValid = false;
      errorMessage = 'Name can only contain letters and spaces';
    }
  }
  
  // Email validation
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address';
    }
  }
  
  // Phone validation (Pakistani format)
  if (field.id === 'phone' && value) {
    const phoneRegex = /^03\d{2}-?\d{7}$/;
    const cleanPhone = value.replace(/\D/g, '');
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith('03')) {
      isValid = false;
      errorMessage = 'Please enter a valid Pakistani phone number (03XX-XXXXXXX)';
    }
  }
  
  // Motivation word count validation
  if (field.id === 'motivation' && value) {
    const wordCount = value.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount < 50) {
      isValid = false;
      errorMessage = 'Please write at least 50 words';
    } else if (wordCount > 300) {
      isValid = false;
      errorMessage = 'Please keep it under 300 words';
    }
  }
  
  // Update UI
  if (!isValid) {
    field.classList.add('error');
    if (errorElement) errorElement.textContent = errorMessage;
  } else {
    field.classList.remove('error');
    if (errorElement) errorElement.textContent = '';
  }
  
  return isValid;
}

// ========================================
// 4. VALIDATE AREAS OF INTEREST
// ========================================
function validateAreasOfInterest() {
  const checkboxes = document.querySelectorAll('input[name="areasOfInterest"]:checked');
  const errorElement = document.getElementById('error-areas-interest');
  
  if (checkboxes.length === 0) {
    if (errorElement) errorElement.textContent = 'Please select at least one area of interest';
    return false;
  } else {
    if (errorElement) errorElement.textContent = '';
    return true;
  }
}

// ========================================
// 5. VALIDATE ENTIRE FORM
// ========================================
function validateForm() {
  let isValid = true;
  
  // Validate all required fields
  const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
  requiredFields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });
  
  // Validate investment range (radio buttons)
  const investmentRange = document.querySelector('input[name="investmentRange"]:checked');
  if (!investmentRange) {
    isValid = false;
    const errorElement = document.getElementById('error-investment-range');
    if (errorElement) errorElement.textContent = 'Please select an investment range';
  }
  
  // Validate areas of interest
  if (!validateAreasOfInterest()) {
    isValid = false;
  }
  
  return isValid;
}

// ========================================
// 6. CHARACTER COUNTER
// ========================================
function setupCharacterCounter() {
  const motivationField = document.getElementById('motivation');
  const counterElement = document.getElementById('character-count');
  
  if (motivationField && counterElement) {
    motivationField.addEventListener('input', function() {
      const text = this.value.trim();
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      
      counterElement.textContent = `${wordCount} / 300 words`;
      
      // Update color based on word count
      counterElement.classList.remove('valid', 'invalid');
      if (wordCount < 50) {
        counterElement.classList.add('invalid');
      } else if (wordCount <= 300) {
        counterElement.classList.add('valid');
      } else {
        counterElement.classList.add('invalid');
      }
    });
  }
}

// ========================================
// 7. PHONE NUMBER FORMATTING
// ========================================
function setupPhoneFormatting() {
  const phoneInput = document.getElementById('phone');
  
  if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      
      if (value.length > 4) {
        value = value.substring(0, 4) + '-' + value.substring(4, 11);
      }
      
      e.target.value = value;
    });
  }
}

// ========================================
// 8. FORM SUBMISSION
// ========================================
function setupFormSubmission() {
  const form = document.getElementById('investor-registration-form');
  
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Validate form
      if (!validateForm()) {
        // Scroll to first error
        const firstError = document.querySelector('.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }
      
      // Collect form data
      const formData = collectFormData();
      
      // Show loading state
      const submitButton = document.getElementById('submit-btn');
      submitButton.disabled = true;
      submitButton.classList.add('loading');
      submitButton.textContent = 'Registering...';
      
      // Simulate API call delay
      setTimeout(() => {
        // Save to localStorage
        saveInvestor(formData);
        
        // Hide loading state
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
        submitButton.textContent = 'Register as Investor';
        
        // Show success modal
        showSuccessModal();
        
        // Clear form
        form.reset();
        
        // Reset character counter
        const counterElement = document.getElementById('character-count');
        if (counterElement) {
          counterElement.textContent = '0 / 300 words';
          counterElement.classList.remove('valid', 'invalid');
        }
        
      }, 1500);
    });
  }
}

// ========================================
// 9. COLLECT FORM DATA
// ========================================
function collectFormData() {
  const form = document.getElementById('investor-registration-form');
  const formData = new FormData(form);
  
  // Get selected areas of interest
  const areasOfInterest = [];
  document.querySelectorAll('input[name="areasOfInterest"]:checked').forEach(checkbox => {
    areasOfInterest.push(checkbox.value);
  });
  
  // Build investor data object
  const investorData = {
    id: 'investor_' + Date.now(),
    fullName: formData.get('fullName'),
    email: formData.get('email'),
    university: formData.get('university'),
    role: formData.get('role'),
    investmentRange: formData.get('investmentRange'),
    areasOfInterest: areasOfInterest,
    motivation: formData.get('motivation'),
    phoneNumber: formData.get('phone') || '',
    registeredAt: new Date().toISOString(),
    status: 'active'
  };
  
  return investorData;
}

// ========================================
// 10. SAVE INVESTOR TO LOCALSTORAGE
// ========================================
function saveInvestor(investorData) {
  try {
    // Get existing investors
    let investors = JSON.parse(localStorage.getItem('campusinvest_investors')) || [];
    
    // Add new investor
    investors.push(investorData);
    
    // Save back to localStorage
    localStorage.setItem('campusinvest_investors', JSON.stringify(investors));
    
    console.log('Investor registered successfully:', investorData);
    
    return true;
  } catch (error) {
    console.error('Error saving investor:', error);
    alert('There was an error saving your registration. Please try again.');
    return false;
  }
}

// ========================================
// 11. SUCCESS MODAL
// ========================================
function showSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function hideSuccessModal() {
  const modal = document.getElementById('success-modal');
  if (modal) {
    modal.style.display = 'none';
  }
}

function setupSuccessModal() {
  const closeButton = document.getElementById('close-modal');
  const modal = document.getElementById('success-modal');
  
  if (closeButton) {
    closeButton.addEventListener('click', hideSuccessModal);
  }
  
  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        hideSuccessModal();
      }
    });
  }
  
  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal && modal.style.display === 'flex') {
      hideSuccessModal();
    }
  });
}

