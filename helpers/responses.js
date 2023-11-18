const successResponse = (user, token) => {
  return {
    user: {
      email: user.email,
      password: user.password,
      subscription: user.subscription || "starter",
      token: token,
    },
  };
};

// handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  const errors = { email: "", password: "" };

  // Login auth error
  if (
    err.message === "incorrect email" ||
    err.message === "incorrect password"
  ) {
    errors.statusCode = 401;
    errors.email = "Email or password is wrong!";
  } else if (err.code === 11000) {
    errors.statusCode = 400;
    errors.email = "This email is already registered";
  }

  // Login validation error
  else if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

module.exports = {
  successResponse,
  handleErrors,
};
