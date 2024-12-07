import React from "react";
import { useEffect, useState } from "react";
import {
  getDetailUserById,
  UpdateUserSettingService,
  getAllSkillByJobCode,
} from "../../service/userService";
import { useFetchAllcode } from "../../util/fetch";
import { toast } from "react-toastify";
import "react-image-lightbox/style.css";
import CommonUtils from "../../util/CommonUtils";
import { Select } from "antd";
const SettingUser = () => {
  const [listSkills, setListSkills] = useState([]);
  const [inputValues, setInputValues] = useState({
    jobType: "",
    salary: "",
    skills: [],
    jobProvince: "",
    exp: "",
    isFindJob: 0,
    isTakeMail: 0,
    file: "",
  });
  let handleOnChangeFile = async (event) => {
    let data = event.target.files;
    let file = data[0];
    if (file) {
      if (file.size > 2097152) {
        toast.error("File của bạn quá lớn. Chỉ gửi file dưới 2MB");
        return;
      }
      let base64 = await CommonUtils.getBase64(file);

      setInputValues({ ...inputValues, file: base64 });
    }
  };

  const handleChange = async (value, detail) => {
    if (Array.isArray(detail)) {
      setInputValues({
        ...inputValues,
        skills: value,
      });
    } else {
      if (detail.type === "jobType") {
        let res = await getAllSkillByJobCode(value);
        let listSkills = res.data.map((item) => ({
          value: item.id,
          label: item.name,
        }));
        setListSkills(listSkills);
        setInputValues({
          ...inputValues,
          [detail.type]: value,
          skills: [],
        });
      } else {
        setInputValues({
          ...inputValues,
          [detail.type]: value,
        });
      }
    }
  };
  let getListSkill = async (jobType) => {
    let res = await getAllSkillByJobCode(jobType);
    let listSkills = res.data.map((item) => ({
      value: item.id,
      label: item.name,
    }));
    setListSkills(listSkills);
  };

  let setStateUser = (data) => {
    getListSkill(data.userAccountData.userSettingData.categoryJobCode);
    let listSkills = [];
    if (Array.isArray(data.listSkills) && data.listSkills.length > 0) {
      listSkills = data.listSkills.map((item) => item.SkillId);
    }
    setInputValues({
      ...inputValues,
      jobType: data.userAccountData.userSettingData.categoryJobCode ?? "",
      salary: data.userAccountData.userSettingData.salaryJobCode ?? "",
      skills: listSkills,
      jobProvince: data.userAccountData.userSettingData.addressCode ?? "",
      exp: data.userAccountData.userSettingData.experienceJobCode ?? "",
      isFindJob: data.userAccountData.userSettingData.isFindJob ?? 0,
      isTakeMail: data.userAccountData.userSettingData.isTakeMail ?? 0,
      file: data.userAccountData.userSettingData.file ?? "",
    });
  };
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      let fetchUser = async () => {
        let user = await getDetailUserById(userData.id);
        if (user && user.errCode === 0) {
          setStateUser(user.data);
        }
      };
      fetchUser();
    }
  }, []);

  let { data: dataProvince } = useFetchAllcode("PROVINCE");
  let { data: dataExp } = useFetchAllcode("EXPTYPE");
  let { data: dataSalary } = useFetchAllcode("SALARYTYPE");
  let { data: dataJobType } = useFetchAllcode("JOBTYPE");

  dataProvince = dataProvince.map((item) => ({
    value: item.code,
    label: item.value,
    type: "jobProvince",
  }));

  dataExp = dataExp.map((item) => ({
    value: item.code,
    label: item.value,
    type: "exp",
  }));

  dataSalary = dataSalary.map((item) => ({
    value: item.code,
    label: item.value,
    type: "salary",
  }));

  dataJobType = dataJobType.map((item) => ({
    value: item.code,
    label: item.value,
    type: "jobType",
  }));

  let handleOnChangeCheckBox = (e) => {
    const { name, checked } = e.target;
    if (name === "isFindJob" && !inputValues.file) {
      toast.error("Bạn cần đăng tải CV trước khi chọn tính năng này");
    } else if (
      name === "isTakeMail" &&
      !inputValues.jobType &&
      !inputValues.jobProvince
    ) {
      toast.error(
        "Bạn cần chọn lĩnh vực và khu vực làm việc trước khi chọn tính năng này"
      );
    } else {
      setInputValues({
        ...inputValues,
        [name]: checked ? 1 : 0,
      });
    }
  };

  let handleSaveUser = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    let settingData = {
      categoryJobCode: inputValues.jobType,
      addressCode: inputValues.jobProvince,
      experienceJobCode: inputValues.exp,
      isTakeMail: inputValues.isTakeMail,
      isFindJob: inputValues.isFindJob,
      file: inputValues.file,
      salaryJobCode: inputValues.salary,
      listSkills: inputValues.skills,
    };
    let res = await UpdateUserSettingService({
      id: userData.id,
      data: settingData,
    });
    if (res && res.errCode === 0) {
      toast.success("Cập nhật người dùng thành công");
      window.location.reload();
    } else {
      toast.error(res.errMessage);
    }
  };
  let handleSearchMulti = (input, option) => {
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());
  };
  return (
    <div className="">
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Cài đặt thông tin nâng cao</h4>
            <br></br>
            <form className="form-sample">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Lĩnh vực</label>
                    <div className="col-sm-9 mt-3">
                      <Select
                        style={{
                          width: "100%",
                        }}
                        placeholder="Chọn lĩnh vực"
                        onChange={handleChange}
                        options={dataJobType}
                        value={inputValues.jobType}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        showSearch
                      ></Select>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Mức lương</label>
                    <div className="col-sm-9 mt-3">
                      <Select
                        style={{
                          width: "100%",
                        }}
                        placeholder="Chọn mức lương"
                        onChange={handleChange}
                        options={dataSalary}
                        value={inputValues.salary}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        showSearch
                      ></Select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Kĩ năng</label>
                    <div
                      className="col-sm-9 mt-3"
                      style={{ marginLeft: "-145px" }}
                    >
                      <Select
                        disabled={!inputValues.jobType}
                        mode="multiple"
                        style={{
                          width: "calc(100% + 115px)",
                        }}
                        placeholder="Chọn kĩ năng của bạn"
                        onChange={handleChange}
                        options={listSkills}
                        value={inputValues.skills}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        showSearch
                      ></Select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">
                      Khu vực làm việc
                    </label>
                    <div className="col-sm-9 mt-3">
                      <Select
                        style={{
                          width: "100%",
                        }}
                        placeholder="Chọn nơi làm việc"
                        onChange={handleChange}
                        options={dataProvince}
                        value={inputValues.jobProvince}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        showSearch
                      ></Select>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">
                      Kinh nghiệm làm việc
                    </label>
                    <div className="col-sm-9 mt-3">
                      <Select
                        style={{
                          width: "100%",
                        }}
                        placeholder="Chọn khoảng kinh nghiệm"
                        onChange={handleChange}
                        options={dataExp}
                        value={inputValues.exp}
                        filterOption={(input, option) =>
                          (option?.label ?? "")
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                        showSearch
                      ></Select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">
                      Bật tìm việc
                    </label>
                    <div className="col-sm-9 mt-3">
                      <input
                        name="isFindJob"
                        onChange={handleOnChangeCheckBox}
                        checked={inputValues.isFindJob}
                        type="checkbox"
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">
                      Nhận mail công việc
                    </label>
                    <div className="col-sm-9 mt-3">
                      <input
                        name="isTakeMail"
                        onChange={handleOnChangeCheckBox}
                        checked={inputValues.isTakeMail}
                        type="checkbox"
                      ></input>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">
                      CV gửi lên
                    </label>
                    <div className="col-sm-9">
                      <input
                        onChange={(event) => handleOnChangeFile(event)}
                        accept=".pdf"
                        type="file"
                        className="form-control form-file"
                      />
                    </div>
                  </div>
                </div>
              </div>
              {inputValues.file && (
                <div className="col-md-12">
                  <div className="form-group row">
                    <iframe
                      width={"100%"}
                      height={"700px"}
                      src={inputValues.file}
                    ></iframe>
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => handleSaveUser()}
                className="btn1 btn1-primary1 btn1-icon-text"
              >
                <i class="ti-file btn1-icon-prepend"></i>
                Lưu
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingUser;
