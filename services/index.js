const Contact = require("./schemas/ContactSchema");

const getAllContacts = async () => {
  return Contact.find();
};

const getContactById = async (id) => {
  const contact = await Contact.findById(id);
  return contact;
};

const removeContact = async (id) => {
  const result = await Contact.findByIdAndDelete(id);
  return result;
};

const addContact = async ({ name, email, phone, favorite }) => {
  return Contact.create({ name, email, phone, favorite });
};

const updateContact = async (id, updateData) => {
  const result = await Contact.findByIdAndUpdate({ _id: id }, updateData, {
    new: true,
  });
  return result;
};

const updateStatusContact = async (id, statusUpdate) => {
  console.log(id, statusUpdate);

  return Contact.findByIdAndUpdate(
    { _id: id },
    { $set: statusUpdate },
    { new: true }
  );
};

module.exports = {
  getAllContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
