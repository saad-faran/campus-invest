// ========================================
// STARTUP LISTINGS PAGE - FILTERING & DISPLAY
// ========================================

let startupsData = []; // Will hold all startup data
let filteredStartups = []; // Will hold filtered results

// ========================================
// 1. LOAD STARTUPS FROM BOTH JSON AND LOCALSTORAGE
// ========================================
async function loadStartups() {
  try {
    // 1. Load existing startups from JSON file
    const response = await fetch('../../data/startups.json');
    if (!response.ok) {
      throw new Error('Failed to load startups data');
    }
    const jsonStartups = await response.json();
    
    // 2. Load newly registered startups from localStorage
    const localStorageStartups = JSON.parse(localStorage.getItem('founderSubmissions') || '[]');
    
    // 3. Filter only approved startups from localStorage
    const approvedLocalStartups = localStorageStartups.filter(startup => {
      // Only show approved startups (or pending if admin wants to show them)
      // For public view, only show approved
      return startup.status === 'approved';
    });
    
    // 4. Merge both arrays
    startupsData = [...jsonStartups, ...approvedLocalStartups];
    
    // 5. Sort by most recent first (newest submissions appear first)
    startupsData.sort((a, b) => {
      const dateA = new Date(a.submittedAt || 0);
      const dateB = new Date(b.submittedAt || 0);
      return dateB - dateA;
    });
    
    // 6. Display all startups
    filteredStartups = startupsData;
    displayStartups(filteredStartups);
    updateResultsCount(filteredStartups.length);
    
    // 7. Show notification if there are new submissions
    showNewSubmissionsNotification(approvedLocalStartups.length);
    
  } catch (error) {
    console.error('Error loading startups:', error);
    // Show error message to user
    const grid = document.getElementById('startups-grid');
    grid.innerHTML = '<div class="no-results"><p>Error loading startups. Please refresh the page.</p></div>';
  }
}

// ========================================
// CHECK IF STARTUP IS NEW (SUBMITTED IN LAST 7 DAYS)
// ========================================
function isNewStartup(startup) {
  if (!startup.submittedAt) return false;
  
  const submittedDate = new Date(startup.submittedAt);
  const now = new Date();
  const daysDiff = (now - submittedDate) / (1000 * 60 * 60 * 24);
  
  return daysDiff <= 7; // Show "NEW" badge for 7 days
}

// ========================================
// SHOW NOTIFICATION FOR NEW SUBMISSIONS
// ========================================
function showNewSubmissionsNotification(count) {
  if (count > 0) {
    // Create a notification banner
    const notification = document.createElement('div');
    notification.className = 'new-submissions-notification';
    notification.innerHTML = `
      <span>🎉 ${count} new startup${count > 1 ? 's' : ''} recently registered!</span>
      <button class="btn-dismiss" onclick="this.parentElement.remove()">✕</button>
    `;
    
    // Insert at the top of the page
    const mainSection = document.querySelector('.startups-grid-section');
    if (mainSection) {
      mainSection.insertBefore(notification, mainSection.firstChild);
    }
  }
}

// ========================================
// 2. DISPLAY STARTUP CARDS
// ========================================
function displayStartups(startups) {
  const grid = document.getElementById('startups-grid');
  const noResults = document.getElementById('no-results');
  
  grid.innerHTML = ''; // Clear existing cards
  
  if (startups.length === 0) {
    grid.style.display = 'none';
    noResults.style.display = 'block';
    return;
  }
  
  grid.style.display = 'grid';
  noResults.style.display = 'none';
  
  startups.forEach((startup, index) => {
    const fundingPercentage = (startup.fundingRaised / startup.fundingGoal) * 100;
    
    const card = document.createElement('div');
    card.className = 'startup-card';
    card.setAttribute('data-university', startup.university);
    card.setAttribute('data-category', startup.category);
    card.setAttribute('data-stage', startup.stage);
    card.style.animationDelay = `${index * 0.05}s`;
    
    card.innerHTML = `
      <div class="startup-logo">
        <img src="${startup.logo}" alt="${startup.name} logo" onerror="this.src='https://via.placeholder.com/100'">
      </div>
      
      <div class="startup-content">
        
        <!-- Badges Container -->
        <div class="badges-container">
          <span class="category-badge">${startup.category}</span>
          ${isNewStartup(startup) ? '<span class="new-badge">NEW ✨</span>' : ''}
        </div>
        
        <h3 class="startup-name">${startup.name}</h3>
        
        <p class="startup-description">${startup.description}</p>
        
        <div class="startup-meta">
          <span class="university-tag">🎓 ${startup.university}</span>
          <span class="stage-tag">📈 ${startup.stage}</span>
        </div>
        
        <!-- Optional: Show status for pending startups -->
        ${startup.status === 'pending' ? '<span class="status-badge pending">⏳ Pending Review</span>' : ''}
        
        <div class="funding-info">
          <div class="funding-row">
            <span>Goal:</span>
            <strong>PKR ${startup.fundingGoal.toLocaleString()}</strong>
          </div>
          <div class="funding-row">
            <span>Raised:</span>
            <strong class="raised-amount">PKR ${startup.fundingRaised.toLocaleString()}</strong>
          </div>
        </div>
        
        <div class="progress-bar-container">
          <div class="progress-bar" style="width: ${Math.min(fundingPercentage, 100)}%"></div>
        </div>
        <p class="progress-text">${Math.round(fundingPercentage)}% funded</p>
        
        <a href="../startup-detail/startup-detail.html?id=${startup.id}" class="btn-view-details">
          View Details
        </a>
      </div>
    `;
    
    grid.appendChild(card);
  });
}

// ========================================
// 3. FILTER FUNCTIONALITY
// ========================================
function applyFilters() {
  const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
  const universityFilter = document.getElementById('filter-university').value;
  const categoryFilter = document.getElementById('filter-category').value;
  const stageFilter = document.getElementById('filter-stage').value;
  
  filteredStartups = startupsData.filter(startup => {
    const matchesSearch = searchTerm === '' || 
                          startup.name.toLowerCase().includes(searchTerm) || 
                          startup.description.toLowerCase().includes(searchTerm);
    const matchesUniversity = universityFilter === 'all' || startup.university === universityFilter;
    const matchesCategory = categoryFilter === 'all' || startup.category === categoryFilter;
    const matchesStage = stageFilter === 'all' || startup.stage === stageFilter;
    
    return matchesSearch && matchesUniversity && matchesCategory && matchesStage;
  });
  
  displayStartups(filteredStartups);
  updateResultsCount(filteredStartups.length);
}

// ========================================
// 4. UPDATE RESULTS COUNT
// ========================================
function updateResultsCount(count) {
  const resultsCount = document.getElementById('results-count');
  resultsCount.textContent = `${count} startup${count !== 1 ? 's' : ''} found`;
}

// ========================================
// 5. RESET FILTERS
// ========================================
function resetFilters() {
  document.getElementById('search-input').value = '';
  document.getElementById('filter-university').value = 'all';
  document.getElementById('filter-category').value = 'all';
  document.getElementById('filter-stage').value = 'all';
  
  filteredStartups = startupsData;
  displayStartups(filteredStartups);
  updateResultsCount(filteredStartups.length);
}

// ========================================
// 6. EVENT LISTENERS
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  
  // Load startups on page load
  loadStartups();
  
  // Search input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
  }
  
  // Filter dropdowns
  const universityFilter = document.getElementById('filter-university');
  const categoryFilter = document.getElementById('filter-category');
  const stageFilter = document.getElementById('filter-stage');
  
  if (universityFilter) {
    universityFilter.addEventListener('change', applyFilters);
  }
  if (categoryFilter) {
    categoryFilter.addEventListener('change', applyFilters);
  }
  if (stageFilter) {
    stageFilter.addEventListener('change', applyFilters);
  }
  
  // Reset button
  const resetBtn = document.getElementById('reset-filters');
  if (resetBtn) {
    resetBtn.addEventListener('click', resetFilters);
  }
  
});

