import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true for port 465 (SSL), false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const message = {
    from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(message);
};

export const sendOrderEmail = async (order, user) => {
  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.qty}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">$${item.price.toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #7c3aed;">Order Confirmation</h2>
      <p>Hi ${user.name},</p>
      <p>Thank you for your order! We've received your payment and are processing it now.</p>
      
      <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="margin-top: 0;">Order #${order.orderNumber}</h4>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="text-align: left; color: #666; font-size: 12px;">
              <th style="padding: 10px;">Item</th>
              <th style="padding: 10px;">Qty</th>
              <th style="padding: 10px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        <div style="text-align: right; margin-top: 15px; font-weight: bold;">
          Total: $${order.totalPrice.toFixed(2)}
        </div>
      </div>
      
      <p><strong>Shipping to:</strong><br>
      ${order.shippingAddress.fullName}<br>
      ${order.shippingAddress.street}, ${order.shippingAddress.city}<br>
      ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
      
      <p>You can track your order status in your account dashboard.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} Minoxidile Shop. All rights reserved.</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: `Confirming your order #${order.orderNumber}`,
    html,
  });
};

export const sendWelcomeEmail = async (user) => {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; text-align: center;">
      <h1 style="color: #7c3aed;">Welcome to Minoxidile!</h1>
      <p>Hi ${user.name}, we're excited to have you join our community of premium grooming enthusiasts.</p>
      <div style="margin: 30px 0;">
        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/shop" style="background: #7c3aed; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Start Shopping</a>
      </div>
      <p>If you have any questions, just reply to this email!</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #999;">&copy; ${new Date().getFullYear()} Minoxidile Shop.</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Welcome to Minoxidile Shop! 🚀',
    html,
  });
};

export const sendResetPasswordEmail = async (user, resetUrl) => {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
      <h2 style="color: #7c3aed;">Password Reset Request</h2>
      <p>Hi ${user.name},</p>
      <p>You are receiving this email because a password reset request was made for your account.</p>
      <p>Please click the button below to reset your password. This link is valid for 10 minutes:</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="${resetUrl}" style="background: #7c3aed; color: #fff; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
      </div>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 12px; color: #999; text-align: center;">&copy; ${new Date().getFullYear()} Minoxidile Shop.</p>
    </div>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Password Reset Request - Minoxidile Shop',
    html,
  });
};

export const sendContactEmail = async (contactData) => {
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #7c3aed; padding: 20px;">
      <h2 style="color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 10px;">New Contact Inquiry</h2>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>From:</strong> ${contactData.name} (${contactData.email})</p>
        <p><strong>Subject:</strong> ${contactData.subject}</p>
      </div>
      <div style="line-height: 1.6; color: #444; background: #fff; padding: 15px; border: 1px solid #eee; border-radius: 5px;">
        <p><strong>Message:</strong></p>
        <p style="white-space: pre-wrap;">${contactData.message}</p>
      </div>
      <p style="font-size: 12px; color: #999; margin-top: 20px; text-align: center;">
        This message was sent from the Minoxidile Shop Contact Form.
      </p>
    </div>
  `;

  await sendEmail({
    email: process.env.SMTP_FROM_EMAIL, // Send to site admin
    subject: `Contact Form: ${contactData.subject}`,
    html,
  });
};

export default sendEmail;
