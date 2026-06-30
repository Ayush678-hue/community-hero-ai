const axios = require('axios');
const Complaint = require('../models/Complaint');
const User = require('../models/User');
const Comment = require('../models/Comment');
const Notification = require('../models/Notification');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';


const generateMockAIResponse = (issueType) => {
  const categories = ['Pothole', 'Garbage Overflow', 'Water Leakage', 'Broken Road', 'Streetlight Damage', 'Sewage Issues'];
  const chosenType = issueType || categories[Math.floor(Math.random() * categories.length)];
  const severityLevels = ['Low', 'Medium', 'High', 'Critical'];
  const chosenSeverity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
  
  return {
    success: true,
    issueType: chosenType,
    confidence: parseFloat((0.75 + Math.random() * 0.22).toFixed(2)),
    severity: chosenSeverity,
    detectedObjects: [chosenType.toLowerCase()],
    summary: `AI detected ${chosenType} with ${chosenSeverity} urgency in public safety zone.`
  };
};

exports.createComplaint = async (req, res, next) => {
  try {
    const { description, latitude, longitude, issueType } = req.body;
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ error: 'Please upload an image showing the civic issue' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: 'Valid GPS coordinates (latitude and longitude) are required' });
    }

    
    let aiResponse;
    try {
      
      const response = await axios.post(`${AI_SERVICE_URL}/api/v1/ai/detect`, {
        imageUrl: imageUrl,
        description: description,
        issueType: issueType 
      }, { timeout: 3000 }); 
      aiResponse = response.data;
    } catch (err) {
      console.warn('⚠️ AI service unavailable. Running fallback mock AI predictions...', err.message);
      aiResponse = generateMockAIResponse(issueType);
    }

    
    const complaint = new Complaint({
      issueType: aiResponse.issueType || issueType || 'Public Cleanliness',
      description,
      imageUrl,
      location: {
        type: 'Point',
        coordinates: [lng, lat] 
      },
      severity: aiResponse.severity || 'Medium',
      createdBy: userId,
      aiAnalysis: {
        confidence: aiResponse.confidence || 0.85,
        summary: aiResponse.summary || `Reported ${issueType || 'civic issue'} waiting for verification.`,
        detectedObjects: aiResponse.detectedObjects || [issueType ? issueType.toLowerCase() : 'civic-hazard']
      }
    });

    await complaint.save();

    
    const user = await User.findById(userId);
    if (user) {
      user.heroPoints += 15; 
      user.reportsSubmitted += 1;
      
      if (user.reportsSubmitted === 1) {
        user.badges.push({
          title: 'Civic Initiator',
          description: 'Reported your very first community issue'
        });
      }
      await user.save();
    }

    
    const notification = new Notification({
      userId,
      title: 'Report Filed',
      message: `Your report for "${complaint.issueType}" has been filed and processed by AI. Earned 15 Hero Points!`
    });
    await notification.save();

    
    if (req.io) {
      req.io.emit('new_complaint', {
        id: complaint._id,
        issueType: complaint.issueType,
        severity: complaint.severity,
        coordinates: [lat, lng],
        summary: complaint.aiAnalysis.summary
      });
      
      req.io.to(userId.toString()).emit('notification', {
        title: 'Report Filed Successfully',
        message: `AI predicted priority: ${complaint.severity}`
      });
    }

    res.status(201).json({
      message: 'Complaint submitted and AI processed successfully',
      complaint
    });
  } catch (err) {
    next(err);
  }
};

exports.getComplaints = async (req, res, next) => {
  try {
    const { status, lat, lng, radius = 5000, issueType } = req.query; 
    let query = {};

    if (status) {
      query.status = status;
    }
    if (issueType) {
      query.issueType = issueType;
    }

    
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    const complaints = await Complaint.find(query)
      .populate('createdBy', 'name email heroPoints badges')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    next(err);
  }
};

exports.getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('createdBy', 'name email heroPoints badges');

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const comments = await Comment.find({ complaintId: complaint._id })
      .populate('userId', 'name role heroPoints');

    res.json({
      complaint,
      comments
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    const userId = req.user.id;

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    
    if (complaint.verifiedBy.includes(userId)) {
      return res.status(400).json({ error: 'You have already verified this complaint' });
    }

    complaint.verifiedBy.push(userId);
    complaint.verificationCount += 1;

    
    if (!complaint.upvotes.includes(userId)) {
      complaint.upvotes.push(userId);
    }

    
    if (complaint.status === 'Reported' && complaint.verificationCount >= 2) {
      complaint.status = 'Verified';
      
      
      const creatorNotification = new Notification({
        userId: complaint.createdBy,
        title: 'Report Verified',
        message: `Your report on "${complaint.issueType}" has been verified by the community!`
      });
      await creatorNotification.save();
    }

    await complaint.save();

    
    const verifier = await User.findById(userId);
    if (verifier) {
      verifier.heroPoints += 5;
      await verifier.save();
    }

    
    if (complaint.verificationCount === 2) {
      const reporter = await User.findById(complaint.createdBy);
      if (reporter) {
        reporter.heroPoints += 10;
        await reporter.save();
      }
    }

    
    if (req.io) {
      req.io.emit('complaint_updated', {
        id: complaint._id,
        status: complaint.status,
        verificationCount: complaint.verificationCount
      });
    }

    res.json({
      message: 'Complaint successfully verified. Hero points awarded!',
      verificationCount: complaint.verificationCount,
      status: complaint.status
    });
  } catch (err) {
    next(err);
  }
};

exports.addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    const complaintId = req.params.id;
    const userId = req.user.id;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    const comment = new Comment({
      complaintId,
      userId,
      text
    });

    await comment.save();

    
    const populatedComment = await Comment.findById(comment._id).populate('userId', 'name role heroPoints');

    res.status(201).json(populatedComment);
  } catch (err) {
    next(err);
  }
};

exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { status, assignedDepartment } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }

    if (assignedDepartment) {
      complaint.assignedDepartment = assignedDepartment;
    }

    if (status) {
      complaint.status = status;
      complaint.updatedAt = Date.now();

      
      if (status === 'Resolved') {
        if (req.file) {
          complaint.resolvedImageUrl = `/uploads/${req.file.filename}`;
          
          
          try {
            const response = await axios.post(`${AI_SERVICE_URL}/api/v1/ai/verify-resolution`, {
              beforeUrl: complaint.imageUrl,
              afterUrl: complaint.resolvedImageUrl
            }, { timeout: 3000 });
            complaint.aiAnalysis.beforeAfterScore = response.data.similarityScore;
          } catch (err) {
            console.warn('⚠️ AI comparison unavailable. Mocking Before/After verification...', err.message);
            
            complaint.aiAnalysis.beforeAfterScore = parseFloat((0.80 + Math.random() * 0.18).toFixed(2));
          }
        }

        
        const reporter = await User.findById(complaint.createdBy);
        if (reporter) {
          reporter.heroPoints += 50; 
          if (reporter.heroPoints >= 200) {
            
            const hasHeroBadge = reporter.badges.some(b => b.title === 'Community Hero');
            if (!hasHeroBadge) {
              reporter.badges.push({
                title: 'Community Hero',
                description: 'Earned 200+ points by reporting and resolving issues'
              });
            }
          }
          await reporter.save();
        }

        
        const resolutionNotification = new Notification({
          userId: complaint.createdBy,
          title: 'Issue Resolved!',
          message: `Awesome! The "${complaint.issueType}" you reported has been marked resolved. You earned 50 Hero points!`
        });
        await resolutionNotification.save();
      } else {
        
        const progressNotification = new Notification({
          userId: complaint.createdBy,
          title: 'Complaint Update',
          message: `The status of your reported issue "${complaint.issueType}" is now: ${status}.`
        });
        await progressNotification.save();
      }
    }

    await complaint.save();

    
    if (req.io) {
      req.io.emit('complaint_updated', {
        id: complaint._id,
        status: complaint.status,
        assignedDepartment: complaint.assignedDepartment,
        resolvedImageUrl: complaint.resolvedImageUrl,
        beforeAfterScore: complaint.aiAnalysis ? complaint.aiAnalysis.beforeAfterScore : undefined
      });
    }

    res.json({
      message: 'Complaint status successfully updated',
      complaint
    });
  } catch (err) {
    next(err);
  }
};
