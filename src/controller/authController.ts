import { db } from "@/db/db";
import { generateEmailHTML } from "@/utils/generateEmailTemplate";
import { generateAccessToken } from "@/utils/generateJWTToken";
import bcrypt from 'bcrypt';
import { addMinutes } from "date-fns";
import { Request, Response } from "express";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);


//generating a token
const generateToken = () => {
  const min = 100000;
  const max = 999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};


export async function Authorization(req:Request, res:Response){
    const {email, username, password} = req.body;

    try {
        let existingUser = null;

        if(email){
            existingUser = await db.user.findUnique({
                where:{
                    email
                }
            })
        }
        
        if(username){
            existingUser = await db.user.findUnique({
                where:{
                    username
                }
            })
        }

        if(!existingUser){
            return res.status(404).json({
                error:"User not found"
            })
        }

        //checking for password is correct or not
        const passwordMatch = await bcrypt.compare(password, existingUser.password)

        if(!passwordMatch){
            return res.status(403).json({
                error:"Wrong credential"
            })
        }
        //destructing out the password from the existing user
        const {password:userPass, ...userWithoutPassword} = existingUser;
        const accessToken = generateAccessToken(userWithoutPassword);
        const result = {
            ...userWithoutPassword,
            accessToken
        }
        return res.status(200).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong"
        });
    }

}

export async function forgotPassword(req:Request, res:Response){
    try {
        const {email} = req.body;
        
        //check for the user which is avalable or not in database
        const user = await db.user.findUnique({
            where:{
                email
            }
        });
        if(!user){
            return res.status(404).json({
                error:"User not found with this email"
            })
        }
    
            // 1.Generate a secure token and store it in the resetToken field
            // 2.set the resetTokenExpiry to a future date, e.g 1 hour from the time of the request
            // 3.send an email to the user with reset token
           const  resetToken  = generateToken().toString();
           const  resetTokenExpiry = addMinutes(new Date(), 30);
           const currentTime = new Date();

           //update the user with token and expiry date
            const UpdatedUser = await db.user.update({
                where: { email },
                data: {
                    resetToken,
                    resetTokenExpiry,
                }
            });
            //importing a emailHTML 
            const emailHTML = generateEmailHTML(resetToken);
        
            //Sending a mail with the token and expiry date
             const { data, error } = await resend.emails.send({
                from: "Inventory <onboarding@resend.dev>",
                to: email,
                subject: "Password Reset Request",
                html: emailHTML,
                });

                if (error) {
                    return res.status(400).json({ error });
                }
                
                const result = {
                    userId: UpdatedUser.id,
                    emailData: data
                }
                return res.status(200).json({
                message: `Password reset email sent to ${email}`,
                data: result,
                error: null,
            });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong"
        });
    }
}

export async function verifyToken(req:Request, res:Response){
    try {
        const {token} = req.params;
        const user = await db.user.findFirst({
            where: {
                resetToken:token,
                resetTokenExpiry: { gte: new Date() },
            },
        });
 
        if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
        }
        
        res.status(200).json({ message: "Token is valid" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Something went wrong"
        });
    }
}

export const changePassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;
 
  try {
    const user = await db.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: { gte: new Date() },
      },
    });
 
    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
 
    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
 
    // Update the user's password and clear the reset token and expiry
    await db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
 
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong"});
  }
};