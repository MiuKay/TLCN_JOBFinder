import React from "react";
import { useEffect, useState } from "react";
import {
  getAllUsers,
  BanUserService,
  UnbanUserService,
} from "../../../service/userService";
import moment from "moment";
import { PAGINATION } from "../../../util/constant";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import CommonUtils from "../../../util/CommonUtils";
import { Input } from "antd";

const ManageUser = () => {
  const [user, setUser] = useState({});
  const [dataUser, setdataUser] = useState([]);
  const [count, setCount] = useState("");
  const [numberPage, setnumberPage] = useState(0);
  const [search, setSearch] = useState("");
  const [total, setTotal] = useState(0);

  let fetchAllUser = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    setUser(userData);

    let res = await getAllUsers({
      limit: PAGINATION.pagerow,
      offset: 0,
      search: CommonUtils.removeSpace(search),
    });
    if (res && res.errCode === 0) {
      setnumberPage(0);
      setdataUser(res.data);
      setCount(Math.ceil(res.count / PAGINATION.pagerow));
      setTotal(res.count);
    }
  };
  useEffect(async () => {
    await fetchAllUser();
  }, [search]);
  let handleChangePage = async (number) => {
    setnumberPage(number.selected);
    let arrData = await getAllUsers({
      limit: PAGINATION.pagerow,
      offset: number.selected * PAGINATION.pagerow,
      search: CommonUtils.removeSpace(search),
    });
    if (arrData && arrData.errCode === 0) {
      setdataUser(arrData.data);
      setTotal(arrData.count);
    }
  };
  let handlebanUser = async (event, item) => {
    event.preventDefault();
    let res = {};
    if (item.statusCode == "S1") {
      res = await BanUserService(item.userAccountData.id);
    } else {
      res = await UnbanUserService(item.userAccountData.id);
    }
    if (res && res.errCode === 0) {
      toast.success(res.errMessage);
      let user = await getAllUsers({
        limit: PAGINATION.pagerow,
        offset: numberPage * PAGINATION.pagerow,
      });
      if (user && user.errCode === 0) {
        setdataUser(user.data);
        setTotal(user.count);
        setCount(Math.ceil(user.count / PAGINATION.pagerow));
      }
    } else {
      toast.error(res.errMessage);
    }
  };
  const handleSearch = (value) => {
    setSearch(value);
  };
  return (
    <div>
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Danh sách người dùng</h4>
            <Input.Search
              onSearch={handleSearch}
              className="mt-5 mb-5"
              placeholder="Nhập tên hoặc số điện thoại"
              allowClear
              enterButton="Tìm kiếm"
            ></Input.Search>
            <div>Số lượng người dùng: {total}</div>

            <div className="table-responsive pt-2">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Họ và Tên</th>
                    <th>Số điện thoại</th>
                    <th>Giới tính</th>
                    <th>Ngày sinh</th>
                    <th>Quyền</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {dataUser &&
                    dataUser.length > 0 &&
                    dataUser.map((item, index) => {
                      let date = item.userAccountData.dob
                        ? moment
                            .unix(item.userAccountData.dob / 1000)
                            .format("DD/MM/YYYY")
                        : "Không có thông tin";
                      return (
                        <tr key={index}>
                          <td>{index + 1 + numberPage * PAGINATION.pagerow}</td>
                          <td>{`${item.userAccountData.firstName} ${item.userAccountData.lastName}`}</td>
                          <td>{item.phonenumber}</td>
                          <td>{item.userAccountData.genderData.value}</td>
                          <td>{date}</td>
                          <td>{item.roleData.value}</td>
                          <td>
                            <label
                              className={
                                item.statusCode === "S1"
                                  ? "badge badge-success"
                                  : "badge badge-danger"
                              }
                            >
                              {item.statusAccountData.value}
                            </label>
                          </td>
                          <td>
                            <Link
                              style={{ color: "#4B49AC" }}
                              to={`/admin/edit-user/${item.userAccountData.id}/`}
                            >
                              Xem
                            </Link>
                            &nbsp; &nbsp;
                            {user.id != item.id && (
                              <a
                                style={{ color: "#4B49AC" }}
                                href="#"
                                onClick={(event) => handlebanUser(event, item)}
                              >
                                {item.statusCode === "S1"
                                  ? "Chặn"
                                  : "Kích hoạt"}
                              </a>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
              {dataUser && dataUser.length == 0 && (
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
    </div>
  );
};

export default ManageUser;
