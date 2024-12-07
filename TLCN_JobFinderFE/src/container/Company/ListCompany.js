import React from 'react'
import { getListCompany } from '../../service/userService';
import './ListCompany.scss';
import { useEffect, useState } from 'react';
import {Input} from 'antd'
import ReactPaginate from 'react-paginate';
import { Link } from 'react-router-dom';
import CommonUtils from '../../util/CommonUtils';
const ListCompany = () => {
    const [dataCompany, setdataCompany] = useState([])
    const [count, setCount] = useState('')
    const [countData,setCountData] = useState(0)
    const [numberPage, setnumberPage] = useState('')
    const [search,setSearch] = useState('')
    const handleSearch = (value) => {
        setSearch(value)
    }
    let fetchData = async () => {
        let arrData = await getListCompany({
            limit: 6,
            offset: 0,
            search: CommonUtils.removeSpace(search)
        })
        if (arrData && arrData.errCode === 0) {
            setdataCompany(arrData.data)
            setCount(Math.ceil(arrData.count / 6))
            setCountData(arrData.count)
        }
    }
    useEffect(() => {
        try {
            fetchData();
            setnumberPage(0)
        } catch (error) {
            console.log(error)
        }

    }, [search])
    let handleChangePage = async (number) => {
        setnumberPage(number.selected)
        let arrData = await getListCompany({
            limit: 6,
            offset: number.selected * 6,
            search : CommonUtils.removeSpace(search)
        })
        if (arrData && arrData.errCode === 0) {
            setdataCompany(arrData.data)
            setCountData(arrData.count)
        }
    }
    return (
        <div className='container-company'>
            <h3 className='title'>DANH SÁCH CÁC CÔNG TY</h3>
            <div className='row list-company'>

            <span>{countData} công ty được tìm thấy</span>
                                    <Input.Search onSearch={handleSearch} className='mt-5 mb-5' placeholder="Nhập tên công ty" allowClear enterButton="Tìm kiếm">
                                    
                                    </Input.Search>
                {dataCompany && dataCompany.length > 0 &&
                    dataCompany.map((item, index) => {
                        return (
                            <div key={index} className='col-md-4 col-sm-6 '>
                                <div className='box-item-company'>
                                    <div className='company-banner'>
                                        <Link to={`/detail-company/${item.id}`}>
                                            <div className='cover-wrapper'>
                                                <img src={item.coverimage}></img>
                                            </div>
                                        </Link>
                                        <div className='company-logo'>
                                            <Link to={`/detail-company/${item.id}`}>
                                                <img class="img-fluid" src={item.thumbnail} alt="Công ty Cổ phần Tập đoàn Hoa Sen" />
                                            </Link>
                                        </div>
                                    </div>
                                    <div class="company-info">
                                        <h3>
                                            <Link to={`/detail-company/${item.id}`} class="company-name" >{item.name}</Link>
                                        </h3>
                                        <div class="company-description">
                                            <p dangerouslySetInnerHTML={{ __html: item.descriptionHTML }}></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }


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

    )
}

export default ListCompany
