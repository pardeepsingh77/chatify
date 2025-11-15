import { resendClient, sender } from "../../lib/resend.js"
import { createWelcomeEmailTemplate } from "./emailTemplate.js"

export const sendWelcomeEmail = async (email , name , clientUrl) => {
    const {data , error} = await resendClient.emails.send({
        from: `${sender.name} <${sender.email}>`,
        to: email,
        subject: "Welcome to Chatify!",
        html: createWelcomeEmailTemplate(name,clientUrl)
    });

    if(error){
        console.error("Error sending welcome emails",error);
        throw new Error("failed to send welcome email");
    }

    console.log("Welcome Email send successfully",data)
}