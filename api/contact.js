import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const { name, email, phone, message } = req.body || {};

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Nexenture Website" <${process.env.SMTP_USER}>`,
      to: "hello@nexenture.uk",
      replyTo: email,
      subject: "New contact form submission",
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        "",
        message,
      ].join("\n"),
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Email send error:", error);
    return res.status(500).json({ error: "Email failed to send." });
  }
}
