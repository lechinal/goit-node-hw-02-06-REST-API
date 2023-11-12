// definim schemele de la DB meu
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contact = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
    minLength: 2,
  },
  email: { type: String, required: true, minLength: 3 },
  phone: { type: String, required: true, minLength: 5 },
  favorite: { type: Boolean, default: false },
});

const Contact = mongoose.model("contacts", contact);

module.exports = Contact;
