import React from 'react'
import { useEffect, useState } from 'react';
import { handleChangePassword } from '../../../service/userService';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
const ChangePassword = (props) => {
    const [inputValues, setInputValues] = useState({
        password: '', oldPassword: '', confirmPassword: ''
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
    let handleSave = async () => {
        if (inputValues.password !== inputValues.confirmPassword) {
            toast.error("Mật khẩu nhập lại không đúng")
            return
        }
        let res = await handleChangePassword({
            id: user.id,
            oldpassword: inputValues.oldPassword,
            password: inputValues.password
        })
        if (res && res.errCode === 0) {
            toast.success("Đổi mật khẩu thành công")
            setInputValues({
                ...inputValues,
                ["oldPassword"]: '',
                ["password"]: '',
                ["confirmPassword"]: ''
            })
        } else {
            toast.error(res.errMessage)
        }
    }
    return (
        <div>
            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Đổi mật khẩu</h4>
                        <form className="form-sample">

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Mật khẩu cũ</label>
                                        <div className="col-sm-8">
                                            <input type="password" value={inputValues.oldPassword} name="oldPassword" onChange={(event) => handleOnChange(event)} className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Mật khẩu mới</label>
                                        <div className="col-sm-8">
                                            <input type="password" value={inputValues.password} name="password" onChange={(event) => handleOnChange(event)} className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-4 col-form-label">Nhập lại mật khẩu</label>
                                        <div className="col-sm-8">
                                            <input type="password" value={inputValues.confirmPassword} name="confirmPassword" onChange={(event) => handleOnChange(event)} className="form-control" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => handleSave()} type="button" className="btn1 btn1-primary1 btn1-icon-text" >
                                <i class="ti-file btn1-icon-prepend"></i>
                                Lưu
                            </button>
                        </form>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default ChangePassword
