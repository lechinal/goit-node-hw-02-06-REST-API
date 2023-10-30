const express = require("express");
const router = express.Router();
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../db/contacts");

router.get("/", (req, res, next) => {
  res.status(200).json({
    status: "success",
    code: 200,
    data: "Server is working nice!",
  });
  next();
});

router.get("/contacts", async (req, res, next) => {
  try {
    const contacts = await listContacts();

    res.status(200).json({
      status: "success",
      code: 200,
      data: { ...contacts },
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      code: 500,
      message: "Error in getting contacts",
    });
  }
});

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const contact = await getContactById(contactId);
    res.status(200).json({
      status: "success",
      code: 200,
      data: { ...contact },
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  }
});

router.post("/contacts", async (req, res, next) => {
  const { name, email, phone } = req.body;
  try {
    const data = await addContact({ name, email, phone });
    res.status(201).json({
      status: "success",
      code: 201,
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "missing required name field",
    });
  }
});

router.delete("/contacts/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  //   console.log(contactId);
  try {
    await removeContact(contactId);
    res.status(200).json({
      status: "success",
      code: 200,
      message: "contact deleted!",
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not Found!",
    });
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400).json({
      status: "error",
      code: 400,
      message: "missing required field",
    });
  }
  try {
    const data = await updateContact(contactId, { name, email, phone });
    res.status(200).json({
      status: "success",
      code: 200,
      data: data,
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      code: 404,
      message: "Not found",
    });
  }
});

module.exports = router;
