import React from 'react'
import moment from 'moment';
const Job = (props) => {
    const handleSplitTime = (time) => {
        return moment(new Date(+time)).fromNow();
    }
    return (
        <>
            <div class="job-items">
                <div class="company-img">
                    <a href="#"><img src={props.data.userPostData.userCompanyData.thumbnail} alt="" style={{ width: "85px", height: "85px" }} /></a>
                </div>
                <div class="job-tittle job-tittle2">
                    <a href="#">
                        <h5>{props.data.postDetailData.name}</h5>
                    </a>
                    <ul className='my-font'>
                        <li>{props.data.postDetailData.jobLevelPostData.value}</li>
                        <li><i class="fas fa-map-marker-alt"></i>{props.data.postDetailData.provincePostData.value}</li>
                        <li>{props.data.postDetailData.salaryTypePostData.value}</li>
                    </ul>
                </div>
            </div>
            <div class="items-link items-link2 f-right">
                <a className='my-font' href="job_details.html">{props.data.postDetailData.workTypePostData.value}</a>
                <span style={{ position: 'absolute', right: '70px' }}>{handleSplitTime(props.data.timePost)}</span>
            </div>

        </>
    )
}

export default Job
