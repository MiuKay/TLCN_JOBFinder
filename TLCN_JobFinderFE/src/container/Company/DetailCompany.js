import React from "react";
import { getDetailCompanyById } from "../../service/userService";
import "./DetailCompany.scss";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { dateFormat } from "../../util/constant";
import CommonUtils from "../../util/CommonUtils";
import moment from "moment";
const DetailCompany = () => {
  const [dataCompany, setdataCompany] = useState({});
  const { id } = useParams();
  useEffect(() => {
    if (id) {
      let fetchCompany = async () => {
        let res = await getDetailCompanyById(id);
        if (res && res.errCode === 0) {
          setdataCompany(res.data);
        }
      };
      fetchCompany();
    }
  }, []);

  const copyLink = () => {
    let copyText = document.getElementById("mylink");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);
  };
  return (
    <div className="container-detail-company">
      <div className="company-cover">
        <div className="container">
          <div className="cover-wrapper">
            <img
              src={dataCompany.coverimage}
              alt=""
              className="img-responsive cover-img"
              width="100%"
              height="236px"
            />
          </div>
          <div className="company-detail-overview">
            <div id="company-logo">
              <div className="company-image-logo">
                <img
                  style={{ width: "100%", height: "100%" }}
                  src={dataCompany.thumbnail}
                  alt="Công ty Cổ phần Tập đoàn Hoa Sen"
                  className="img-responsive"
                />
              </div>
            </div>
            <div className="company-info">
              <h1 className="company-detail-name text-highlight">
                {dataCompany.name}
              </h1>
              <div className="d-flex">
                <p className="website">
                  <i className="fas fa-globe-americas"></i>
                  <a href={dataCompany.website} target="_blank">
                    {dataCompany.website}
                  </a>
                </p>
                <p className="company-size">
                  <i className="far fa-building"></i>
                  {dataCompany.amountEmployer}+ nhân viên
                </p>
              </div>
            </div>
            <div className="box-follow">
              <a
                style={{
                  background:
                    dataCompany.censorData &&
                    (dataCompany.censorData.code === "CS2"
                      ? "red"
                      : dataCompany.censorData.code !== "CS1"
                      ? "yellow"
                      : ""),
                  color: "black",
                }}
                className="btn btn-follow btn-primary-hover"
              >
                {dataCompany.censorData && dataCompany.censorData.value}
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="detail">
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <div className="company-info box-white">
                <h4 className="title">Giới thiệu công ty</h4>
                <div className="box-body">
                  <p
                    dangerouslySetInnerHTML={{
                      __html: dataCompany.descriptionHTML,
                    }}
                  ></p>
                </div>
              </div>
              <div className="job-listing box-white">
                <h4 className="title">Tuyển dụng</h4>
                <div className="box-body">
                  {dataCompany &&
                    dataCompany.postData &&
                    dataCompany.postData.length > 0 &&
                    dataCompany.postData.map((item, index) => {
                      return (
                        <Link
                          to={`/detail-job/${item.id}`}
                          className="company-logo"
                        >
                          <div
                            key={index}
                            className="job-item  job-ta result-job-hover"
                          >
                            <div className="avatar">
                              <img
                                src={dataCompany.thumbnail}
                                className="w-100"
                                alt="Công ty Cổ phần Tập đoàn Hoa Sen"
                                title="Nhân Viên Tuyển Dụng - Đào Tạo"
                              />
                            </div>
                            <div className="body">
                              <div className="content">
                                <div className="ml-auto">
                                  <h4 className="title-job">
                                    <Link
                                      className="underline-box-job"
                                      to={`/detail-job/${item.id}`}
                                    >
                                      <span
                                        className="bold transform-job-title"
                                        data-toggle="tooltip"
                                        title
                                        data-placement="top"
                                        data-container="body"
                                        data-original-title="Nhân Viên Tuyển Dụng - Đào Tạo"
                                      >
                                        {item.postDetailData.name}
                                      </span>
                                      <i
                                        className="fa-solid fa-circle-check"
                                        data-toggle="tooltip"
                                        title
                                        data-placement="top"
                                        data-container="body"
                                        data-original-title="Tin từ nhà tuyển dụng đã xác thực"
                                      />
                                    </Link>
                                  </h4>
                                </div>
                                <div
                                  style={{ minWidth: "100px" }}
                                  className="mr-auto text-right"
                                >
                                  <p className="deadline">
                                    {CommonUtils.formatDate(item.timeEnd) <=
                                    0 ? (
                                      <div>Hết hạn ứng tuyển</div>
                                    ) : (
                                      <div>
                                        Còn{" "}
                                        <strong>
                                          {CommonUtils.formatDate(item.timeEnd)}
                                        </strong>{" "}
                                        ngày
                                      </div>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <div
                                style={{ margin: "10px 0" }}
                                className="d-flex"
                              >
                                <div className="label-content ml-auto">
                                  <label className="salary">
                                    {
                                      item.postDetailData.salaryTypePostData
                                        .value
                                    }
                                  </label>
                                  <label
                                    style={{ margin: "0px 10px" }}
                                    className="address"
                                    data-toggle="tooltip"
                                    title
                                    data-placement="top"
                                    data-container="body"
                                    data-original-title="Hà Nam"
                                  >
                                    {item.postDetailData.provincePostData.value}
                                  </label>
                                  <label className="time">
                                    {moment(item.createdAt).fromNow()}
                                  </label>
                                </div>
                                {/* <div className="icon mr-auto">
                                                                <div id="box-save-job-589972" className="box-save-job  box-save-job-hover   job-notsave " style={{ width: '23px' }}>
                                                                    <a href="javascript:void(0)" className="btn-save save" data-id={589972} data-title="Nhân Viên Tuyển Dụng - Đào Tạo">
                                                                        <span id="save-job-loading" style={{ display: 'none' }}>
                                                                            <img src="https://www.topcv.vn/v3/images/ap-loading.gif" style={{ width: '20px' }} />
                                                                        </span>
                                                                        <i className="fa-light fa-heart" />
                                                                    </a>
                                                                    <a href="javascript:void(0)" className="btn-unsave unsave text-highlight" data-toggle="tooltip" title data-id={589972} data-title="Nhân Viên Tuyển Dụng - Đào Tạo" data-placement="top" data-container="body" data-original-title="Bỏ lưu">
                                                                        <span id="unsave-job-loading" style={{ display: 'none' }}>
                                                                            <img src="https://www.topcv.vn/v3/images/ap-loading.gif" style={{ width: '20px' }} />
                                                                        </span>
                                                                        <i className="fa-solid fa-heart" />
                                                                    </a>
                                                                </div> </div> */}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  {dataCompany &&
                    dataCompany.postData &&
                    dataCompany.postData.length === 0 && (
                      <div style={{ textAlign: "center" }}>
                        Không có bài đăng nào
                      </div>
                    )}

                  <div className="text-center"></div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="box-address box-white">
                <h4 className="title">Địa chỉ công ty</h4>
                <div className="box-body">
                  <p className="text-dark-gray">
                    <i className="fas fa-map-marker-alt" />
                    {dataCompany.address}
                  </p>
                  <div className="company-map">
                    <p className="map">Bản đồ trụ sở chính :</p>
                    <iframe
                      width="100%"
                      height={270}
                      frameBorder={0}
                      style={{ border: 0 }}
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCVgO8KzHQ8iKcfqXgrMnUIGlD-piWiPpo&q=${dataCompany.address}&zoom=15&language=vi`}
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>
              <div className="box-sharing box-white">
                <h4 className="title">Chia sẻ công ty tới bạn bè</h4>
                <div className="box-body">
                  <p>Sao chép đường dẫn</p>
                  <div className="box-copy">
                    <input
                      id="mylink"
                      type="text"
                      defaultValue={window.location.href}
                      className="url-copy"
                      readOnly
                    />
                    <div className="btn-copy">
                      <button onClick={copyLink} className="btn-copy-url">
                        <i className="fa-regular fa-copy" />
                      </button>
                    </div>
                  </div>
                  <p>Chia sẻ qua mạng xã hội</p>
                  <div className="box-share">
                    <a
                      href={`http://www.facebook.com/sharer/sharer.php?u=${
                        dataCompany.website || ""
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://www.topcv.vn/v4/image/job-detail/share/facebook.png"
                        alt="Share on Facebook"
                      />
                    </a>

                    <a
                      href={`https://twitter.com/intent/tweet?url=${
                        dataCompany.website || ""
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://www.topcv.vn/v4/image/job-detail/share/twitter.png"
                        alt="Share on Twitter"
                      />
                    </a>

                    <a
                      href={`https://www.linkedin.com/cws/share?url=${
                        dataCompany.website || ""
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="https://www.topcv.vn/v4/image/job-detail/share/linkedin.png"
                        alt="Share on LinkedIn"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCompany;
