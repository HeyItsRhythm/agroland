const generateOTPTemplate = (userName, otp, title = 'Login OTP Verification', contextMessage = 'We received a request to log in to your Agroland account. Please use the verification code below to complete your login process.') => {
    return `
    <div style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; background-color: #f8fafc; padding: 20px 0;">
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #f8fafc;">
            <tr>
                <td align="center">
                    <table width="100%" border="0" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #0f172a; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);">
                        <!-- Header -->
                        <tr>
                            <td style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px 20px; text-align: center;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 1px;">Agroland</h1>
                            </td>
                        </tr>
                        
                        <!-- Body -->
                        <tr>
                            <td style="padding: 40px 30px;">
                                <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px; text-align: center; font-weight: 600;">${title}</h2>
                                
                                <p style="margin: 0 0 25px; color: #cbd5e1; font-size: 16px; text-align: center; line-height: 1.6;">
                                    Hi ${userName || 'User'},<br><br>
                                    ${contextMessage}
                                </p>
                                
                                <!-- OTP Box -->
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border: 1px solid #334155; border-radius: 8px; margin: 30px 0;">
                                    <tr>
                                        <td align="center" style="padding: 30px;">
                                            <div style="font-size: 46px; font-weight: bold; color: #10b981; letter-spacing: 12px; margin-bottom: 10px;">
                                                ${otp}
                                            </div>
                                            <div style="color: #94a3b8; font-size: 14px;">
                                                Valid for 10 minutes
                                            </div>
                                        </td>
                                    </tr>
                                </table>
                                
                                <!-- Warning Section -->
                                <table width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color: #1e293b; border-left: 4px solid #10b981; border-radius: 4px; margin-bottom: 20px;">
                                    <tr>
                                        <td style="padding: 20px;">
                                            <h3 style="margin: 0 0 8px; font-size: 16px; color: #ffffff; font-weight: 600;">Didn't request this?</h3>
                                            <p style="margin: 0; color: #cbd5e1; font-size: 14px; line-height: 1.5;">
                                                If you didn't ask to do this, please ignore this email &mdash; your account stays secure.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        
                       
                    </table>
                    <!-- Spacer for mobile -->
                    <div style="height: 40px;"></div>
                </td>
            </tr>
        </table>
    </div>
    `;
};

module.exports = { generateOTPTemplate };
