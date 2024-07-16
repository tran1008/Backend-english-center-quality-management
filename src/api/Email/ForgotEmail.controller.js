import Teacher from "../model/teacher.schema.js";
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

export default class ForgotEmailController{
    static async forgotPassword (req, res){
        try {
            const { email } = req.body;
        
            const teacher = await Teacher.findOne({ Email: email });
            if (!teacher) {
              return res.status(404).json({ message: 'Email not found' });
            }
        
            const newPassword = Math.random().toString(36).slice(-8); // Generate a random password
        
            // Hash the new password 
            // const salt = await bcrypt.genSalt(10);
            // const hashedPassword = await bcrypt.hash(newPassword, salt);
        
            teacher.Password = newPassword;
            await teacher.save();
        
            const transporter = nodemailer.createTransport({
              service: 'Gmail',
              auth: {
                user: 'earthcenterenglish@gmail.com',
                pass: 'rfckssvnhcetssvz',
              },
            });
        
            
            const mailOptions = {
              from: 'earthcenterenglish@gmail.com',
              to: email,
              subject: 'EARTH CENTER ENGLISH: Password Reset',
              html: `<h2 style='color: #2877fd' >EARTH CENTER ENGLISH!</h2>
               <span>Your new password is: </span>${newPassword}
               <h2>Thanks!</h2> ${teacher.Name} ` 
            };
        
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Failed to send email' });
              } else {
                console.log('Email sent: ' + info.response);
                return res.status(200).json({ message: 'Password reset email sent' });
              }
            });
          } 
          catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Server error' });
          }
    }
}
