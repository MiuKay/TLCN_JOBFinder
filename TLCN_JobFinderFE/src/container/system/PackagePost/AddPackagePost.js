import React from 'react'
import { useEffect, useState } from 'react';
import { getPackageById , createPackagePost , updatePackagePost } from '../../../service/userService';
import { toast } from 'react-toastify';
import { useHistory, useParams } from "react-router-dom";
import { Spinner, Modal } from 'reactstrap'
import '../../../components/modal/modal.css'
const AddpackagePost = () => {


    const [isActionADD, setisActionADD] = useState(true)
    const [isLoading, setIsLoading] = useState(false)


    const { id } = useParams();

    const [inputValues, setInputValues] = useState({
        value: '', price: '' , isHot: 0 , name: ''
    });
    useEffect(() => {

        if (id) {
            let fetchDetailPackagePost = async () => {
                setisActionADD(false)
                let res = await getPackageById(id)
                if (res && res.errCode === 0) {
                    setInputValues({ ...inputValues, ["value"]: res.data.value, ["id"]: res.data.id , ["price"] : res.data.price , ["name"] : res.data.name })
                }
            }
            fetchDetailPackagePost()
        }
    }, [])

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });

    };  
    let handleSavePackagePost = async () => {
        setIsLoading(true)
        if (isActionADD === true) {
            let res = await createPackagePost({
                value: inputValues.value,
                isHot: inputValues.isHot,
                name: inputValues.name,
                price: inputValues.price
            })
            setTimeout(() => {
                setIsLoading(false)
                if (res && res.errCode === 0) {
                    toast.success(res.errMessage)
                    setInputValues({
                        ...inputValues,
                        ["value"]: '',
                        ["code"]: '',
                        price: '',
                        name: ''
                    })
                }
                else if (res && res.errCode === 2) {
                    toast.error(res.errMessage)
                }
                else toast.error(res.errMessage)
            }, 1000);
        } else {
            let res = await updatePackagePost({
                value: inputValues.value,
                name: inputValues.name,
                isHot: inputValues.isHot,
                price: inputValues.price,
                id: id,
            })
            setTimeout(() => {
                setIsLoading(false)
                if (res && res.errCode === 0) {
                    toast.success(res.errMessage)
                }
                else if (res && res.errCode === 2) {
                    toast.error(res.errMessage)
                }
                else toast.error(res.errMessage)
            }, 500);
        }
    }
    const history = useHistory()
    return (
        <div className=''>
            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                    <div onClick={()=> history.goBack()} className='mb-2 hover-pointer' style={{color:'red'}}><i class="fa-solid fa-arrow-left mr-2"></i>Quay lại</div>

                        <h4 className="card-title">{isActionADD === true ? 'Thêm mới gói bài viết' : 'Cập nhật gói bài viết'}</h4>
                        <br></br>
                        <form className="form-sample">

                            <div className="row">
                                <div className="col-md-8">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Tên gói bài viết</label>
                                        <div className="col-sm-8">
                                            <input type="text" value={inputValues.name} name="name" onChange={(event) => handleOnChange(event)} className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Giá trị</label>
                                        <div className="col-sm-3">
                                            <input type="number" value={inputValues.value} name="value" onChange={(event) => handleOnChange(event)} className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">{'Giá tiền (USD)'}</label>
                                        <div className="col-sm-3">
                                            <input type="number" value={inputValues.price} name="price" onChange={(event) => handleOnChange(event)} className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="col-md-8">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Loại bài viết</label>
                                        <div className="col-sm-5">
                                            <select style={{ color: "black" }} className="form-control" value={inputValues.isHot} name="isHot" onChange={(event) => handleOnChange(event)}>
                                                <option value={0}>Bình thường</option>
                                                <option value={1}>Nổi bật</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button type="button" className="btn1 btn1-primary1 btn1-icon-text" onClick={() => handleSavePackagePost()}>
                                <i class="ti-file btn1-icon-prepend"></i>
                                Lưu
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            {isLoading &&
                <Modal isOpen='true' centered contentClassName='closeBorder' >

                    <div style={{
                        position: 'absolute', right: '50%',
                        justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Spinner animation="border"  ></Spinner>
                    </div>

                </Modal>
            }
        </div>
    )
}

export default AddpackagePost
