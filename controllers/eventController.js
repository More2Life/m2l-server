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

function createEvent(eventBody, callback) {
    var uri = VENUEURI.concat(eventBody.venue_id);
    console.log("Venue URI", uri);
    eventbriteRequest(uri, function(error, response, body) {
        console.log("Venue Error", error);
        console.log("Venue Response", {statusMessage: response.statusMessage, statusCode: response.statusCode});
        console.log("Venue body", body);
        var status = (eventBody.status === 'live') ? true : false;
        var event = new Event({
            title: eventBody.name.text,
            description: eventBody.description.text,
            index: 0,
            isActive: status,
            eventUrl: eventBody.url,
            resourceUri: eventBody.resource_uri,
            imageUrl: eventBody.logo.original.url,
            startTime: eventBody.start.local,
            endTime: eventBody.end.local,
            address: body.address.localized_address_display,
            area: body.address.localized_area_display,
            multiLineAddress: body.address.localized_multi_line_address_display,
            latitude: body.address.latitude,
            longitude: body.address.longitude,
            venueName: body.name
        });
        console.log("Event", event);
        event.save(callback);
    });
}

var EventController = {

    handleEventbriteHook: function(req, callback) {
        var action = req.config.action;
        var url = req.api_url;
        console.log("Eventbrite action", action);
        console.log("Eventbrite url", url);

        if (action === 'event.created') {
            console.log("Equals event.created");
            eventbriteRequest(url, function(error, response, body) {
                console.log("Event Error", error);
                console.log("Event Response", {statusMessage: response.statusMessage, statusCode: response.statusCode});
                console.log("Event Body", body);
                if (error) throw error;
                if (response.statusCode == 200) {
                    createEvent(body, callback);
                } else {
                    callback("Error receiving Event from Eventbrite");
                }
            });
        }
        else if (action === 'event.published') {
            console.log("Marking event published");
        }
        else if (action === 'event.unpublished') {
            console.log("Marking event unpublished");
        }
        else if (action === 'event.updated') {
            console.log("Updating event");
        }
        else if (action === 'venue.updated') {
            console.log("Updating venue");
        }
        else {
            callback("Action not recognized");
        }
    }
}

exports.EventController = EventController;
