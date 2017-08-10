var mongoose = require('mongoose');
var Event = require('../models/event').Event;
var request = require('request');
var createError = require('http-errors');

const TOKEN = process.env.EVENTBRITE_BEARER_TOKEN;
const VENUEURI = "https://www.eventbriteapi.com/v3/venues/"

var eventbriteRequest = request.defaults({
    headers: {
        'Authorization' : TOKEN
    },
    json: true
})

function createEvent(eventBody, endRequest) {
    var createEventAndSave = function(eventBody, venueBody) {
        var eventDoc = {
            title: eventBody.name.text,
            description: eventBody.description.text,
            index: 0,
            isActive: (eventBody.status === 'live') ? true : false,
            eventUrl: eventBody.url,
            resourceUri: eventBody.resource_uri,
            imageUrl: (eventBody.logo) ? eventBody.logo.original.url : null,
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
            endRequest();
        });
    };

    var getVenueDetails = function(eventBody) {
        var uri = VENUEURI.concat(eventBody.venue_id);
        console.log("Venue URI", uri);
        eventbriteRequest(uri, function(error, response, body) {
            console.log("Venue Error", error);
            console.log("Venue Response", {statusMessage: response.statusMessage, statusCode: response.statusCode});
            console.log("Venue body", body);
            createEventAndSave(eventBody, body);
        });
    };

    if (!body.venue_id) {
        endRequest(createError(412, 'Event doesn\'t have required details.'));
    } else {
        getVenueDetails(eventBody);
    }
}

var EventController = {

    createEvent: function(url, endRequest) {
        console.log("Eventbrite url", url);
        eventbriteRequest(url, function(error, response, body) {
            console.log("Event Error", error);
            console.log("Event Response", {statusMessage: response.statusMessage, statusCode: response.statusCode});
            console.log("Event Body", body);
            if (error || response.statusCode != 200) {
                console.log("Error receiving Event from Eventbrite");
                endRequest(error);
            } else {
                createEvent(body, endRequest);
            }
        });
    }
}

exports.EventController = EventController;
