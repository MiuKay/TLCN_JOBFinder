import React from "react";
import { useEffect, useState } from "react";
import { getPackageByType, getPaymentLink } from "../../../service/userService";
import { toast } from "react-toastify";
import { useHistory, useParams } from "react-router-dom";
import { Spinner, Modal } from "reactstrap";
const BuyPost = () => {
  const history = useHistory();
  const [inputValues, setInputValues] = useState({
    amount: 1,
    packageId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [dataPackage, setDataPackage] = useState([]);
  const [price, setPrice] = useState(0);
  const [total, setTotal] = useState(0);
  const handleOnChangePackage = (event) => {
    const { value } = event.target;
    let item = dataPackage.find((item) => item.id == value);
    setPrice(item.price);
    setTotal(item.price * inputValues.amount);
    setInputValues({
      ...inputValues,
      packageId: item.id,
    });
  };
  // const handleOnChangeAmount = event => {
  //     const { value } = event.target
  //     setInputValues({
  //         ...inputValues,
  //         amount: value
  //     })
  //     setTotal(value * price)
  // }
  const handleOnChangeAmount = (event) => {
    let value = event.target.value;

    // Kiểm tra nếu giá trị không phải là số hoặc là số âm thì không làm gì
    if (value < 0) {
      return;
    }

    setInputValues({
      ...inputValues,
      amount: value,
    });
    setTotal(value * price);
  };
  const handleOnChangeType = (event) => {
    const { value } = event.target;
    fetchPackagePost(value);
  };

  const handleBuy = async () => {
    setIsLoading(true);
    let res = await getPaymentLink(inputValues.packageId, inputValues.amount);
    if (res.errCode == 0) {
      let data = {
        packageId: inputValues.packageId,
        amount: inputValues.amount,
        userId: JSON.parse(localStorage.getItem("userData")).id,
      };
      localStorage.setItem("orderData", JSON.stringify(data));
      window.location.href = res.link;
    } else {
      toast.errorr(res.errMessage);
      setIsLoading(false);
    }
  };
  const fetchPackagePost = async (isHot) => {
    let res = await getPackageByType(isHot);
    setDataPackage(res.data);
    setInputValues({
      ...inputValues,
      isHot: isHot,
      packageId: res.data[0].id,
    });
    setPrice(res.data[0].price);
    setTotal(res.data[0].price * inputValues.amount);
  };
  useEffect(() => {
    fetchPackagePost(0);
  }, []);
  return (
    <div className="">
      <div className="col-12 grid-margin">
        <div className="card">
          <div className="card-body">
            <h4 className="card-title">Mua lượt đăng bài viết</h4>
            <br></br>
            <form className="form-sample">
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">
                      Loại lượt đăng bài viết
                    </label>
                    <div className="col-sm-9">
                      <select
                        style={{ color: "black" }}
                        className="form-control"
                        value={inputValues.isHot}
                        name="typePost"
                        onChange={(event) => handleOnChangeType(event)}
                      >
                        <option value={0}>Bài viết bình thường</option>
                        <option value={1}>Bài viết nổi bật</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">
                      Các gói bài viết
                    </label>
                    <div className="col-sm-9">
                      <select
                        style={{ color: "black" }}
                        className="form-control"
                        name="addressCode"
                        onChange={(event) => handleOnChangePackage(event)}
                      >
                        {dataPackage &&
                          dataPackage.length > 0 &&
                          dataPackage.map((item, index) => {
                            return (
                              <option key={index} value={item.id}>
                                {item.name}
                              </option>
                            );
                          })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Đơn giá</label>
                    <div className="col-sm-9">
                      <p className="mt-2">{price} USD</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  {/* <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Số lượng</label>
                                        <div className="col-sm-9">
                                            <input onChange={handleOnChangeAmount} value={inputValues.amount} className='mt-2' type={'number'}></input>
                                        </div>
                                    </div> */}
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Số lượng</label>
                    <div className="col-sm-9">
                      <input
                        onChange={handleOnChangeAmount}
                        value={inputValues.amount}
                        className="mt-2"
                        type="number"
                        min="0" // Giới hạn giá trị nhập vào là 0 trở lên
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-8">
                  <div className="form-group row">
                    <label className="col-sm-3 col-form-label">Tổng tiền</label>
                    <div className="col-sm-9">
                      <p className="mt-2">{total} USD</p>
                    </div>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="btn1 btn1-primary1 btn1-icon-text"
                onClick={() => handleBuy()}
              >
                <i class="ti-file btn1-icon-prepend"></i>
                Mua
              </button>
            </form>
          </div>
        </div>
      </div>
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

export default BuyPost;
