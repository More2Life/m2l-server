var mongoose = require('mongoose');
var Event = require('../models/listing').Listing;
var request = require('request');
const TOKEN = process.env.SQUARE_PERSONAL_ACCESS_TOKEN;
var SQUARE_BASE_URL = 'https://connect.squareup.com/v2/';

var options = {
    headers: {
        'Authorization': TOKEN,
        'Accept': 'application/json'
    }
};

var EventController = {
    updateListing : function (req, callback) {

    }
}

exports.EventController = EventController;
