module.exports = {
  index: eventsIndex
};

const Event = require('../models/event');

function eventsIndex(req, res){
  Event.find({}).sort({name: 1}).exec((err, events) => {
    if (err) return res.status(500).json({ message: "Error." });
    return res.status(200).json({ events });
  });
}
