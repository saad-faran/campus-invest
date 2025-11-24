// ========================================
// CONTRIBUTION/INVESTMENT PAGE - COMPLETE FLOW
// ========================================

let currentStartup = null;
let selectedAmount = 0;
let selectedInvestor = null;

// ========================================
// 1. INITIALIZE PAGE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  initPage();
});

async function initPage() {
  // Check investor status first
  if (!checkInvestorStatus()) {
    return; // Stop if no investors found
  }
  
  // Get startup ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const startupId = urlParams.get('startup_id');
  
  if (!startupId) {
    alert('No startup ID provided. Redirecting to listings...');
    window.location.href = '../startup-listings/startup-listings.html';
    return;
  }
  
  // Load startup data
  await loadStartupData(startupId);
  
  // Setup event listeners
  setupEventListeners();
  
  // Populate investor dropdown
  populateInvestorDropdown();
}

// ========================================
// 2. CHECK INVESTOR STATUS
// ========================================
function checkInvestorStatus() {
  const investors = JSON.parse(localStorage.getItem('campusinvest_investors')) || [];
  
  if (investors.length === 0) {
    // Show not registered modal
    showNotRegisteredModal();
    return false;
  }
  
  return true;
}

// ========================================
// 3. LOAD STARTUP DATA
// ========================================
async function loadStartupData(startupId) {
  try {
    // Load from JSON file
    const response = await fetch('../../data/startups.json');
    const jsonStartups = await response.json();
    
    // Load from localStorage (newly registered startups)
    const localStorageStartups = JSON.parse(localStorage.getItem('founderSubmissions') || '[]');
    
    // Combine both arrays
    const allStartups = [...jsonStartups, ...localStorageStartups];
    
    // Find the startup
    const startup = allStartups.find(s => s.id === startupId);
    
    if (!startup) {
      alert('Startup not found. Redirecting...');
      window.location.href = '../startup-listings/startup-listings.html';
      return;
    }
    
    currentStartup = startup;
    populateStartupDetails(startup);
    
    // Update back link
    const backLink = document.getElementById('back-link');
    if (backLink) {
      backLink.href = `../startup-detail/startup-detail.html?id=${startupId}`;
    }
    
  } catch (error) {
    console.error('Error loading startup:', error);
    alert('Error loading startup data. Please try again.');
  }
}

// ========================================
// 4. POPULATE STARTUP DETAILS
// ========================================
function populateStartupDetails(startup) {
  // Header
  const nameHeader = document.getElementById('startup-name-header');
  const categoryHeader = document.getElementById('startup-category-header');
  if (nameHeader) nameHeader.textContent = startup.name;
  if (categoryHeader) categoryHeader.textContent = startup.category;
  
  // Summary card
  const logo = document.getElementById('startup-logo');
  const nameSummary = document.getElementById('startup-name-summary');
  const categorySummary = document.getElementById('startup-category-summary');
  
  if (logo) logo.src = startup.logo || 'https://via.placeholder.com/100';
  if (nameSummary) nameSummary.textContent = startup.name;
  if (categorySummary) categorySummary.textContent = startup.category;
  
  // Funding information
  const goal = parseInt(startup.fundingGoal) || 0;
  const raised = parseInt(startup.fundingRaised) || 0;
  const remaining = Math.max(0, goal - raised);
  const percentage = goal > 0 ? (raised / goal) * 100 : 0;
  
  const goalElement = document.getElementById('funding-goal');
  const raisedElement = document.getElementById('funding-raised');
  const remainingElement = document.getElementById('funding-remaining');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');
  
  if (goalElement) goalElement.textContent = `PKR ${goal.toLocaleString()}`;
  if (raisedElement) raisedElement.textContent = `PKR ${raised.toLocaleString()}`;
  if (remainingElement) remainingElement.textContent = `PKR ${remaining.toLocaleString()}`;
  if (progressFill) progressFill.style.width = `${Math.min(percentage, 100)}%`;
  if (progressText) progressText.textContent = `${Math.round(percentage)}% funded`;
  
  // Store for later use
  currentStartup.fundingGoal = goal;
  currentStartup.fundingRaised = raised;
  currentStartup.remaining = remaining;
}

// ========================================
// 5. POPULATE INVESTOR DROPDOWN
// ========================================
function populateInvestorDropdown() {
  const investors = JSON.parse(localStorage.getItem('campusinvest_investors')) || [];
  const select = document.getElementById('investorSelect');
  
  if (!select) return;
  
  // Clear existing options (except first one)
  select.innerHTML = '<option value="">-- Select Your Profile --</option>';
  
  // Add investors
  investors.forEach(investor => {
    const option = document.createElement('option');
    option.value = investor.id;
    option.textContent = `${investor.fullName} (${investor.email})`;
    select.appendChild(option);
  });
}

// ========================================
// 6. SETUP EVENT LISTENERS
// ========================================
function setupEventListeners() {
  // Investor selection
  const investorSelect = document.getElementById('investorSelect');
  if (investorSelect) {
    investorSelect.addEventListener('change', function() {
      const investors = JSON.parse(localStorage.getItem('campusinvest_investors')) || [];
      selectedInvestor = investors.find(inv => inv.id === this.value);
      validateForm();
    });
  }
  
  // Quick amount buttons
  document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const amount = parseInt(this.getAttribute('data-amount'));
      handleAmountSelection(amount);
    });
  });
  
  // Custom amount input
  const customAmount = document.getElementById('customAmount');
  if (customAmount) {
    customAmount.addEventListener('input', function() {
      const amount = parseInt(this.value) || 0;
      if (amount > 0) {
        handleAmountSelection(amount);
      }
    });
  }
  
  // Payment method
  const paymentMethod = document.getElementById('paymentMethod');
  if (paymentMethod) {
    paymentMethod.addEventListener('change', validateForm);
  }
  
  // Checkboxes
  const agreeTerms = document.getElementById('agreeTerms');
  const agreeRisk = document.getElementById('agreeRisk');
  if (agreeTerms) agreeTerms.addEventListener('change', validateForm);
  if (agreeRisk) agreeRisk.addEventListener('change', validateForm);
  
  // Submit button
  const contributeBtn = document.getElementById('contributeBtn');
  if (contributeBtn) {
    contributeBtn.addEventListener('click', processContribution);
  }
  
  // Modal close buttons
  const cancelModal = document.getElementById('cancel-modal');
  const backToStartup = document.getElementById('back-to-startup');
  const notRegisteredModal = document.getElementById('not-registered-modal');
  
  // Close modal function (make it global for onclick handlers)
  window.closeNotRegisteredModal = function() {
    const modal = document.getElementById('not-registered-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  };
  
  function closeNotRegisteredModal() {
    window.closeNotRegisteredModal();
  }
  
  if (cancelModal) {
    cancelModal.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      closeNotRegisteredModal();
    });
  }
  
  // Close modal when clicking outside
  if (notRegisteredModal) {
    notRegisteredModal.addEventListener('click', function(e) {
      if (e.target === notRegisteredModal) {
        closeNotRegisteredModal();
      }
    });
  }
  
  if (backToStartup) {
    backToStartup.addEventListener('click', function() {
      if (currentStartup) {
        window.location.href = `../startup-detail/startup-detail.html?id=${currentStartup.id}`;
      }
    });
  }
}

// ========================================
// 7. HANDLE AMOUNT SELECTION
// ========================================
function handleAmountSelection(amount) {
  selectedAmount = amount;
  
  // Update button states
  document.querySelectorAll('.amount-btn').forEach(btn => {
    btn.classList.remove('selected');
    if (parseInt(btn.getAttribute('data-amount')) === amount) {
      btn.classList.add('selected');
    }
  });
  
  // Update custom amount input
  const customAmount = document.getElementById('customAmount');
  if (customAmount) {
    customAmount.value = amount;
  }
  
  // Detect and show tier
  const tier = detectTier(amount);
  showSelectedTier(tier);
  
  // Update contribute button
  updateContributeButton();
  
  // Validate form
  validateForm();
}

// ========================================
// 8. DETECT TIER
// ========================================
function detectTier(amount) {
  if (amount >= 10000) return "Angel";
  if (amount >= 5000) return "Champion";
  if (amount >= 1000) return "Advocate";
  if (amount >= 100) return "Supporter";
  return null;
}

// ========================================
// 9. SHOW SELECTED TIER
// ========================================
function showSelectedTier(tier) {
  const tierDisplay = document.getElementById('selectedTier');
  const tierName = document.getElementById('tier-name');
  
  if (tier && tierDisplay && tierName) {
    tierName.textContent = tier;
    tierDisplay.style.display = 'block';
  } else if (tierDisplay) {
    tierDisplay.style.display = 'none';
  }
}

// ========================================
// 10. UPDATE CONTRIBUTE BUTTON
// ========================================
function updateContributeButton() {
  const btn = document.getElementById('contributeBtn');
  if (btn && selectedAmount > 0) {
    btn.textContent = `Contribute PKR ${selectedAmount.toLocaleString()}`;
  }
}

// ========================================
// 11. VALIDATE FORM
// ========================================
function validateForm() {
  let isValid = true;
  
  // Check investor selection
  if (!selectedInvestor) {
    isValid = false;
    showError('error-investor', 'Please select your investor profile');
  } else {
    clearError('error-investor');
  }
  
  // Check amount
  if (selectedAmount < 100) {
    isValid = false;
    showError('error-amount', 'Minimum contribution: PKR 100');
  } else if (selectedAmount > 10000) {
    isValid = false;
    showError('error-amount', 'Maximum contribution: PKR 10,000');
  } else if (selectedAmount > currentStartup.remaining) {
    isValid = false;
    showError('error-amount', `Amount exceeds remaining goal (PKR ${currentStartup.remaining.toLocaleString()})`);
  } else {
    clearError('error-amount');
  }
  
  // Check payment method
  const paymentMethod = document.getElementById('paymentMethod');
  if (!paymentMethod || !paymentMethod.value) {
    isValid = false;
    showError('error-payment', 'Please select a payment method');
  } else {
    clearError('error-payment');
  }
  
  // Check checkboxes
  const agreeTerms = document.getElementById('agreeTerms');
  const agreeRisk = document.getElementById('agreeRisk');
  
  if (!agreeTerms || !agreeTerms.checked) {
    isValid = false;
    showError('error-terms', 'You must agree to the terms');
  } else {
    clearError('error-terms');
  }
  
  if (!agreeRisk || !agreeRisk.checked) {
    isValid = false;
    showError('error-risk', 'You must acknowledge the risks');
  } else {
    clearError('error-risk');
  }
  
  // Enable/disable submit button
  const contributeBtn = document.getElementById('contributeBtn');
  if (contributeBtn) {
    contributeBtn.disabled = !isValid;
  }
  
  return isValid;
}

// ========================================
// 12. PROCESS CONTRIBUTION
// ========================================
function processContribution() {
  if (!validateForm()) {
    return;
  }
  
  const contributeBtn = document.getElementById('contributeBtn');
  if (contributeBtn) {
    contributeBtn.disabled = true;
    contributeBtn.classList.add('loading');
    contributeBtn.textContent = 'Processing...';
  }
  
  // Simulate processing delay
  setTimeout(() => {
    // Create investment record
    const investmentData = {
      id: 'investment_' + Date.now(),
      investorId: selectedInvestor.id,
      investorName: selectedInvestor.fullName,
      investorEmail: selectedInvestor.email,
      startupId: currentStartup.id,
      startupName: currentStartup.name,
      amount: selectedAmount,
      tier: detectTier(selectedAmount),
      paymentMethod: document.getElementById('paymentMethod').value,
      status: 'completed',
      investedAt: new Date().toISOString(),
      transactionId: 'TXN_' + Date.now()
    };
    
    // Save investment
    saveInvestment(investmentData);
    
    // Update startup funding
    updateStartupFunding(currentStartup.id, selectedAmount);
    
    // Show success modal
    showSuccessMessage(investmentData);
    
    // Reset button
    if (contributeBtn) {
      contributeBtn.disabled = false;
      contributeBtn.classList.remove('loading');
    }
    
  }, 2000);
}

// ========================================
// 13. SAVE INVESTMENT
// ========================================
function saveInvestment(investmentData) {
  try {
    let investments = JSON.parse(localStorage.getItem('campusinvest_investments')) || [];
    investments.push(investmentData);
    localStorage.setItem('campusinvest_investments', JSON.stringify(investments));
    console.log('Investment saved:', investmentData);
    return true;
  } catch (error) {
    console.error('Error saving investment:', error);
    return false;
  }
}

// ========================================
// 14. UPDATE STARTUP FUNDING
// ========================================
function updateStartupFunding(startupId, investmentAmount) {
  try {
    // Get all startups from localStorage (newly registered)
    let customStartups = JSON.parse(localStorage.getItem('founderSubmissions')) || [];
    
    // Find and update the startup
    const startup = customStartups.find(s => s.id === startupId);
    if (startup) {
      const currentRaised = parseInt(startup.fundingRaised) || 0;
      startup.fundingRaised = currentRaised + investmentAmount;
      
      // Save back
      localStorage.setItem('founderSubmissions', JSON.stringify(customStartups));
      
      // Update UI immediately
      const newRaised = startup.fundingRaised;
      const goal = parseInt(startup.fundingGoal) || 0;
      const remaining = Math.max(0, goal - newRaised);
      const percentage = goal > 0 ? (newRaised / goal) * 100 : 0;
      
      const raisedElement = document.getElementById('funding-raised');
      const remainingElement = document.getElementById('funding-remaining');
      const progressFill = document.getElementById('progress-fill');
      const progressText = document.getElementById('progress-text');
      
      if (raisedElement) raisedElement.textContent = `PKR ${newRaised.toLocaleString()}`;
      if (remainingElement) remainingElement.textContent = `PKR ${remaining.toLocaleString()}`;
      if (progressFill) {
        progressFill.style.width = `${Math.min(percentage, 100)}%`;
        progressFill.classList.add('animate-progress');
        setTimeout(() => progressFill.classList.remove('animate-progress'), 500);
      }
      if (progressText) progressText.textContent = `${Math.round(percentage)}% funded`;
      
      // Update current startup object
      currentStartup.fundingRaised = newRaised;
      currentStartup.remaining = remaining;
    }
  } catch (error) {
    console.error('Error updating startup funding:', error);
  }
}

// ========================================
// 15. SHOW SUCCESS MESSAGE
// ========================================
function showSuccessMessage(investmentData) {
  const modal = document.getElementById('success-modal');
  const successStartupName = document.getElementById('success-startup-name');
  const successAmount = document.getElementById('success-amount');
  const successTier = document.getElementById('success-tier');
  const successTransaction = document.getElementById('success-transaction');
  
  if (modal) {
    if (successStartupName) successStartupName.textContent = investmentData.startupName;
    if (successAmount) successAmount.textContent = `PKR ${investmentData.amount.toLocaleString()}`;
    if (successTier) successTier.textContent = investmentData.tier;
    if (successTransaction) successTransaction.textContent = investmentData.transactionId;
    
    modal.style.display = 'flex';
  }
}

// ========================================
// 16. SHOW NOT REGISTERED MODAL
// ========================================
function showNotRegisteredModal() {
  const modal = document.getElementById('not-registered-modal');
  if (modal) {
    modal.style.display = 'flex';
  }
}

// ========================================
// 17. ERROR HANDLING HELPERS
// ========================================
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

function clearError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = '';
  }
}

