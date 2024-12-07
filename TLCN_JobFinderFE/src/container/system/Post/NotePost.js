import React from 'react'
import { useEffect, useState } from 'react';
import { getListNoteByPost } from '../../../service/userService';
import moment from 'moment';
import { PAGINATION } from '../../../util/constant';
import ReactPaginate from 'react-paginate';
import { Link, useHistory } from 'react-router-dom';
import { useParams } from "react-router-dom";


const NotePost = () => {
    const user = JSON.parse(localStorage.getItem("userData"))
    const [dataNotePost, setdataNotePost] = useState([])
    const [count, setCount] = useState('')
    const [numberPage, setnumberPage] = useState('')
    const { id } = useParams();
    useEffect(() => {
        if (id) {
            try {
                let fetchData = async () => {
                    let arrData = await getListNoteByPost({
                        limit: PAGINATION.pagerow,
                        offset: 0,
                        id: id
                    })
                    if (arrData && arrData.errCode === 0) {
                        setdataNotePost(arrData.data)
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
        let arrData = await getListNoteByPost({


            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
            id: id

        })
        if (arrData && arrData.errCode === 0) {
            setdataNotePost(arrData.data)

        }
    }
    const history = useHistory()
    return (

        <div>

            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                    <div onClick={()=> history.goBack()} className='mb-2 hover-pointer' style={{color:'red'}}><i class="fa-solid fa-arrow-left mr-2"></i>Quay lại</div>

                        <h4 className="card-title">Thông tin chi tiết các ghi chú bài viết</h4>

                        <div className="table-responsive pt-2">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>
                                            STT
                                        </th>
                                        <th>
                                            Tên người ghi nhận
                                        </th>
                                        <th>
                                            Mã người ghi nhận
                                        </th>
                                        <th>
                                            Nội dung
                                        </th>
                                        <th>
                                            Thời gian ghi nhận
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataNotePost && dataNotePost.length > 0 &&
                                        dataNotePost.map((item, index) => {

                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1 + numberPage * PAGINATION.pagerow}</td>
                                                    <td>{item.userNoteData.firstName + " " + item.userNoteData.lastName}</td>
                                                    <td>{item.userNoteData.id}</td>
                                                    <td>{item.note}</td>                                                
                                                    <td>{moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss')}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                </tbody>
                            </table>
                                    { dataNotePost && dataNotePost.length==0 && <div style={{textAlign:'center'}}>Không có dữ liệu</div> }    
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

export default NotePost
