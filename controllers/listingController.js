var mongoose = require('mongoose');
var Event = require('../models/listing').Listing;
var request = require('request');
const TOKEN = process.env.SQUARE_PERSONAL_ACCESS_TOKEN;
var baseUrl = 'https://connect.squareup.com/v2/';


var baseRequest = request.defaults({
    headers: {
        'Authorization': TOKEN,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
})

var EventController = {
    updateListing : function (req) {
        var entityId = req.body.entity_id;
        options.url = baseUrl + 'catalog/object/' + entityId;
        console.log('Request URL: ' + options.url);

        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                var info = JSON.parse(body);
                console.log(info);
            }
        }

        request(options, callback);
    }
}

exports.EventController = EventController;
