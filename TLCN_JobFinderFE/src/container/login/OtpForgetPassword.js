// import React, { useEffect, useState } from "react";
// import "./Otp.scss";
// import firebase from "../../util/firebase";
// import { toast } from "react-toastify";
// import { createNewUser, handleLoginService } from "../../service/userService";
// const OtpForgetPassword = (props) => {
//   const [dataUser, setdataUser] = useState({});
//   const [otpnumber, setotpnumber] = useState("");
//   const [inputValues, setInputValues] = useState({
//     so1: "",
//     so2: "",
//     so3: "",
//     so4: "",
//     so5: "",
//     so6: "",
//   });
//   useEffect(() => {
//     if (props.dataUser) {
//       let fetchOtp = async () => {
//         await onSignInSubmit(false);
//       };
//       fetchOtp();
//     }
//   }, [props.dataUser]);
//   const handleOnChange = (event) => {
//     const { name, value } = event.target;
//     setInputValues({ ...inputValues, [name]: value });
//   };
//   let configureCaptcha = () => {
//     window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
//       "sign-in-button",
//       {
//         size: "invisible",
//         defaultCountry: "VN",
//       }
//     );
//   };
//   let onSignInSubmit = async (isResend) => {
//     if (!isResend) configureCaptcha();
//     let phoneNumber = props.dataUser;
//     if (phoneNumber) {
//       phoneNumber = "+84" + phoneNumber.slice(1);
//     }

//     console.log("check phonenumber", phoneNumber);
//     const appVerifier = window.recaptchaVerifier;

//     await firebase
//       .auth()
//       .signInWithPhoneNumber(phoneNumber, appVerifier)
//       .then((confirmationResult) => {
//         // SMS sent. Prompt user to type the code from the message, then sign the
//         // user in with confirmationResult.confirm(code).
//         window.confirmationResult = confirmationResult;
//         toast.success("Đã gửi mã OTP vào điện thoại");
//         // ...
//       })
//       .catch((error) => {
//         console.log(error);
//         toast.error("Gửi mã thất bại !");
//       });
//   };
//   let submitOTP = async () => {
//     const code = +(
//       inputValues.so1 +
//       inputValues.so2 +
//       inputValues.so3 +
//       inputValues.so4 +
//       inputValues.so5 +
//       inputValues.so6
//     );

//     await window.confirmationResult
//       .confirm(code)
//       .then((result) => {
//         // User signed in successfully.
//         const user = result.user;
//         toast.success("Đã xác nhận mã OTP !");
//         props.recieveVerify(true);
//         // ...
//       })
//       .catch((error) => {
//         // User couldn't sign in (bad verification code?)
//         // ...
//         toast.error("Mã OTP không đúng !");
//       });
//   };
//   let resendOTP = async () => {
//     await onSignInSubmit(true);
//   };
//   return (
//     <>
//       <div className="container d-flex justify-content-center align-items-center container_Otp">
//         <div className="card text-center">
//           <div className="card-header p-5">
//             <img src="https://raw.githubusercontent.com/Rustcodeweb/OTP-Verification-Card-Design/main/mobile.png" />
//             <h5 style={{ color: "#fff" }} className="mb-2">
//               XÁC THỰC OTP
//             </h5>
//             <div>
//               <small>
//                 mã đã được gửi tới sdt{" "}
//                 {props.dataUser && props.dataUser.phonenumber}
//               </small>
//             </div>
//           </div>
//           <div className="input-container d-flex flex-row justify-content-center mt-2">
//             <input
//               value={inputValues.so1}
//               name="so1"
//               onChange={(event) => handleOnChange(event)}
//               type="text"
//               className="m-1 text-center form-control rounded"
//               maxLength={1}
//             />
//             <input
//               value={inputValues.so2}
//               name="so2"
//               onChange={(event) => handleOnChange(event)}
//               type="text"
//               className="m-1 text-center form-control rounded"
//               maxLength={1}
//             />
//             <input
//               value={inputValues.so3}
//               name="so3"
//               onChange={(event) => handleOnChange(event)}
//               type="text"
//               className="m-1 text-center form-control rounded"
//               maxLength={1}
//             />
//             <input
//               value={inputValues.so4}
//               name="so4"
//               onChange={(event) => handleOnChange(event)}
//               type="text"
//               className="m-1 text-center form-control rounded"
//               maxLength={1}
//             />
//             <input
//               value={inputValues.so5}
//               name="so5"
//               onChange={(event) => handleOnChange(event)}
//               type="text"
//               className="m-1 text-center form-control rounded"
//               maxLength={1}
//             />
//             <input
//               value={inputValues.so6}
//               name="so6"
//               onChange={(event) => handleOnChange(event)}
//               type="text"
//               className="m-1 text-center form-control rounded"
//               maxLength={1}
//             />
//           </div>
//           <div>
//             <small>
//               bạn không nhận được Otp ?
//               <a
//                 onClick={() => resendOTP()}
//                 style={{ color: "#3366FF" }}
//                 className="text-decoration-none ml-2"
//               >
//                 Gửi lại
//               </a>
//             </small>
//           </div>
//           <div className="mt-3 mb-5">
//             <div id="sign-in-button"></div>
//             <button
//               onClick={() => submitOTP()}
//               className="btn btn-success px-4 verify-btn"
//             >
//               Xác thực
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OtpForgetPassword;

// import React, { useEffect, useState } from "react";
// import "./Otp.scss";
// import { toast } from "react-toastify";
// import {
//   createNewUser,
//   handleLoginService,
//   sendOTPService,
//   verifyOTPService,
// } from "../../service/userService";

// const OtpForgetPassword = (props) => {
//   const [inputValues, setInputValues] = useState({
//     so1: "",
//     so2: "",
//     so3: "",
//     so4: "",
//     so5: "",
//     so6: "",
//   });

//   useEffect(() => {
//     if (props.dataUser) {
//       sendOtp(); // Gửi OTP qua email khi nhận được dataUser
//     }
//   }, [props.dataUser]);

//   // Hàm gửi OTP qua email
//   const sendOtp = async () => {
//     const email = props.dataUser.email; // Lấy email từ props
//     try {
//       await sendOTPService(email); // Gọi API gửi OTP từ server
//       toast.success("Đã gửi mã OTP vào email");
//     } catch (error) {
//       console.error(error);
//       toast.error("Gửi mã thất bại!");
//     }
//   };

//   // Hàm xử lý nhập dữ liệu từ các ô input
//   const handleOnChange = (event) => {
//     const { name, value } = event.target;
//     setInputValues({ ...inputValues, [name]: value });
//   };

//   // // Hàm tạo tài khoản mới
//   // const createUser = async (dataUser) => {
//   //   try {
//   //     const res = await createNewUser({
//   //       password: dataUser.password,
//   //       firstName: dataUser.firstName,
//   //       lastName: dataUser.lastName,
//   //       phonenumber: dataUser.phonenumber,
//   //       roleCode: dataUser.roleCode,
//   //       email: dataUser.email,
//   //       image:
//   //         "https://res.cloudinary.com/bingo2706/image/upload/v1642521841/dev_setups/l60Hf_blyqhb.png",
//   //     });

//   //     if (res && res.errCode === 0) {
//   //       toast.success("Tạo tài khoản thành công!");
//   //       handleLogin(dataUser.email, dataUser.password); // Đăng nhập sau khi tạo tài khoản thành công
//   //     } else {
//   //       toast.error(res.errMessage || "Tạo tài khoản thất bại!");
//   //     }
//   //   } catch (error) {
//   //     toast.error("Lỗi trong quá trình tạo tài khoản!");
//   //     console.error("Error while creating user:", error);
//   //   }
//   // };

//   // // Hàm xử lý xác nhận mã OTP
//   // const submitOTP = async () => {
//   //   const code =
//   //     inputValues.so1 +
//   //     inputValues.so2 +
//   //     inputValues.so3 +
//   //     inputValues.so4 +
//   //     inputValues.so5 +
//   //     inputValues.so6;

//   //   try {
//   //     const res = await verifyOTPService(props.dataUser.email, code); // Gọi API xác thực OTP từ server

//   //     // Kiểm tra nếu status là 200 và message là "OTP verified successfully"
//   //     if (
//   //       res &&
//   //       res.status === 200 &&
//   //       res.data.message === "OTP verified successfully"
//   //     ) {
//   //       toast.success("OTP xác thực thành công!");

//   //       // Nếu OTP đúng, tạo tài khoản mới
//   //       await createUser(props.dataUser);
//   //     } else {
//   //       toast.success("OTP xác thực thành công!");
//   //       await createUser(props.dataUser);
//   //     }
//   //   } catch (error) {
//   //     toast.error("Xác thực OTP thất bại!");
//   //     console.error("Error while verifying OTP:", error);
//   //   }
//   // };

//   // Hàm xử lý xác nhận mã OTP
//   const submitOTP = async () => {
//     const code =
//       inputValues.so1 +
//       inputValues.so2 +
//       inputValues.so3 +
//       inputValues.so4 +
//       inputValues.so5 +
//       inputValues.so6;

//     try {
//       const res = await verifyOTPService(props.dataUser.email, code); // Gọi API xác thực OTP từ server
//       if (res && res.status === 200) {
//         toast.success("OTP xác thực thành công!");
//       } else {
//         toast.success("OTP xác thực thành công!");
//         props.recieveVerify(true);
//       }
//     } catch (error) {
//       toast.error("Xác thực OTP thất bại!");
//       console.error(error);
//     }
//   };

//   // Hàm gửi lại OTP
//   const resendOTP = async () => {
//     sendOtp();
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center container_Otp">
//       <div className="card text-center">
//         <div className="card-header p-5">
//           <img src="https://raw.githubusercontent.com/Rustcodeweb/OTP-Verification-Card-Design/main/mobile.png" />
//           <h5 style={{ color: "#fff" }} className="mb-2">
//             XÁC THỰC OTP
//           </h5>
//           <div>
//             <small>
//               Mã OTP đã được gửi tới email{" "}
//               {props.dataUser && props.dataUser.email}
//             </small>
//           </div>
//         </div>
//         <div className="input-container d-flex flex-row justify-content-center mt-2">
//           {["so1", "so2", "so3", "so4", "so5", "so6"].map((name, index) => (
//             <input
//               key={index}
//               value={inputValues[name]}
//               name={name}
//               onChange={handleOnChange}
//               type="text"
//               className="m-1 text-center form-control rounded"
//               maxLength={1}
//             />
//           ))}
//         </div>
//         <div>
//           <small>
//             Bạn không nhận được OTP?
//             <a
//               onClick={resendOTP}
//               style={{ color: "#3366FF" }}
//               className="text-decoration-none ml-2"
//             >
//               Gửi lại
//             </a>
//           </small>
//         </div>
//         <div className="mt-3 mb-5">
//           <button
//             onClick={submitOTP}
//             className="btn btn-success px-4 verify-btn"
//           >
//             Xác thực
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OtpForgetPassword;

// import React, { useEffect, useState, useRef } from "react";
// import "./Otp.scss";
// import { toast } from "react-toastify";
// import {
//   createNewUser,
//   handleLoginService,
//   sendOTPService,
//   verifyOTPService,
// } from "../../service/userService";

// const OtpForgetPassword = (props) => {
//   const [inputValues, setInputValues] = useState({
//     so1: "",
//     so2: "",
//     so3: "",
//     so4: "",
//     so5: "",
//     so6: "",
//   });

//   const [email, setEmail] = useState(""); // State cho email

//   useEffect(() => {
//     if (props.dataUser) {
//       sendOtp(); // Gửi OTP qua email khi nhận được dataUser
//     }
//   }, [props.dataUser]);

//   // Hàm gửi OTP qua email
//   const sendOtp = async () => {
//     try {
//       await sendOTPService(email); // Gọi API gửi OTP từ server
//       toast.success("Đã gửi mã OTP vào email");
//     } catch (error) {
//       console.error(error);
//       // toast.error("Gửi mã thất bại!");
//     }
//   };

//   const inputRefs = useRef([]);
//   // Xử lý khi người dùng nhập mã OTP, tự động chuyển focus sang ô tiếp theo
//   const handleOnChange = (event, index) => {
//     const { name, value } = event.target;
//     if (/^\d*$/.test(value) && value.length <= 1) {
//       // Chỉ cho phép nhập số
//       setInputValues({ ...inputValues, [name]: value });
//       if (value && index < inputRefs.current.length - 1) {
//         inputRefs.current[index + 1].focus(); // Chuyển focus sang ô tiếp theo
//       }
//     }
//   };

//   // Hàm xử lý thay đổi email
//   const handleEmailChange = (event) => {
//     setEmail(event.target.value);
//   };

//   // Hàm xử lý xác nhận mã OTP
//   const submitOTP = async () => {
//     const code =
//       inputValues.so1 +
//       inputValues.so2 +
//       inputValues.so3 +
//       inputValues.so4 +
//       inputValues.so5 +
//       inputValues.so6;

//     try {
//       const res = await verifyOTPService(email, code); // Gọi API xác thực OTP từ server
//       if (res && res.status === 200) {
//         toast.success("OTP xác thực thành công!");
//         // Thực hiện hành động khác sau khi xác thực thành công
//       } else {
//         toast.success("OTP xác thực thành công!");
//         props.recieveVerify(true);
//       }
//     } catch (error) {
//       toast.error("Xác thực OTP thất bại!");
//       console.error(error);
//     }
//   };

//   const resendOtp = async () => {
//     try {
//       await sendOTPService(email); // Gọi API gửi OTP từ server
//       toast.success("Đã gửi mã OTP vào email");
//     } catch (error) {
//       console.error(error);
//       toast.error("Gửi mã thất bại! Vui lòng nhập email");
//     }
//   };
//   // Hàm gửi lại OTP
//   const resendOTP = async () => {
//     resendOtp();
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center container_Otp">
//       <div className="card text-center">
//         <div className="card-header p-5">
//           <img src="https://raw.githubusercontent.com/Rustcodeweb/OTP-Verification-Card-Design/main/mobile.png" />
//           <h5 style={{ color: "#fff" }} className="mb-2">
//             XÁC THỰC OTP
//           </h5>
//           <div>
//             <small>Nhập email để nhận mã OTP:</small>
//           </div>
//           <input
//             type="email"
//             value={email}
//             onChange={handleEmailChange}
//             className="mt-2 mb-3 form-control"
//             placeholder="Nhập email của bạn"
//           />
//         </div>
//         <div className="input-container d-flex flex-row justify-content-center mt-2">
//           {Array.from({ length: 6 }).map((_, index) => (
//             <input
//               key={index}
//               ref={(el) => (inputRefs.current[index] = el)}
//               value={inputValues[`so${index + 1}`]}
//               name={`so${index + 1}`}
//               onChange={(e) => handleOnChange(e, index)}
//               type="text"
//               className="m-1 text-center form-control rounded"
//               maxLength={1}
//               onFocus={(e) => e.target.select()} // Chọn toàn bộ nội dung khi focus
//             />
//           ))}
//         </div>
//         <div>
//           <small>
//             Bạn không nhận được OTP?
//             <a
//               onClick={resendOTP}
//               style={{ color: "#3366FF" }}
//               className="text-decoration-none ml-2"
//             >
//               Gửi lại
//             </a>
//           </small>
//         </div>
//         <div className="mt-3 mb-5">
//           <button
//             onClick={submitOTP}
//             className="btn btn-success px-4 verify-btn"
//           >
//             Xác thực
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OtpForgetPassword;

//////////////////////////////////////////////////////////////

import React, { useEffect, useState, useRef } from "react";
import "./Otp.scss";
import { toast } from "react-toastify";
import {
  createNewUser,
  handleLoginService,
  sendOTPService,
  verifyOTPService,
} from "../../service/userService";

const OtpForgetPassword = (props) => {
  const [inputValues, setInputValues] = useState({
    so1: "",
    so2: "",
    so3: "",
    so4: "",
    so5: "",
    so6: "",
  });

  const [email, setEmail] = useState(""); // State cho email

  useEffect(() => {
    if (props.dataUser) {
      sendOtp(); // Gửi OTP qua email khi nhận được dataUser
    }
  }, [props.dataUser]);

  // Hàm gửi OTP qua email
  const sendOtp = async () => {
    try {
      await sendOTPService(email); // Gọi API gửi OTP từ server
      toast.success("Đã gửi mã OTP vào email");
    } catch (error) {
      console.error(error);
      // toast.error("Gửi mã thất bại!");
    }
  };

  const inputRefs = useRef([]);
  // Xử lý khi người dùng nhập mã OTP, tự động chuyển focus sang ô tiếp theo
  const handleOnChange = (event, index) => {
    const { name, value } = event.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      // Chỉ cho phép nhập số
      setInputValues({ ...inputValues, [name]: value });
      if (value && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1].focus(); // Chuyển focus sang ô tiếp theo
      }
    }
  };

  // Hàm xử lý thay đổi email
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Hàm xử lý xác nhận mã OTP
  const submitOTP = async () => {
    const code =
      inputValues.so1 +
      inputValues.so2 +
      inputValues.so3 +
      inputValues.so4 +
      inputValues.so5 +
      inputValues.so6;

    try {
      const res = await verifyOTPService(email, code); // Gọi API xác thực OTP từ server
      if (res && res.status === 200) {
        toast.success("OTP xác thực thành công!");
        // Thực hiện hành động khác sau khi xác thực thành công
      } else {
        toast.success("OTP xác thực thành công!");
        props.recieveVerify(true);
      }
    } catch (error) {
      toast.error("Xác thực OTP thất bại!");
      console.error(error);
    }
  };

  const resendOtp = async () => {
    try {
      await sendOTPService(email); // Gọi API gửi OTP từ server
      toast.success("Đã gửi mã OTP vào email");
    } catch (error) {
      console.error(error);
      toast.error("Gửi mã thất bại! Vui lòng nhập email");
    }
  };
  // Hàm gửi lại OTP
  const resendOTP = async () => {
    resendOtp();
  };

  return (
    <div className="container d-flex justify-content-center align-items-center container_Otp">
      <div className="card text-center">
        <div className="card-header p-5">
          <img src="https://raw.githubusercontent.com/Rustcodeweb/OTP-Verification-Card-Design/main/mobile.png" />
          <h5 style={{ color: "#fff" }} className="mb-2">
            XÁC THỰC OTP
          </h5>
          <div>
            <small>Nhập email để nhận mã OTP:</small>
          </div>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="mt-2 mb-3 form-control"
            placeholder="Nhập email của bạn"
            required
          />
          <a
            onClick={sendOtp}
            style={{
              color: "#fff",
              backgroundColor: "#28a745", // Màu xanh lá
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              textDecoration: "none",
            }}
            className="ml-2"
          >
            Gửi
          </a>
        </div>

        <div className="input-container d-flex flex-row justify-content-center mt-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={inputValues[`so${index + 1}`]}
              name={`so${index + 1}`}
              onChange={(e) => handleOnChange(e, index)}
              type="text"
              className="m-1 text-center form-control rounded"
              maxLength={1}
              onFocus={(e) => e.target.select()} // Chọn toàn bộ nội dung khi focus
            />
          ))}
        </div>
        <div>
          <small>
            Bạn không nhận được OTP?
            <a
              onClick={resendOTP}
              style={{ color: "#3366FF" }}
              className="text-decoration-none ml-2"
            >
              Gửi lại
            </a>
          </small>
        </div>
        <div className="mt-3 mb-5">
          <button
            onClick={submitOTP}
            className="btn btn-success px-4 verify-btn"
          >
            Xác thực
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpForgetPassword;

////////////////////////////////////////////////////////////
// import React, { useEffect, useState, useRef } from "react";
// import "./Otp.scss";
// import { toast } from "react-toastify";
// import {
//   createNewUser,
//   handleLoginService,
//   sendOTPService,
//   verifyOTPService,
// } from "../../service/userService";

// const OtpForgetPassword = (props) => {
//   const [inputValues, setInputValues] = useState({
//     so1: "",
//     so2: "",
//     so3: "",
//     so4: "",
//     so5: "",
//     so6: "",
//   });

//   useEffect(() => {
//     if (props.dataUser) {
//       sendOtp(); // Gửi OTP qua email khi nhận được dataUser
//     }
//   }, [props.dataUser]);

//   // Hàm gửi OTP qua email
//   const sendOtp = async () => {
//     const email = props.dataUser.email; // Lấy email từ props
//     try {
//       await sendOTPService(email); // Gọi API gửi OTP từ server
//       toast.success("Đã gửi mã OTP vào email");
//     } catch (error) {
//       console.error(error);
//       toast.error("Gửi mã thất bại!");
//     }
//   };

//   const inputRefs = useRef([]);
//   // Xử lý khi người dùng nhập mã OTP, tự động chuyển focus sang ô tiếp theo
//   const handleOnChange = (event, index) => {
//     const { name, value } = event.target;
//     if (/^\d*$/.test(value) && value.length <= 1) {
//       // Chỉ cho phép nhập số
//       setInputValues({ ...inputValues, [name]: value });
//       if (value && index < inputRefs.current.length - 1) {
//         inputRefs.current[index + 1].focus(); // Chuyển focus sang ô tiếp theo
//       }
//     }
//   };

//   // Hàm xử lý xác nhận mã OTP
//   const submitOTP = async () => {
//     const code =
//       inputValues.so1 +
//       inputValues.so2 +
//       inputValues.so3 +
//       inputValues.so4 +
//       inputValues.so5 +
//       inputValues.so6;

//     try {
//       const res = await verifyOTPService(props.dataUser.email, code); // Gọi API xác thực OTP từ server
//       if (res && res.status === 200) {
//         toast.success("OTP xác thực thành công!");
//         // Thực hiện hành động khác sau khi xác thực thành công
//       } else {
//         toast.success("OTP xác thực thành công!");
//         props.recieveVerify(true);
//       }
//     } catch (error) {
//       toast.error("Xác thực OTP thất bại!");
//       console.error(error);
//     }
//   };

//   // Hàm gửi lại OTP
//   const resendOTP = async () => {
//     sendOtp();
//   };

//   return (
//     <div className="container d-flex justify-content-center align-items-center container_Otp">
//       <div className="card text-center">
//         <div className="card-header p-5">
//           <img src="https://raw.githubusercontent.com/Rustcodeweb/OTP-Verification-Card-Design/main/mobile.png" />
//           <h5 style={{ color: "#fff" }} className="mb-2">
//             XÁC THỰC OTP
//           </h5>
//           <div>
//             <small>
//               Mã OTP đã được gửi tới email{" "}
//               {props.dataUser && props.dataUser.email}
//             </small>
//           </div>
//         </div>
//         <div className="input-container d-flex flex-row justify-content-center mt-2">
//           {Array.from({ length: 6 }).map((_, index) => (
//             <input
//               key={index}
//               ref={(el) => (inputRefs.current[index] = el)}
//               value={inputValues[`so${index + 1}`]}
//               name={`so${index + 1}`}
//               onChange={(e) => handleOnChange(e, index)}
//               type="text"
//               className="m-1 text-center form-control rounded"
//               maxLength={1}
//               onFocus={(e) => e.target.select()} // Chọn toàn bộ nội dung khi focus
//             />
//           ))}
//         </div>
//         <div>
//           <small>
//             Bạn không nhận được OTP?
//             <a
//               onClick={resendOTP}
//               style={{ color: "#3366FF" }}
//               className="text-decoration-none ml-2"
//             >
//               Gửi lại
//             </a>
//           </small>
//         </div>
//         <div className="mt-3 mb-5">
//           <button
//             onClick={submitOTP}
//             className="btn btn-success px-4 verify-btn"
//           >
//             Xác thực
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OtpForgetPassword;