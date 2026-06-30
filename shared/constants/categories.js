// Shared configuration constants for Community Hero AI

const ISSUES = [
  'Pothole',
  'Garbage Overflow',
  'Water Leakage',
  'Broken Road',
  'Streetlight Damage',
  'Sewage Issues',
  'Road Damage',
  'Public Cleanliness',
  'Infrastructure Damage'
];

const DEPARTMENTS = [
  'Public Works',
  'Sanitation Department',
  'Traffic Control',
  'Water & Sewage'
];

const REWARDS = {
  SUBMIT_REPORT: 15,
  COMMUNITY_VERIFY: 5,
  RESOLUTION_REPORTER_BONUS: 50
};

const SEVERITIES = [
  'Low',
  'Medium',
  'High',
  'Critical'
];

module.exports = {
  ISSUES,
  DEPARTMENTS,
  REWARDS,
  SEVERITIES
};
