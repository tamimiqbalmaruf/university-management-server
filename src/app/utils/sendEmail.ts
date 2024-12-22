import nodemailer from "nodemailer"
import config from "../config";

export const sendEmail = async (to: string, html: string) => {

    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: config.NODE_ENV === "production",
        auth: {
            user: config.nodemailer_email,
            pass: config.nodemailer_app_password,
        },
    });

    await transporter.sendMail({
        from: '"University Management 👻" <marufmd775@gmail.com>', // sender address
        to, // list of receivers
        subject: "Reset your password within ten minutes!", // Subject line
        text: "", // plain text body
        html, // html body
    });

};