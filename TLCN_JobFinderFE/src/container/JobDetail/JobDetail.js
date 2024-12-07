import React from "react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SendCvModal from "../../components/modal/SendCvModal";
import { getDetailPostByIdService } from "../../service/userService";
import moment from "moment";
import CommonUtils from "../../util/CommonUtils";
const JobDetail = () => {
  const history = useHistory();
  const { id } = useParams();
  const [isActiveModal, setAcitveModal] = useState(false);
  const [dataPost, setDataPost] = useState({});
  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, []);

  let fetchPost = async (id) => {
    let res = await getDetailPostByIdService(id);
    if (res && res.errCode === 0) {
      setDataPost(res.data);
    }
  };

  const handleOpenModal = () => {
    if (dataPost.timeEnd && CommonUtils.formatDate(dataPost.timeEnd) > 0) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (userData) setAcitveModal(true);
      else {
        toast.error("Xin hãy đăng nhập để có thể thực hiện nộp CV");
        setTimeout(() => {
          localStorage.setItem("lastUrl", window.location.href);
          history.push("/login");
        }, 1000);
      }
    } else toast.error("Hạn ứng tuyển đã hết");
  };
  return (
    <>
      {/* <div id="preloader-active">
        <div className="preloader d-flex align-items-center justify-content-center">
            <div className="preloader-inner position-relative">
                <div className="preloader-circle"></div>
                <div className="preloader-img pere-text">
                    <img src="assets/img/logo/logo.png" alt="">
                </div>
            </div>
        </div>
    </div>
    <!-- Preloader Start --> */}
      {dataPost.companyData && (
        <main>
          <div className="slider-area ">
            <div
              className="single-slider slider-height2 d-flex align-items-center"
              style={{
                backgroundImage: `url(${dataPost.companyData.coverimage})`,
              }}
            >
              <div className="container">
                <div className="row">
                  <div className="col-xl-12">
                    <div className="hero-cap text-center"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="job-post-company pt-120 pb-120">
            <div className="container">
              <div className="row justify-content-between">
                <div className="col-xl-7 col-lg-8">
                  <div className="single-job-items mb-30">
                    <div className="job-items">
                      <div className="company-img company-img-details">
                        <img
                          src={dataPost.companyData.thumbnail}
                          alt="Ảnh bị lỗi"
                          width={100}
                          height={100}
                        />
                      </div>
                      <div className="job-tittle">
                        <h4>{dataPost.postDetailData.name}</h4>

                        <ul>
                          <li>
                            {dataPost.postDetailData.workTypePostData.value}
                          </li>
                          <li>
                            <i className="fas fa-map-marker-alt"></i>
                            {dataPost.postDetailData.provincePostData.value}
                          </li>
                          <li>
                            {dataPost.postDetailData.salaryTypePostData.value}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="job-post-details">
                    <div className="post-details1 mb-50">
                      <div className="small-section-tittle">
                        <h4>Mô tả công việc</h4>
                      </div>
                    </div>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: dataPost.postDetailData.descriptionHTML,
                      }}
                    />
                  </div>
                </div>

                <div className="col-xl-4 col-lg-4">
                  <div className="post-details3  mb-50">
                    <div className="small-section-tittle">
                      <h4>Thông tin công việc</h4>
                    </div>
                    <ul>
                      <li>
                        Lĩnh vực :{" "}
                        <span>
                          {dataPost.postDetailData.jobTypePostData.value}
                        </span>
                      </li>
                      <li>
                        Nơi làm việc :{" "}
                        <span>
                          {dataPost.postDetailData.provincePostData.value}
                        </span>
                      </li>
                      <li>
                        Hình thức làm việc :{" "}
                        <span>
                          {dataPost.postDetailData.workTypePostData.value}
                        </span>
                      </li>
                      <li>
                        Kinh nghiệm:{" "}
                        <span>
                          {dataPost.postDetailData.expTypePostData.value}
                        </span>
                      </li>
                      <li>
                        Lương :{" "}
                        <span>
                          {dataPost.postDetailData.salaryTypePostData.value}
                        </span>
                      </li>
                      <li>
                        Hạn nộp :{" "}
                        <span>
                          {moment
                            .unix(dataPost.timeEnd / 1000)
                            .format("DD/MM/YYYY")}
                        </span>
                      </li>
                    </ul>
                    <div className="btn" onClick={() => handleOpenModal()}>
                      Ứng tuyển ngay
                    </div>
                  </div>
                  <div className="post-details4  mb-50">
                    <div className="small-section-tittle">
                      <h4>Thông tin công ty</h4>
                    </div>
                    <span>Tên công ty : {dataPost.companyData.name}</span>
                    <ul>
                      <li>
                        Website : <span>{dataPost.companyData.website}</span>
                      </li>
                      {/* <li>
                        Địa chỉ : <span>{dataPost.companyData.address}</span>
                      </li> */}
                      <li>
                        Địa chỉ công ty :
                        <div className="box-body">
                          <p className="text-dark-gray">
                            <i className="fas fa-map-marker-alt" />
                            {dataPost.companyData.address}
                          </p>
                          <div className="company-map">
                            <p className="map">Bản đồ trụ sở chính :</p>
                            <iframe
                              width="100%"
                              height={270}
                              frameBorder={0}
                              style={{ border: 0 }}
                              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyCVgO8KzHQ8iKcfqXgrMnUIGlD-piWiPpo&q=${dataPost.companyData.address}&zoom=15&language=vi`}
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      </li>
                      <li>
                        Điện thoại :{" "}
                        <span>{dataPost.companyData.phonenumber}</span>
                      </li>
                      <li>
                        Mã số thuế :{" "}
                        <span>{dataPost.companyData.taxnumber}</span>
                      </li>
                      <li>
                        Số nhân viên:{" "}
                        <span>{dataPost.companyData.amountEmployer}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <!-- job post company End --> */}
          <SendCvModal
            isOpen={isActiveModal}
            onHide={() => setAcitveModal(false)}
            postId={id}
          />
        </main>
      )}
    </>
  );
};

export default JobDetail;
