// const multer = require("multer");
// const path = require("path");

// // definire si configurare middleware pntru încărcarea fișierelor cu ajutorul pachetului multer
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "./public/avatars");
//   },

//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     );
//   },
// });

// const upload = multer({ storage: storage });
