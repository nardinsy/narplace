import { RequestHandler, Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import createHttpError from "../models/createHttpError";
import User, { IUser } from "../models/user";
import { UserInfoType } from "../types/types";
import privateKey from "../privateKey";
import { PlaceDto, UserDto } from "../shared/dtos";
import { AuthRequestHandler } from "../lib/auth";
import contentTypeBufferSplit from "../helpers/data-url";
import ProfilePicture, { IProfilePicture } from "../models/profile-picture";
import { LoginResult } from "../shared/results";

const getProfilePictureUrl = (id: string): string => {
  return `users/profile-picture/${id}`;
};

export const getUsers: RequestHandler = async (req, res, next) => {
  const result = await User.find().exec();

  const usersInfo = result.map((user) => {
    return new UserDto(
      user.id,
      user.username,
      user.picture
        ? getProfilePictureUrl(user.picture.toHexString())
        : undefined,
      user.places.length
      // pictureUrl: (if has picture) ? url to the picture : undefined
    );
  });

  res.json({ message: "Get users successfully", usersInfo });
};

export const signup: RequestHandler = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = createHttpError(
      "Invalid input passed, please check your sign up information.",
      422
    );
    return next(error);
  }

  const username: string = req.body.username;
  const email: string = req.body.email;
  const password: string = req.body.password;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(
        createHttpError("User exists already, please login instead.", 422)
      );
    }
  } catch (error) {
    return next(
      createHttpError("Signing up failed, please try again later.", 500)
    );
  }

  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      createHttpError("Could not create user, please try again.", 500)
    );
  }

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    places: [],
  });

  const token = await generateToken(newUser);

  try {
    await newUser.save();
    // await session.save();
  } catch (error) {
    return next(createHttpError("Signing up failed, please try again.", 500));
    // console.log(error);
  }

  const userInfo = new UserDto(newUser.id, username, undefined);
  res.status(201).json({
    message: "Signup user successfully.",
    token: token,
    userInfo,
  });
};

export const login: RequestHandler = async (req, res, next) => {
  const email: string = req.body.email;
  const password: string = req.body.password;

  let existingUser: IUser | null;

  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(
      createHttpError("Logging in failed, please try again later.", 500)
    );
  }

  if (!existingUser) {
    return next(
      createHttpError("Could not identify user or Wrong password", 401)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(createHttpError("Wrong password", 401));
  }

  if (!isValidPassword) {
    return next(
      createHttpError("Invalid credentials, could not log you in.", 401)
    );
  }

  const token = await generateToken(existingUser);

  const userDto = new UserDto(
    existingUser.id,
    existingUser.username,
    existingUser.picture
      ? getProfilePictureUrl(existingUser.picture.toHexString())
      : undefined
  );

  res.status(200).json(new LoginResult(token, userDto));
};

export const logout: AuthRequestHandler = async (user, req, res, next) => {
  res.json({ message: "User logged out successfully" });
};

export const editUserInfo: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const username: string = req.body.username;

  if (username !== "") {
    user.username = username;
  } else {
    return;
  }

  try {
    await user.save();
  } catch (error) {
    return next(createHttpError("Signing up failed, please try again.", 500));
  }

  res.status(201).json({
    message: "Edit user info successfully.",
    userId: user.id,
    username: user.username,
  });
};

export const changeProfilePicture: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const image: string = req.body.image;

  const deleteOk = await deleteUserPictureFromDB(user.id);

  if (!image && deleteOk) {
    user.picture = null;
    try {
      user.save();
    } catch (error) {
      console.log(error);
    }
    res.status(201).json({
      message: "Delete user image successfully.",
    });
    return;
  }

  const { contentType, buffer } = contentTypeBufferSplit(image);

  // let userPicture;

  const userPicture: IProfilePicture = new ProfilePicture({
    image: {
      data: buffer,
      contentType,
    },
    userId: user.id,
  });

  try {
    await userPicture.save();
  } catch (error) {
    console.log(error);
  }

  user.picture = userPicture._id;

  try {
    user.save();
  } catch (error) {
    console.log(error);
  }

  const userInfo = new UserDto(
    user.id,
    user.username,
    getProfilePictureUrl(userPicture.id)
  );

  res.status(201).json({
    message: "Edit user image successfully.",
    userInfo,
    // pictureUrl: getProfilePictureUrl(userPicture.id),
  });
};

export const getUserProfilePicture: RequestHandler = async (req, res, next) => {
  const userId: string = req.params.uid;

  let userPicture;
  try {
    userPicture = await ProfilePicture.findOne({
      _id: userId,
    });
  } catch (error) {
    console.log(error);
  }

  if (!userPicture) {
    res.status(404).end();
  } else {
    res.set("Content-Type", userPicture.image.contentType);
    res.send(userPicture.image.data);
  }
};

export const changePassword: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const password: string = req.body.password;

  let hashedPassword: string;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(
      createHttpError("Could not change password, please try again.", 500)
    );
  }

  user.password = hashedPassword;

  try {
    user.save();
  } catch (error) {
    return next(
      createHttpError("Could not change password, please try again.", 500)
    );
  }

  res.status(200).json({ message: "Changed password successfully" });
};

export const changeUsername: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const username: string = req.body.username;

  user.username = username;

  try {
    user.save();
  } catch (error) {
    return next(
      createHttpError("Could not change username, please try again.", 500)
    );
  }

  res.status(200).json({ message: "Changed username successfully" });
};

const generateToken = async (user: IUser): Promise<string> => {
  let token;
  try {
    token = jwt.sign({ userId: user.id, email: user.email }, privateKey);
  } catch (error) {
    console.log(error);
    throw new Error("Can not generate token");
  }

  return token;
};

const deleteUserPictureFromDB = async (id: string) => {
  try {
    const userPicture = await ProfilePicture.findOne({
      userId: id,
    });
    //if you want to store all picture do not delete
    if (userPicture) {
      await ProfilePicture.findByIdAndDelete(userPicture._id.toHexString());
      return "Delete";
    }
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
