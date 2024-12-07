// import React from "react";
// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import { checkUserPhoneService } from "../../service/userService";
// import { useFetchAllcode } from "../../util/fetch";
// import Otp from "./Otp";
// import handleValidate from "../../util/Validation";
// import { Link } from "react-router-dom";
// const Register = () => {
//   const [inputValidates, setValidates] = useState({
//     phonenumber: true,
//     password: true,
//     firstName: true,
//     lastName: true,
//     email: true,
//     againPass: true,
//   });
//   const [inputValues, setInputValues] = useState({
//     phonenumber: "",
//     firstName: "",
//     lastName: "",
//     password: "",
//     isOpen: false,
//     dataUser: {},
//     roleCode: "",
//     email: "",
//     againPass: "",
//     genderCode: "",
//   });
//   let { data: dataRole } = useFetchAllcode("ROLE");
//   let { data: dataGender } = useFetchAllcode("GENDER");

//   if (dataRole && dataRole.length > 0) {
//     dataRole = dataRole.filter(
//       (item) => item.code !== "ADMIN" && item.code !== "COMPANY"
//     );
//   }
//   if (
//     dataGender &&
//     dataGender.length > 0 &&
//     inputValues.genderCode === "" &&
//     dataRole &&
//     dataRole.length > 0 &&
//     inputValues.roleCode === ""
//   ) {
//     setInputValues({
//       ...inputValues,
//       ["genderCode"]: dataGender[0].code,
//       ["roleCode"]: dataRole[0].code,
//     });
//   }

//   const handleOnChange = (event) => {
//     const { name, value } = event.target;
//     setInputValues({ ...inputValues, [name]: value });
//   };

//   let handleOpenVerifyOTP = async () => {
//     let checkPhonenumber = handleValidate(inputValues.phonenumber, "phone");
//     let checkPassword = handleValidate(inputValues.password, "password");
//     let checkFirstName = handleValidate(inputValues.firstName, "isEmpty");
//     let checkLastName = handleValidate(inputValues.lastName, "isEmpty");
//     let checkEmail = handleValidate(inputValues.email, "email");
//     if (
//       !(
//         checkPhonenumber === true &&
//         checkPassword === true &&
//         checkFirstName === true &&
//         checkLastName === true &&
//         checkEmail === true
//       )
//     ) {
//       setValidates({
//         phonenumber: checkPhonenumber,
//         password: checkPassword,
//         firstName: checkFirstName,
//         lastName: checkLastName,
//         email: checkEmail,
//       });
//       return;
//     }

//     if (inputValues.againPass !== inputValues.password) {
//       toast.error("Mật khẩu nhập lại không trùng khớp!");
//       return;
//     }
//     let res = await checkUserPhoneService(inputValues.phonenumber);
//     if (res === true) {
//       toast.error("Số điện thoại đã tồn tại !");
//     } else {
//       setInputValues({
//         ...inputValues,
//         ["dataUser"]: {
//           phonenumber: inputValues.phonenumber,
//           firstName: inputValues.firstName,
//           lastName: inputValues.lastName,
//           password: inputValues.password,
//           roleCode: inputValues.roleCode,
//           genderCode: inputValues.genderCode,
//           email: inputValues.email,
//         },
//         ["isOpen"]: true,
//       });
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
//                     <h4>Người mới?</h4>
//                     <h6 className="font-weight-light">
//                       Đăng ký dễ dàng chỉ vài bước đơn giản
//                     </h6>
//                     <form className="pt-3">
//                       <div className="form-group">
//                         <input
//                           type="text"
//                           value={inputValues.firstName}
//                           name="firstName"
//                           onChange={(event) => handleOnChange(event)}
//                           className="form-control form-control-lg"
//                           id="exampleInputUsername1"
//                           placeholder="Họ"
//                         />
//                         {inputValidates.firstName && (
//                           <p style={{ color: "red" }}>
//                             {inputValidates.firstName}
//                           </p>
//                         )}
//                       </div>
//                       <div className="form-group">
//                         <input
//                           type="text"
//                           value={inputValues.lastName}
//                           name="lastName"
//                           onChange={(event) => handleOnChange(event)}
//                           className="form-control form-control-lg"
//                           id="exampleInputUsername1"
//                           placeholder="Tên"
//                         />
//                         {inputValidates.lastName && (
//                           <p style={{ color: "red" }}>
//                             {inputValidates.lastName}
//                           </p>
//                         )}
//                       </div>
//                       <div className="form-group">
//                         <input
//                           type="number"
//                           value={inputValues.phonenumber}
//                           name="phonenumber"
//                           onChange={(event) => handleOnChange(event)}
//                           className="form-control form-control-lg"
//                           id="exampleInputEmail1"
//                           placeholder="Số điện thoại"
//                         />
//                         {inputValidates.phonenumber && (
//                           <p style={{ color: "red" }}>
//                             {inputValidates.phonenumber}
//                           </p>
//                         )}
//                       </div>
//                       <div className="form-group">
//                         <input
//                           type="text"
//                           value={inputValues.email}
//                           name="email"
//                           onChange={(event) => handleOnChange(event)}
//                           className="form-control form-control-lg"
//                           placeholder="Email"
//                         />
//                         {inputValidates.email && (
//                           <p style={{ color: "red" }}>{inputValidates.email}</p>
//                         )}
//                       </div>
//                       <div className="form-group">
//                         <input
//                           type="password"
//                           value={inputValues.password}
//                           name="password"
//                           onChange={(event) => handleOnChange(event)}
//                           className="form-control form-control-lg"
//                           id="exampleInputPassword1"
//                           placeholder="Mật khẩu"
//                         />
//                         {inputValidates.password && (
//                           <p style={{ color: "red" }}>
//                             {inputValidates.password}
//                           </p>
//                         )}
//                       </div>
//                       <div className="form-group">
//                         <input
//                           type="password"
//                           value={inputValues.againPass}
//                           name="againPass"
//                           onChange={(event) => handleOnChange(event)}
//                           className="form-control form-control-lg"
//                           placeholder="Nhập lại mật khẩu"
//                         />
//                         {inputValidates.againPass && (
//                           <p style={{ color: "red" }}>
//                             {inputValidates.againPass}
//                           </p>
//                         )}
//                       </div>
//                       <div className="form-group">
//                         <select
//                           style={{ color: "black" }}
//                           className="form-control"
//                           value={inputValues.roleCode}
//                           name="roleCode"
//                           onChange={(event) => handleOnChange(event)}
//                         >
//                           {dataRole &&
//                             dataRole.length > 0 &&
//                             dataRole.map((item, index) => {
//                               if (
//                                 item.code !== "ADMIN" &&
//                                 item.code !== "COMPANY"
//                               ) {
//                                 return (
//                                   <option key={index} value={item.code}>
//                                     {item.value}
//                                   </option>
//                                 );
//                               }
//                             })}
//                         </select>
//                       </div>
//                       <div className="form-group">
//                         <select
//                           style={{ color: "black" }}
//                           className="form-control"
//                           value={inputValues.genderCode}
//                           name="genderCode"
//                           onChange={(event) => handleOnChange(event)}
//                         >
//                           {dataGender &&
//                             dataGender.length > 0 &&
//                             dataGender.map((item, index) => {
//                               return (
//                                 <option key={index} value={item.code}>
//                                   {item.value}
//                                 </option>
//                               );
//                             })}
//                         </select>
//                       </div>
//                       <div className="mt-3">
//                         <a
//                           onClick={() => handleOpenVerifyOTP()}
//                           className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1"
//                         >
//                           Đăng ký
//                         </a>
//                       </div>
//                       <div className="text-center mt-4 font-weight-light">
//                         Bạn đã có tài khoản rồi?{" "}
//                         <Link to="/login" className="text-primary">
//                           Đăng nhập ngay
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

//       {inputValues.isOpen === true && <Otp dataUser={inputValues.dataUser} />}
//     </>
//   );
// };

// export default Register;

import React from "react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { checkUserPhoneService } from "../../service/userService";
import { useFetchAllcode } from "../../util/fetch";
import Otp from "./Otp";
import handleValidate from "../../util/Validation";
import { Link } from "react-router-dom";
const Register = () => {
  const [inputValidates, setValidates] = useState({
    phonenumber: true,
    password: true,
    firstName: true,
    lastName: true,
    email: true,
    againPass: true,
  });
  const [inputValues, setInputValues] = useState({
    phonenumber: "",
    firstName: "",
    lastName: "",
    password: "",
    isOpen: false,
    dataUser: {},
    roleCode: "",
    email: "",
    againPass: "",
    genderCode: "",
  });
  let { data: dataRole } = useFetchAllcode("ROLE");
  let { data: dataGender } = useFetchAllcode("GENDER");

  if (dataRole && dataRole.length > 0) {
    dataRole = dataRole.filter(
      (item) => item.code !== "ADMIN" && item.code !== "COMPANY"
    );
  }
  if (
    dataGender &&
    dataGender.length > 0 &&
    inputValues.genderCode === "" &&
    dataRole &&
    dataRole.length > 0 &&
    inputValues.roleCode === ""
  ) {
    setInputValues({
      ...inputValues,
      ["genderCode"]: dataGender[0].code,
      ["roleCode"]: dataRole[0].code,
    });
  }

  // const handleOnChange = (event) => {
  //   const { name, value } = event.target;
  //   setInputValues({ ...inputValues, [name]: value });
  // };
  const handleOnChange = (event) => {
    const { name, value } = event.target;

    // Cập nhật giá trị input
    setInputValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = () => {
    let isValid = true;
    const newValidates = {};

    Object.keys(inputValues).forEach((key) => {
      if (key !== "isOpen" && key !== "dataUser") {
        const validateMessage = handleValidate(inputValues[key], key);
        newValidates[key] = validateMessage === true ? "" : validateMessage;
        if (validateMessage !== true) isValid = false;
      }
    });

    setValidates(newValidates);

    if (isValid) {
      handleOpenVerifyOTP(); // Mở trang xác minh OTP
    } else {
      setSubmitMessage("Có lỗi trong form. Vui lòng kiểm tra lại.");
    }
  };

  let handleOpenVerifyOTP = async () => {
    let checkPhonenumber = handleValidate(inputValues.phonenumber, "phone");
    let checkPassword = handleValidate(inputValues.password, "password");
    let checkFirstName = handleValidate(inputValues.firstName, "isEmpty");
    let checkLastName = handleValidate(inputValues.lastName, "isEmpty");
    let checkEmail = handleValidate(inputValues.email, "email");
    if (
      !(
        checkPhonenumber === true &&
        checkPassword === true &&
        checkFirstName === true &&
        checkLastName === true &&
        checkEmail === true
      )
    ) {
      setValidates({
        phonenumber: checkPhonenumber,
        password: checkPassword,
        firstName: checkFirstName,
        lastName: checkLastName,
        email: checkEmail,
      });
      return;
    }

    if (inputValues.againPass !== inputValues.password) {
      toast.error("Mật khẩu nhập lại không trùng khớp!");
      return;
    }
    let res = await checkUserPhoneService(inputValues.phonenumber);
    if (res === true) {
      toast.error("Số điện thoại đã tồn tại !");
    } else {
      setInputValues({
        ...inputValues,
        ["dataUser"]: {
          phonenumber: inputValues.phonenumber,
          firstName: inputValues.firstName,
          lastName: inputValues.lastName,
          password: inputValues.password,
          roleCode: inputValues.roleCode,
          genderCode: inputValues.genderCode,
          email: inputValues.email,
        },
        ["isOpen"]: true,
      });
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
                    <h4>Người mới?</h4>
                    <h6 className="font-weight-light">
                      Đăng ký dễ dàng chỉ vài bước đơn giản
                    </h6>
                    <form className="pt-3">
                      <div className="form-group">
                        <input
                          type="text"
                          value={inputValues.firstName}
                          name="firstName"
                          onChange={(event) => handleOnChange(event)}
                          className="form-control form-control-lg"
                          id="exampleInputUsername1"
                          placeholder="Họ"
                        />
                        {inputValidates.firstName && (
                          <p style={{ color: "red" }}>
                            {inputValidates.firstName}
                          </p>
                        )}
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          value={inputValues.lastName}
                          name="lastName"
                          onChange={(event) => handleOnChange(event)}
                          className="form-control form-control-lg"
                          id="exampleInputUsername1"
                          placeholder="Tên"
                        />
                        {inputValidates.lastName && (
                          <p style={{ color: "red" }}>
                            {inputValidates.lastName}
                          </p>
                        )}
                      </div>
                      <div className="form-group">
                        <input
                          type="number"
                          value={inputValues.phonenumber}
                          name="phonenumber"
                          onChange={(event) => handleOnChange(event)}
                          className="form-control form-control-lg"
                          id="exampleInputEmail1"
                          placeholder="Số điện thoại"
                        />
                        {inputValidates.phonenumber && (
                          <p style={{ color: "red" }}>
                            {inputValidates.phonenumber}
                          </p>
                        )}
                      </div>
                      <div className="form-group">
                        <input
                          type="text"
                          value={inputValues.email}
                          name="email"
                          onChange={(event) => handleOnChange(event)}
                          className="form-control form-control-lg"
                          placeholder="Email"
                        />
                        {inputValidates.email && (
                          <p style={{ color: "red" }}>{inputValidates.email}</p>
                        )}
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          value={inputValues.password}
                          name="password"
                          onChange={(event) => handleOnChange(event)}
                          className="form-control form-control-lg"
                          id="exampleInputPassword1"
                          placeholder="Mật khẩu"
                        />
                        {inputValidates.password && (
                          <p style={{ color: "red" }}>
                            {inputValidates.password}
                          </p>
                        )}
                      </div>
                      <div className="form-group">
                        <input
                          type="password"
                          value={inputValues.againPass}
                          name="againPass"
                          onChange={(event) => handleOnChange(event)}
                          className="form-control form-control-lg"
                          placeholder="Nhập lại mật khẩu"
                        />
                        {inputValidates.againPass && (
                          <p style={{ color: "red" }}>
                            {inputValidates.againPass}
                          </p>
                        )}
                      </div>
                      <div className="form-group">
                        <select
                          style={{ color: "black" }}
                          className="form-control"
                          value={inputValues.roleCode}
                          name="roleCode"
                          onChange={(event) => handleOnChange(event)}
                        >
                          {dataRole &&
                            dataRole.length > 0 &&
                            dataRole.map((item, index) => {
                              if (
                                item.code !== "ADMIN" &&
                                item.code !== "COMPANY"
                              ) {
                                return (
                                  <option key={index} value={item.code}>
                                    {item.value}
                                  </option>
                                );
                              }
                            })}
                        </select>
                      </div>
                      <div className="form-group">
                        <select
                          style={{ color: "black" }}
                          className="form-control"
                          value={inputValues.genderCode}
                          name="genderCode"
                          onChange={(event) => handleOnChange(event)}
                        >
                          {dataGender &&
                            dataGender.length > 0 &&
                            dataGender.map((item, index) => {
                              return (
                                <option key={index} value={item.code}>
                                  {item.value}
                                </option>
                              );
                            })}
                        </select>
                      </div>
                      <div className="mt-3">
                        {/* <a
                          onClick={() => handleOpenVerifyOTP()}
                          className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1"
                        >
                          Đăng ký
                        </a> */}
                        <div>
                          {submitMessage && (
                            <p
                              style={{
                                color: submitMessage.includes("lỗi")
                                  ? "red"
                                  : "green",
                              }}
                            >
                              {submitMessage}
                            </p>
                          )}
                        </div>

                        <a
                          onClick={(e) => {
                            e.preventDefault(); // Ngăn reload trang
                            handleSubmit();
                          }}
                          className="btn1 btn1-block btn1-primary1 btn1-lg font-weight-medium auth-form-btn1"
                        >
                          Đăng ký
                        </a>
                      </div>
                      <div className="text-center mt-4 font-weight-light">
                        Bạn đã có tài khoản rồi?{" "}
                        <Link to="/login" className="text-primary">
                          Đăng nhập ngay
                        </Link>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            {/* content-wrapper ends */}
          </div>
          {/* page-body-wrapper ends */}
        </div>
      )}

      {inputValues.isOpen === true && <Otp dataUser={inputValues.dataUser} />}
    </>
  );
};

export default Register;
