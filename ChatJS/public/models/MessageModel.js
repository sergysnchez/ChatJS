var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var message = new Schema({
  author:   { type: String, require: true },
  text:   { type: String, require: true },
  tipo: { type: String, require: true },
  dia : { type: String, require: true },
  horas : { type: String, require: true },
  destinatario:   { type: String, require: true },
  leido: { type: Boolean, require: true}
});

module.exports = mongoose.model('message', message);
