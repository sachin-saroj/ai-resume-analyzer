const express = require('express');
const router = express.Router();
const { getApplications, createApplication, updateApplication, deleteApplication } = require('../controllers/applicationController');
const authMiddleware = require('../middlewares/auth');

// Protect all application endpoints
router.use(authMiddleware);

router.get('/', getApplications);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

module.exports = router;
