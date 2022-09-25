const router = require('express').Router();

router.use('/comments', require('./comments'))
router.use('/merge-requests', require('./merge-requests'))

module.exports = router;