const User = require("../models/user.model");

const authUtil = require("../util/authentication");
const sessionFlash = require("../util/session-flash");

const bcrypt = require("bcrypt");
const {
  userDetailsAreValid,
  loginDetailsAreValid,
} = require("../util/validation");

const getSignup = (req, res) => {
  let sessionData = sessionFlash.getSessionData(req);
  if (!sessionData) {
    sessionData = {
      email: "",
      confirmEmail: "",
      password: "",
      fullname: "",
      address: "",
      postal: "",
      city: "",
    };
  }
  res.render("./customer/auth/signup", { inputData: sessionData });
};

const signUp = async (req, res, next) => {
  const { email, password, fullname, address, postal, city } = req.body;

  const data = {
    email,
    confirmEmail: req.body["confirm-email"],
    password,
    fullname,
    address,
    postal,
    city,
  };

  const validate = userDetailsAreValid(
    email,
    password,
    fullname,
    address,
    postal,
    city
  );
  if (!validate) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          "Please check your input, Password must be at least 6 character",
        ...data,
      },
      () => {
        res.redirect("/signup");
      }
    );
    return;
  }

  let existedUser;
  try {
    existedUser = await User.find({ email });
  } catch (error) {
    next(error);
    return;
  }

  if (existedUser.length !== 0) {
    sessionFlash.flashDataToSession(
      req,
      { errorMessage: "User Exists already! Try Logging in instead", ...data },
      () => {
        res.redirect("/signup");
      }
    );
    return;
  }

  const confirmEmail = req.body["confirm-email"];
  if (email !== confirmEmail) return;

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    email: email,
    password: hashedPassword,
    fullname: fullname,
    address: address,
    postal: postal,
    city: city,
  });

  try {
    await user.save();
  } catch (error) {
    next(error);
    return;
  }
  res.redirect("/login");
};

const getLogin = (req, res) => {
  let sessionData = sessionFlash.getSessionData(req);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }

  res.render("./customer/auth/login", { inputData: sessionData });
};

const logIn = async (req, res, next) => {
  const { email, password } = req.body;

  const validate = loginDetailsAreValid(email, password);

  if (!validate) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "Invalid Credentials - please double-check your data",
        email,
        password,
      },
      () => {
        res.redirect("/login");
      }
    );
    return;
  }

  let user;
  try {
    user = await User.find({ email });
  } catch (error) {
    next(error);
    return;
  }

  if (user.length == 0) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "Invalid Credentials - please double-check your data",
        email,
        password,
      },
      () => {
        res.redirect("/login");
      }
    );
    return;
  }

  let result;
  try {
    result = await bcrypt.compare(password, user[0].password);
  } catch (error) {
    next(error);
    return;
  }

  if (!result) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage: "Invalid Credentials - please double-check your data",
        email,
        password,
      },
      () => {
        res.redirect("/login");
      }
    );
    return;
  }
  authUtil.createUserSession(req, user[0], () => {
    res.redirect("/");
  });
};

const logout = (req, res) => {
  authUtil.destroyUserAuthSession(req);
  res.redirect("/");
};

module.exports = {
  getSignup: getSignup,
  getLogin,
  signUp,
  logIn,
  logout,
};
