const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");

const { auth } = require("../../middlewares/authToken");

router.post("/signup", authController.signup_post);

router.post("/login", authController.login_post);

router.get("/logout", auth, authController.logout_get);

router.get("/current", auth, authController.usersData_get);

/**
 * TODO :
 * Realizează paginarea pentru colecția de contacte (GET /contacts?page=1&limit=20).
Realizează filtrarea contactelor după câmpul favorite (GET /contacts?favorite=true).
Reînnoirea abonamentului pentru utilizator (subscription) printr-un endpoint PATCH /users. Abonamentul trebuie să aibă una dintre următoarele valori ['starter', 'pro', 'business'].
 * 
 * router.patch("/subscription", auth, authController.subscription_patch);
 *  */

module.exports = router;
