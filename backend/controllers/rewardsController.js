const User = require('../models/User');

exports.getLeaderboard = async (req, res, next) => {
  try {
    // Return top 10 users based on heroPoints
    const topUsers = await User.find({ role: 'citizen' })
      .select('name email heroPoints badges reportsSubmitted')
      .sort({ heroPoints: -1 })
      .limit(10);

    res.json(topUsers);
  } catch (err) {
    next(err);
  }
};

exports.getNotifications = async (req, res, next) => {
  try {
    const Notification = require('../models/Notification');
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
};

exports.markNotificationsRead = async (req, res, next) => {
  try {
    const Notification = require('../models/Notification');
    await Notification.updateMany(
      { userId: req.user.id, readStatus: false },
      { $set: { readStatus: true } }
    );
    res.json({ message: 'Notifications marked as read' });
  } catch (err) {
    next(err);
  }
};
