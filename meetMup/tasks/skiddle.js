const mongoose   = require("mongoose");
const Bluebird   = require("bluebird");
mongoose.Promise = Bluebird;
const rp         = require("request-promise");
const config     = require("../config/config");
const Event      = require("../models/event");
const limit      = 100;
let totalcount   = 0;
let pages        = 0;
const url        = urlBuilder(0);

Event.collection.drop();

mongoose.connect(config.db, () => {
  console.log("Connected to db.");
});

function getEvents() {
  return rp(url)
    .then(data => {
      let json   = JSON.parse(data);
      totalcount = json.totalcount;
      pages      = Math.floor(totalcount/limit);
      if (totalcount % limit !== 0) {
        pages   += 1;
      }
      return Bluebird.mapSeries(Array(pages), (page, i) => {
        return rp(urlBuilder((i+1)*limit))
        .then(data => {
          let json = JSON.parse(data);
          return Bluebird.map(json.results, result => {
            let eventData         = {};
            eventData.externalId  = result.id;
            eventData.name        = result.eventname;

            eventData.description = result.description;
            eventData.venue       = result.venue.name;
            eventData.address     = result.venue.address;
            eventData.postCode    = result.venue.postcode;
            eventData.town        = result.venue.town;
            eventData.type        = result.venue.type;
            eventData.imageurl    = result.largeimageurl;
            eventData.link        = result.link;
            eventData.date        = result.date;

            eventData.lat         = result.venue.latitude;
            eventData.lng         = result.venue.longitude;
            console.log(`Saving ${eventData.name}`);

            return Event.create(eventData);
          });
        });
      });
    })
    .then(data => {
      console.log(data);
    })
    .catch(console.error);
}

function urlBuilder(offset) {
  return `http://www.skiddle.com/api/v1/events/?api_key=${process.env.SKIDDLE_API_KEY}&limit=${limit}&offset=${offset}`;
}

getEvents();
