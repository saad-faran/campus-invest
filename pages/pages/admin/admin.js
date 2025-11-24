// ========================================
// ADMIN PANEL - AUTHENTICATION & MANAGEMENT
// ========================================

// ========================================
// CONFIGURATION
// ========================================
const ADMIN_PASSWORD = "campusinvest2025";
const AUTHORIZED_EMAILS = [
  "saad@nust.edu.pk",
  "rimsha@nust.edu.pk",
  "hanan@nust.edu.pk",
  "arsalan@nust.edu.pk",
  "zainab@nust.edu.pk",
  "rabia@nust.edu.pk",
  "admin@campusinvest.com",
  "test@admin.com"
];

// ========================================
// PAGE INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  checkAuthentication();
});

// ========================================
// AUTHENTICATION SYSTEM
// ========================================

/**
 * Check if user is already authenticated
 */
function checkAuthentication() {
  const adminAccess = sessionStorage.getItem('adminAccess');
  
  if (adminAccess) {
    try {
      const accessData = JSON.parse(adminAccess);
      
      // Verify the access data is valid
      if (accessData.email && accessData.timestamp) {
        // Check if access is still valid (within 8 hours)
        const now = Date.now();
        const accessTime = accessData.timestamp;
        const eightHours = 8 * 60 * 60 * 1000;
        
        if (now - accessTime < eightHours) {
          // Valid access - show admin panel
          showAdminPanel(accessData.email);
          return;
        }
      }
    } catch (error) {
      console.error('Invalid access data:', error);
    }
  }
  
  // No valid access - show login modal
  showLoginModal();
}

/**
 * Show login modal
 */
function showLoginModal() {
  document.getElementById('loginModal').style.display = 'flex';
  document.getElementById('adminPanel').style.display = 'none';
  
  // Setup login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
}

/**
 * Handle login form submission
 */
function handleLogin(event) {
  event.preventDefault();
  
  const password = document.getElementById('adminPassword').value;
  const email = document.getElementById('adminEmail').value.toLowerCase().trim();
  const errorDiv = document.getElementById('loginError');
  
  // Validate credentials
  if (password === ADMIN_PASSWORD && AUTHORIZED_EMAILS.includes(email)) {
    // Success - store access
    const accessData = {
      email: email,
      timestamp: Date.now()
    };
    sessionStorage.setItem('adminAccess', JSON.stringify(accessData));
    
    // Hide login, show admin panel
    document.getElementById('loginModal').style.display = 'none';
    showAdminPanel(email);
    
  } else {
    // Failed authentication
    if (errorDiv) {
      errorDiv.style.display = 'block';
      errorDiv.textContent = '❌ Invalid credentials. Please check your password and email.';
      
      // Shake animation
      errorDiv.style.animation = 'shake 0.5s';
      setTimeout(() => {
        errorDiv.style.animation = '';
      }, 500);
    }
  }
}

/**
 * Show admin panel after successful authentication
 */
function showAdminPanel(email) {
  document.getElementById('adminPanel').style.display = 'block';
  const welcomeMsg = document.getElementById('welcomeMessage');
  if (welcomeMsg) {
    welcomeMsg.textContent = `Welcome, ${email}`;
  }
  
  // Initialize admin panel
  initializeAdminPanel();
  
  // Setup logout button
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', handleLogout);
  }
}

/**
 * Handle logout
 */
function handleLogout() {
  const confirmLogout = confirm('Are you sure you want to logout?');
  
  if (confirmLogout) {
    sessionStorage.removeItem('adminAccess');
    location.reload();
  }
}

// ========================================
// ADMIN PANEL FUNCTIONALITY
// ========================================

/**
 * Initialize admin panel - load all data
 */
function initializeAdminPanel() {
  // Load stats
  loadDashboardStats();
  
  // Load data for all tabs
  loadStartups();
  loadInvestors();
  loadInvestments();
  
  // Setup tab switching
  setupTabs();
  
  // Setup search and filters
  setupSearchAndFilters();
}

/**
 * Load dashboard statistics
 */
function loadDashboardStats() {
  // Load all data
  const customStartups = JSON.parse(localStorage.getItem('founderSubmissions') || '[]');
  const investors = JSON.parse(localStorage.getItem('campusinvest_investors') || '[]');
  const investments = JSON.parse(localStorage.getItem('campusinvest_investments') || '[]');
  
  // Calculate total funding
  const totalFunding = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  
  // Count pending startups
  const pendingStartups = customStartups.filter(s => (s.status || 'pending') === 'pending').length;
  
  // Update stats display
  const totalStartupsEl = document.getElementById('totalStartups');
  const totalInvestorsEl = document.getElementById('totalInvestors');
  const totalFundingEl = document.getElementById('totalFunding');
  const totalInvestmentsEl = document.getElementById('totalInvestments');
  const pendingStartupsEl = document.getElementById('pendingStartups');
  
  if (totalStartupsEl) totalStartupsEl.textContent = customStartups.length;
  if (totalInvestorsEl) totalInvestorsEl.textContent = investors.length;
  if (totalFundingEl) totalFundingEl.textContent = `PKR ${totalFunding.toLocaleString()}`;
  if (totalInvestmentsEl) totalInvestmentsEl.textContent = investments.length;
  if (pendingStartupsEl) pendingStartupsEl.textContent = pendingStartups;
}

/**
 * Load and display startups
 */
function loadStartups() {
  const customStartups = JSON.parse(localStorage.getItem('founderSubmissions') || '[]');
  const container = document.getElementById('startupsList');
  
  if (!container) return;
  
  if (customStartups.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No Custom Startups</h3>
        <p>Startups registered through the platform will appear here.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = customStartups.map(startup => {
    const goal = parseInt(startup.fundingGoal) || 0;
    const raised = parseInt(startup.fundingRaised) || 0;
    const percentage = goal > 0 ? Math.round((raised / goal) * 100) : 0;
    const status = startup.status || 'pending';
    const statusClass = status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'pending';
    const statusText = status === 'approved' ? '✅ Approved' : status === 'rejected' ? '❌ Rejected' : '⏳ Pending';
    
    return `
      <div class="data-item" data-id="${startup.id}" data-university="${startup.university || ''}" data-status="${status}">
        <div class="item-main">
          <div class="item-header">
            <h3>${startup.name || 'Unnamed Startup'}</h3>
            <span class="badge category-badge">${startup.category || 'N/A'}</span>
            <span class="badge status-badge ${statusClass}">${statusText}</span>
          </div>
          
          <div class="item-details">
            <div class="detail-row">
              <span class="label">🎓 University:</span>
              <span class="value">${startup.university || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">🎯 Goal:</span>
              <span class="value">PKR ${goal.toLocaleString()}</span>
            </div>
            <div class="detail-row">
              <span class="label">💰 Raised:</span>
              <span class="value">PKR ${raised.toLocaleString()} (${percentage}%)</span>
            </div>
            <div class="detail-row">
              <span class="label">📊 Stage:</span>
              <span class="value">${startup.stage || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">📅 Registered:</span>
              <span class="value">${startup.submittedAt ? new Date(startup.submittedAt).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">🆔 ID:</span>
              <span class="value"><code>${startup.id}</code></span>
            </div>
          </div>
        </div>
        
        <div class="item-actions">
          <button class="action-btn view-btn" onclick="viewStartupDetails('${startup.id}')">
            👁️ View
          </button>
          ${status !== 'approved' ? `
            <button class="action-btn approve-btn" onclick="approveStartup('${startup.id}', '${(startup.name || 'Unnamed').replace(/'/g, "\\'")}')">
              ✅ Approve
            </button>
          ` : ''}
          ${status !== 'rejected' ? `
            <button class="action-btn reject-btn" onclick="rejectStartup('${startup.id}', '${(startup.name || 'Unnamed').replace(/'/g, "\\'")}')">
              ❌ Reject
            </button>
          ` : ''}
          ${status === 'rejected' ? `
            <button class="action-btn approve-btn" onclick="approveStartup('${startup.id}', '${(startup.name || 'Unnamed').replace(/'/g, "\\'")}')">
              ✅ Approve
            </button>
          ` : ''}
          <button class="action-btn delete-btn" onclick="deleteStartup('${startup.id}', '${(startup.name || 'Unnamed').replace(/'/g, "\\'")}')">
            🗑️ Delete
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Load and display investors
 */
function loadInvestors() {
  const investors = JSON.parse(localStorage.getItem('campusinvest_investors') || '[]');
  const container = document.getElementById('investorsList');
  
  if (!container) return;
  
  if (investors.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">👥</div>
        <h3>No Registered Investors</h3>
        <p>Investors who register will appear here.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = investors.map(investor => {
    const interests = Array.isArray(investor.areasOfInterest) 
      ? investor.areasOfInterest.join(', ') 
      : (investor.areasOfInterest || 'N/A');
    
    return `
      <div class="data-item" data-id="${investor.id}">
        <div class="item-main">
          <div class="item-header">
            <h3>${investor.fullName || 'Unnamed Investor'}</h3>
            <span class="badge role-badge">${investor.role || 'N/A'}</span>
          </div>
          
          <div class="item-details">
            <div class="detail-row">
              <span class="label">📧 Email:</span>
              <span class="value">${investor.email || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">🎓 University:</span>
              <span class="value">${investor.university || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">💵 Range:</span>
              <span class="value">${investor.investmentRange || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">🏷️ Interests:</span>
              <span class="value">${interests}</span>
            </div>
            <div class="detail-row">
              <span class="label">📅 Registered:</span>
              <span class="value">${investor.registeredAt ? new Date(investor.registeredAt).toLocaleDateString() : 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">🆔 ID:</span>
              <span class="value"><code>${investor.id}</code></span>
            </div>
          </div>
        </div>
        
        <div class="item-actions">
          <button class="action-btn delete-btn" onclick="deleteInvestor('${investor.id}', '${(investor.fullName || 'Unnamed').replace(/'/g, "\\'")}')">
            🗑️ Delete
          </button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Load and display investments
 */
function loadInvestments() {
  const investments = JSON.parse(localStorage.getItem('campusinvest_investments') || '[]');
  const container = document.getElementById('investmentsList');
  
  if (!container) return;
  
  if (investments.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💰</div>
        <h3>No Investments Yet</h3>
        <p>Investment transactions will appear here.</p>
      </div>
    `;
    return;
  }
  
  // Sort by date (newest first)
  investments.sort((a, b) => {
    const dateA = new Date(a.investedAt || 0);
    const dateB = new Date(b.investedAt || 0);
    return dateB - dateA;
  });
  
  container.innerHTML = investments.map(investment => {
    const amount = investment.amount || 0;
    const tier = investment.tier || 'N/A';
    
    return `
      <div class="data-item" data-id="${investment.id}" data-status="${investment.status || 'completed'}">
        <div class="item-main">
          <div class="item-header">
            <h3>PKR ${amount.toLocaleString()}</h3>
            <span class="badge tier-badge">${tier}</span>
          </div>
          
          <div class="item-details">
            <div class="detail-row">
              <span class="label">👤 Investor:</span>
              <span class="value">${investment.investorName || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">🚀 Startup:</span>
              <span class="value">${investment.startupName || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">💳 Method:</span>
              <span class="value">${investment.paymentMethod || 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">📅 Date:</span>
              <span class="value">${investment.investedAt ? new Date(investment.investedAt).toLocaleString() : 'N/A'}</span>
            </div>
            <div class="detail-row">
              <span class="label">📊 Status:</span>
              <span class="value">${investment.status || 'completed'}</span>
            </div>
            <div class="detail-row">
              <span class="label">🆔 Transaction ID:</span>
              <span class="value"><code>${investment.transactionId || 'N/A'}</code></span>
            </div>
          </div>
        </div>
        
        <div class="item-actions">
          <button class="action-btn delete-btn" onclick="deleteInvestment('${investment.id}', ${amount})">
            🗑️ Delete
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// ========================================
// DELETE FUNCTIONS
// ========================================

/**
 * Delete a startup
 */
function deleteStartup(id, name) {
  const confirmDelete = confirm(
    `⚠️ Delete "${name}"?\n\n` +
    `This will:\n` +
    `• Remove the startup permanently\n` +
    `• Delete all associated investments\n\n` +
    `This action cannot be undone.`
  );
  
  if (!confirmDelete) return;
  
  try {
    // Remove from custom startups (founderSubmissions)
    let startups = JSON.parse(localStorage.getItem('founderSubmissions') || '[]');
    startups = startups.filter(s => s.id !== id);
    localStorage.setItem('founderSubmissions', JSON.stringify(startups));
    
    // Remove associated investments
    let investments = JSON.parse(localStorage.getItem('campusinvest_investments') || '[]');
    investments = investments.filter(inv => inv.startupId !== id);
    localStorage.setItem('campusinvest_investments', JSON.stringify(investments));
    
    alert(`✅ "${name}" deleted successfully!`);
    
    // Reload data
    loadDashboardStats();
    loadStartups();
    loadInvestments();
    
  } catch (error) {
    console.error('Error deleting startup:', error);
    alert('❌ Error deleting startup. Please try again.');
  }
}

/**
 * Delete an investor
 */
function deleteInvestor(id, name) {
  const confirmDelete = confirm(
    `⚠️ Delete investor "${name}"?\n\n` +
    `Note: Their investment records will remain in the system.\n\n` +
    `Continue?`
  );
  
  if (!confirmDelete) return;
  
  try {
    let investors = JSON.parse(localStorage.getItem('campusinvest_investors') || '[]');
    investors = investors.filter(inv => inv.id !== id);
    localStorage.setItem('campusinvest_investors', JSON.stringify(investors));
    
    alert(`✅ "${name}" deleted successfully!`);
    
    loadDashboardStats();
    loadInvestors();
    
  } catch (error) {
    console.error('Error deleting investor:', error);
    alert('❌ Error deleting investor. Please try again.');
  }
}

/**
 * Delete an investment
 */
function deleteInvestment(id, amount) {
  const confirmDelete = confirm(
    `⚠️ Delete this PKR ${amount.toLocaleString()} investment?\n\n` +
    `This will reduce the startup's raised amount.\n\n` +
    `Continue?`
  );
  
  if (!confirmDelete) return;
  
  try {
    let investments = JSON.parse(localStorage.getItem('campusinvest_investments') || '[]');
    const investment = investments.find(inv => inv.id === id);
    
    if (investment) {
      // Adjust startup's raised amount
      let startups = JSON.parse(localStorage.getItem('founderSubmissions') || '[]');
      const startup = startups.find(s => s.id === investment.startupId);
      
      if (startup) {
        const currentRaised = parseInt(startup.fundingRaised) || 0;
        const newRaised = Math.max(0, currentRaised - amount);
        startup.fundingRaised = newRaised;
        localStorage.setItem('founderSubmissions', JSON.stringify(startups));
      }
    }
    
    // Remove investment
    investments = investments.filter(inv => inv.id !== id);
    localStorage.setItem('campusinvest_investments', JSON.stringify(investments));
    
    alert('✅ Investment deleted successfully!');
    
    loadDashboardStats();
    loadInvestments();
    loadStartups();
    
  } catch (error) {
    console.error('Error deleting investment:', error);
    alert('❌ Error deleting investment. Please try again.');
  }
}

/**
 * View startup details
 */
function viewStartupDetails(id) {
  window.location.href = `../startup-detail/startup-detail.html?id=${id}`;
}

/**
 * Approve a startup
 */
function approveStartup(id, name) {
  const confirmApprove = confirm(
    `✅ Approve "${name}"?\n\n` +
    `This will make the startup visible in the public listings.\n\n` +
    `Continue?`
  );
  
  if (!confirmApprove) return;
  
  try {
    let startups = JSON.parse(localStorage.getItem('founderSubmissions') || '[]');
    const startup = startups.find(s => s.id === id);
    
    if (startup) {
      startup.status = 'approved';
      startup.approvedAt = new Date().toISOString();
      localStorage.setItem('founderSubmissions', JSON.stringify(startups));
      
      alert(`✅ "${name}" has been approved and is now visible in listings!`);
      
      // Reload data
      loadDashboardStats();
      loadStartups();
    } else {
      alert('❌ Startup not found.');
    }
  } catch (error) {
    console.error('Error approving startup:', error);
    alert('❌ Error approving startup. Please try again.');
  }
}

/**
 * Reject a startup
 */
function rejectStartup(id, name) {
  const confirmReject = confirm(
    `❌ Reject "${name}"?\n\n` +
    `This will hide the startup from public listings.\n\n` +
    `Continue?`
  );
  
  if (!confirmReject) return;
  
  try {
    let startups = JSON.parse(localStorage.getItem('founderSubmissions') || '[]');
    const startup = startups.find(s => s.id === id);
    
    if (startup) {
      startup.status = 'rejected';
      startup.rejectedAt = new Date().toISOString();
      localStorage.setItem('founderSubmissions', JSON.stringify(startups));
      
      alert(`❌ "${name}" has been rejected and hidden from listings.`);
      
      // Reload data
      loadDashboardStats();
      loadStartups();
    } else {
      alert('❌ Startup not found.');
    }
  } catch (error) {
    console.error('Error rejecting startup:', error);
    alert('❌ Error rejecting startup. Please try again.');
  }
}

// ========================================
// DANGER ZONE FUNCTIONS
// ========================================

function clearCustomStartups() {
  const confirm1 = confirm('⚠️ Delete ALL custom startups?\n\nThis cannot be undone!');
  if (!confirm1) return;
  
  const confirm2 = prompt('Type "DELETE" to confirm:');
  if (confirm2 !== 'DELETE') {
    alert('❌ Action cancelled.');
    return;
  }
  
  localStorage.removeItem('founderSubmissions');
  alert('✅ All custom startups cleared!');
  location.reload();
}

function clearAllInvestors() {
  const confirm1 = confirm('⚠️ Delete ALL investors?\n\nThis cannot be undone!');
  if (!confirm1) return;
  
  const confirm2 = prompt('Type "DELETE" to confirm:');
  if (confirm2 !== 'DELETE') {
    alert('❌ Action cancelled.');
    return;
  }
  
  localStorage.removeItem('campusinvest_investors');
  alert('✅ All investors cleared!');
  location.reload();
}

function clearAllInvestments() {
  const confirm1 = confirm('⚠️ Delete ALL investments?\n\nThis cannot be undone!');
  if (!confirm1) return;
  
  const confirm2 = prompt('Type "DELETE" to confirm:');
  if (confirm2 !== 'DELETE') {
    alert('❌ Action cancelled.');
    return;
  }
  
  localStorage.removeItem('campusinvest_investments');
  alert('✅ All investments cleared!');
  location.reload();
}

function resetEntirePlatform() {
  const confirm1 = confirm(
    '💣 RESET ENTIRE PLATFORM?\n\n' +
    'This will DELETE:\n' +
    '• All custom startups\n' +
    '• All investors\n' +
    '• All investments\n\n' +
    '⚠️ THIS CANNOT BE UNDONE! ⚠️'
  );
  
  if (!confirm1) return;
  
  const confirm2 = prompt('Type "RESET EVERYTHING" to confirm (case-sensitive):');
  if (confirm2 !== 'RESET EVERYTHING') {
    alert('❌ Reset cancelled.');
    return;
  }
  
  localStorage.removeItem('founderSubmissions');
  localStorage.removeItem('campusinvest_investors');
  localStorage.removeItem('campusinvest_investments');
  
  alert('✅ Platform reset complete. Redirecting to home...');
  setTimeout(() => {
    window.location.href = '../startup-listings/startup-listings.html';
  }, 1000);
}

// ========================================
// TAB SYSTEM
// ========================================

function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabName = button.getAttribute('data-tab');
      
      // Remove active from all
      document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
      
      // Add active to selected
      button.classList.add('active');
      const targetTab = document.getElementById(`${tabName}-tab`);
      if (targetTab) {
        targetTab.classList.add('active');
      }
    });
  });
}

// ========================================
// SEARCH AND FILTERS
// ========================================

function setupSearchAndFilters() {
  // Search startups
  const searchStartups = document.getElementById('searchStartups');
  if (searchStartups) {
    searchStartups.addEventListener('input', (e) => {
      filterStartups(e.target.value);
    });
  }
  
  // Filter status
  const filterStatus = document.getElementById('filterStatus');
  if (filterStatus) {
    filterStatus.addEventListener('change', (e) => {
      filterStartupsByStatus(e.target.value);
    });
  }
  
  // Filter university
  const filterUniversity = document.getElementById('filterUniversity');
  if (filterUniversity) {
    filterUniversity.addEventListener('change', (e) => {
      filterStartupsByUniversity(e.target.value);
    });
  }
  
  // Search investors
  const searchInvestors = document.getElementById('searchInvestors');
  if (searchInvestors) {
    searchInvestors.addEventListener('input', (e) => {
      filterInvestors(e.target.value);
    });
  }
  
  // Filter investment status
  const filterInvestmentStatus = document.getElementById('filterInvestmentStatus');
  if (filterInvestmentStatus) {
    filterInvestmentStatus.addEventListener('change', (e) => {
      filterInvestmentsByStatus(e.target.value);
    });
  }
}

function filterStartups(query) {
  const items = document.querySelectorAll('#startupsList .data-item');
  const searchTerm = query.toLowerCase();
  
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
  });
}

function filterStartupsByStatus(status) {
  const items = document.querySelectorAll('#startupsList .data-item');
  
  items.forEach(item => {
    if (!status) {
      item.style.display = 'flex';
    } else {
      const itemStatus = item.getAttribute('data-status');
      item.style.display = itemStatus === status ? 'flex' : 'none';
    }
  });
}

function filterStartupsByUniversity(university) {
  const items = document.querySelectorAll('#startupsList .data-item');
  
  items.forEach(item => {
    if (!university) {
      item.style.display = 'flex';
    } else {
      const itemUniversity = item.getAttribute('data-university');
      item.style.display = itemUniversity === university ? 'flex' : 'none';
    }
  });
}

function filterInvestors(query) {
  const items = document.querySelectorAll('#investorsList .data-item');
  const searchTerm = query.toLowerCase();
  
  items.forEach(item => {
    const text = item.textContent.toLowerCase();
    item.style.display = text.includes(searchTerm) ? 'flex' : 'none';
  });
}

function filterInvestmentsByStatus(status) {
  const items = document.querySelectorAll('#investmentsList .data-item');
  
  items.forEach(item => {
    if (!status) {
      item.style.display = 'flex';
    } else {
      const itemStatus = item.getAttribute('data-status');
      item.style.display = itemStatus === status ? 'flex' : 'none';
    }
  });
}

