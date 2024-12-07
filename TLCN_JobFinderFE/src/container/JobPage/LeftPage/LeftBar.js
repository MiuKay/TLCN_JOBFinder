import React, { useState } from 'react'
import { useFetchAllcode } from '../../../util/fetch'
const LeftBar = (props) => {
    const { data: dataJobType } = useFetchAllcode('JOBTYPE')
    const { data: dataJobLevel } = useFetchAllcode('JOBLEVEL')
    const { data: dataSalaryType } = useFetchAllcode('SALARYTYPE')
    const { data: dataExpType } = useFetchAllcode('EXPTYPE')
    const { data: dataWorkType } = useFetchAllcode('WORKTYPE')
    const { data: dataJobLocation } = useFetchAllcode('PROVINCE')

    const [check, setCheck] = useState()
    return (
        <>
            <div className="job-category-listing mb-50">
                {/* <!-- single one --> */}
                <div className="single-listing">
                    <div className="small-section-tittle2">
                        <h4>Lĩnh vực</h4>
                    </div>
                    {/* <!-- Select job items start --> */}
                    <div className="select-job-items2">
                        <select name="select" onChange={(e) => {
                            props.recieveJobType(e.target.value)
                        }}>
                            <option value="">Tất cả</option>
                            {dataJobType.map((data, index) => {
                                return (
                                    <option value={data.code} key={index}>{data.value}</option>
                                )
                            })}
                        </select>
                    </div>
                    {/* <!--  Select job items End--> */}
                    {/* <!-- select-Categories start --> */}
                    <div className="select-Categories pt-80 pb-50">
                        <div className="small-section-tittle2">
                            <h4>Hình thức làm việc</h4>
                        </div>
                        {dataWorkType.map((data, index) => {
                            return (
                                <label className="container" key={index}>{data.value}
                                    <input type="checkbox" value={data.code} onChange={(e) => {

                                        props.worktype(e.target.value)
                                    }} required />
                                    <span className="checkmark"></span>
                                </label>
                            )
                        })}
                    </div>
                    {/* <!-- select-Categories End --> */}
                </div>
                {/* <!-- single two --> */}
                <div className="single-listing">
                    <div className="small-section-tittle2">
                        <h4>Vị trí</h4>
                    </div>
                    {/* <!-- Select job items start --> */}
                    <div className="select-job-items2">
                        <select name="select" onChange={(e) => {
                            props.recieveLocation(e.target.value);
                        }}>
                            <option value="">Tất cả</option>
                            {dataJobLocation.map((data, index) => {
                                return (
                                    <option value={data.code} key={index}>{data.value}</option>
                                )
                            })}
                        </select>
                    </div>
                    {/* <!--  Select job items End--> */}
                    {/* <!-- select-Categories start --> */}
                    <div className="select-Categories pt-80 pb-50">
                        <div className="small-section-tittle2">
                            <h4>Kinh nghiệm làm việc</h4>
                        </div>
                        {dataExpType.map((data, index) => {
                            return (
                                <label className="container" key={index}>{data.value}
                                    <input type="checkbox" value={data.code} onChange={(e) => props.recieveExp(e.target.value)} />
                                    <span className="checkmark"></span>
                                </label>
                            )
                        })}
                    </div>
                    {/* <!-- select-Categories End --> */}
                </div>
                {/* <!-- single three --> */}
                <div className="single-listing">
                    {/* <!-- select-Categories start --> */}
                    <div className="select-Categories pb-50">
                        <div className="small-section-tittle2">
                            <h4>Cấp bậc</h4>
                        </div>
                        {dataJobLevel.map((data, index) => {
                            return (
                                <label className="container" key={index}>{data.value}
                                    <input type="checkbox" value={data.code} onChange={(e) => {
                                        props.recieveJobLevel(e.target.value)
                                    }} />
                                    <span className="checkmark"></span>
                                </label>
                            )
                        })}
                    </div>
                    {/* <!-- select-Categories End --> */}
                    <div className="single-listing">
                        {/* <!-- select-Categories start --> */}
                        <div className="select-Categories pb-50">
                            <div className="small-section-tittle2">
                                <h4>Lương bổng</h4>
                            </div>
                            {dataSalaryType.map((data, index) => {
                                return (
                                    <label className="container" key={index}>{data.value}
                                        <input type="checkbox" value={data.code} onChange={(e) => {
                                            props.recieveSalary(e.target.value)

                                        }}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LeftBar

