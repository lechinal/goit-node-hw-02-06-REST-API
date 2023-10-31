const fs = require("fs/promises");
const path = require("path");

const contactsPath = path.join(__dirname, "contacts.json");

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf8");
    const contacts = JSON.parse(data);
    console.table(contacts);
    return contacts;
  } catch (error) {
    console.error("An error occurred while reading the file:", error);
    throw error;
  }
}

async function getContactById(contactId) {
  try {
    const contacts = await listContacts();
    const contact = contacts.find(({ id }) => id === contactId);

    if (!contact) {
      throw new Error(`Contact with id:${contactId} was not found!`);
    }
    console.table(contact);
    return contact;
  } catch (error) {
    console.error("An error occurred while getting contact by id:", error);
    throw error;
  }
}

async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      console.error(`Contact with id:${contactId} was not found!`);
      return;
    }
    contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  } catch (error) {
    console.error(
      "There was an error while removing the contact by id:",
      error
    );
    throw error;
  }
}

async function addContact(body) {
  if (!body.name || !body.email || !body.phone) {
    console.error("Missing required name field");
    return;
  }
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const newContact = { ...body, id: String(Date.now()) };
    contacts.push(newContact);
    console.table(contacts);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log("Contact successfully added to the list!");
    return newContact;
  } catch (error) {
    console.error("An error occurred while adding the contact:", error);
  }
}

async function updateContact(contactId, body) {
  if (!body.name || !body.email || !body.phone) {
    console.error(
      "Name, email, or phone field is missing. Please provide the required information."
    );
    return;
  }
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    const contacts = JSON.parse(data);
    const index = contacts.findIndex((contact) => contact.id === contactId);
    if (index === -1) {
      console.error(`Contact with id:${contactId} was not found!`);
      return;
    }
    const updatedContact = { ...contacts[index], ...body };
    contacts[index] = updatedContact;
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    console.log("Contact details have been successfully updated!");
    return updatedContact;
  } catch (error) {
    console.error("An error occurred while updating the contact:", error);
    throw error;
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
