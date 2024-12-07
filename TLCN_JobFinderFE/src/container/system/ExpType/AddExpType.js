import React from 'react'
import { useEffect, useState } from 'react';
import { createAllCodeService, getDetailAllcodeByCode, UpdateAllcodeService } from '../../../service/userService';
import { toast } from 'react-toastify';
import { useHistory, useParams } from "react-router-dom";
import { Spinner, Modal } from 'reactstrap'
import '../../../components/modal/modal.css'
import CommonUtils from '../../../util/CommonUtils';

const AddExpType = () => {


    const [isActionADD, setisActionADD] = useState(true)
    const [isLoading, setIsLoading] = useState(false)


    const { id } = useParams();

    const [inputValues, setInputValues] = useState({
        value: '', code: ''
    });

    useEffect(() => {

        if (id) {
            let fetchDetailExpType = async () => {
                setisActionADD(false)
                let allcode = await getDetailAllcodeByCode(id)
                if (allcode && allcode.errCode === 0) {
                    setInputValues({ ...inputValues, ["value"]: allcode.data.value, ["code"]: allcode.data.code })
                }
            }
            fetchDetailExpType()
        }
    }, [])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setInputValues({
                ...inputValues,
                value: CommonUtils.removeSpace(inputValues.value)
            })
        }, 50)
    
        return () => clearTimeout(delayDebounceFn)
      }, [inputValues.value])

    const handleOnChange = event => {
        const { name, value } = event.target;
        if (name === 'value') {
            setInputValues({
                ...inputValues,
                value: value,
                code: isActionADD ? CommonUtils.replaceCode(value) : inputValues.code
            })
        }
        else {
            setInputValues({ ...inputValues, [name]: value });
        }

    };

    let handleSaveExpType = async () => {
        setIsLoading(true)
        if (isActionADD === true) {
            let res = await createAllCodeService({
                value: inputValues.value,
                code: inputValues.code,
                type: 'EXPTYPE',

            })
            setTimeout(() => {
                setIsLoading(false)
                if (res && res.errCode === 0) {
                    toast.success("Thêm khoảng kinh nghiệm thành công")
                    setInputValues({
                        ...inputValues,
                        ["value"]: '',
                        ["code"]: '',
                    })
                }
                else if (res && res.errCode === 2) {
                    toast.error(res.errMessage)
                }
                else toast.error("Thêm khoảng kinh nghiệm thất bại")
            }, 50);
        } else {
            let res = await UpdateAllcodeService({
                value: inputValues.value,
                code: id,
            })
            setTimeout(() => {
                setIsLoading(false)
                if (res && res.errCode === 0) {
                    toast.success("Cập nhật khoảng kinh nghiệm thành công")

                }
                else if (res && res.errCode === 2) {
                    toast.error(res.errMessage)
                }
                else toast.error("Cập nhật khoảng kinh nghiệm thất bại")
            }, 50);
        }
    }
    const history = useHistory()
    return (
        <div className=''>
            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                    <div onClick={()=> history.goBack()} className='mb-2 hover-pointer' style={{color:'red'}}><i class="fa-solid fa-arrow-left mr-2"></i>Quay lại</div>

                        <h4 className="card-title">{isActionADD === true ? 'Thêm mới khoảng kinh nghiệm làm việc' : 'Cập nhật khoảng kinh nghiệm làm việc'}</h4>
                        <br></br>
                        <form className="form-sample">

                            <div className="row">
                                <div className="col-md-8">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Tên khoảng kinh nghiệm</label>
                                        <div className="col-sm-9">
                                            <input type="text" value={inputValues.value} name="value" onChange={(event) => handleOnChange(event)} className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Mã code</label>
                                        <div className="col-sm-9">
                                            <input disabled={true} type="text" value={inputValues.code} name="code" onChange={(event) => handleOnChange(event)} className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button type="button" className="btn1 btn1-primary1 btn1-icon-text" onClick={() => handleSaveExpType()}>
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

export default AddExpType
