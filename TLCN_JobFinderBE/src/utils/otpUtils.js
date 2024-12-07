// utils/otpUtils.js

let otpStore = {}; // Khởi tạo một đối tượng để lưu trữ OTP tạm thời

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Tạo mã OTP 6 chữ số
};

export const saveOTPToMemory = (email, otp) => {
  const expirationTime = Date.now() + 10 * 60 * 1000; // Đặt thời gian hết hạn là 10 phút từ bây giờ
  otpStore[email] = { otp, expirationTime }; // Lưu OTP và thời gian hết hạn
};

export const verifyOTP = (email, otp) => {
  const entry = otpStore[email];

  if (!entry) {
    return false; // Không tìm thấy OTP cho email này
  }

  const { otp: storedOTP, expirationTime } = entry;

  // Kiểm tra xem OTP có khớp không và thời gian hết hạn có hợp lệ không
  const isOTPValid = storedOTP === otp && Date.now() < expirationTime;
  if (isOTPValid) {
    delete otpStore[email]; // Xóa OTP sau khi xác minh thành công (nếu bạn muốn)
  }
  return isOTPValid; // Trả về true nếu hợp lệ, false nếu không
};
