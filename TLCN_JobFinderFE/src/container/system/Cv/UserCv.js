import React from 'react'
import { useEffect, useState } from 'react';
import { getDetailCvService } from '../../../service/cvService';


import { Link, useHistory } from 'react-router-dom';
import { useParams } from "react-router-dom";


const UserCv = () => {
    const user = JSON.parse(localStorage.getItem("userData"))
    const { id } = useParams();
    const [dataCV, setdataCV] = useState({
        userCvData: {
            firstName: '',
            lastName: ''
        },
        file: {
            data: ''
        }
    });
    useEffect(() => {
        if (id) {
            let fetchCV = async () => {
                let res = await getDetailCvService(id,user.roleCode)
                if (res && res.errCode === 0) {
                    setdataCV(res.data)
                }
            }
            fetchCV()

        }


    }, [])


    const history = useHistory()

    return (

        <div>

            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                    <div onClick={() => history.goBack()} className='mb-2 hover-pointer' style={{ color: 'red' }}><i class="fa-solid fa-arrow-left mr-2"></i>Quay lại</div>
                        <h4 className="card-title">Giới thiệu bản thân</h4>
                        <blockquote class="blockquote blockquote-primary">
                            <p>{dataCV.description}</p>
                            <footer class="blockquote-footer"><cite title="Source Title">{dataCV.userCvData.firstName + " " + dataCV.userCvData.lastName}</cite></footer>
                        </blockquote>

                    </div>
                    <div className="card-body">
                        <h4 className="card-title">FILE CV</h4>
                        <iframe width={'100%'} height={'700px'} src={dataCV.file}></iframe>
                    </div>
                </div>

            </div>



        </div>
    )
}

export default UserCv
