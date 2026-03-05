import nodemailer from 'nodemailer';
import {config} from 'dotenv';

config({ path:'./config/config.env' });
console.log(process.env.NODEMAILER_SERVICE,"this is service");

console.log(process.env.NODEMAILER_SERVICE, "this is service");

const transport = nodemailer.createTransport({
    service: process.env.NODEMAILER_SERVICE || "gmail", // Fallback to Gmail if not set
    auth: {
        user: process.env.NODEMAILER_SENDING_EMAIL_ADDRESS,
        pass: process.env.NODEMAILER_SENDING_EMAIL_PASSWORD,
    },
    // port: 465,
    tls: {
        rejectUnauthorized: false, // Accept unauthorized certificates if needed
    },
});


export default transport;