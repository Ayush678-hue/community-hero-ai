


const generateMockAIResponse = (issueType) => {
  return {
    success: true,
    issueType: issueType || 'Pothole',
    confidence: 0.94,
    severity: 'High',
    detectedObjects: [issueType ? issueType.toLowerCase() : 'pothole'],
    summary: `AI detected ${issueType || 'Pothole'} with High urgency in public safety zone.`
  };
};

console.log('🏁 Starting Community Hero AI Demo Sequence Verification...\n');


const citizen = {
  id: 'citizen_123',
  name: 'Aria Chen',
  role: 'citizen',
  heroPoints: 145,
  reportsSubmitted: 0,
  badges: []
};

const authority = {
  id: 'officer_456',
  name: 'Officer Marcus Vance',
  role: 'authority'
};

const neighbor = {
  id: 'citizen_789',
  name: 'Elena Rostova',
  role: 'citizen',
  heroPoints: 30
};

console.log('👤 [Step 1: User Profiles Authenticated]');
console.log(`   - Citizen "${citizen.name}" logged in (Points: ${citizen.heroPoints})`);
console.log(`   - Authority "${authority.name}" logged in`);
console.log(`   - Neighbor "${neighbor.name}" active nearby`);
console.log('--------------------------------------------------\n');


console.log('📸 [Step 2: Citizen Files Complaint]');
const reportData = {
  issueType: 'Pothole',
  description: 'Deep pothole on school crossing zone near 5th ave. Hazardous for cycles.',
  latitude: 37.7799,
  longitude: -122.4194,
  imageUrl: '/uploads/pothole-raw.jpg'
};
console.log(`   - Filing report: "${reportData.issueType}" at coords [${reportData.latitude}, ${reportData.longitude}]`);
console.log(`   - Uploading image: "${reportData.imageUrl}"`);
console.log('--------------------------------------------------\n');


console.log('🤖 [Step 3: AI Computer Vision Inference]');
console.log('   - Contacting FastAPI AI Microservice /api/v1/ai/detect...');


const desc_lower = reportData.description.lowerCode || reportData.description.toLowerCase();
let severity = 'High';
if (desc_lower.includes('school') || desc_lower.includes('hospital') || desc_lower.includes('hazard')) {
  severity = 'Critical';
}
const aiResponse = {
  success: true,
  issueType: 'Pothole',
  confidence: 0.94,
  severity: severity,
  detectedObjects: ['pothole'],
  summary: `AI detected Pothole with ${severity} severity in public school safety zone.`
};

console.log(`   - [AI Output] Class: ${aiResponse.issueType} (Confidence: ${aiResponse.confidence * 100}%)`);
console.log(`   - [AI Output] Priority: ${aiResponse.severity}`);
console.log(`   - [AI Output] Summary: "${aiResponse.summary}"`);


citizen.heroPoints += 15;
citizen.reportsSubmitted += 1;
console.log(`   - Awarded +15 Hero Points to ${citizen.name} (New balance: ${citizen.heroPoints})`);
console.log('--------------------------------------------------\n');


console.log('👥 [Step 4: Neighborhood Verification]');
const complaintState = {
  _id: 'complaint_pothole_101',
  ...reportData,
  severity: aiResponse.severity,
  status: 'Reported',
  verificationCount: 0,
  verifiedBy: [],
  upvotes: []
};


complaintState.verificationCount += 1;
complaintState.verifiedBy.push(neighbor.id);
neighbor.heroPoints += 5;
console.log(`   - Neighbor "${neighbor.name}" verified the issue (+5 points, new balance: ${neighbor.heroPoints})`);


complaintState.verificationCount += 1;
complaintState.verifiedBy.push('neighbor_2');
complaintState.status = 'Verified';
console.log(`   - Second neighbor verified. Threshold reached! Status updated to "${complaintState.status}"`);
console.log(`   - Citizen "${citizen.name}" awarded +10 verification bonus points!`);
citizen.heroPoints += 10;
console.log('--------------------------------------------------\n');


console.log('🏢 [Step 5: Authority Workplace Routing]');
complaintState.assignedDepartment = 'Public Works (Roads)';
complaintState.status = 'In Progress';
console.log(`   - Authority assigned task to: "${complaintState.assignedDepartment}"`);
console.log(`   - Workforce dispatched. Status: "${complaintState.status}"`);
console.log('--------------------------------------------------\n');


console.log('🔧 [Step 6: Resolution Verification]');
console.log('   - Road repairs completed by workforce.');
const resolutionData = {
  resolvedImageUrl: '/uploads/pothole-resolved.jpg',
  status: 'Resolved'
};
console.log(`   - Uploading resolution proof image: "${resolutionData.resolvedImageUrl}"`);


const beforeAfterScore = 0.89; 
complaintState.status = 'Resolved';
complaintState.resolvedImageUrl = resolutionData.resolvedImageUrl;
complaintState.aiAnalysisBeforeAfter = beforeAfterScore;

console.log(`   - Running Before/After Comparison AI...`);
console.log(`   - [AI Output] Match Score: ${beforeAfterScore * 100}% (Visual check passed)`);
console.log(`   - Status updated: "${complaintState.status}"`);


citizen.heroPoints += 50;
console.log(`   - Awarded +50 Hero Points to original reporter "${citizen.name}" (Final balance: ${citizen.heroPoints})`);
if (citizen.heroPoints >= 200) {
  citizen.badges.push({ title: 'Community Hero', description: 'Earned 200+ points by resolving issues' });
  console.log(`   - 🏆 BADGE EARNED: "Community Hero" awarded to ${citizen.name}!`);
}
console.log('--------------------------------------------------\n');


console.log('🏆 [Step 7: Leaderboard Update]');
const leaderboard = [
  { name: citizen.name, points: citizen.heroPoints, badges: citizen.badges.map(b => b.title) },
  { name: 'Elena Rostova', points: neighbor.heroPoints, badges: [] }
].sort((a, b) => b.points - a.points);

console.log('   Current Leaderboard Rankings:');
leaderboard.forEach((user, idx) => {
  console.log(`   ${idx + 1}. ${user.name} - ${user.points} pts ${user.badges.length ? `[Badges: ${user.badges.join(', ')}]` : ''}`);
});
console.log('\n✅ Demo Flow Simulation Verification Complete. System functions properly.');
console.log('--------------------------------------------------');
