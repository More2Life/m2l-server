var mongoose = require('mongoose');
var FeedItem = require('../models/feedItem').FeedItem;

var FeedItemController = {
    getFeedItems: function(req, callback) {
        var requestedCount = parseInt(req.query.count);
        var requestedIndex = req.query.index;
        var requestedType = req.query.type;
        var requestedIsActive = req.query.isActive;
        
        var query = FeedItem.find();

        if (requestedIsActive) {
            query = query.where('isActive').equals(requestedIsActive);
         }

        if (requestedType) {
            query = query.where('type').equals(requestedType);
        }
        if (requestedIndex) {
            query = query.where('_id').lt(mongoose.Types.ObjectId(requestedIndex));
        }
        if (requestedCount) {
            query = query.limit(requestedCount);
        }

        query.sort('-_id').exec(callback);
    }
}

exports.FeedItemController = FeedItemController;
