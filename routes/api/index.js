const express = require("express");
const router = express.Router();
const controller = require("../../controllers/index.js");

router.get("/contacts", controller.get);

router.post("/contacts", controller.create);

router.get("/contacts/:contactId", controller.getById);

router.delete("/contacts/:contactId", controller.remove);

router.put("/contacts/:contactId", controller.update);

router.patch("/contacts/:contactId/favorite", controller.updateStatus);

module.exports = router;
