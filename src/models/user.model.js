import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { generateUUID } from "../utils/uuidHander.js";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowecase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    first_name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
    },
    coverImg: {
        type: String,
      },
    date_joined: {
      type: Date,
      default: Date.now,
    },
    resume_count: {
      type: Number,
    },
    cover_letter_count: {
      type: Number,
    },
    web_site_count: {
      type: Number,
    },
    confirmed_privacy_policy: {
      type: Boolean,
    },
    uuid: {
      type: String,
      default: generateUUID,
      unique: true,
    },
    enable_notification: {
      type: Boolean,
    },
    data_sharing: {
      type: Boolean,
    },
    confirmed_marketing_emails: {
      type: Boolean,
    },
    confirmed_joboffer_emails: {
      type: Boolean,
    },
    is_superuser: {
      type: Boolean,
      default: false,
    },
    first_login: {
      type: Boolean,
      default: true,
    },
    refreshToken: {
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    // CV reference
    cv: {
      type: Schema.Types.ObjectId,
      ref: "CV",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      fullName: this.fullName,
      first_name: this.first_name,
      last_name: this.last_name,
      date_joined: this.date_joined,
      resume_count: this.resume_count,
      cover_letter_count: this.cover_letter_count,
      web_site_count: this.web_site_count,
      confirmed_privacy_policy: this.confirmed_privacy_policy,
      enable_notification: this.enable_notification,
      data_sharing: this.data_sharing,
      confirmed_marketing_emails: this.confirmed_marketing_emails,
      confirmed_joboffer_emails: this.confirmed_joboffer_emails,
      is_superuser: this.is_superuser,
      first_login: this.first_login,
      refreshToken: this.refreshToken,
      // CV reference
      cv: this.cv,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);
