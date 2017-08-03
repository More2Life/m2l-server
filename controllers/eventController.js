var mongoose = require('mongoose');
var Event = require('../models/Event').Event;
var request = require('request');
var TOKEN = process.env.EVENTBRITE_BEARER_TOKEN;

var EventController = {
    createEvent : function (req, callback) {
        
    }
}

exports.EventController = EventController;
