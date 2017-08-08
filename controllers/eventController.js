var mongoose = require('mongoose');
var Event = require('../models/event').Event;
var request = require('request');
const TOKEN = process.env.EVENTBRITE_BEARER_TOKEN;
var VENUEURI = "https://www.eventbriteapi.com/v3/venues/"

var eventbriteRequest = request.defaults({
    headers: {
        'Authorization' : TOKEN
    },
    json: true
})

function createEvent(eventBody) {
    var createEventAndSave = function(eventBody, venueBody) {
        var eventDoc = {
            title: eventBody.name.text,
            description: eventBody.description.text,
            index: 0,
            isActive: (eventBody.status === 'live') ? true : false,
            eventUrl: eventBody.url,
            resourceUri: eventBody.resource_uri,
            imageUrl: eventBody.logo.original.url,
            startTime: eventBody.start.local,
            endTime: eventBody.end.local
        }
        if (venueBody) {
            eventDoc.address = venueBody.address.localized_address_display;
            eventDoc.area = venueBody.address.localized_area_display;
            eventDoc.multiLineAddress = venueBody.address.localized_multi_line_address_display;
            eventDoc.latitude = venueBody.address.latitude;
            eventDoc.longitude = venueBody.address.longitude;
            eventDoc.venueName = venueBody.name;
        }
        var event = new Event(eventDoc);
        console.log("Event to be saved: ");
        console.log(event);
        event.save(function (err) {
            if (err) {
                console.log('ERROR SAVING EVENT:');
                console.log(event);
            }
        });
    };

    var createWithVenue = function(eventBody) {
        var uri = VENUEURI.concat(eventBody.venue_id);
        console.log("Venue URI", uri);
        eventbriteRequest(uri, function(error, response, body) {
            console.log("Venue Error", error);
            console.log("Venue Response", {statusMessage: response.statusMessage, statusCode: response.statusCode});
            console.log("Venue body", body);
            createEventAndSave(eventBody, body);
        });
    };

    if (eventBody.venue_id) {
        createWithVenue(eventBody);
    } else {
        createEventAndSave(eventBody);
    }
}

var EventController = {

    createEvent: function(req) {
        var url = req.api_url;
        console.log("Eventbrite url", url);
        eventbriteRequest(url, function(error, response, body) {
            console.log("Event Error", error);
            console.log("Event Response", {statusMessage: response.statusMessage, statusCode: response.statusCode});
            console.log("Event Body", body);
            if (error) throw error;

            if (response.statusCode == 200) {
                createEvent(body);
            } else {
                console.log("Error receiving Event from Eventbrite");
            }
        });
    }
}

exports.EventController = EventController;
