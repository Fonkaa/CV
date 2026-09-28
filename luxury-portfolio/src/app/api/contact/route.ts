import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message, recipient } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required contact fields." }, { status: 400 });
    }

    const targetRecipient = recipient || process.env.GMAIL_USER || "fikiylkal@gmail.com";
    const senderUser = process.env.GMAIL_USER;
    const senderPass = process.env.GMAIL_APP_PASSWORD;

    // 1. If Gmail credentials exist, dispatch directly via Nodemailer
    if (senderUser && senderPass) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: senderUser,
          pass: senderPass,
        },
      });

      await transporter.sendMail({
        from: `"${name}" <${senderUser}>`,
        to: targetRecipient,
        replyTo: email,
        subject: `[Portfolio Inquiry] ${subject || "New Transmission"} from ${name}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #0f172a; color: #f8fafc; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1);">
            <h2 style="color: #d97706; margin-top: 0; font-size: 20px;">New Transmission Received</h2>
            <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 12px; margin-bottom: 20px; font-size: 13px; line-height: 1.6;">
              <p style="margin: 0 0 8px 0;"><strong>Sender Name:</strong> ${name}</p>
              <p style="margin: 0 0 8px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #38bdf8;">${email}</a></p>
              <p style="margin: 0;"><strong>Subject:</strong> ${subject || "Portfolio Project Inquiry"}</p>
            </div>
            <div style="background: rgba(0,0,0,0.3); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08); font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
            <p style="margin-top: 24px; font-size: 11px; color: #94a3b8; font-family: monospace;">
              Dispatched from Portfolio Atelier • You can hit "Reply" to write back directly to ${email}.
            </p>
          </div>
        `,
      });

      return NextResponse.json({
        success: true,
        message: `Transmission dispatched directly to ${targetRecipient}`,
      });
    }

    // 2. Fallback logger if environment variables aren't set yet
    console.log(`[LOCAL DEV DISPATCH] Target: ${targetRecipient} | From: ${name} (${email}) | Message: ${message}`);
    return NextResponse.json({
      success: true,
      message: `Transmission logged locally (credentials pending).`,
    });

  } catch (error: any) {
    console.error("Nodemailer Dispatch Error:", error);
    return NextResponse.json({ error: error.message || "Failed to dispatch email" }, { status: 500 });
  }
}