import React from 'react'
import { useEffect, useState } from 'react';
import { getDetailUserById, UpdateUserSettingService, getAllSkillByJobCode } from '../../../service/userService';
import { checkSeeCandiate } from '../../../service/cvService';

import { useFetchAllcode } from '../../../util/fetch';
import { toast } from 'react-toastify';
import 'react-image-lightbox/style.css';
import { Select } from 'antd'
import { useHistory, useParams } from "react-router-dom";

const DetailFilterUser = () => {
    const [listSkills,setListSkills] = useState([])
    const [inputValues, setInputValues] = useState({
        jobType: '', salary: '', skills: [], jobProvince: '', exp: '', file: ''
    });
    const { id } = useParams();
    let getListSkill = async(jobType) => {
        let res = await getAllSkillByJobCode(jobType)
        let listSkills =  res.data.map(item=>({
            value: item.id,
            label: item.name
        }))
        setListSkills(listSkills)
    }

    let setStateUser = (data) => {
        getListSkill(data.userAccountData.userSettingData.categoryJobCode)
        let listSkills = []
        if (Array.isArray(data.listSkills) && data.listSkills.length > 0) {
            listSkills = data.listSkills.map(item=>item.SkillId)
        }
        setInputValues({
            ...inputValues,
            jobType: data.userAccountData.userSettingData.categoryJobCode,
            salary: data.userAccountData.userSettingData.salaryJobCode,
            skills: listSkills,
            jobProvince: data.userAccountData.userSettingData.addressCode,
            exp: data.userAccountData.userSettingData.experienceJobCode,
            isFindJob: data.userAccountData.userSettingData.isFindJob,
            isTakeMail: data.userAccountData.userSettingData.isTakeMail,
            file: data.userAccountData.userSettingData.file
        })
    }
    useEffect(() => {
        if (id) {
            let fetchUser = async () => {
                let userData = JSON.parse(localStorage.getItem("userData"))
                let check = await checkSeeCandiate({
                    userId: userData.id,
                    companyId: userData.companyId
                })
                if (check.errCode ===0 ) {
                    let user = await getDetailUserById(id)
                    if (user && user.errCode === 0) {
                        setStateUser(user.data)
                    }
                } else {
                    toast.error(check.errMessage)
                    setTimeout(()=> {
                        history.push('/admin/list-candiate/')
                    },1000)
                }
            }
            fetchUser()
        }
    }, [])

    let { data: dataProvince } = useFetchAllcode('PROVINCE');
    let { data: dataExp } = useFetchAllcode('EXPTYPE')
    let { data: dataSalary} = useFetchAllcode('SALARYTYPE')
    let { data: dataJobType} = useFetchAllcode('JOBTYPE')


    dataProvince = dataProvince.map(item=>({
        value: item.code,
        label: item.value,
    }))

    dataExp = dataExp.map(item=>({
        value: item.code,
        label: item.value,
    }))

    dataSalary = dataSalary.map(item=>({
        value: item.code,
        label: item.value,
    }))

    dataJobType = dataJobType.map(item=>({
        value: item.code,
        label: item.value,
    }))
    const history = useHistory()
    return (
        <div className=''>
            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                    <div onClick={() => history.goBack()} className='mb-2 hover-pointer' style={{ color: 'red' }}><i class="fa-solid fa-arrow-left mr-2"></i>Quay lại</div>

                        <h4 className="card-title">Thông tin chi tiết ứng viên</h4>
                        <br></br>
                        <form className="form-sample">

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Lĩnh vực</label>
                                        <div className="col-sm-9 mt-3">
                                        <Select
                                                allowClear
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder="Chọn lĩnh vực"
                                                disabled
                                                options={dataJobType}
                                                value={inputValues.jobType}
                                            >
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Mức lương</label>
                                        <div className="col-sm-9 mt-3">
                                        <Select
                                                allowClear
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder="Chọn mức lương"
                                                disabled
                                                options={dataSalary}
                                                value={inputValues.salary}
                                            >
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row'>
                                <div className='col-md-12'>
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Kĩ năng</label>
                                        <div className="col-sm-9 mt-3" style={{ marginLeft: '-115px' }}>
                                            <Select
                                                disabled
                                                mode="multiple"
                                                allowClear
                                                style={{
                                                    width: 'calc(100% + 115px)',
                                                }}
                                                placeholder="Chọn kĩ năng của bạn"
                                                options={listSkills}
                                                value={inputValues.skills}
                                                
                                            >
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Khu vực làm việc</label>
                                        <div className="col-sm-9 mt-3">
                                            <Select
                                                allowClear
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder="Chọn nơi làm việc"
                                                disabled
                                                options={dataProvince}
                                                value={inputValues.jobProvince}
                                            >
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group row">
                                        <label className="col-sm-3 col-form-label">Kinh nghiệm làm việc</label>
                                        <div className="col-sm-9 mt-3">
                                        <Select
                                                allowClear
                                                style={{
                                                    width: '100%',
                                                }}
                                                placeholder="Chọn khoảng kinh nghiệm"
                                                disabled
                                                options={dataExp}
                                                value={inputValues.exp}
                                            >
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                inputValues.file &&
                                <div className="col-md-12">
                                    <div className="form-group row">
                                        
                                        <iframe width={'100%'} height={'700px'} src={inputValues.file}></iframe>
                                    </div>
                                </div>
                            }
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetailFilterUser
