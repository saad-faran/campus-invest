// ========================================
// LEADERBOARD PAGE - RANKINGS & DISPLAY
// ========================================

let platformStats = null;

// ========================================
// 1. INITIALIZE PAGE
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  initLeaderboard();
});

async function initLeaderboard() {
  // Calculate all platform stats (async)
  platformStats = await calculatePlatformStats();
  
  // Render initial tab (Universities)
  renderUniversityLeaderboard(platformStats.universityStats);
  
  // Setup tab switching
  setupTabNavigation();
}

// ========================================
// 2. LOAD ALL DATA
// ========================================
async function loadAllStartups() {
  let jsonStartups = [];
  let localStorageStartups = [];
  
  try {
    // Load from JSON file
    const response = await fetch('../../data/startups.json');
    if (response.ok) {
      jsonStartups = await response.json();
    }
  } catch (error) {
    console.error('Error loading startups from JSON:', error);
  }
  
  try {
    // Load from localStorage (newly registered)
    localStorageStartups = JSON.parse(localStorage.getItem('founderSubmissions') || '[]');
  } catch (error) {
    console.error('Error loading startups from localStorage:', error);
  }
  
  // Merge both arrays
  return [...jsonStartups, ...localStorageStartups];
}

function loadAllInvestors() {
  return JSON.parse(localStorage.getItem('campusinvest_investors') || '[]');
}

function loadAllInvestments() {
  return JSON.parse(localStorage.getItem('campusinvest_investments') || '[]');
}

// ========================================
// 3. CALCULATE PLATFORM STATS
// ========================================
async function calculatePlatformStats() {
  const startups = await loadAllStartups();
  const investors = loadAllInvestors();
  const investments = loadAllInvestments();
  
  // Calculate university stats
  const universityStats = calculateUniversityStats(startups, investments, investors);
  
  // Rank startups
  const topStartups = rankStartups(startups, investments);
  
  // Rank investors
  const topInvestors = rankInvestors(investors, investments);
  
  return {
    totalStartups: startups.length,
    totalFunding: calculateTotalFunding(investments),
    totalInvestors: investors.length,
    successRate: calculateSuccessRate(startups),
    universityStats,
    topStartups,
    topInvestors
  };
}

// ========================================
// 4. CALCULATE UNIVERSITY STATS
// ========================================
function calculateUniversityStats(startups, investments, investors) {
  const universities = {};
  
  // Process startups
  startups.forEach(startup => {
    const uni = startup.university || 'Unknown';
    if (!universities[uni]) {
      universities[uni] = {
        name: uni,
        startupCount: 0,
        totalRaised: 0,
        investorCount: new Set(),
        startups: []
      };
    }
    universities[uni].startupCount++;
    const raised = parseInt(startup.fundingRaised) || 0;
    universities[uni].totalRaised += raised;
    universities[uni].startups.push(startup);
  });
  
  // Process investments to count investors per university
  investments.forEach(investment => {
    const investor = investors.find(inv => inv.id === investment.investorId);
    if (investor && investor.university) {
      const uni = investor.university;
      if (universities[uni]) {
        universities[uni].investorCount.add(investor.id);
      }
    }
  });
  
  // Calculate scores and convert to array
  const universityArray = Object.values(universities).map(uni => {
    const avgFunding = uni.startupCount > 0 ? uni.totalRaised / uni.startupCount : 0;
    const investorCount = uni.investorCount.size;
    
    // Calculate composite score
    const score = (
      uni.startupCount * 0.4 +
      (uni.totalRaised / 1000) * 0.35 +
      investorCount * 0.15 +
      (avgFunding / 100) * 0.1
    );
    
    return {
      ...uni,
      investorCount: investorCount,
      avgFunding: avgFunding,
      score: score,
      successRate: calculateUniversitySuccessRate(uni.startups)
    };
  });
  
  // Sort by score
  return universityArray.sort((a, b) => b.score - a.score);
}

function calculateUniversitySuccessRate(startups) {
  if (startups.length === 0) return 0;
  const successful = startups.filter(s => {
    const raised = parseInt(s.fundingRaised) || 0;
    const goal = parseInt(s.fundingGoal) || 1;
    return (raised / goal) >= 0.7;
  });
  return Math.round((successful.length / startups.length) * 100);
}

// ========================================
// 5. RANK STARTUPS
// ========================================
function rankStartups(startups, investments) {
  // Group investments by startup
  const startupInvestments = {};
  investments.forEach(inv => {
    if (!startupInvestments[inv.startupId]) {
      startupInvestments[inv.startupId] = [];
    }
    startupInvestments[inv.startupId].push(inv);
  });
  
  // Calculate scores for each startup
  const rankedStartups = startups.map(startup => {
    const invs = startupInvestments[startup.id] || [];
    const totalRaised = parseInt(startup.fundingRaised) || 0;
    const goal = parseInt(startup.fundingGoal) || 1;
    const percentage = (totalRaised / goal) * 100;
    const investorCount = new Set(invs.map(inv => inv.investorId)).size;
    
    // Score: raised amount (50%) + percentage (30%) + investors (20%)
    const score = (totalRaised * 0.5) + (percentage * 100 * 0.3) + (investorCount * 1000 * 0.2);
    
    return {
      ...startup,
      totalRaised,
      goal,
      percentage,
      investorCount,
      score,
      status: getStartupStatus(percentage)
    };
  });
  
  // Sort by score
  return rankedStartups.sort((a, b) => b.score - a.score).slice(0, 20); // Top 20
}

function getStartupStatus(percentage) {
  if (percentage >= 100) return 'fully-funded';
  if (percentage >= 50) return 'active';
  return 'new';
}

// ========================================
// 6. RANK INVESTORS
// ========================================
function rankInvestors(investors, investments) {
  // Group investments by investor
  const investorInvestments = {};
  investments.forEach(inv => {
    if (!investorInvestments[inv.investorId]) {
      investorInvestments[inv.investorId] = [];
    }
    investorInvestments[inv.investorId].push(inv);
  });
  
  // Calculate scores
  const rankedInvestors = investors.map(investor => {
    const invs = investorInvestments[investor.id] || [];
    const totalInvested = invs.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const startupCount = new Set(invs.map(inv => inv.startupId)).size;
    const categories = new Set(invs.map(inv => {
      // Get category from startup (would need to lookup)
      return 'diverse';
    })).size;
    
    // Score: total invested (50%) + startups (30%) + diversity (20%)
    const score = (totalInvested * 0.5) + (startupCount * 5000 * 0.3) + (categories * 2000 * 0.2);
    
    // Get badges
    const badges = getInvestorBadges(invs);
    
    return {
      ...investor,
      totalInvested,
      startupCount,
      badges,
      score,
      successRate: calculateInvestorSuccessRate(invs)
    };
  });
  
  // Sort by score
  return rankedInvestors.sort((a, b) => b.score - a.score).slice(0, 20); // Top 20
}

function getInvestorBadges(investments) {
  const badges = [];
  const totalInvested = investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
  
  if (totalInvested >= 30000) badges.push('Angel');
  if (totalInvested >= 15000) badges.push('Champion');
  if (totalInvested >= 5000) badges.push('Advocate');
  if (totalInvested >= 2000) badges.push('Supporter');
  
  return badges;
}

function calculateInvestorSuccessRate(investments) {
  if (investments.length === 0) return 0;
  // Simplified: assume 85% success rate for demo
  return 85;
}

// ========================================
// 7. HELPER FUNCTIONS
// ========================================
function calculateTotalFunding(investments) {
  return investments.reduce((sum, inv) => sum + (inv.amount || 0), 0);
}

function calculateSuccessRate(startups) {
  if (startups.length === 0) return 0;
  const successful = startups.filter(s => {
    const raised = parseInt(s.fundingRaised) || 0;
    const goal = parseInt(s.fundingGoal) || 1;
    return (raised / goal) >= 0.7;
  });
  return Math.round((successful.length / startups.length) * 100);
}

// ========================================
// 8. RENDER FUNCTIONS
// ========================================
function renderUniversityLeaderboard(universities) {
  const container = document.getElementById('university-leaderboard');
  if (!container) return;
  
  if (universities.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📊</div>
        <h3>No University Data Available</h3>
        <p>Register startups to see university rankings</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = universities.map((uni, index) => {
    const rank = index + 1;
    const rankBadge = getRankBadge(rank);
    const initials = uni.name.substring(0, 2).toUpperCase();
    const maxScore = universities[0].score;
    const percentage = maxScore > 0 ? (uni.score / maxScore) * 100 : 0;
    
    return `
      <div class="leaderboard-card">
        ${rankBadge}
        <div class="card-content">
          <div class="card-icon">${initials}</div>
          <div class="card-info">
            <div class="card-title">${uni.name}</div>
            <div class="card-stats">
              <div class="stat-item">📊 <strong>${uni.startupCount}</strong> Startups</div>
              <div class="stat-item">💰 <strong>PKR ${uni.totalRaised.toLocaleString()}</strong> Raised</div>
              <div class="stat-item">👥 <strong>${uni.investorCount}</strong> Investors</div>
              <div class="stat-item">✅ <strong>${uni.successRate}%</strong> Success Rate</div>
            </div>
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" style="width: ${percentage}%"></div>
              </div>
              <div class="progress-text">${Math.round(percentage)}% Performance</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderStartupLeaderboard(startups) {
  const container = document.getElementById('startups-leaderboard');
  if (!container) return;
  
  if (startups.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🚀</div>
        <h3>No Startups Available</h3>
        <p>Register startups to see rankings</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = startups.map((startup, index) => {
    const rank = index + 1;
    const rankBadge = getRankBadge(rank);
    const rankClass = rank <= 3 ? `rank-${rank}` : '';
    
    return `
      <div class="leaderboard-card startup-card ${rankClass}">
        ${rankBadge}
        <div class="card-content">
          <div class="card-info">
            <div class="card-title">
              ${startup.name}
              <span class="category-badge">${startup.category}</span>
              <span class="university-tag">🎓 ${startup.university}</span>
              <span class="status-badge ${startup.status}">${getStatusText(startup.status)}</span>
            </div>
            <div class="card-stats">
              <div class="stat-item">💰 Goal: <strong>PKR ${startup.goal.toLocaleString()}</strong></div>
              <div class="stat-item">💵 Raised: <strong>PKR ${startup.totalRaised.toLocaleString()}</strong></div>
              <div class="stat-item">📈 <strong>${Math.round(startup.percentage)}%</strong> Funded</div>
              <div class="stat-item">👥 <strong>${startup.investorCount}</strong> Investors</div>
            </div>
            <a href="../startup-detail/startup-detail.html?id=${startup.id}" class="btn-view-details">View Details</a>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderInvestorLeaderboard(investors) {
  const container = document.getElementById('investors-leaderboard');
  if (!container) return;
  
  if (investors.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">👥</div>
        <h3>No Investors Available</h3>
        <p>Register as an investor to see rankings</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = investors.map((investor, index) => {
    const rank = index + 1;
    const rankBadge = getRankBadge(rank);
    const initials = investor.fullName.substring(0, 2).toUpperCase();
    const topBadge = investor.badges[0] || 'Supporter';
    
    return `
      <div class="leaderboard-card">
        ${rankBadge}
        <div class="card-content">
          <div class="card-icon">${initials}</div>
          <div class="card-info">
            <div class="card-title">
              ${investor.fullName}
              <span class="university-tag">🎓 ${investor.university}</span>
              <span class="role-badge">${investor.role}</span>
            </div>
            <div class="card-stats">
              <div class="stat-item">💰 <strong>PKR ${investor.totalInvested.toLocaleString()}</strong> Total Invested</div>
              <div class="stat-item">🚀 <strong>${investor.startupCount}</strong> Startups Supported</div>
              <div class="stat-item">⭐ <strong>${investor.successRate}%</strong> Success Rate</div>
            </div>
            <div class="investor-badges">
              <strong>Badges:</strong>
              ${investor.badges.map(badge => `<span class="badge-icon">🏅</span>`).join('')}
              <span style="margin-left: 8px; font-size: 12px; color: var(--text-light);">(${topBadge} Investor)</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ========================================
// 9. HELPER RENDERING FUNCTIONS
// ========================================
function getRankBadge(rank) {
  if (rank === 1) {
    return '<div class="rank-badge gold">🥇</div>';
  } else if (rank === 2) {
    return '<div class="rank-badge silver">🥈</div>';
  } else if (rank === 3) {
    return '<div class="rank-badge bronze">🥉</div>';
  } else {
    return `<div class="rank-badge number">${rank}</div>`;
  }
}

function getStatusText(status) {
  const statusMap = {
    'fully-funded': 'Fully Funded',
    'active': 'Active',
    'new': 'New'
  };
  return statusMap[status] || 'Active';
}

// ========================================
// 10. TAB NAVIGATION
// ========================================
function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      
      // Remove active class from all
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
      
      // Add active class to clicked
      this.classList.add('active');
      const targetContent = document.getElementById(`${targetTab}-tab`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
      
      // Render appropriate content
      if (targetTab === 'universities') {
        renderUniversityLeaderboard(platformStats.universityStats);
      } else if (targetTab === 'startups') {
        renderStartupLeaderboard(platformStats.topStartups);
      } else if (targetTab === 'investors') {
        renderInvestorLeaderboard(platformStats.topInvestors);
      }
    });
  });
}

