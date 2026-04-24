const emailjs = require('@emailjs/nodejs');

const sendEmail = async (options) => {
    // These keys match the variables you should define in your EmailJS template.
    // Ensure your EmailJS template contains: {{to_email}}, {{subject}}, {{message}}, {{{html_content}}} (triple braces for HTML)
    const templateParams = {
        to_email: options.email,
        subject: options.subject,
        message: options.message,
        html_content: options.html
    };

    try {
        const response = await emailjs.send(
            process.env.EMAILJS_SERVICE_ID,
            process.env.EMAILJS_TEMPLATE_ID,
            templateParams,
            {
                publicKey: process.env.EMAILJS_PUBLIC_KEY,
                privateKey: process.env.EMAILJS_PRIVATE_KEY, // Highly recommended for backend
            }
        );
        console.log('✅ Email sent successfully to:', options.email, '| Response Status:', response.status);
        return response;
    } catch (error) {
        console.error('Email send error:', error);
        throw error;
    }
};

module.exports = sendEmail;

