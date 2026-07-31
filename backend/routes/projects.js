var express = require('express');
var router = express.Router();
var projectController = require('../controllers/projectController');
var protect = require('../middleware/auth');
var upload = require('../middleware/upload');

router.get('/public', projectController.getPublicProjects);
router.get('/stats', protect, projectController.getStats);
router.get('/', protect, projectController.getProjects);
router.get('/:id', protect, projectController.getProject);
router.post('/', protect, upload.single('image'), projectController.createProject);
router.put('/:id', protect, upload.single('image'), projectController.updateProject);
router.delete('/all', protect, projectController.deleteAllProjects);
router.delete('/:id', protect, projectController.deleteProject);

module.exports = router;