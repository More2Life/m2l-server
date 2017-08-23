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
    var uri = VENUEURI.concat(eventBody.venue_id);
    console.log("Venue URI", uri);
    eventbriteRequest(uri, function(error, response, venueBody) {
        console.log("Venue Response", {statusMessage: response.statusMessage, statusCode: response.statusCode});
        console.log("Venue body", venueBody);

        if (error || response.statusCode != 200) {
            console.log("Error receiving Venue from Eventbrite", error);
            endRequest();
        } else { // have both Event and Venue, so create Event
            var eventDoc = {
                title: eventBody.name.text,
                description: eventBody.description.text,
                index: 0,
                isActive: (eventBody.status === 'live') ? true : false,
                eventStatus: eventBody.status,
                eventUrl: eventBody.url,
                resourceUri: eventBody.resource_uri,
                feedImageUrl: (eventBody.logo) ? eventBody.logo.original.url : null,
                startTime: eventBody.start.local,
                endTime: eventBody.end.local,
                address: venueBody.address.localized_address_display,
                area: venueBody.address.localized_area_display,
                multiLineAddress: venueBody.address.localized_multi_line_address_display,
                latitude: venueBody.address.latitude,
                longitude: venueBody.address.longitude,
                venueName: venueBody.name,
                venueId: venueBody.id
            }
            var event = new Event(eventDoc);
            console.log("Event to be saved: ");
            console.log(event);
            event.save(function (err) {
                if (err) {
                    console.log('ERROR SAVING EVENT', err);
                    console.log(event);
                }
                endRequest();
            });
        }
    });
}

function updateEvent(eventBody, endRequest) {
    var save = function(eventToSave) {
        eventToSave.save(function (err) {
            if (err) {
                console.log('ERROR SAVING EVENT:');
                console.log(ev);
            }
            endRequest();
        })
    }

    Event.findOne({resourceUri: eventBody.resource_uri}, function(err, ev){
        if (err) throw err; // if err, explode node)

        if (ev)  { // we have this event in our DB; update it
            ev.title = eventBody.name.text;
            ev.description = eventBody.description.text;
            ev.isActive = (eventBody.status === 'live') ? true : false;
            ev.eventStatus = eventBody.status;
            ev.eventUrl = eventBody.url;
            ev.feedImageUrl = (eventBody.logo) ? eventBody.logo.original.url : null;
            ev.startTime = eventBody.start.local;
            ev.endTime = eventBody.end.local;

            if (ev.venueId != eventBody.venue_id) { // if the venue changed, we should fetch it again
                var uri = VENUEURI.concat(eventBody.venue_id);
                eventbriteRequest(uri, function(error, response, venueBody) {
                    console.log("Venue Response", {statusMessage: response.statusMessage, statusCode: response.statusCode});
                    console.log("Venue body", venueBody);
                    if (error || response.statusCode != 200) {
                        console.log("Error receiving Venue from Eventbrite", error);
                        endRequest(createError(412, "Your venue isn't available; send another hook later"));
                    } else {
                        ev.address = venueBody.address.localized_address_display;
                        ev.area = venueBody.address.localized_area_display;
                        ev.multiLineAddress = venueBody.address.localized_multi_line_address_display;
                        ev.latitude = venueBody.address.latitude;
                        ev.longitude = venueBody.address.longitude;
                        ev.venueName = venueBody.name;
                        ev.venueId = venueBody.id;
                        save(ev);
                    }
                });
            } else { // venue did not change
                save(ev);
            }
        } else if (eventBody.venue_id) { // Don't have this event already; create one if we have a venue
                createEvent(eventBody, endRequest);
        } else { // don't have this event, and it also didn't come with venue, so do nothing
            endRequest();
        }
    });
}

var EventController = {

    createFromEventbrite: function(url, endRequest) {
        console.log("Eventbrite url", url);
        eventbriteRequest(url, function(error, response, body) {
            console.log("Event Response", {statusMessage: response.statusMessage, statusCode: response.statusCode});
            console.log("Event Body", body);
            if (error || response.statusCode != 200) {
                console.log("Error receiving Event from Eventbrite", error);
                endRequest(error);
            } else if (!body.venue_id) {
                endRequest(createError(412, 'Event doesn\'t have required details. Will not create.'));
            } else {
                createEvent(body, endRequest);
            }
        });
    },

    updateFromEventbrite: function(url, endRequest) {
        console.log("Eventbrite url", url);
        eventbriteRequest(url, function(error, response, body) {
            console.log("Event Response", {statusMessage: response.statusMessage, statusCode: response.statusCode});
            console.log("Event Body", body);
            if (error || response.statusCode != 200) {
                console.log("Error receiving Event from Eventbrite", error);
                endRequest(error);
            } else {
                updateEvent(body, endRequest);
            }
        });
    }
}

exports.EventController = EventController;
