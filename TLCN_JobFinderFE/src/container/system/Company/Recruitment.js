import React from 'react'
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { RecruitmentService } from '../../../service/userService';
const Recruitment = () => {

    const [inputValues, setInputValues] = useState({
        phonenumber: ''
    });

    const [user, setUser] = useState({})
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUser(userData)
    }, [])

    const handleOnChange = event => {
        const { name, value } = event.target;
        setInputValues({ ...inputValues, [name]: value });

    };
    let handleSubmit = async () => {
        let res = await RecruitmentService({
            phonenumber: inputValues.phonenumber,
            companyId: user.companyId
        })
        if (res && res.errCode === 0) {
            toast.success("Tuyển dụng thành công !");
            setInputValues({
                ...inputValues,
                ["phonenumber"]: ''
            })
        } else {
            toast.error(res.errMessage)
        }
    }
    return (
        <div className=''>
            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Tuyển dụng nhân viên</h4>
                        <br></br>
                        <form className="form-sample">

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Số điện thoại</label>
                                        <div className="col-sm-9">
                                            <input type="text" value={inputValues.phonenumber} name="phonenumber" onChange={(event) => handleOnChange(event)} className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button onClick={() => handleSubmit()} type="button" className="btn1 btn1-primary1 btn1-icon-text" >
                                <i class="ti-file btn1-icon-prepend"></i>
                                Gửi
                            </button>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Recruitment
