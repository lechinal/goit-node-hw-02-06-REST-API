const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
    minLength: 2,
  },
  email: { type: String, required: true, minLength: 3 },
  phone: { type: String, required: true, minLength: 5 },
  favorite: { type: Boolean, default: false },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});

const Contact = mongoose.model("contact", contactSchema);

module.exports = Contact;
