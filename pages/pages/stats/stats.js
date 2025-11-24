// ========================================
// STATS DASHBOARD - CALCULATIONS & RENDERING
// ========================================

let dashboardStats = null;

// ========================================
// 1. INITIALIZE DASHBOARD
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  initStatsDashboard();
});

async function initStatsDashboard() {
  // Load and calculate all stats
  dashboardStats = await loadStats();
  
  // Render all sections
  renderKeyMetrics(dashboardStats);
  renderCategoryChart(dashboardStats.categoryBreakdown);
  renderStageChart(dashboardStats.stageBreakdown);
  renderUniversityComparison(dashboardStats.topUniversities);
  renderActivityFeed(dashboardStats.recentActivity);
  renderTopPerformers(dashboardStats.topPerformers);
  
  // Setup auto-refresh (optional)
  // setupAutoRefresh();
}

// ========================================
// 2. LOAD ALL STATS
// ========================================
async function loadStats() {
  const startups = await loadAllStartups();
  const investors = loadAllInvestors();
  const investments = loadAllInvestments();
  
  // Calculate key metrics
  const totalStartups = startups.length;
  const totalFunding = calculateTotalFunding(investments);
  const totalInvestors = investors.length;
  const successRate = calculateSuccessRate(startups);
  
  // Calculate breakdowns
  const categoryBreakdown = calculateCategoryBreakdown(startups);
  const stageBreakdown = calculateStageBreakdown(startups);
  
  // Get top universities
  const universityStats = calculateUniversityStats(startups, investments, investors);
  const topUniversities = universityStats.slice(0, 5);
  
  // Generate recent activity
  const recentActivity = generateRecentActivity(startups, investors, investments);
  
  // Get top performers
  const topPerformers = getTopPerformers(startups, investors, investments);
  
  return {
    totalStartups,
    totalFunding,
    totalInvestors,
    successRate,
    categoryBreakdown,
    stageBreakdown,
    topUniversities,
    recentActivity,
    topPerformers
  };
}

// ========================================
// 3. LOAD DATA FUNCTIONS
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
// 4. CALCULATION FUNCTIONS
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

function calculateCategoryBreakdown(startups) {
  const breakdown = {};
  
  startups.forEach(startup => {
    const category = startup.category || 'Other';
    breakdown[category] = (breakdown[category] || 0) + 1;
  });
  
  return breakdown;
}

function calculateStageBreakdown(startups) {
  const breakdown = {
    'Idea Stage': 0,
    'MVP Built': 0,
    'Growth Stage': 0,
    'Scaling': 0
  };
  
  startups.forEach(startup => {
    const stage = startup.stage || 'Idea Stage';
    if (breakdown[stage] !== undefined) {
      breakdown[stage]++;
    } else {
      breakdown['Idea Stage']++;
    }
  });
  
  return breakdown;
}

function calculateUniversityStats(startups, investments, investors) {
  const universities = {};
  
  startups.forEach(startup => {
    const uni = startup.university || 'Unknown';
    if (!universities[uni]) {
      universities[uni] = {
        name: uni,
        startupCount: 0,
        totalRaised: 0,
        investorCount: new Set()
      };
    }
    universities[uni].startupCount++;
    universities[uni].totalRaised += parseInt(startup.fundingRaised) || 0;
  });
  
  investments.forEach(investment => {
    const investor = investors.find(inv => inv.id === investment.investorId);
    if (investor && investor.university) {
      const uni = investor.university;
      if (universities[uni]) {
        universities[uni].investorCount.add(investor.id);
      }
    }
  });
  
  return Object.values(universities).map(uni => ({
    ...uni,
    investorCount: uni.investorCount.size
  })).sort((a, b) => b.totalRaised - a.totalRaised);
}

function generateRecentActivity(startups, investors, investments) {
  const activities = [];
  
  // Recent investments
  investments.slice(-5).forEach(inv => {
    const investor = investors.find(i => i.id === inv.investorId);
    const startup = startups.find(s => s.id === inv.startupId);
    if (investor && startup) {
      activities.push({
        icon: '💰',
        text: `${investor.fullName} invested PKR ${inv.amount.toLocaleString()} in ${startup.name}`,
        time: getTimeAgo(inv.investedAt)
      });
    }
  });
  
  // Recent startups
  startups.slice(-3).forEach(startup => {
    activities.push({
      icon: '🚀',
      text: `New startup "${startup.name}" registered from ${startup.university}`,
      time: getTimeAgo(startup.submittedAt)
    });
  });
  
  // Recent investors
  investors.slice(-2).forEach(investor => {
    activities.push({
      icon: '👤',
      text: `New investor ${investor.fullName} from ${investor.university} joined the platform`,
      time: getTimeAgo(investor.registeredAt)
    });
  });
  
  // Sort by time (most recent first)
  return activities.sort((a, b) => {
    // Simple sort - in real app, parse dates
    return Math.random() - 0.5; // Random for demo
  }).slice(0, 10);
}

function getTimeAgo(dateString) {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return 'Recently';
}

function getTopPerformers(startups, investors, investments) {
  // Fastest growing startup (by funding raised recently)
  const fastestStartup = startups.reduce((max, s) => {
    const raised = parseInt(s.fundingRaised) || 0;
    const maxRaised = parseInt(max.fundingRaised) || 0;
    return raised > maxRaised ? s : max;
  }, startups[0] || {});
  
  // Most active investor
  const investorInvestments = {};
  investments.forEach(inv => {
    if (!investorInvestments[inv.investorId]) {
      investorInvestments[inv.investorId] = { count: 0, total: 0 };
    }
    investorInvestments[inv.investorId].count++;
    investorInvestments[inv.investorId].total += inv.amount || 0;
  });
  
  let mostActiveInvestor = null;
  let maxInvested = 0;
  investors.forEach(inv => {
    const stats = investorInvestments[inv.id] || { count: 0, total: 0 };
    if (stats.total > maxInvested) {
      maxInvested = stats.total;
      mostActiveInvestor = { ...inv, ...stats };
    }
  });
  
  // Rising university (simplified - most new startups)
  const universityCounts = {};
  startups.forEach(s => {
    const uni = s.university || 'Unknown';
    universityCounts[uni] = (universityCounts[uni] || 0) + 1;
  });
  
  let risingUniversity = null;
  let maxCount = 0;
  Object.entries(universityCounts).forEach(([uni, count]) => {
    if (count > maxCount) {
      maxCount = count;
      risingUniversity = { name: uni, count };
    }
  });
  
  return {
    fastestStartup,
    mostActiveInvestor,
    risingUniversity
  };
}

// ========================================
// 5. RENDER FUNCTIONS
// ========================================
function renderKeyMetrics(stats) {
  // Use landing page stats as defaults if data is empty
  const totalStartups = stats.totalStartups || 50;
  const totalFunding = stats.totalFunding || 2000000; // PKR 2M
  const totalInvestors = stats.totalInvestors || 500;
  const successRate = stats.successRate || 75;
  
  document.getElementById('total-startups').textContent = totalStartups;
  document.getElementById('total-funding').textContent = totalFunding >= 1000000 
    ? `PKR ${(totalFunding / 1000000).toFixed(1)}M` 
    : `PKR ${(totalFunding / 1000).toFixed(0)}K`;
  document.getElementById('total-investors').textContent = totalInvestors;
  document.getElementById('success-rate').textContent = `${successRate}%`;
  
  // Calculate changes (simplified - would compare with previous month in real app)
  const changes = {
    startups: Math.max(5, Math.floor(totalStartups * 0.2)),
    funding: Math.max(100000, Math.floor(totalFunding * 0.15)),
    investors: Math.max(50, Math.floor(totalInvestors * 0.15)),
    success: Math.max(2, Math.floor(successRate * 0.05))
  };
  
  document.getElementById('startups-change').textContent = `+${changes.startups} this month`;
  document.getElementById('funding-change').textContent = changes.funding >= 1000000
    ? `+PKR ${(changes.funding / 1000000).toFixed(1)}M this month`
    : `+PKR ${(changes.funding / 1000).toFixed(0)}K this month`;
  document.getElementById('investors-change').textContent = `+${changes.investors} this month`;
  document.getElementById('success-change').textContent = `+${changes.success}% this month`;
}

function renderCategoryChart(breakdown) {
  const container = document.getElementById('category-chart');
  if (!container) return;
  
  const total = Object.values(breakdown).reduce((sum, val) => sum + val, 0);
  if (total === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No category data available</p>';
    return;
  }
  
  const categoryColors = {
    'AI/ML': 'var(--primary)',
    'EdTech': 'var(--success)',
    'FinTech': 'var(--secondary)',
    'HealthTech': 'var(--error)',
    'E-commerce': 'var(--gold)',
    'AgriTech': '#22C55E',
    'CleanTech': '#06B6D4',
    'Other': 'var(--silver)'
  };
  
  const categoryClasses = {
    'AI/ML': 'ai-ml',
    'EdTech': 'edtech',
    'FinTech': 'fintech',
    'HealthTech': 'healthtech',
    'E-commerce': 'ecommerce',
    'AgriTech': 'agritech',
    'CleanTech': 'cleantech',
    'Other': 'other'
  };
  
  container.innerHTML = Object.entries(breakdown)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => {
      const percentage = (count / total) * 100;
      const color = categoryColors[category] || categoryColors['Other'];
      const className = categoryClasses[category] || 'other';
      
      return `
        <div class="category-item ${className}">
          <div class="category-name">${category}</div>
          <div class="category-bar">
            <div class="category-fill" style="width: ${percentage}%; background: ${color};">
              ${count}
            </div>
          </div>
          <div class="category-count">${count}</div>
        </div>
      `;
    }).join('');
}

function renderStageChart(breakdown) {
  const container = document.getElementById('stage-chart');
  if (!container) return;
  
  const max = Math.max(...Object.values(breakdown));
  if (max === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No stage data available</p>';
    return;
  }
  
  container.innerHTML = `
    <div class="stage-chart">
      ${Object.entries(breakdown).map(([stage, count]) => {
        const height = (count / max) * 100;
        return `
          <div class="stage-bar-container">
            <div class="stage-bar" style="height: ${height}%">
              ${count}
            </div>
            <div class="stage-label">${stage}</div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

function renderUniversityComparison(universities) {
  const container = document.getElementById('university-comparison');
  if (!container) return;
  
  if (universities.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-light);">No university data available</p>';
    return;
  }
  
  const maxStartups = Math.max(...universities.map(u => u.startupCount));
  const maxFunding = Math.max(...universities.map(u => u.totalRaised));
  const maxInvestors = Math.max(...universities.map(u => u.investorCount));
  const totalStartups = universities.reduce((sum, u) => sum + u.startupCount, 0);
  
  container.innerHTML = universities.map(uni => {
    const startupPercentage = (uni.startupCount / maxStartups) * 100;
    const fundingPercentage = (uni.totalRaised / maxFunding) * 100;
    const investorPercentage = (uni.investorCount / maxInvestors) * 100;
    const contributionPercentage = totalStartups > 0 ? (uni.startupCount / totalStartups) * 100 : 0;
    
    return `
      <div class="university-comp-card">
        <h3>${uni.name}</h3>
        <div class="comp-stat">
          <div class="comp-stat-label">
            <span>Startups</span>
            <span>${uni.startupCount}</span>
          </div>
          <div class="comp-stat-bar">
            <div class="comp-stat-fill" style="width: ${startupPercentage}%">${uni.startupCount}</div>
          </div>
        </div>
        <div class="comp-stat">
          <div class="comp-stat-label">
            <span>Funding</span>
            <span>PKR ${uni.totalRaised.toLocaleString()}</span>
          </div>
          <div class="comp-stat-bar">
            <div class="comp-stat-fill" style="width: ${fundingPercentage}%">PKR ${(uni.totalRaised / 1000).toFixed(0)}K</div>
          </div>
        </div>
        <div class="comp-stat">
          <div class="comp-stat-label">
            <span>Investors</span>
            <span>${uni.investorCount}</span>
          </div>
          <div class="comp-stat-bar">
            <div class="comp-stat-fill" style="width: ${investorPercentage}%">${uni.investorCount}</div>
          </div>
        </div>
        <div class="comp-percentage">${contributionPercentage.toFixed(1)}% of total platform</div>
      </div>
    `;
  }).join('');
}

function renderActivityFeed(activities) {
  const container = document.getElementById('activity-feed');
  if (!container) return;
  
  if (activities.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--text-light); padding: 40px;">No recent activity</p>';
    return;
  }
  
  container.innerHTML = activities.map(activity => `
    <div class="activity-item">
      <div class="activity-icon">${activity.icon}</div>
      <div class="activity-text">${activity.text}</div>
      <div class="activity-time">${activity.time}</div>
    </div>
  `).join('');
}

function renderTopPerformers(performers) {
  if (performers.fastestStartup && performers.fastestStartup.name) {
    const raised = parseInt(performers.fastestStartup.fundingRaised) || 0;
    document.getElementById('fastest-startup').textContent = performers.fastestStartup.name;
    document.getElementById('fastest-stats').textContent = `PKR ${raised.toLocaleString()} raised`;
  }
  
  if (performers.mostActiveInvestor) {
    document.getElementById('active-investor').textContent = performers.mostActiveInvestor.fullName;
    document.getElementById('active-stats').textContent = `PKR ${performers.mostActiveInvestor.total.toLocaleString()} invested in ${performers.mostActiveInvestor.count} startups`;
  }
  
  if (performers.risingUniversity) {
    document.getElementById('rising-university').textContent = performers.risingUniversity.name;
    document.getElementById('rising-stats').textContent = `${performers.risingUniversity.count} startups registered`;
  }
}

// ========================================
// 6. AUTO-REFRESH (OPTIONAL)
// ========================================
function setupAutoRefresh() {
  setInterval(() => {
    dashboardStats = loadStats();
    renderKeyMetrics(dashboardStats);
    renderCategoryChart(dashboardStats.categoryBreakdown);
    renderStageChart(dashboardStats.stageBreakdown);
    renderUniversityComparison(dashboardStats.topUniversities);
    renderActivityFeed(dashboardStats.recentActivity);
    renderTopPerformers(dashboardStats.topPerformers);
  }, 30000); // Refresh every 30 seconds
}

