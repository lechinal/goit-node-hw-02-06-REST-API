const User = require("../services/schemas/UsersSchema");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs");

// const { upload } = require("../routes/api/auth");
const { successResponse, handleErrors } = require("../helpers/responses");

require("dotenv").config();
const secret = process.env.SECRET;

// create token with jsonwebtoken
const maxAge = 3 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, secret, { expiresIn: maxAge });
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    await User.findByIdAndUpdate(user._id, { token });
    const response = successResponse(user, token);

    res.status(201).json(response);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(errors.statusCode || 400).json({ errors });
  }
};

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    await User.findByIdAndUpdate(user._id, { token });
    const response = successResponse(user, token);

    res.status(200).json(response);
  } catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({ errors });
  }
};

module.exports.logout_get = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    if (!user.token) {
      return res.status(200).json({ message: "User already logged out!" });
    }

    await User.findByIdAndUpdate(_id, { token: null });

    res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error updating user token:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports.usersData_get = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(401).json({ message: "Not authorized" });
    }
    const userData = {
      email: user.email,
      subscription: user.subscription,
    };
    res.status(200).json(userData);
  } catch (error) {
    console.error("error retrieving user data:", error);
    res.statut(500).json({ message: "internal Server Error" });
  }
};

/** 
 * TODO :
 * module.exports.subscription_patch = (req, res) => {
  res.json({ message: "Subscription updated successfully" });
};
 *  
 */

module.exports.uploadAvatar = async (req, res, next) => {
  console.log("test");

  try {
    if (!req.file) {
      return res.status(404).json({ error: "No file provided!" });
    }

    // creem un numa unic pt fisierul de avatar folosind id-ul utilizatorului si marcajul de timp
    const uniqFilename = `${req.user._id}-${Date.now()}${path.extname(
      req.file.originalname
    )}`;

    const destinationPath = path.join(
      __dirname,
      `../public/avatars/${uniqFilename}`
    );
    // definim calea de destinație pentru fișierul final de avatar.

    // folosim Jimp pentru redimensionare, ajustarea calității și transformare în tonuri de gri
    await Jimp.read(req.file.path)
      .then((image) => {
        return image
          .resize(250, 250)
          .quality(60)
          .greyscale()
          .writeAsync(destinationPath);
        // writeAsync(destinationPath) salvează în calea de destinație.
      })
      // stergem  fișierul original după redimensionare,
      .then(() => {
        fs.unlinkSync(req.file.path);
      })
      // excepție în caz de eroare în timpul procesării imaginii cu Jimp.
      .catch((error) => {
        throw error;
      });

    // actualizam calea avatarului în obiectul utilizatorului.
    req.user.avatarURL = `/avatars/${uniqFilename}`;
    // salvam modificările în obiectul utilizatorului în baza de date.
    await req.user.save();

    res.status(200).json({ avatarURL: req.user.avatarURL });
  } catch (error) {
    res.status(500).json({ error: error.message });
    next(error);
  }
};
