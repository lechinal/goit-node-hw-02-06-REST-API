const User = require("../services/schemas/UsersSchema");
const jwt = require("jsonwebtoken");
const Jimp = require("jimp");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");

const { v4: uuidv4 } = require("uuid");
const { successResponse, handleErrors } = require("../helpers/responses");

require("dotenv").config();
const secret = process.env.SECRET;
const BASE_URL = process.env.BASE_URL;
const OutlookEmail = process.env.OUTLOOK_EMAIL;
const OutlookPassword = process.env.OUTLOOK_PASSWORD;

// create token with jsonwebtoken
const maxAge = 3 * 60 * 60 * 1000;
const createToken = (id) => {
  return jwt.sign({ id }, secret, { expiresIn: maxAge });
};

// trimitere email de verificare
const sendVerificationEmail = async (email, verificationToken) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      user: OutlookEmail,
      pass: OutlookPassword,
    },
  });

  const mailOptions = {
    from: OutlookEmail,
    to: email,
    subject: "Email verification",
    // text: `Click on the following link to verify your email address: /users/verify/${verificationToken}`,
    html: `<p>Click on the following link: <mark><a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click Here</a></mark> to verify your email address!</p>`,
  };

  try {
    const info = transporter.sendMail(mailOptions);
    console.log("Email send: " + info.response);
  } catch (error) {
    console.log("Error sending email:", error);
  }
  // transporter.sendMail(mailOptions, (error, info) => {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("Email trimis: " + info.response);
  //   }
  // });
};

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    // generate verification token
    const verificationToken = uuidv4();

    const user = await User.create({ email, password, verificationToken });

    await sendVerificationEmail(email, verificationToken);

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

    if (!user.verify) {
      return res.status(400).json({
        errors: {
          statusCode: 400,
          email: "Email is not verified! Please check your email!",
        },
      });
    }

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

// verify email

module.exports.verifyEmailController = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;

    await verifyEmail(verificationToken);

    res
      .status(200)
      .json({ message: "Email verified successfully!", code: 200 });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: error.message,
    });
  }
};

const verifyEmail = async (verificationToken) => {
  try {
    const update = { verify: true, verificationToken: null };

    const result = await User.findOneAndUpdate(
      {
        verificationToken: verificationToken,
      },
      { $set: update },
      { new: true }
    );
    console.log(result);
    if (!result) throw new Error("User not found");
  } catch (error) {
    console.log(error);
  }
};

// resend verification email

module.exports.resendVerificationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // verificam daca exista email-ul in cerere-body
    if (!email) {
      return res.status(400).json({ message: "missing required field email" });
    }

    // gasim userul dupa email
    const user = await User.findOne({ email });

    // verificam daca userul exosta so daca nu este inca verificat
    if (user && !user.verify) {
      // generam un nou token de verificare
      const newVerificationToken = uuidv4();

      // actualizam tokelul de verificare in DB
      await User.findByIdAndUpdate(user._id, {
        verificationToken: newVerificationToken,
      });

      // trimitem email-ul de reverificare cu noul token
      await sendVerificationEmail(email, newVerificationToken);

      return res.status(200).json({ message: "Verification email resent" });
    } else if (user && user.verify) {
      // returnam o eroare daca userul este deja verificat
      return res
        .status(400)
        .json({ message: "Verification has already been passed" });
    } else {
      // returneaza eroare daca email-ul nu a fost gasit
      return res.status(400).json({ message: "Email not found" });
    }
  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
