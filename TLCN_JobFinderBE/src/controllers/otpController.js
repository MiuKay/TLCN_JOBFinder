// otpController.js
import nodemailer from "nodemailer"; // Sử dụng nodemailer để gửi email
import { generateOTP, saveOTPToMemory, verifyOTP } from "../utils/otpUtils"; // Giả sử bạn đã tạo các hàm này

const otpController = {
  sendOTP: async (req, res) => {
    const { email } = req.body;

    // Kiểm tra email có hợp lệ không
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Tạo mã OTP
    const otp = generateOTP();

    // Gửi mã OTP qua email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_APP, // Thay bằng email của bạn
        pass: process.env.EMAIL_APP_PASSWORD, // Thay bằng mật khẩu email
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_APP,
      to: email,
      subject: "Your OTP Code",
      html: `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f2f2f2;
                  padding: 20px;
                  margin: 0;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 5px;
                  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }
                h1 {
                  color: #333;
                }
                .otp {
                  font-size: 24px;
                  font-weight: bold;
                  color: #4CAF50; /* Màu xanh cho OTP */
                  margin: 20px 0;
                }
                p {
                  color: #555;
                }
                .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #aaa;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>Your OTP Code</h1>
                <p>Dear You,</p>
                <p>Your OTP code is:</p>
                <div class="otp">${otp}</div>
                <p>This code will expire in 10 minutes. Please do not share it with anyone.</p>
                <p>Thank you!</p>
                <div class="footer">This email was sent to you by our service.</div>
              </div>
            </body>
          </html>
        `,
    };

    try {
      await transporter.sendMail(mailOptions);
      // Lưu mã OTP vào bộ nhớ để xác thực sau này
      saveOTPToMemory(email, otp);
      return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
      console.error("Error sending OTP: ", error); // Log lỗi
      return res
        .status(500)
        .json({ message: "Failed to send OTP", error: error.message });
    }
  },

  verifyOTP: async (req, res) => {
    const { email, otp } = req.body;

    // Kiểm tra email và OTP có hợp lệ không
    const isValid = verifyOTP(email, otp);

    if (isValid) {
      return res.status(200).json({ message: "OTP verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid OTP" });
    }
  },
};

export default otpController;
