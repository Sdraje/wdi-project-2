const mongoose = require("mongoose");

let eventSchema = new mongoose.Schema({
  externalId:  { type: String, trim: true },
  name:        { type: String, trim: true },
  description: { type: String, trim: true },
  venue:       { type: String, trim: true },
  address:     { type: String, trim: true },
  postCode:    { type: String, trim: true },
  town:        { type: String, trim: true },
  type:        { type: String, trim: true },
  imageurl:    { type: String, trim: true },
  link:        { type: String, trim: true },
  date:        { type: String, trim: true },
  lat:         { type: String, trim: true },
  lng:         { type: String, trim: true }
});

module.exports = mongoose.model("Event", eventSchema);
