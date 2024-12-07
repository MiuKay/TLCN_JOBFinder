import React from "react";

const Category = (props) => {
  return (
    <>
      <div class="col-xl-3 col-lg-3 col-md-4 col-sm-6">
        <div class="single-services text-center mb-30">
          <div class="services-ion">
            <img
              style={{ width: "70%", height: "70%" }}
              src={props.data.postDetailData.jobTypePostData.image}
            ></img>
          </div>
          <div class="services-cap">
            {/* <h5><a href="job_listing.html">{props.data.postDetailData.jobTypePostData.value}</a></h5> */}
            <h5>{props.data.postDetailData.jobTypePostData.value}</h5>
            <span>{props.data.amount}</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Category;
