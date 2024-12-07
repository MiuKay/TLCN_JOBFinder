import React from 'react'
import { useEffect, useState } from 'react';
import { DeleteAllcodeService, getListAllCodeService } from '../../../service/userService';
import moment from 'moment';
import { PAGINATION } from '../../../util/constant';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CommonUtils from '../../../util/CommonUtils';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import {Input, Modal} from 'antd'
const {confirm} = Modal

const ManageExpType = () => {
    const [dataExpType, setdataExpType] = useState([])
    const [count, setCount] = useState('')
    const [numberPage, setnumberPage] = useState('')
    const [search,setSearch] = useState('')

    useEffect(() => {
        try {
            let fetchData = async () => {
                let arrData = await getListAllCodeService({

                    type: 'EXPTYPE',
                    limit: PAGINATION.pagerow,
                    offset: 0,
                    search: CommonUtils.removeSpace(search)

                })
                if (arrData && arrData.errCode === 0) {
                    setdataExpType(arrData.data)
                    setnumberPage(0)
                    setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
                }
            }
            fetchData();
        } catch (error) {
            console.log(error)
        }

    }, [search])
    let handleDeleteExpType = async (code) => {
        let res = await DeleteAllcodeService(code)
        if (res && res.errCode === 0) {
            toast.success(res.errMessage)
            let arrData = await getListAllCodeService({

                type: 'EXPTYPE',
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow,
                search: CommonUtils.removeSpace(search)


            })
            if (arrData && arrData.errCode === 0) {
                setdataExpType(arrData.data)
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
            }

        } else toast.error(res.errMessage)
    }
    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
        let arrData = await getListAllCodeService({

            type: 'EXPTYPE',
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
            search: CommonUtils.removeSpace(search)


        })
        if (arrData && arrData.errCode === 0) {
            setdataExpType(arrData.data)

        }
    }
    const handleSearch = (value) => {
        setSearch(value)
    }
    const confirmDelete = (id) => {
        confirm({
            title: 'Bạn có chắc muốn xóa khoảng kinh nghiệm này?',
            icon: <ExclamationCircleOutlined />,    
            onOk() {
                handleDeleteExpType(id)
            },
        
            onCancel() {
            },
          });
    }
    return (
        <div>
            <div className="col-12 grid-margin">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Danh sách khoảng kinh nghiệm làm việc</h4>
                        <Input.Search onSearch={handleSearch} className='mt-5 mb-5' placeholder="Nhập tên công việc" allowClear enterButton="Tìm kiếm">
                                    
                                    </Input.Search>
                        <div className="table-responsive pt-2">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>
                                            STT
                                        </th>
                                        <th>
                                            Tên khoảng kinh nghiệm
                                        </th>
                                        <th>
                                            Mã code
                                        </th>

                                        <th>
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataExpType && dataExpType.length > 0 &&
                                        dataExpType.map((item, index) => {

                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1 + numberPage * PAGINATION.pagerow}</td>
                                                    <td>{item.value}</td>
                                                    <td>{item.code}</td>
                                                    <td>
                                                        <Link style={{ color: '#4B49AC' }} to={`/admin/edit-exp-type/${item.code}/`}>Sửa</Link>
                                                        &nbsp; &nbsp;
                                                        <a style={{ color: '#4B49AC' }} href="#" onClick={(event) => confirmDelete(item.code)} >Xóa</a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>
                            {
                                            dataExpType && dataExpType.length == 0 && (
                                                <div style={{ textAlign: 'center' }}>

                                                    Không có dữ liệu

                                                </div>
                                            )
                                        }
                        </div>
                    </div>
                    <ReactPaginate
                    forcePage={numberPage}
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

export default ManageExpType
