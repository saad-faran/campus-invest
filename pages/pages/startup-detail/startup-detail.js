// ========================================
// DYNAMIC STARTUP DETAIL PAGE
// ========================================

let currentStartup = null;

// ========================================
// 1. GET STARTUP ID FROM URL
// ========================================
function getStartupIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// ========================================
// 2. LOAD STARTUP DATA FROM BOTH JSON AND LOCALSTORAGE
// ========================================
async function loadStartupData(startupId) {
  try {
    console.log('[DEBUG] Looking for startup with ID:', startupId);
    
    // 1. Load existing startups from JSON file
    const response = await fetch('../../data/startups.json');
    
    if (!response.ok) {
      throw new Error('Failed to load startups data');
    }
    
    const jsonStartups = await response.json();
    console.log('[DEBUG] Loaded from JSON:', jsonStartups.length, 'startups');
    
    // 2. Load newly registered startups from localStorage
    const localStorageStartups = JSON.parse(localStorage.getItem('founderSubmissions') || '[]');
    console.log('[DEBUG] Loaded from localStorage:', localStorageStartups.length, 'startups');
    
    // 3. Combine both arrays
    const allStartups = [...jsonStartups, ...localStorageStartups];
    console.log('[DEBUG] Total startups:', allStartups.length);
    
    // 4. Log all available IDs for debugging
    console.log('[DEBUG] Available startup IDs:', allStartups.map(s => s.id));
    
    // 5. Find the specific startup by ID
    const startup = allStartups.find(s => s.id === startupId);
    
    if (!startup) {
      console.error('[ERROR] Startup not found with ID:', startupId);
      showErrorMessage();
      return null;
    }
    
    console.log('[SUCCESS] Found startup:', startup);
    
    return startup;
    
  } catch (error) {
    console.error('[ERROR] Error loading startup data:', error);
    showErrorMessage();
    return null;
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
// 3. POPULATE PAGE WITH STARTUP DATA
// ========================================
function populateStartupDetails(startup) {
  currentStartup = startup;
  
  // Restore hero banner structure if it was replaced by loading state
  const heroBanner = document.querySelector('.hero-banner');
  if (heroBanner && !heroBanner.querySelector('#startup-name')) {
    heroBanner.innerHTML = `
      <div class="hero-content">
        <h1 id="startup-name">${startup.name}</h1>
        <p class="hero-tagline" id="startup-category">${startup.category}${isNewStartup(startup) ? ' <span class="new-badge-hero">NEW ✨</span>' : ''}</p>
      </div>
    `;
  } else {
    // Hero Section - normal update
    const nameElement = document.getElementById('startup-name');
    if (nameElement) {
      nameElement.textContent = startup.name;
    }
    
    // Add NEW badge if recently submitted
    const categoryElement = document.getElementById('startup-category');
    if (categoryElement) {
      if (isNewStartup(startup)) {
        categoryElement.innerHTML = `${startup.category} <span class="new-badge-hero">NEW ✨</span>`;
      } else {
        categoryElement.textContent = startup.category;
      }
    }
  }
  
  // Description Section
  const descElement = document.getElementById('startup-description');
  if (descElement) {
    descElement.textContent = startup.description || 'No description available.';
  }
  
  // Problem Section (use description if no separate problem field)
  const problemElement = document.getElementById('startup-problem');
  if (problemElement) {
    const problemText = startup.problem || "This startup is solving a critical problem in the " + startup.category + " space.";
    problemElement.textContent = problemText;
  }
  
  // Solution Section (use description if no separate solution field)
  const solutionElement = document.getElementById('startup-solution');
  if (solutionElement) {
    const solutionText = startup.solution || startup.description || 'Solution details coming soon.';
    solutionElement.textContent = solutionText;
  }
  
  // Team Section
  populateTeam(startup.team);
  
  // Funding Information
  const goalElement = document.getElementById('funding-goal');
  if (goalElement) {
    goalElement.textContent = `PKR ${startup.fundingGoal.toLocaleString()}`;
  }
  
  const raisedElement = document.getElementById('funding-raised');
  if (raisedElement) {
    raisedElement.textContent = `PKR ${startup.fundingRaised.toLocaleString()}`;
  }
  
  // Progress Bar
  const progressBar = document.getElementById('progress-bar');
  const progressText = document.getElementById('progress-text');
  if (progressBar && progressText) {
    const fundingPercentage = (startup.fundingRaised / startup.fundingGoal) * 100;
    progressBar.style.width = fundingPercentage + '%';
    progressText.textContent = Math.round(fundingPercentage) + '% funded';
  }
  
  // Meta Information
  const universityElement = document.getElementById('startup-university');
  if (universityElement) {
    universityElement.textContent = startup.university || '-';
  }
  
  const stageElement = document.getElementById('startup-stage');
  if (stageElement) {
    stageElement.textContent = startup.stage || '-';
  }
  
  // Show status if pending
  const fundingCard = document.querySelector('.funding-card');
  if (startup.status === 'pending' && fundingCard) {
    // Remove existing status banner if any
    const existingBanner = fundingCard.querySelector('.status-banner');
    if (existingBanner) {
      existingBanner.remove();
    }
    
    const statusHTML = '<div class="status-banner pending">⏳ This startup is pending admin review</div>';
    fundingCard.insertAdjacentHTML('beforeend', statusHTML);
  }
  
  // Show content, hide error
  const contentContainer = document.querySelector('.content-container');
  if (contentContainer) {
    contentContainer.style.display = 'block';
  }
  
  const errorMessage = document.getElementById('error-message');
  if (errorMessage) {
    errorMessage.style.display = 'none';
  }
}

// ========================================
// 4. POPULATE TEAM SECTION
// ========================================
function populateTeam(team) {
  const teamGrid = document.getElementById('team-grid');
  
  // If no team data exists, use default
  if (!team || team.length === 0) {
    team = [
      { name: "Founder 1", role: "CEO" },
      { name: "Founder 2", role: "CTO" },
      { name: "Founder 3", role: "CMO" }
    ];
  }
  
  teamGrid.innerHTML = '';
  
  team.forEach(member => {
    const memberHTML = `
      <div class="team-member">
        <div class="avatar-placeholder">
          ${member.name.charAt(0).toUpperCase()}
        </div>
        <h4>${member.name}</h4>
        <p>${member.role}</p>
      </div>
    `;
    teamGrid.innerHTML += memberHTML;
  });
}

// ========================================
// 5. SHOW ERROR MESSAGE WITH DEBUG INFO
// ========================================
function showErrorMessage() {
  const contentContainer = document.querySelector('.content-container');
  const errorMessage = document.getElementById('error-message');
  
  if (contentContainer) {
    contentContainer.style.display = 'none';
  }
  
  if (errorMessage) {
    // Get the attempted ID for debugging
    const urlParams = new URLSearchParams(window.location.search);
    const attemptedId = urlParams.get('id');
    
    errorMessage.innerHTML = `
      <h2>Startup Not Found</h2>
      <p>The startup you're looking for doesn't exist or may have been removed.</p>
      <p style="color: #94A3B8; font-size: 14px; margin-top: 16px;">
        Attempted ID: <code>${attemptedId || 'none'}</code>
      </p>
      <a href="../startup-listings/startup-listings.html" class="btn-back">← Back to Listings</a>
    `;
    
    errorMessage.style.display = 'block';
    
    // Log for debugging
    console.error('Startup not found. Attempted ID:', attemptedId);
  }
}

// ========================================
// LOADING STATE FUNCTIONS
// ========================================
function showLoadingState() {
  const heroBanner = document.querySelector('.hero-banner');
  if (heroBanner) {
    heroBanner.innerHTML = `
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p>Loading startup details...</p>
      </div>
    `;
  }
}

function hideLoadingState() {
  // Loading will be replaced by actual content when populateStartupDetails is called
}

// ========================================
// 6. CONTRIBUTE BUTTON ACTION
// ========================================
function setupContributeButton() {
  const contributeBtn = document.getElementById('btn-contribute');
  
  if (contributeBtn) {
    contributeBtn.addEventListener('click', function() {
      if (currentStartup) {
        // Redirect to contribution page with startup ID
        window.location.href = `../contribution/contribution.html?startup_id=${currentStartup.id}`;
      }
    });
  }
}

// ========================================
// 7. FADE-IN ANIMATION FOR CARDS
// ========================================
function setupCardAnimations() {
  const cards = document.querySelectorAll('.info-card');
  
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  cards.forEach(card => observer.observe(card));
}

// ========================================
// 8. INITIALIZE PAGE
// ========================================
document.addEventListener('DOMContentLoaded', async function() {
  
  try {
    // Show loading state
    showLoadingState();
    
    // Get startup ID from URL
    const startupId = getStartupIdFromURL();
    
    if (!startupId) {
      hideLoadingState();
      showErrorMessage();
      return;
    }
    
    // Load startup data
    const startup = await loadStartupData(startupId);
    
    hideLoadingState();
    
    if (startup) {
      // Populate page with data
      populateStartupDetails(startup);
      
      // Setup button
      setupContributeButton();
      
      // Setup card animations
      setupCardAnimations();
      
      // Add fade-in animation to container
      const contentContainer = document.querySelector('.content-container');
      if (contentContainer) {
        contentContainer.classList.add('fade-in');
      }
    } else {
      // If startup is null, error message should already be shown
      hideLoadingState();
    }
  } catch (error) {
    console.error('[FATAL ERROR] Failed to initialize page:', error);
    hideLoadingState();
    showErrorMessage();
  }
  
});
