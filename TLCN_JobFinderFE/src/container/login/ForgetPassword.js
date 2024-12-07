// import React from "react";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import {
//   checkUserPhoneService,
//   changePasswordByphone,
//   handleLoginService,
// } from "../../service/userService";
// import OtpForgetPassword from "./OtpForgetPassword";
// import { Link } from "react-router-dom";
// import handleValidate from "../../util/Validation";
// const ForgetPassword = () => {
//   const [inputValidates, setValidates] = useState({
//     phonenumber: true,
//     newPassword: true,
//     confirmPassword: true,
//   });
//   const [inputValues, setInputValues] = useState({
//     phonenumber: "",
//     isOpen: false,
//     isSuccess: false,
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const handleOnChange = (event) => {
//     const { name, value } = event.target;
//     setInputValues({ ...inputValues, [name]: value });
//   };

//   let handleOpenVerifyOTP = async () => {
//     let checkPhone = handleValidate(inputValues.phonenumber, "phone");
//     if (!(checkPhone === true)) {
//       setValidates({
//         ...inputValidates,
//         phonenumber: checkPhone,
//       });
//       return;
//     }
//     let res = await checkUserPhoneService(inputValues.phonenumber);
//     if (res === true) {
//       setInputValues({ ...inputValues, ["isOpen"]: true });
//     } else {
//       setValidates({
//         ...inputValidates,
//         phonenumber: true,
//       });
//       toast.error("Số điện thoại không tồn tại!");
//     }
//   };
//   const recieveVerify = (success) => {
//     setInputValues({ ...inputValues, ["isOpen"]: false, ["isSuccess"]: true });
//   };
//   let handleLogin = async (phonenumber, password) => {
//     let res = await handleLoginService({
//       phonenumber: phonenumber,
//       password: password,
//     });

//     if (res && res.errCode === 0) {
//       localStorage.setItem("userData", JSON.stringify(res.user));
//       if (res.user.roleCode === "ADMIN" || res.user.roleCode === "EMPLOYER") {
//         window.location.href = "/admin/";
//       } else {
//         window.location.href = "/";
//       }
//     } else {
//       toast.error(res.errMessage);
//     }
//   };
//   let handleForgetPassword = async () => {
//     let checkNewPass = handleValidate(inputValues.newPassword, "password");
//     if (!(checkNewPass === true)) {
//       setValidates({
//         ...inputValidates,
//         newPassword: checkNewPass,
//       });
//       if (inputValues.confirmPassword !== inputValues.newPassword) {
//         setValidates({
//           ...inputValidates,
//           confirmPassword: "Mật khẩu nhập lại không trùng",
//         });
//         return;
//       }
//       return;
//     }
//     let res = await changePasswordByphone({
//       phonenumber: inputValues.phonenumber,
//       password: inputValues.newPassword,
//     });
//     if (res && res.errCode === 0) {
//       toast.success("Đổi mật khẩu thành công");
//       handleLogin(inputValues.phonenumber, inputValues.newPassword);
//     } else {
//       toast.error(res.errMessage);
//     }
//   };
//   return (
//     <>
//       {inputValues.isOpen === false && (
//         <div className="container-scroller">
//           <div className="container-fluid page-body-wrapper full-page-wrapper">
//             <div className="content-wrapper d-flex align-items-center auth px-0">
//               <div className="row w-100 mx-0">
//                 <div className="col-lg-4 mx-auto">
//                   <div className="auth-form-light text-left py-5 px-4 px-sm-5">
//                     <div className="brand-logo">
//                       <img src="/assets/img/logo/logo.png" alt="logo" />
//                     </div>
//                     <h4>Quên mật khẩu?</h4>
//                     <h6 className="font-weight-light">
//                       Đừng lo! Khôi phục trong vài giây
//                     </h6>
//                     <form className="pt-3">
//                       {inputValues.isSuccess === true && (
//                         <>
//                           <div className="form-group">
//                             <input
//                               type="password"
//                               value={inputValues.newPassword}
//                               name="newPassword"
//                               onChange={(event) => handleOnChange(event)}
//                               className="form-control form-control-lg"
//                               id="exampleInputPassword1"
//                               placeholder="Mật khẩu mới"
//                             />
//                             {inputValidates.newPassword && (
//                               <p style={{ color: "red" }}>
//                                 {inputValidates.newPassword}
//                               </p>
//                             )}
//                           </div>
//                           <div className="form-group">
//                             <input
//                               type="password"
//                               value={inputValues.confirmPassword}
//                               name="confirmPassword"
//                               onChange={(event) => handleOnChange(event)}
//                               className="form-control form-control-lg"
//                               id="exampleInputPassword1"
//                               placeholder="Xác nhận mật khẩu"
//                             />
//                             {inputValidates.confirmPassword && (
//                               <p style={{ color: "red" }}>
//                                 {inputValidates.confirmPassword}
//                               </p>
//                             )}
//                           </div>
//                           <div className="mt-3">
//                             <a
//                               onClick={() => handleForgetPassword()}
//                               className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1"
//                             >
//                               Xác nhận
//                             </a>
//                           </div>
//                         </>
//                       )}
//                       {inputValues.isSuccess === false && (
//                         <>
//                           <div className="form-group">
//                             <input
//                               type="number"
//                               value={inputValues.phonenumber}
//                               name="phonenumber"
//                               onChange={(event) => handleOnChange(event)}
//                               className="form-control form-control-lg"
//                               id="exampleInputEmail1"
//                               placeholder="Số điện thoại"
//                             />
//                             {inputValidates.phonenumber && (
//                               <p style={{ color: "red" }}>
//                                 {inputValidates.phonenumber}
//                               </p>
//                             )}
//                           </div>
//                           <div className="mt-3">
//                             <a
//                               onClick={() => handleOpenVerifyOTP()}
//                               className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1"
//                             >
//                               Xác nhận
//                             </a>
//                           </div>
//                         </>
//                       )}
//                       <div className="text-center mt-4 font-weight-light">
//                         Chưa có tài khoản?{" "}
//                         <Link to="/register" className="text-primary">
//                           Đăng ký
//                         </Link>
//                         <br></br>
//                         <br></br>
//                         Đã có tài khoản?{" "}
//                         <Link to="/login" className="text-primary">
//                           Đăng nhập
//                         </Link>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//             {/* content-wrapper ends */}
//           </div>
//           {/* page-body-wrapper ends */}
//         </div>
//       )}
//       {inputValues.isOpen === true && (
//         <OtpForgetPassword
//           dataUser={inputValues.phonenumber}
//           recieveVerify={recieveVerify}
//         />
//       )}
//     </>
//   );
// };

// export default ForgetPassword;

// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import {
//   checkUserPhoneService,
//   changePasswordByphone,
//   sendOTPService,
//   handleLoginService,
// } from "../../service/userService";
// import OtpForgetPassword from "./OtpForgetPassword";
// import { Link } from "react-router-dom";
// import handleValidate from "../../util/Validation";

// const ForgetPassword = () => {
//   const [inputValidates, setValidates] = useState({
//     phonenumber: true,
//     email: true,
//     newPassword: true,
//     confirmPassword: true,
//   });
//   const [inputValues, setInputValues] = useState({
//     phonenumber: "",
//     isOpen: false,
//     isSuccess: false,
//     newPassword: "",
//     confirmPassword: "",
//     email: "",
//   });

//   const handleOnChange = (event) => {
//     const { name, value } = event.target;
//     setInputValues({ ...inputValues, [name]: value });
//   };

//   const handleOpenVerifyOTP = async () => {
//     // Kiểm tra số điện thoại
//     let checkPhone = handleValidate(inputValues.phonenumber, "phone");
//     if (checkPhone !== true) {
//       setValidates({ ...inputValidates, phonenumber: checkPhone });
//       return;
//     }

//     // Kiểm tra email
//     let checkEmail = handleValidate(inputValues.email, "email");
//     if (checkEmail !== true) {
//       setValidates({ ...inputValidates, email: checkEmail });
//       return;
//     }

//     // Kiểm tra thông tin tài khoản qua số điện thoại
//     let res = await checkUserPhoneService(inputValues.phonenumber);
//     if (res) {
//       // Gửi mã OTP qua email
//       let otpRes = await sendOTPService(inputValues.email);
//       if (otpRes && otpRes.errCode === 0) {
//         toast.success("Mã OTP đã được gửi đến email của bạn!");
//         // Cập nhật trạng thái mở trang OTP
//         setInputValues({ ...inputValues, isOpen: true });
//       } else {
//         toast.success("Mã OTP đã được gửi đến email của bạn!");
//         // Cập nhật trạng thái mở trang OTP
//         setInputValues({ ...inputValues, isOpen: true });
//       }
//     } else {
//       toast.error("Số điện thoại không tồn tại!");
//     }
//   };

//   const recieveVerify = (success) => {
//     setInputValues({ ...inputValues, isOpen: false, isSuccess: true });
//   };

//   const handleLogin = async (phonenumber, password) => {
//     let res = await handleLoginService({
//       phonenumber: phonenumber,
//       password: password,
//     });

//     if (res && res.errCode === 0) {
//       localStorage.setItem("userData", JSON.stringify(res.user));
//       if (res.user.roleCode === "ADMIN" || res.user.roleCode === "EMPLOYER") {
//         window.location.href = "/admin/";
//       } else {
//         window.location.href = "/";
//       }
//     } else {
//       toast.error(res.errMessage);
//     }
//   };

//   const handleForgetPassword = async () => {
//     let checkNewPass = handleValidate(inputValues.newPassword, "password");
//     if (checkNewPass !== true) {
//       setValidates({ ...inputValidates, newPassword: checkNewPass });
//       if (inputValues.confirmPassword !== inputValues.newPassword) {
//         setValidates({
//           ...inputValidates,
//           confirmPassword: "Mật khẩu nhập lại không trùng",
//         });
//         return;
//       }
//       return;
//     }
//     let res = await changePasswordByphone({
//       phonenumber: inputValues.phonenumber,
//       password: inputValues.newPassword,
//     });
//     if (res && res.errCode === 0) {
//       toast.success("Đổi mật khẩu thành công");
//       handleLogin(inputValues.phonenumber, inputValues.newPassword);
//     } else {
//       toast.error(res.errMessage);
//     }
//   };

//   return (
//     <>
//       {inputValues.isOpen === false && (
//         <div className="container-scroller">
//           <div className="container-fluid page-body-wrapper full-page-wrapper">
//             <div className="content-wrapper d-flex align-items-center auth px-0">
//               <div className="row w-100 mx-0">
//                 <div className="col-lg-4 mx-auto">
//                   <div className="auth-form-light text-left py-5 px-4 px-sm-5">
//                     <div className="brand-logo">
//                       <img src="/assets/img/logo/logo.png" alt="logo" />
//                     </div>
//                     <h4>Quên mật khẩu?</h4>
//                     <h6 className="font-weight-light">
//                       Đừng lo! Khôi phục trong vài giây
//                     </h6>
//                     <form className="pt-3">
//                       {inputValues.isSuccess === true && (
//                         <>
//                           <div className="form-group">
//                             <input
//                               type="password"
//                               value={inputValues.newPassword}
//                               name="newPassword"
//                               onChange={(event) => handleOnChange(event)}
//                               className="form-control form-control-lg"
//                               placeholder="Mật khẩu mới"
//                             />
//                             {inputValidates.newPassword && (
//                               <p style={{ color: "red" }}>
//                                 {inputValidates.newPassword}
//                               </p>
//                             )}
//                           </div>
//                           <div className="form-group">
//                             <input
//                               type="password"
//                               value={inputValues.confirmPassword}
//                               name="confirmPassword"
//                               onChange={(event) => handleOnChange(event)}
//                               className="form-control form-control-lg"
//                               placeholder="Xác nhận mật khẩu"
//                             />
//                             {inputValidates.confirmPassword && (
//                               <p style={{ color: "red" }}>
//                                 {inputValidates.confirmPassword}
//                               </p>
//                             )}
//                           </div>
//                           <div className="mt-3">
//                             <a
//                               onClick={() => handleForgetPassword()}
//                               className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1"
//                             >
//                               Xác nhận
//                             </a>
//                           </div>
//                         </>
//                       )}
//                       {inputValues.isSuccess === false && (
//                         <>
//                           <div className="form-group">
//                             <input
//                               type="number"
//                               value={inputValues.phonenumber}
//                               name="phonenumber"
//                               onChange={(event) => handleOnChange(event)}
//                               className="form-control form-control-lg"
//                               placeholder="Số điện thoại"
//                             />
//                             {inputValidates.phonenumber && (
//                               <p style={{ color: "red" }}>
//                                 {inputValidates.phonenumber}
//                               </p>
//                             )}
//                           </div>
//                           <div className="form-group">
//                             <input
//                               type="email"
//                               value={inputValues.email}
//                               name="email"
//                               onChange={(event) => handleOnChange(event)}
//                               className="form-control form-control-lg"
//                               placeholder="Email"
//                             />
//                             {inputValidates.email && (
//                               <p style={{ color: "red" }}>
//                                 {inputValidates.email}
//                               </p>
//                             )}
//                           </div>
//                           <div className="mt-3">
//                             <a
//                               onClick={() => handleOpenVerifyOTP()}
//                               className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1"
//                             >
//                               Xác nhận
//                             </a>
//                           </div>
//                         </>
//                       )}
//                       <div className="text-center mt-4 font-weight-light">
//                         Chưa có tài khoản?{" "}
//                         <Link to="/register" className="text-primary">
//                           Đăng ký
//                         </Link>
//                         <br></br>
//                         <br></br>
//                         Đã có tài khoản?{" "}
//                         <Link to="/login" className="text-primary">
//                           Đăng nhập
//                         </Link>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {inputValues.isOpen === true && (
//         <OtpForgetPassword
//           dataUser={inputValues.email}
//           recieveVerify={recieveVerify}
//         />
//       )}
//     </>
//   );
// };

// export default ForgetPassword;

// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import {
//   checkUserPhoneService,
//   changePasswordByphone,
//   sendOTPService,
//   handleLoginService,
// } from "../../service/userService";
// import OtpForgetPassword from "./OtpForgetPassword";
// import { Link } from "react-router-dom";
// import handleValidate from "../../util/Validation";

// const ForgetPassword = () => {
//   const [inputValidates, setValidates] = useState({
//     phonenumber: true,
//     email: true,
//     newPassword: true,
//     confirmPassword: true,
//   });
//   const [inputValues, setInputValues] = useState({
//     phonenumber: "",
//     isOpen: false,
//     isSuccess: false,
//     newPassword: "",
//     confirmPassword: "",
//     email: "",
//   });

//   const handleOnChange = (event) => {
//     const { name, value } = event.target;
//     setInputValues({ ...inputValues, [name]: value });
//   };

//   const handleOpenVerifyOTP = async () => {
//     // Kiểm tra số điện thoại
//     let checkPhone = handleValidate(inputValues.phonenumber, "phone");
//     if (checkPhone !== true) {
//       setValidates({ ...inputValidates, phonenumber: checkPhone });
//       return;
//     }

//     // Kiểm tra email
//     let checkEmail = handleValidate(inputValues.email, "email");
//     if (checkEmail !== true) {
//       setValidates({ ...inputValidates, email: checkEmail });
//       return;
//     }

//     // Kiểm tra thông tin tài khoản qua số điện thoại
//     let res = await checkUserPhoneService(inputValues.phonenumber);
//     if (res) {
//       // Gửi mã OTP qua email
//       let otpRes = await sendOTPService(inputValues.email);
//       if (otpRes && otpRes.errCode === 0) {
//         toast.success("Mã OTP đã được gửi đến email của bạn!");
//         // Cập nhật trạng thái mở trang OTP
//         setInputValues({ ...inputValues, isOpen: true });
//       } else {
//         toast.success("Mã OTP đã được gửi đến email của bạn!");
//         // Cập nhật trạng thái mở trang OTP
//         setInputValues({ ...inputValues, isOpen: true });
//       }
//     } else {
//       toast.error("Số điện thoại không tồn tại!");
//     }
//   };

//   const recieveVerify = (success) => {
//     setInputValues({ ...inputValues, isOpen: false, isSuccess: true });
//   };

//   let handleLogin = async (phonenumber, password) => {
//     let res = await handleLoginService({
//       phonenumber: phonenumber,
//       password: password,
//     });

//     if (res && res.errCode === 0) {
//       localStorage.setItem("userData", JSON.stringify(res.user));
//       localStorage.setItem("token_user", res.token);
//       if (res.user.roleCode === "ADMIN" || res.user.roleCode === "EMPLOYER") {
//         window.location.href = "/admin/";
//       } else {
//         window.location.href = "/";
//       }
//     } else {
//       toast.error(res.errMessage);
//     }
//   };
//   // let handleForgetPassword = async () => {
//   //   let checkNewPass = handleValidate(inputValues.newPassword, "password");
//   //   if (!(checkNewPass === true)) {
//   //     setValidates({
//   //       ...inputValidates,
//   //       newPassword: checkNewPass,
//   //     });
//   //     if (inputValues.confirmPassword !== inputValues.newPassword) {
//   //       setValidates({
//   //         ...inputValidates,
//   //         confirmPassword: "Mật khẩu nhập lại không trùng",
//   //       });
//   //       return;
//   //     }
//   //     return;
//   //   }
//   //   let res = await changePasswordByphone({
//   //     phonenumber: inputValues.phonenumber,
//   //     password: inputValues.newPassword,
//   //   });
//   //   if (res && res.errCode === 0) {
//   //     toast.success("Đổi mật khẩu thành công");
//   //     handleLogin(inputValues.phonenumber, inputValues.newPassword);
//   //   } else {
//   //     toast.error(res.errMessage);
//   //   }
//   // };

//   let handleForgetPassword = async () => {
//     // Kiểm tra mật khẩu mới
//     let checkNewPass = handleValidate(inputValues.newPassword, "password");
//     if (checkNewPass !== true) {
//       setValidates({
//         ...inputValidates,
//         newPassword: checkNewPass,
//       });
//       return;
//     }

//     // Kiểm tra xem xác nhận mật khẩu có giống mật khẩu mới hay không
//     if (inputValues.confirmPassword !== inputValues.newPassword) {
//       setValidates({
//         ...inputValidates,
//         confirmPassword: "Mật khẩu nhập lại không trùng",
//       });
//       return;
//     }

//     // Nếu tất cả đều hợp lệ, gọi API để thay đổi mật khẩu
//     let res = await changePasswordByphone({
//       phonenumber: inputValues.phonenumber,
//       password: inputValues.newPassword,
//     });
//     if (res && res.errCode === 0) {
//       toast.success("Đổi mật khẩu thành công");
//       handleLogin(inputValues.phonenumber, inputValues.newPassword);
//     } else {
//       toast.error(res.errMessage);
//     }
//   };

//   return (
//     <>
//       {inputValues.isOpen === false && (
//         <div className="container-scroller">
//           <div className="container-fluid page-body-wrapper full-page-wrapper">
//             <div className="content-wrapper d-flex align-items-center auth px-0">
//               <div className="row w-100 mx-0">
//                 <div className="col-lg-4 mx-auto">
//                   <div className="auth-form-light text-left py-5 px-4 px-sm-5">
//                     <div className="brand-logo">
//                       <img src="/assets/img/logo/logo.png" alt="logo" />
//                     </div>
//                     <h4>Quên mật khẩu?</h4>
//                     <h6 className="font-weight-light">
//                       Đừng lo! Khôi phục trong vài giây
//                     </h6>
//                     <form className="pt-3">
//                       {inputValues.isSuccess === true && (
//                         <>
//                           <div className="form-group">
//                             <input
//                               type="password"
//                               value={inputValues.newPassword}
//                               name="newPassword"
//                               onChange={(event) => handleOnChange(event)}
//                               className="form-control form-control-lg"
//                               placeholder="Mật khẩu mới"
//                             />
//                             {inputValidates.newPassword && (
//                               <p style={{ color: "red" }}>
//                                 {inputValidates.newPassword}
//                               </p>
//                             )}
//                           </div>
//                           <div className="form-group">
//                             <input
//                               type="password"
//                               value={inputValues.confirmPassword}
//                               name="confirmPassword"
//                               onChange={(event) => handleOnChange(event)}
//                               className="form-control form-control-lg"
//                               placeholder="Xác nhận mật khẩu"
//                             />
//                             {inputValidates.confirmPassword && (
//                               <p style={{ color: "red" }}>
//                                 {inputValidates.confirmPassword}
//                               </p>
//                             )}
//                           </div>
//                           <div className="mt-3">
//                             <a
//                               onClick={() => handleForgetPassword()}
//                               className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1"
//                             >
//                               Xác nhận
//                             </a>
//                           </div>
//                         </>
//                       )}
//                       {inputValues.isSuccess === false && (
//                         <>
//                           <div className="form-group">
//                             <input
//                               type="number"
//                               value={inputValues.phonenumber}
//                               name="phonenumber"
//                               onChange={(event) => handleOnChange(event)}
//                               className="form-control form-control-lg"
//                               placeholder="Số điện thoại"
//                             />
//                             {inputValidates.phonenumber && (
//                               <p style={{ color: "red" }}>
//                                 {inputValidates.phonenumber}
//                               </p>
//                             )}
//                           </div>
//                           <div className="form-group">
//                             <input
//                               type="email"
//                               value={inputValues.email}
//                               name="email"
//                               onChange={(event) => handleOnChange(event)}
//                               className="form-control form-control-lg"
//                               placeholder="Email"
//                             />
//                             {inputValidates.email && (
//                               <p style={{ color: "red" }}>
//                                 {inputValidates.email}
//                               </p>
//                             )}
//                           </div>
//                           <div className="mt-3">
//                             <a
//                               onClick={() => handleOpenVerifyOTP()}
//                               className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1"
//                             >
//                               Xác nhận
//                             </a>
//                           </div>
//                         </>
//                       )}
//                       <div className="text-center mt-4 font-weight-light">
//                         Chưa có tài khoản?{" "}
//                         <Link to="/register" className="text-primary">
//                           Đăng ký
//                         </Link>
//                         <br></br>
//                         <br></br>
//                         Đã có tài khoản?{" "}
//                         <Link to="/login" className="text-primary">
//                           Đăng nhập
//                         </Link>
//                       </div>
//                     </form>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//       {inputValues.isOpen === true && (
//         <OtpForgetPassword
//           dataUser={inputValues.email}
//           recieveVerify={recieveVerify}
//         />
//       )}
//     </>
//   );
// };

// export default ForgetPassword;

import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  checkUserPhoneService,
  changePasswordByphone,
  sendOTPService,
  handleLoginService,
} from "../../service/userService";
import OtpForgetPassword from "./OtpForgetPassword";
import { Link } from "react-router-dom";
import handleValidate from "../../util/Validation";

const ForgetPassword = () => {
  const [inputValidates, setValidates] = useState({
    phonenumber: true,
    newPassword: true,
    confirmPassword: true,
  });
  const [inputValues, setInputValues] = useState({
    phonenumber: "",
    isOpen: false,
    isSuccess: false,
    newPassword: "",
    confirmPassword: "",
  });

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    setInputValues({ ...inputValues, [name]: value });
  };

  const handleOpenVerifyOTP = async () => {
    // Kiểm tra số điện thoại
    let checkPhone = handleValidate(inputValues.phonenumber, "phone");
    if (checkPhone !== true) {
      setValidates({ ...inputValidates, phonenumber: checkPhone });
      return;
    }

    // Kiểm tra thông tin tài khoản qua số điện thoại
    let res = await checkUserPhoneService(inputValues.phonenumber);
    if (res === true) {
      setInputValues({ ...inputValues, ["isOpen"]: true });
    } else {
      setValidates({
        ...inputValidates,
        phonenumber: true,
      });
      toast.error("Số điện thoại không tồn tại!");
    }
  };

  const recieveVerify = (success) => {
    setInputValues({ ...inputValues, isOpen: false, isSuccess: true });
  };

  let handleLogin = async (phonenumber, password) => {
    let res = await handleLoginService({
      phonenumber: phonenumber,
      password: password,
    });

    if (res && res.errCode === 0) {
      localStorage.setItem("userData", JSON.stringify(res.user));
      localStorage.setItem("token_user", res.token);
      if (
        res.user.roleCode === "ADMIN" ||
        res.user.roleCode === "EMPLOYER" ||
        res.user.roleCode === "COMPANY"
      ) {
        window.location.href = "/admin/";
      } else {
        window.location.href = "/";
      }
    } else {
      toast.error(res.errMessage);
    }
  };

  let handleForgetPassword = async () => {
    // Kiểm tra mật khẩu mới
    let checkNewPass = handleValidate(inputValues.newPassword, "password");
    if (checkNewPass !== true) {
      setValidates({
        ...inputValidates,
        newPassword: checkNewPass,
      });
      return;
    }

    // Kiểm tra xem xác nhận mật khẩu có giống mật khẩu mới hay không
    if (inputValues.confirmPassword !== inputValues.newPassword) {
      setValidates({
        ...inputValidates,
        confirmPassword: "Mật khẩu nhập lại không trùng",
      });
      return;
    }

    // Nếu tất cả đều hợp lệ, gọi API để thay đổi mật khẩu
    let res = await changePasswordByphone({
      phonenumber: inputValues.phonenumber,
      password: inputValues.newPassword,
    });
    if (res && res.errCode === 0) {
      toast.success("Đổi mật khẩu thành công");
      handleLogin(inputValues.phonenumber, inputValues.newPassword);
    } else {
      toast.error(res.errMessage);
    }
  };

  return (
    <>
      {inputValues.isOpen === false && (
        <div className="container-scroller">
          <div className="container-fluid page-body-wrapper full-page-wrapper">
            <div className="content-wrapper d-flex align-items-center auth px-0">
              <div className="row w-100 mx-0">
                <div className="col-lg-4 mx-auto">
                  <div className="auth-form-light text-left py-5 px-4 px-sm-5">
                    <div className="brand-logo">
                      <img src="/assets/img/logo/logo.png" alt="logo" />
                    </div>
                    <h4>Quên mật khẩu?</h4>
                    <h6 className="font-weight-light">
                      Đừng lo! Khôi phục trong vài giây
                    </h6>
                    <form className="pt-3">
                      {inputValues.isSuccess === true && (
                        <>
                          <div className="form-group">
                            <input
                              type="password"
                              value={inputValues.newPassword}
                              name="newPassword"
                              onChange={(event) => handleOnChange(event)}
                              className="form-control form-control-lg"
                              placeholder="Mật khẩu mới"
                            />
                            {inputValidates.newPassword && (
                              <p style={{ color: "red" }}>
                                {inputValidates.newPassword}
                              </p>
                            )}
                          </div>
                          <div className="form-group">
                            <input
                              type="password"
                              value={inputValues.confirmPassword}
                              name="confirmPassword"
                              onChange={(event) => handleOnChange(event)}
                              className="form-control form-control-lg"
                              placeholder="Xác nhận mật khẩu"
                            />
                            {inputValidates.confirmPassword && (
                              <p style={{ color: "red" }}>
                                {inputValidates.confirmPassword}
                              </p>
                            )}
                          </div>
                          <div className="mt-3">
                            <a
                              onClick={() => handleForgetPassword()}
                              className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1"
                            >
                              Xác nhận
                            </a>
                          </div>
                        </>
                      )}
                      {inputValues.isSuccess === false && (
                        <>
                          <div className="form-group">
                            <input
                              type="number"
                              value={inputValues.phonenumber}
                              name="phonenumber"
                              onChange={(event) => handleOnChange(event)}
                              className="form-control form-control-lg"
                              placeholder="Số điện thoại"
                            />
                            {inputValidates.phonenumber && (
                              <p style={{ color: "red" }}>
                                {inputValidates.phonenumber}
                              </p>
                            )}
                          </div>

                          <div className="mt-3">
                            <a
                              onClick={() => handleOpenVerifyOTP()}
                              className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1"
                            >
                              Xác nhận
                            </a>
                          </div>
                        </>
                      )}
                      <div className="text-center mt-4 font-weight-light">
                        Chưa có tài khoản?{" "}
                        <Link to="/register" className="text-primary">
                          Đăng ký
                        </Link>
                        <br></br>
                        <br></br>
                        Đã có tài khoản?{" "}
                        <Link to="/login" className="text-primary">
                          Đăng nhập
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {inputValues.isOpen === true && (
        <OtpForgetPassword
          dataUser={inputValues.phonenumber}
          recieveVerify={recieveVerify}
        />
      )}
    </>
  );
};

export default ForgetPassword;
