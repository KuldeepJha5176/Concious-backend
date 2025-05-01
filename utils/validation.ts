
import { z } from "zod";

export const signupSchema = z.object({
    username: z
        .string()
        .min(3,{message:"Username must be at least 3 characters"})
        .regex(/^\S*$/,{message : "Spaces are not allowed in user name"})
        .max(12,{message:"Username must be at most 12 characters"}),

    password: z
        .string()
        .min(8,{message:"Password must be at least 8 characters"})
        .max(12,{message:"Password must be at most 12 characters"})
        .regex(/[!@#$%^&*(),.?":{}|<>]/, {
            message: "Password must contain at least 1 special character",
          })
        .refine((val)=>[...val].some(char => char >= 'A' && char <= 'Z'),{
            message : "Must include at least one capital letter"
          }),

        });

 export const signinSchema = z.object({
            username: z
                .string()
                .min(3,{message:"Username must be at least 3 characters"})
                .regex(/^\S*$/,{message : "Spaces are not allowed in user name"})
                .max(12,{message:"Username must be at most 12 characters"})
                .refine((val)=>[...val].some(char => char >= 'A' && char <= 'Z'),{
                    message : "Must include at least one capital letter"
                }),
            password: z
                .string()
                .min(8,{message:"Password must be at least 8 characters"})
                .max(12,{message:"Password must be at most 12 characters"})
                .regex(/[!@#$%^&*(),.?":{}|<>]/, {
                    message: "Password must contain at least 1 special character",
                  })
                .refine((val)=>[...val].some(char => char >= 'A' && char <= 'Z'),{
                    message : "Must include at least one capital letter"
                }),
            });

 export const searchSchema = z.object({
        querry: z.string().min(1,{message:"Search query must be at least 1 character"}),

          });
export const shareSchema = z.object({
        share: z.boolean()
             });