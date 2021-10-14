const express = require('express');

const router = express.Router();

// GET /user 라우터
router.get('/user', (req, res) => {
    res.send('Hello user');
});

module.exports = router;