import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { userRegistrationValidation } from "../validator/user.validator.js";
import { BlacklistToken } from "../models/blacklistToken.model.js";

const registerUser = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!firstname || !email || !password) {
      throw new Error("All fileds are required!");
    }

    const inputError = userRegistrationValidation({
      firstname,
      lastname,
      email,
      password,
    });

    if (inputError) {
      console.log(inputError);
      throw new ApiError(400, `${inputError[0].message}`);
    }

    const normalizedEmail = email?.toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });

    if (userExists) {
      throw new ApiError(400, "User with this email already exists");
    }

    const hashedPassword = await User.hashPassword(password);

    const user = await User.create({
      fullname: {
        firstname,
        lastname,
      },
      lastname,
      email: normalizedEmail,
      password: hashedPassword,
    });

    const createdUser = await User.findById(user._id).select("-password ");

    if (!createdUser) {
      throw new ApiError(500, "Something went wrong registering the user");
    }

    const token = user.generateAuthToken();

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { createdUser, token },
          "User Registered Sucessfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "All fields must be filled");
    }

    const userExist = await User.findOne({ email }).select("+password");

    if (!userExist) {
      throw new ApiError(401, "Invalid email or password ");
    }

    const isValid = await userExist.isPasswordCorrect(password);

    if (!isValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    const token = userExist.generateAuthToken();

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("token", token, options)
      .json(
        new ApiResponse(200, { userExist, token }, "Logged in sucessfully")
      );
  } catch (error) {
    next(error);
  }
};

const getUserProfile = async (req, res, next) => {
  try {
    const currentUser = req.user;
    if (!currentUser) {
      throw new ApiError(502, "Failed to get user");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, currentUser, "Current user fetched Successfully")
      );
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization.split(" ")[1];

    await BlacklistToken.create({ token });

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .clearCookie("token", options)
      .json(new ApiResponse(200, {}, "Logged out successfully"));
  } catch (error) {
    next(error);
  }
};

export { registerUser, loginUser, getUserProfile, logoutUser };
