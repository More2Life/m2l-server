var mongoose = require('mongoose');
var FeedItem = require('../models/feedItem').FeedItem;

var FeedItemController = {
    getFeedItems: function(req, callback) {
        var requestedCount = parseInt(req.query.count);
        var requestedIndex = req.query.index;
        var requestedType = req.query.type;
        console.log('Requested Count: ' + requestedCount);
        console.log('Requested Index: ' + requestedIndex);
        console.log('Requested Type: ' + requestedType);

        var query = FeedItem.find();

        if (requestedType) {
            query = query.where('type').equals(requestedType);
        }
        if (requestedIndex) {
            query = query.where('_id').lt(requestedIndex);
        }
        if (requestedCount) {
            query = query.limit(requestedCount);
        }

        query.sort('-_id').exec(callback);
    }
}

exports.FeedItemController = FeedItemController;
