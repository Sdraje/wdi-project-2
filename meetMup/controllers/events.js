module.exports = {
  index:       eventsIndex,
  indexByType: eventsIndexByType
};

const Event = require('../models/event');

function eventsIndexByType(req, res){
  Event.find({ eventType: req.params.eventType, town: req.params.town}).sort({date: 1}).exec((err, events) => {
    if (err) return res.status(500).json({ message: "Error." });
    return res.status(200).json({ events });
  });
}

function eventsIndex(req, res){
  Event.find({town: req.params.town}).sort({date: 1}).exec((err, events) => {
    if (err) return res.status(500).json({ message: "Error." });
    return res.status(200).json({ events });
  });
}
