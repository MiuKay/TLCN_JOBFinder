import React from 'react'
import { useEffect, useState } from 'react';
import { DeleteSkillService, getListSkill } from '../../../service/userService';
import { PAGINATION } from '../../../util/constant';
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-image-lightbox/style.css';
import CommonUtils from '../../../util/CommonUtils';
import {Input, Modal, Row, Col, Select} from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { useFetchAllcode } from '../../../util/fetch';
const {confirm} = Modal

const ManageJobSkill = () => {
    const [dataJobSkill, setdataJobSkill] = useState([])
    const [count, setCount] = useState('')
    const [numberPage, setnumberPage] = useState('')
    const [search,setSearch] = useState('')
    const [categoryJobCode,setCategoryJobCode] = useState('')
    useEffect(() => {
        try {
            let fetchData = async () => {
                let arrData = await getListSkill({
                    categoryJobCode: categoryJobCode,
                    limit: PAGINATION.pagerow,
                    offset: 0,
                    search: CommonUtils.removeSpace(search)
                })
                if (arrData && arrData.errCode === 0) {
                    setnumberPage(0)
                    setdataJobSkill(arrData.data)
                    setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
                }
            }
            fetchData();
        } catch (error) {
            console.log(error)
        }

    }, [search,categoryJobCode])

    let { data: listCategoryJobCode } = useFetchAllcode('JOBTYPE');
    listCategoryJobCode = listCategoryJobCode.map(item=> ({
        value: item.code,
        label: item.value
    }))
    listCategoryJobCode.unshift({
        value: '',
        label: 'Tất cả'
    })

    let handleDeleteJobSkill = async (id) => {
        let res = await DeleteSkillService(id)
        if (res && res.errCode === 0) {
            toast.success(res.errMessage)
            let arrData = await getListSkill({
                categoryJobCode: '',
                limit: PAGINATION.pagerow,
                offset: numberPage * PAGINATION.pagerow,
                search: CommonUtils.removeSpace(search)
            })
            if (arrData && arrData.errCode === 0) {
                setdataJobSkill(arrData.data)
                setCount(Math.ceil(arrData.count / PAGINATION.pagerow))
            }

        } else toast.error(res.errMessage)
    }
    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
        let arrData = await getListSkill({

            categoryJobCode: categoryJobCode,
            limit: PAGINATION.pagerow,
            offset: number.selected * PAGINATION.pagerow,
            search: CommonUtils.removeSpace(search)

        })
        if (arrData && arrData.errCode === 0) {
            setdataJobSkill(arrData.data)

        }
    }
    let handleOnChangeCategoryJobCode = async(value) => {
        setCategoryJobCode(value)
    }
    const handleSearch = (value) => {
        setSearch(value)
    }
    const confirmDelete = (id) => {
        confirm({
            title: 'Bạn có chắc muốn xóa kĩ năng này?',
            icon: <ExclamationCircleOutlined />,    
            onOk() {
                handleDeleteJobSkill(id)
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
                        <h4 className="card-title">Danh sách các kĩ năng</h4>
                        <Row justify='space-around' className='mt-5 mb-5'>
                            <Col xs={12} xxl={12}>
                        <Input.Search  onSearch={handleSearch} placeholder="Nhập tên kĩ năng " allowClear enterButton="Tìm kiếm">
                        </Input.Search>
                            </Col>
                            <Col xs={8} xxl={8}>
                                <label className='mr-2'>Loại trạng thái: </label>
                                <Select onChange={(value)=> handleOnChangeCategoryJobCode(value)} defaultValue={listCategoryJobCode[0]} style={{width:'50%'}} size='default' options={listCategoryJobCode ? listCategoryJobCode : []}>
                                    
                                </Select>
                            </Col>

                        </Row>
                        <div className="table-responsive pt-2">
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>
                                            STT
                                        </th>
                                        <th>
                                            Tên kỹ năng
                                        </th>
                                        <th>
                                            Lĩnh vực
                                        </th>
                                        <th>
                                            Thao tác
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dataJobSkill && dataJobSkill.length > 0 &&
                                        dataJobSkill.map((item, index) => {

                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1 + numberPage * PAGINATION.pagerow}</td>
                                                    <td>{item.name}</td>
                                                    <td>{item.jobTypeSkillData.value}</td>
                                                    <td>
                                                        <Link style={{ color: '#4B49AC' }} to={`/admin/edit-job-skill/${item.id}/`}>Sửa</Link>
                                                        &nbsp; &nbsp;
                                                        <a style={{ color: '#4B49AC' }} href="#" onClick={(event) => confirmDelete(item.id)} >Xóa</a>
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }

                                </tbody>
                            </table>
                            {
                                            dataJobSkill && dataJobSkill.length == 0 && (
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

export default ManageJobSkill
