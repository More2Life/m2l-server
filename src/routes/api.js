var express = require('express');
var router = express.Router();

var feedItemController  = require ('../controllers/feedItemController').FeedItemController;

//test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    console.log("called /api");
    res.json({ message: 'Welcome to the More2Life App API!' });
});

router.get('/feedItems', function (req, res) {
    console.log('GET Feed Items');

    feedItemController.getFeedItems(req, function(err, feedItems) {
        if(err) throw err;
        res.json(feedItems);
    });
});

module.exports = router;
