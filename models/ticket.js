var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var TicketSchema = new Schema({
    name: String,
    user: String,
    status: String,
    sprint: Number,
    memo: String,
    board: ObjectId,
    icon: String,
    category: String,
    deadline: Date
});
TicketSchema.plugin(timestamps);
module.exports = mongoose.model('Ticket', TicketSchema);
