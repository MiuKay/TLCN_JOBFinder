import React from 'react'
import { useEffect, useState } from 'react';
import { getAllListCvByUserIdService } from '../../service/cvService';

import { PAGINATION } from '../../util/constant';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { useParams } from "react-router-dom";
import moment from 'moment';


const ManageCvCandidate = (props) => {
    const [dataCv, setdataCv] = useState([])
    const [count, setCount] = useState('')
    const [numberPage, setnumberPage] = useState('')
    const [user, setUser] = useState({})
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setUser(userData)
        if (userData) {
            try {
                let fetchData = async () => {
                    let arrData = await getAllListCvByUserIdService({
                        limit: PAGINATION.pagerow,
                        offset: 0,
                        userId: userData.id
                    })
                    if (arrData && arrData.errCode === 0) {
                        setdataCv(arrData.data)
                        setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
                    }
                }
                fetchData();
            } catch (error) {
                console.log(error)
            }
        }


    }, [])

    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
        let arrData = await getAllListCvByUserIdService({


            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
            userId: user.id

        })
        if (arrData && arrData.errCode === 0) {
            setdataCv(arrData.data)

        }
    }

    return (

        <div>

            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Danh sách Công Việc Đã Nộp</h4>

                        <div className="table-responsive pt-2">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>
                                            STT
                                        </th>
                                        <th>
                                            Tên công việc
                                        </th>
                                        <th>
                                            Ngành
                                        </th>
                                        <th>
                                            Chức vụ
                                        </th>
                                        <th>
                                            Địa chỉ
                                        </th>
                                        <th>
                                            Thời gian nộp
                                        </th>
                                        <th>
                                            Trạng thái
                                        </th>
                                        <th>
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataCv && dataCv.length > 0 &&
                                        dataCv.map((item, index) => {

                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1 + numberPage * PAGINATION.pagerow}</td>
                                                    <td>{item.postCvData.postDetailData.name}</td>
                                                    <td>{item.postCvData.postDetailData.jobTypePostData.value}</td>
                                                    <td>{item.postCvData.postDetailData.jobLevelPostData.value}</td>
                                                    <td>{item.postCvData.postDetailData.provincePostData.value}</td>
                                                    <td>{moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss')}</td>
                                                    <td>{item.isChecked === 0 ? 'Chưa xem' : 'Đã xem'}</td>
                                                    <td>
                                                        <Link style={{ color: '#4B49AC', cursor: 'pointer' }} to={`/detail-job/${item.postCvData.id}/`}>Xem công việc</Link>
                                                        &nbsp; &nbsp;
                                                        <Link style={{ color: '#4B49AC', cursor: 'pointer' }} to={`/candidate/cv-detail/${item.id}`}>Xem CV đã nộp</Link>
                                                        &nbsp; &nbsp;
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <ReactPaginate
                        previousLabel={'Quay lại'}
                        nextLabel={'Tiếp'}
                        breakLabel={'...'}
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
    )
}

export default ManageCvCandidate
