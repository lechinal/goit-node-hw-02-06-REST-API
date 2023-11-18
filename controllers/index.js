const services = require("../services/index.js");

const get = async (req, res, next) => {
  try {
    const results = await services.getAllContacts();
    res.json({
      status: "success",
      code: 200,
      data: results,
    });
  } catch (error) {
    res
      .status(400)
      .json({ status: "error", code: 400, message: error.message });
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;
    const result = await services.addContact({ name, email, phone, favorite });
    res.status(201).json({ status: "success", code: 201, data: result });
  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: "error",
      code: 404,
      message: error.message,
    });
    next(error);
  }
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await services.getContactById(contactId);
    if (result) {
      res.json({ status: "success", code: 200, data: result });
    }
  } catch (error) {
    res.error(404).json({ status: "error", code: 404 });
    next(error);
  }
};

const remove = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await services.removeContact(contactId);
    if (result) {
      res.json({ status: "success", code: 200, message: "contact deleted" });
    }
  } catch (error) {
    res
      .error(404)
      .json({ status: "error", code: 404, message: "contact not found" });
  }
};

const update = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, email, phone, favorite } = req.body;
  try {
    const result = await services.updateContact(contactId, {
      name,
      email,
      phone,
      favorite,
    });
    if (result) {
      res.status(200).json({ status: "success", code: 200, data: result });
    }
  } catch (error) {
    res.error(404).json({ status: "error", code: 404 });
  }
};

const updateStatus = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  try {
    const result = await services.updateStatusContact(contactId, { favorite });
    if (result) {
      res.status(200).json({ status: "updated", code: 200, data: result });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ status: "error", code: 404, message: "Not found" });
  }
};

module.exports = { get, create, getById, remove, update, updateStatus };
