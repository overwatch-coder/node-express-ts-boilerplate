import nodemailer from "nodemailer";
import transporter from "@/config/email";
import { createHttpError } from "@/middleware/error.middleware";
import { StatusCodes as HttpStatusCode } from "http-status-codes";

export const sendEmail = async (
  email: string,
  subject: string,
  content: string
) => {
  try {
    const message = await transporter.sendMail({
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: subject,
      html: content,
    });

    const messageId =
      process.env.NODE_ENV === "production"
        ? message.messageId
        : nodemailer.getTestMessageUrl(message);

    return messageId;
  } catch (error: any) {
    throw createHttpError(error.message, HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
};
