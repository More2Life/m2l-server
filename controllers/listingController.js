var mongoose = require('mongoose');
var Listing = require('../models/listing').Listing;
// var ProductVariant = require('../models/productVariant').ProductVariant;
// var request = require('request');
// var redisController = require('../database/redis.js').RedisController;
var moment = require('moment');

// const TOKEN = process.env.SQUARE_PERSONAL_ACCESS_TOKEN;
// var baseUrl = 'https://connect.squareup.com/v2/';
// var minute = 60000;
// var LAST_POLLED_AT_KEY = 'squareItemListLastPolledAt'


// var baseRequest = request.defaults({
//     headers: {
//         'Authorization': TOKEN,
//         'Accept': 'application/json',
//         'Content-Type': 'application/json',
//     },
//     json: true
// })

var ListingController = {

    // getItemList: () => {
    //     redisController.getValueForKey(LAST_POLLED_AT_KEY, (lastPolledAt) => {
    //
    //         function searchItems(url, postBody, cursor) {
    //             var postUrl = url;
    //             if (cursor) {
    //                 postUrl = postUrl + '?cursor=' + cursor;
    //             }
    //             baseRequest.post({url: postUrl, body: postBody}, function (error, response, body) {
    //                 if (error) console.log("Error: ", error);
    //                 if (error) throw error;
    //                 var items = body.objects;
    //                 console.log("FETCHED ITEMS LIST:");
    //                 console.log(items);
    //                 if (items) {
    //                     items.forEach(function (item, index) {
    //                         ListingController.checkAndUpdateListing(item);
    //                     });
    //                 }
    //                 if (body.cursor) {
    //                     console.log('PAGINATE WITH CURSOR: ' + body.cursor);
    //                     searchItems(url, postBody, body.cursor);
    //                 }
    //             });
    //         }
    //         var postBody = {object_types : ["ITEM"]};
    //         var searchTime = moment().toISOString();
    //         if (lastPolledAt) {
    //             postBody.begin_time = lastPolledAt;
    //         }
    //         var postUrl = baseUrl + 'catalog/search';
    //
    //         searchItems(postUrl, postBody);
    //         redisController.setKeyValue(LAST_POLLED_AT_KEY, searchTime)
    //     });
    // },

    handleWebhook : async (item) => {
        try {
            var listing = await Listing.findOne({'vendorId' : item.id});
            if (listing) {
                console.log('LISTING FOUND');
                ListingController.updateListing(listing, item);
            } else {
                ListingController.createListing(item);
            }
        } catch (err) {
            console.log(err);
        }
    },

    createListing : (item) => {

        console.log('CREATING LISTING');
        let variants = [];
        item.variants.forEach( v => {
            var variant = {
                vendorId: v.id,
                title: v.title,
                sku: v.sku,
                option1: v.option1,
                option2: v.option2,
                option3: v.option3,
                imageId: v.image_id,
                inventoryQuantity: v.inventory_quantity
            };
            variants.push(variant);
        });

        var listing = new Listing({
            title: item.title,
            description: item.body_html,
            index: 0,
            isActive: true,
            vendorId: item.id,
            feedImageUrl: item.images[0].src,
            lastUpdatedAt: item.updated_at,
            price: item.variants[0].price,
            variants: variants
        });

        ListingController.saveListing(listing);
    },

    updateListing : (listing, item) => {
        let variants = [];
        item.variants.forEach( v => {
            var variant = {
                vendorId: v.id,
                title: v.title,
                sku: v.sku,
                option1: v.option1,
                option2: v.option2,
                option3: v.option3,
                imageId: v.image_id,
                inventoryQuantity: v.inventory_quantity
            };
            variants.push(variant);
        });

        listing.title = item.title;
        listing.description = item.body_html;
        listing.feedImageUrl = item.images[0].src;
        listing.lastUpdatedAt = item.updated_at;
        listing.price = item.variants[0].price;
        listing.variants = variants;

        ListingController.saveListing(listing);
    },

    saveListing : (listing) => {
        console.log('SAVING LISTING');
        listing.save(function (err) {
            if (err) {
                console.log('ERROR SAVING LISTING:');
                console.log(listing)
                console.log(err);
            }
        });
    }
}

// setInterval( async () => {
//     console.log('POLLING SQUARE ITEMS');
//     await ListingController.getItemList();
// }, minute * 60);

exports.ListingController = ListingController;