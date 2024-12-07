import React from "react";
import { useEffect, useState } from "react";
import {
  createAllCodeService,
  getDetailAllcodeByCode,
  UpdateAllcodeService,
} from "../../../service/userService";
import { useFetchAllcode } from "../../../util/fetch";
import DatePicker from "../../../components/input/DatePicker";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import CommonUtils from "../../../util/CommonUtils";
import { Spinner, Modal } from "reactstrap";
import "../../../components/modal/modal.css";
import "./AddJobType.scss";
const AddJobType = () => {
  const [isActionADD, setisActionADD] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const { code } = useParams();

  const [inputValues, setInputValues] = useState({
    value: "",
    code: "",
    image: "",
    imageReview: "",
    isOpen: false,
  });

  useEffect(() => {
    if (code) {
      let fetchDetailJobType = async () => {
        setisActionADD(false);
        let allcode = await getDetailAllcodeByCode(code);
        if (allcode && allcode.errCode === 0) {
          setInputValues({
            ...inputValues,
            ["value"]: allcode.data.value,
            ["code"]: allcode.data.code,
            ["image"]: allcode.data.image,
            ["imageReview"]: allcode.data.image,
          });
        }
      };
      fetchDetailJobType();
    }
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setInputValues({
        ...inputValues,
        value: CommonUtils.removeSpace(inputValues.value),
      });
    }, 50);

    return () => clearTimeout(delayDebounceFn);
  }, [inputValues.value]);

  const handleOnChange = (event) => {
    const { name, value } = event.target;
    if (name === "value") {
      setInputValues({
        ...inputValues,
        value: value,
        code: isActionADD ? CommonUtils.replaceCode(value) : inputValues.code,
      });
    } else {
      setInputValues({ ...inputValues, [name]: value });
    }
  };
  let handleOnChangeImage = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      let base64 = await CommonUtils.getBase64(file);
      let objectUrl = URL.createObjectURL(file);

      setInputValues({
        ...inputValues,
        ["image"]: base64,
        ["imageReview"]: objectUrl,
      });
    }
  };
  let openPreviewImage = () => {
    if (!inputValues.imageReview) return;

    setInputValues({ ...inputValues, ["isOpen"]: true });
  };
  let handleSaveJobType = async () => {
    setIsLoading(true);
    if (isActionADD === true) {
      let res = await createAllCodeService({
        value: inputValues.value,
        code: inputValues.code,
        type: "JOBTYPE",
        image: inputValues.image,
      });
      setTimeout(() => {
        setIsLoading(false);
        if (res && res.errCode === 0) {
          toast.success("Thêm loại công việc thành công");
          setInputValues({
            ...inputValues,
            ["value"]: "",
            ["code"]: "",
            ["image"]: "",
            ["imageReview"]: "",
          });
        } else if (res && res.errCode === 2) {
          toast.error(res.errMessage);
        } else toast.error("Thêm loại công việc thất bại");
      }, 50);
    } else {
      let res = await UpdateAllcodeService({
        value: inputValues.value,
        code: code,
        image: inputValues.image,
      });
      setTimeout(() => {
        setIsLoading(false);
        if (res && res.errCode === 0) {
          toast.success("Cập nhật loại công việc thành công");
        } else if (res && res.errCode === 2) {
          toast.error(res.errMessage);
        } else toast.error("Cập nhật loại công việc thất bại");
      }, 50);
    }
  };
  const history = useHistory();
  return (
    <div className="">
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <div
              onClick={() => history.goBack()}
              className="mb-2 hover-pointer"
              style={{ color: "red" }}
            >
              <i class="fa-solid fa-arrow-left mr-2"></i>Quay lại
            </div>

            <h4 className="card-title">
              {isActionADD === true
                ? "Thêm mới loại công việc"
                : "Cập nhật loại công việc"}
            </h4>
            <br></br>
            <form className="form-sample">
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">
                      Tên loại công việc
                    </label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        value={inputValues.value}
                        name="value"
                        onChange={(event) => handleOnChange(event)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Mã code</label>
                    <div className="col-sm-9">
                      <input
                        type="text"
                        disabled={true}
                        value={inputValues.code}
                        name="code"
                        onChange={(event) => handleOnChange(event)}
                        className="form-control"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Hình ảnh</label>
                    <div className="col-sm-9">
                      <input
                        onChange={(event) => handleOnChangeImage(event)}
                        accept="image/*"
                        type="file"
                        className="form-control form-file"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  {/* <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Hình ảnh hiển thị</label>
                                        <div className="col-sm-9">
                                            <div style={{ backgroundImage: `url(${inputValues.imageReview})` }} onClick={() => openPreviewImage()} className="box-img-preview"></div>
                                        </div>
                                    </div> */}
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">
                      Hình ảnh hiển thị
                    </label>
                    <div className="col-sm-9">
                      <div
                        style={{
                          backgroundImage: `url(${inputValues.imageReview})`,
                          width: "300px", // Đặt chiều rộng là 300px
                          height: "200px", // Đặt chiều cao là 200px
                          backgroundSize: "cover", // Đảm bảo ảnh phủ đầy khung
                          backgroundPosition: "center", // Căn giữa ảnh trong khung
                        }}
                        onClick={() => openPreviewImage()}
                        className="box-img-preview"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn1 btn1-primary1 btn1-icon-text"
                onClick={() => handleSaveJobType()}
              >
                <i class="ti-file btn1-icon-prepend"></i>
                Lưu
              </button>
            </form>
          </div>
        </div>
      </div>
      {inputValues.isOpen === true && (
        <Lightbox
          mainSrc={inputValues.imageReview}
          onCloseRequest={() =>
            setInputValues({ ...inputValues, ["isOpen"]: false })
          }
        />
      )}
      {isLoading && (
        <Modal isOpen="true" centered contentClassName="closeBorder">
          <div
            style={{
              position: "absolute",
              right: "50%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Spinner animation="border"></Spinner>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AddJobType;
