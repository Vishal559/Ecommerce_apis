const User = require("../models/user");
const BigPromise = require("../middlewares/bigPromise");
const cookieToken = require("../utils/cookieToken");
const crypto = require("crypto");
const mailHelper = require("../utils/emailHelper");
const CustomError = require("../utils/customError");


exports.signup = BigPromise(async (req, res, next) => {
    
  const { username, email, password } = req.body;
  
  if (!email || !username || !password) {
    return next(new CustomError("Name, email and password are required", 400));
  }

  // const user = await User.create({
  //     req.body
  //     // username,
  //     // email,
  //     // password,
  // });

  const user = await User.create(req.body);

  cookieToken(user, res);

});


exports.login = BigPromise(async (req, res, next) => {
    const { email, password } = req.body;

    // check for presence of email and password
    if (!email || !password) {
      return res.status(400).json("please provide email and password");
    }
  
    // get user from DB
    const user = await User.findOne({ email }).select("+password");
  
    // if user not found in DB
    if (!user) {
      return res.status(400).json("Email or password does not match or exist");
    }
  
    // match the password
    const isPasswordCorrect = await user.isValidatedPassword(password);
  
    //if password do not match
    if (!isPasswordCorrect) {
      return res.status(400).json("Email or password does not match or exist");
    }
  
    // if all goes good and we send the token
    cookieToken(user, res);
});

exports.logout = BigPromise(async (req, res, next) => {
    //clear the cookie
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    //send JSON response for success
    res.status(200).json({
      succes: true,
      message: "Logout success",
    });
});


exports.forgotPassword = BigPromise(async (req, res, next) => {
    // collect email
    const { email } = req.body;
  
    // find user in database
    const user = await User.findOne({ email });
  
    // if user not found in database
    if (!user) {
      return res.status(400).json("Email not found as registered");
    }
  
    //get token from user model methods
    const forgotToken = user.getForgotPasswordToken();
  
    // save user fields in DB
    await user.save({ validateBeforeSave: false });
  
    // create a URL
    const myUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/password/reset/${forgotToken}`;
  
    // craft a message
    const message = `Copy paste this link in your URL and hit enter \n\n ${myUrl}`;
  
    // attempt to send email
    try {
      await mailHelper({
        email: user.email,
        subject: "Softwood Store - Password reset email",
        message,
      });
  
      // json reponse if email is success
      res.status(200).json({
        succes: true,
        message: "Email sent successfully",
      });
    } catch (error) {
      // reset user fields if things goes wrong
      user.forgotPasswordToken = undefined;
      user.forgotPasswordExpiry = undefined;
      await user.save({ validateBeforeSave: false });
  
      // send error response
      return res.status(500).json(error.message);
    }
});


exports.passwordReset = BigPromise(async (req, res, next) => {
    //get token from params
    const token = req.params.token;
  
    // hash the token as db also stores the hashed version
    const encryToken = crypto.createHash("sha256").update(token).digest("hex");
  
    // find user based on hased on token and time in future
    const user = await User.findOne({
        encryToken,
        forgotPasswordExpiry: { $gt: Date.now() },
    });
  
    if (!user) {
        console.log("Hello");
        return res.status(400).json({
            success : false,
            msg : "Token is invalid or expired"
        });
    }
  
    // check if password and conf password matched
    if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json("password and confirm password do not match")
    }
  
    // update password field in DB
    user.password = req.body.password;
  
    // reset token fields
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
  
    await user.save();
    cookieToken(user, res);
});
  
  