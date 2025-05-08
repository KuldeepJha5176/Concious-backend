import { UserModel } from "../models";
import { signupSchema } from "../utils/validation";
import { signinSchema } from "../utils/validation";
import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const validInput = signupSchema.safeParse(req.body);

  if (!validInput.success) {
    const errormessage = validInput.error.errors.map((e) => e.message);

    res.status(401).json({
      message: errormessage || "Invalid input",
      errror: errormessage,
    });
    return;
  }

  const { username, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      await UserModel.create({ username, password: hashedPassword });

      res.status(201).json({
        message: "User created successfully",
      });
    } else {
      res.status(409).json({
        message: "User already exists",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const signin = async (req: Request, res: Response): Promise<void> => {
  const validInput = signinSchema.safeParse(req.body);

  if (!validInput.success) {
    const errormessage = validInput.error.errors.map((e) => e.message);
    res.status(401).json({
      message: errormessage || "Invalid input",
      errror: errormessage,
    });
    return;
  }
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
      return;
    }
    if (!user.password) {
      res.status(404).json({
        message: "  Invalid password",
      });
      return;
    } else {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(401).json({
          message: "Invalid password",
        });
        return;
      }
      if (!user._id) {
        res.status(404).json({
          message: "User not found",
        });
        return;
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", {
        expiresIn: "7days",
      });

      res.status(200).json({
        message: "User logged in successfully",
        token,
        username,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
