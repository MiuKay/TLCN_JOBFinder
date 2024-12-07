import React from "react";
import { useEffect, useState } from "react";
import {
  DeleteAllcodeService,
  getListAllCodeService,
} from "../../../service/userService";
import moment from "moment";
import { PAGINATION } from "../../../util/constant";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import CommonUtils from "../../../util/CommonUtils";
import { Input, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { confirm } = Modal;

const ManageJobType = () => {
  const [dataJobType, setdataJobType] = useState([]);
  const [count, setCount] = useState("");
  const [numberPage, setnumberPage] = useState("");
  const [imgPreview, setimgPreview] = useState("");
  const [isOpen, setisOpen] = useState(false);
  const [search, setSearch] = useState("");
  useEffect(() => {
    try {
      let fetchData = async () => {
        let arrData = await getListAllCodeService({
          type: "JOBTYPE",
          limit: PAGINATION.pagerow,
          offset: 0,
          search: CommonUtils.removeSpace(search),
        });
        if (arrData && arrData.errCode === 0) {
          setnumberPage(0);
          setdataJobType(arrData.data);
          setCount(Math.ceil(arrData.count / PAGINATION.pagerow));
        }
      };
      fetchData();
    } catch (error) {
      console.log(error);
    }
  }, [search]);
  let openPreviewImage = (url) => {
    setimgPreview(url);
    setisOpen(true);
  };
  let handleDeleteJobType = async (id) => {
    let res = await DeleteAllcodeService(id);
    if (res && res.errCode === 0) {
      toast.success(res.errMessage);
      let arrData = await getListAllCodeService({
        type: "JOBTYPE",
        limit: PAGINATION.pagerow,
        offset: numberPage * PAGINATION.pagerow,
        search: CommonUtils.removeSpace(search),
      });
      if (arrData && arrData.errCode === 0) {
        setdataJobType(arrData.data);
        setCount(Math.ceil(arrData.count / PAGINATION.pagerow));
      }
    } else toast.error(res.errMessage);
  };
  let handleChangePage = async (number) => {
    setnumberPage(number.selected);
    let arrData = await getListAllCodeService({
      type: "JOBTYPE",
      limit: PAGINATION.pagerow,
      offset: number.selected * PAGINATION.pagerow,
      search: CommonUtils.removeSpace(search),
    });
    if (arrData && arrData.errCode === 0) {
      setdataJobType(arrData.data);
    }
  };
  const handleSearch = (value) => {
    setSearch(value);
  };
  const confirmDelete = (id) => {
    confirm({
      title: "Bạn có chắc muốn xóa lĩnh vực này này?",
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDeleteJobType(id);
      },

      onCancel() {},
    });
  };
  return (
    <div>
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Danh sách loại công việc</h4>
            <Input.Search
              onSearch={handleSearch}
              className="mt-5 mb-5"
              placeholder="Nhập tên công việc"
              allowClear
              enterButton="Tìm kiếm"
            ></Input.Search>
            <div className="table-responsive pt-2">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên công việc</th>
                    <th>Mã code</th>
                    <th>Hình ảnh</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {dataJobType &&
                    dataJobType.length > 0 &&
                    dataJobType.map((item, index) => {
                      return (
                        // <tr key={index}>
                        //     <td>{index + 1 + numberPage * PAGINATION.pagerow}</td>
                        //     <td>{item.value}</td>
                        //     <td>{item.code}</td>
                        //     <td style={{ width: '30%' }} ><div onClick={() => openPreviewImage(item.image)} className="box-img-preview" style={{ backgroundImage: `url(${item.image})`, width: '100%' }}></div></td>
                        //     <td>
                        //         <Link style={{ color: '#4B49AC' }} to={`/admin/edit-job-type/${item.code}/`}>Sửa</Link>
                        //         &nbsp; &nbsp;
                        //         <a style={{ color: '#4B49AC' }} href="#" onClick={(event) => confirmDelete(item.code)} >Xóa</a>
                        //     </td>
                        // </tr>
                        <tr key={index}>
                          <td>{index + 1 + numberPage * PAGINATION.pagerow}</td>
                          <td>{item.value}</td>
                          <td>{item.code}</td>
                          <td style={{ width: "30%" }}>
                            <div
                              onClick={() => openPreviewImage(item.image)}
                              className="box-img-preview"
                              style={{
                                backgroundImage: `url(${item.image})`,
                                width: "100%", // Điều chỉnh chiều rộng của ảnh
                                height: "170px", // Điều chỉnh chiều cao của ảnh
                                backgroundSize: "cover", // Đảm bảo ảnh phủ đầy khung mà không bị méo
                                backgroundPosition: "center", // Căn giữa ảnh trong khung
                              }}
                            ></div>
                          </td>
                          <td>
                            <Link
                              style={{ color: "#4B49AC" }}
                              to={`/admin/edit-job-type/${item.code}/`}
                            >
                              Sửa
                            </Link>
                            &nbsp; &nbsp;
                            <a
                              style={{ color: "#4B49AC" }}
                              href="#"
                              onClick={(event) => confirmDelete(item.code)}
                            >
                              Xóa
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {dataJobType && dataJobType.length == 0 && (
                <div style={{ textAlign: "center" }}>Không có dữ liệu</div>
              )}
            </div>
          </div>
          <ReactPaginate
            forcePage={numberPage}
            previousLabel={"Quay lại"}
            nextLabel={"Tiếp"}
            breakLabel={"..."}
            pageCount={count}
            marginPagesDisplayed={3}
            containerClassName={"pagination justify-content-center pb-3"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousLinkClassName={"page-link"}
            previousClassName={"page-item"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakLinkClassName={"page-link"}
            breakClassName={"page-item"}
            activeClassName={"active"}
            onPageChange={handleChangePage}
          />
        </div>
      </div>
      {isOpen === true && (
        <Lightbox
          mainSrc={imgPreview}
          onCloseRequest={() => setisOpen(false)}
        />
      )}
    </div>
  );
};

export default ManageJobType;
