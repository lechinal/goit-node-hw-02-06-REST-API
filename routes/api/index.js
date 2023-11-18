const express = require("express");
const router = express.Router();
const controller = require("../../controllers/index.js");

const { auth } = require("../../middlewares/authToken");

router.get("/contacts", auth, controller.get);

router.post("/contacts", auth, controller.create);

router.get("/contacts/:contactId", auth, controller.getById);

router.delete("/contacts/:contactId", auth, controller.remove);

router.put("/contacts/:contactId", auth, controller.update);

router.patch("/contacts/:contactId/favorite", auth, controller.updateStatus);

module.exports = router;
