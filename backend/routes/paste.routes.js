const express = require('express');
const router = express.Router();
const { createPaste, getPaste } = require('../controllers/paste.controller');

router.post('/', createPaste);

router.get('/:pasteId', getPaste);

module.exports = router;
