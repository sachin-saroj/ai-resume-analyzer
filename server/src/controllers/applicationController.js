const mongoose = require('mongoose');
const Application = require('../models/Application');

// Initialize in-memory fallback store if MongoDB is offline
global.APPLICATION_MEMORY_STORE = global.APPLICATION_MEMORY_STORE || {};

exports.getApplications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const dbConnected = mongoose.connection.readyState === 1;

    let apps;
    if (dbConnected) {
      apps = await Application.find({ userId }).populate('analysisId').sort({ createdAt: -1 });
    } else {
      apps = Object.values(global.APPLICATION_MEMORY_STORE)
        .filter(app => String(app.userId) === String(userId))
        .map(app => {
          // Deep copy to prevent modifying stored data
          const appCopy = { ...app };
          if (appCopy.analysisId && global.EXAM_MEMORY_STORE && global.EXAM_MEMORY_STORE[appCopy.analysisId]) {
            appCopy.analysisId = global.EXAM_MEMORY_STORE[appCopy.analysisId];
          }
          return appCopy;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    res.status(200).json({ success: true, count: apps.length, applications: apps });
  } catch (err) {
    next(err);
  }
};

exports.createApplication = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { company, role, analysisId, status, appliedDate, notes, followUpDate } = req.body;

    if (!company || !role) {
      return res.status(400).json({ success: false, message: 'Company and Role are required fields.' });
    }

    const dbConnected = mongoose.connection.readyState === 1;
    let savedApp;

    if (dbConnected) {
      const app = new Application({
        userId,
        company,
        role,
        analysisId: analysisId || undefined,
        status: status || 'applied',
        appliedDate: appliedDate || undefined,
        notes: notes || '',
        followUpDate: followUpDate || undefined
      });
      savedApp = await app.save();
    } else {
      const _id = new mongoose.Types.ObjectId().toString();
      savedApp = {
        _id,
        userId,
        company,
        role,
        analysisId: analysisId || undefined,
        status: status || 'applied',
        appliedDate: appliedDate ? new Date(appliedDate) : new Date(),
        notes: notes || '',
        followUpDate: followUpDate ? new Date(followUpDate) : undefined,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      global.APPLICATION_MEMORY_STORE[_id] = savedApp;
    }

    res.status(201).json({ success: true, application: savedApp });
  } catch (err) {
    next(err);
  }
};

exports.updateApplication = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { company, role, analysisId, status, appliedDate, notes, followUpDate } = req.body;

    const dbConnected = mongoose.connection.readyState === 1;
    let appDoc;

    if (dbConnected) {
      appDoc = await Application.findById(id);
      if (!appDoc) {
        return res.status(404).json({ success: false, message: 'Application not found.' });
      }
      if (String(appDoc.userId) !== String(userId)) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this application.' });
      }

      appDoc.company = company !== undefined ? company : appDoc.company;
      appDoc.role = role !== undefined ? role : appDoc.role;
      appDoc.analysisId = analysisId !== undefined ? (analysisId || undefined) : appDoc.analysisId;
      appDoc.status = status !== undefined ? status : appDoc.status;
      appDoc.appliedDate = appliedDate !== undefined ? appliedDate : appDoc.appliedDate;
      appDoc.notes = notes !== undefined ? notes : appDoc.notes;
      appDoc.followUpDate = followUpDate !== undefined ? (followUpDate || undefined) : appDoc.followUpDate;

      await appDoc.save();
    } else {
      appDoc = global.APPLICATION_MEMORY_STORE[id];
      if (!appDoc) {
        return res.status(404).json({ success: false, message: 'Application not found.' });
      }
      if (String(appDoc.userId) !== String(userId)) {
        return res.status(403).json({ success: false, message: 'Not authorized to modify this application.' });
      }

      appDoc.company = company !== undefined ? company : appDoc.company;
      appDoc.role = role !== undefined ? role : appDoc.role;
      appDoc.analysisId = analysisId !== undefined ? (analysisId || undefined) : appDoc.analysisId;
      appDoc.status = status !== undefined ? status : appDoc.status;
      appDoc.appliedDate = appliedDate !== undefined ? new Date(appliedDate) : appDoc.appliedDate;
      appDoc.notes = notes !== undefined ? notes : appDoc.notes;
      appDoc.followUpDate = followUpDate !== undefined ? (followUpDate ? new Date(followUpDate) : undefined) : appDoc.followUpDate;
      appDoc.updatedAt = new Date();
    }

    res.status(200).json({ success: true, application: appDoc });
  } catch (err) {
    next(err);
  }
};

exports.deleteApplication = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const dbConnected = mongoose.connection.readyState === 1;
    let appDoc;

    if (dbConnected) {
      appDoc = await Application.findById(id);
      if (!appDoc) {
        return res.status(404).json({ success: false, message: 'Application not found.' });
      }
      if (String(appDoc.userId) !== String(userId)) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this application.' });
      }
      await appDoc.deleteOne();
    } else {
      appDoc = global.APPLICATION_MEMORY_STORE[id];
      if (!appDoc) {
        return res.status(404).json({ success: false, message: 'Application not found.' });
      }
      if (String(appDoc.userId) !== String(userId)) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this application.' });
      }
      delete global.APPLICATION_MEMORY_STORE[id];
    }

    res.status(200).json({ success: true, message: 'Application deleted successfully.' });
  } catch (err) {
    next(err);
  }
};
