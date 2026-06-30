const Complaint = require('../models/Complaint');

exports.getHeatmapData = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({}).select('location severity issueType status');
    
    
    const heatmapPoints = complaints.map(c => {
      
      let weight = 0.3;
      if (c.severity === 'Medium') weight = 0.5;
      if (c.severity === 'High') weight = 0.8;
      if (c.severity === 'Critical') weight = 1.0;

      
      return {
        lat: c.location.coordinates[1],
        lng: c.location.coordinates[0],
        weight: weight,
        issueType: c.issueType,
        severity: c.severity,
        status: c.status
      };
    });

    res.json(heatmapPoints);
  } catch (err) {
    next(err);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const total = await Complaint.countDocuments({});
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const verified = await Complaint.countDocuments({ status: 'Verified' });
    const reported = await Complaint.countDocuments({ status: 'Reported' });

    
    const categoryStats = await Complaint.aggregate([
      { $group: { _id: '$issueType', count: { $sum: 1 } } }
    ]);

    
    const departmentStats = await Complaint.aggregate([
      { $group: { _id: '$assignedDepartment', count: { $sum: 1 } } }
    ]);

    res.json({
      total,
      resolved,
      inProgress,
      verified,
      reported,
      resolutionRate: total > 0 ? parseFloat(((resolved / total) * 100).toFixed(1)) : 0,
      categories: categoryStats.map(item => ({ name: item._id, count: item.count })),
      departments: departmentStats.map(item => ({ name: item._id, count: item.count }))
    });
  } catch (err) {
    next(err);
  }
};
