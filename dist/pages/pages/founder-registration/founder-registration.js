// ========================================
// FOUNDER REGISTRATION PAGE - MULTI-STEP FORM
// ========================================

let currentStep = 1;
const totalSteps = 3;

// ========================================
// 1. INITIALIZE PAGE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  
  // Step navigation
  setupStepNavigation();
  
  // Form validation
  setupFormValidation();
  
  // Character counter for description
  setupCharacterCounter();
  
  // Form submission
  setupFormSubmission();
  
  // Phone number formatting
  setupPhoneFormatting();
  
  // Prevent form submission on Enter key (except in textareas)
  preventEnterSubmission();
  
});

// ========================================
// 2. STEP NAVIGATION
// ========================================
function setupStepNavigation() {
  
  // Next buttons
  document.querySelectorAll('.btn-next').forEach(button => {
    button.addEventListener('click', function() {
      const nextStep = parseInt(this.getAttribute('data-next'));
      
      if (validateCurrentStep()) {
        goToStep(nextStep);
      }
    });
  });
  
  // Previous buttons
  document.querySelectorAll('.btn-prev').forEach(button => {
    button.addEventListener('click', function() {
      const prevStep = parseInt(this.getAttribute('data-prev'));
      goToStep(prevStep);
    });
  });
  
}

function goToStep(stepNumber) {
  // Hide current step
  const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  if (currentStepElement) {
    currentStepElement.classList.remove('active');
  }
  
  // Show next step
  const nextStepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
  if (nextStepElement) {
    nextStepElement.classList.add('active');
  }
  
  // Update step indicator
  updateStepIndicator(stepNumber);
  
  // Update current step
  currentStep = stepNumber;
  
  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepIndicator(stepNumber) {
  document.querySelectorAll('.step').forEach((step, index) => {
    const stepNum = index + 1;
    
    if (stepNum < stepNumber) {
      step.classList.add('completed');
      step.classList.remove('active');
    } else if (stepNum === stepNumber) {
      step.classList.add('active');
      step.classList.remove('completed');
    } else {
      step.classList.remove('active', 'completed');
    }
  });
}

// ========================================
// 3. FORM VALIDATION
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
        const errorMsg = document.getElementById(`error-${this.id}`);
        if (errorMsg) errorMsg.textContent = '';
      }
    });
  });
  
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  const errorElement = document.getElementById(`error-${field.id}`);
  
  let isValid = true;
  let errorMessage = '';
  
  // Required field check
  if (field.hasAttribute('required') && !value) {
    isValid = false;
    errorMessage = 'This field is required';
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
  
  // CMS ID validation
  if (field.id === 'cms-id' && value) {
    if (value.length < 5) {
      isValid = false;
      errorMessage = 'CMS ID must be at least 5 characters';
    }
  }
  
  // Funding goal validation
  if (field.id === 'funding-goal' && value) {
    const amount = parseInt(value);
    if (amount < 5000) {
      isValid = false;
      errorMessage = 'Minimum funding goal is PKR 5,000';
    } else if (amount > 500000) {
      isValid = false;
      errorMessage = 'Maximum funding goal is PKR 500,000';
    }
  }
  
  // Word count validation for description
  if (field.id === 'description' && value) {
    const wordCount = value.split(/\s+/).filter(word => word.length > 0).length;
    if (wordCount > 200) {
      isValid = false;
      errorMessage = 'Description cannot exceed 200 words';
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

function validateCurrentStep() {
  const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  if (!currentStepElement) return false;
  
  const fields = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
  
  let isValid = true;
  
  fields.forEach(field => {
    if (!validateField(field)) {
      isValid = false;
    }
  });
  
  // Special validation for terms checkbox in step 3
  if (currentStep === 3) {
    const termsCheckbox = document.getElementById('terms');
    const termsError = document.getElementById('error-terms');
    if (!termsCheckbox.checked) {
      isValid = false;
      if (termsError) termsError.textContent = 'You must agree to the terms';
    } else {
      if (termsError) termsError.textContent = '';
    }
  }
  
  return isValid;
}

// ========================================
// 4. CHARACTER COUNTER
// ========================================
function setupCharacterCounter() {
  const descriptionField = document.getElementById('description');
  const counterElement = document.querySelector('.character-count');
  
  if (descriptionField && counterElement) {
    descriptionField.addEventListener('input', function() {
      const text = this.value.trim();
      const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;
      counterElement.textContent = `${wordCount} / 200 words`;
      
      if (wordCount > 200) {
        counterElement.style.color = 'var(--error-red)';
      } else {
        counterElement.style.color = 'var(--text-grey)';
      }
    });
  }
}

// ========================================
// 5. FORM SUBMISSION
// ========================================
function setupFormSubmission() {
  const form = document.getElementById('founder-registration-form');
  
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      if (!validateCurrentStep()) {
        return;
      }
      
      // Collect form data
      const formData = collectFormData();
      
      // Show loading state
      const submitButton = document.querySelector('.btn-submit');
      if (submitButton) {
        submitButton.textContent = 'Submitting...';
        submitButton.disabled = true;
      }
      
      // Simulate API call (replace with actual backend call later)
      try {
        await saveToJSON(formData);
        showSuccessMessage(formData.name);
      } catch (error) {
        console.error('Error submitting form:', error);
        alert('There was an error submitting your application. Please try again.');
        if (submitButton) {
          submitButton.textContent = 'Submit Application';
          submitButton.disabled = false;
        }
      }
    });
  }
}

function collectFormData() {
  const form = document.getElementById('founder-registration-form');
  const formData = new FormData(form);
  
  // Convert FormData to object
  const data = {
    id: 'startup_' + Date.now(), // Generate unique ID
    submittedAt: new Date().toISOString(),
    
    // Personal Info
    founderName: formData.get('founderName'),
    cmsId: formData.get('cmsId'),
    university: formData.get('university'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    
    // Startup Details
    name: formData.get('startupName'),
    category: formData.get('category'),
    stage: formData.get('stage'),
    description: formData.get('description'),
    problem: formData.get('problem'),
    solution: formData.get('solution'),
    teamSize: formData.get('teamSize') || 1,
    
    // Funding Info
    fundingGoal: parseInt(formData.get('fundingGoal')),
    fundingRaised: 0, // Initially 0
    fundingPurpose: formData.get('fundingPurpose'),
    timeline: formData.get('timeline') || 'Not specified',
    
    // Additional fields for consistency with startups.json
    logo: 'https://via.placeholder.com/100',
    team: [
      {
        name: formData.get('founderName'),
        role: 'Founder & CEO'
      }
    ],
    
    // Status (default to pending - requires admin approval)
    status: 'pending' // Will be reviewed by admin before appearing in listings
  };
  
  return data;
}

async function saveToJSON(data) {
  // Simulate saving to JSON file
  // In production, this would be an API call to your backend
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // For now, store in localStorage as demo
      let submissions = JSON.parse(localStorage.getItem('founderSubmissions') || '[]');
      submissions.push(data);
      localStorage.setItem('founderSubmissions', JSON.stringify(submissions));
      
      console.log('Form submitted:', data);
      resolve();
    }, 1500);
  });
  
  /* 
  // REAL IMPLEMENTATION (when backend is ready):
  
  const response = await fetch('/api/submit-startup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  
  if (!response.ok) {
    throw new Error('Submission failed');
  }
  
  return await response.json();
  */
}

function showSuccessMessage(startupName) {
  // Hide form
  const form = document.getElementById('founder-registration-form');
  const stepsIndicator = document.querySelector('.steps-indicator');
  
  if (form) form.style.display = 'none';
  if (stepsIndicator) stepsIndicator.style.display = 'none';
  
  // Show success message
  const successMessage = document.getElementById('success-message');
  const submittedNameSpan = document.getElementById('submitted-startup-name');
  
  if (successMessage) {
    if (submittedNameSpan) submittedNameSpan.textContent = startupName;
    successMessage.style.display = 'block';
  }
}

// ========================================
// 6. UTILITY FUNCTIONS
// ========================================

// Format phone number as user types
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

// Prevent form submission on Enter key (except in textareas)
function preventEnterSubmission() {
  const form = document.getElementById('founder-registration-form');
  
  if (form) {
    form.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    });
  }
}

