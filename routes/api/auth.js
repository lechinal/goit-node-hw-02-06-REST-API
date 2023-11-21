const express = require("express");
const router = express.Router();
const authController = require("../../controllers/authController");
const multer = require("multer");
const path = require("path");

const { auth } = require("../../middlewares/authToken");

// definire si configurare middleware pntru încărcarea fișierelor cu ajutorul pachetului multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/avatars");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

// rute users

router.post("/signup", authController.signup_post);

router.post("/login", authController.login_post);

router.get("/logout", auth, authController.logout_get);

router.get("/current", auth, authController.usersData_get);

router.patch(
  "/avatars",
  auth,
  upload.single("avatar"),
  authController.uploadAvatar
);

/**
 * TODO :
 * Realizează paginarea pentru colecția de contacte (GET /contacts?page=1&limit=20).
Realizează filtrarea contactelor după câmpul favorite (GET /contacts?favorite=true).
Reînnoirea abonamentului pentru utilizator (subscription) printr-un endpoint PATCH /users. Abonamentul trebuie să aibă una dintre următoarele valori ['starter', 'pro', 'business'].
 * 
 * router.patch("/subscription", auth, authController.subscription_patch);
 *  */

module.exports = router;
