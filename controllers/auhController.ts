import { UserModel } from "../models";
import { signupSchema } from "../utils/validation";
import { Request, Response } from "express";
import bcrypt from "bcrypt";

export const signup = async  (req:Request, res:Response):  Promise<void> => {
    const validInput = signupSchema.safeParse(req.body);
    
    if(!validInput.success){
        const errormessage = validInput.error.errors.map((e) => e.message);

            res.status(401).json({
                message: errormessage ||  "Invalid input",
                errror: errormessage
            });
            return;
    }

    const {username, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    try {
        const user = await UserModel.findOne({username});
        if(!user){
            const newUser = new UserModel({username, password: hashedPassword});

            await newUser.save();
            res.status(201).json({
                message: "User created successfully"
                
            });

        }
        else{
            res.status(409).json({
                message: "User already exists"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        }); 
    }
    
};

export const signin = async (req:Request, res:Response): Promise<void> => {
    const validInput = signinSchema.safeParse(req.body);

    if(!validInput.success){
        const errormessage = validInput.error.errors.map((e) => e.message);
        res.status(401).json({
            message: errormessage ||  "Invalid input",
            errror: errormessage
        });
        return;
    }
    const {username, password} = req.body;

    try {
        const user = await UserModel.findOne({username});
        if(!user){
            res.status(404).json({
                message: "User not found"
            });
        }
        if(!user.password){
            res.status(404).json({
                message: "  Invalid password"
            });
        }
        else{
            const validPassword = await bcrypt.compare(password, user.password);
            if(!validPassword){
                res.status(401).json({
                    message: "Invalid password"
                });
            }
            else{
                res.status(200).json({
                    message: "User logged in successfully",
                    user
                });
            }
        }

       } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        }); 
    }
};