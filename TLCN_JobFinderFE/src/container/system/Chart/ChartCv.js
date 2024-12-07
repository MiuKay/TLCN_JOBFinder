import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { getSumByYearCv } from "../../../service/userService";
import Chart from "chart.js/auto";
import { Col, Row, Select } from "antd";
function ChartCv() {
  const [valueYear, setValueYear] = useState(new Date().getFullYear());
  const options = {
    legend: { display: false },
    title: {
      display: true,
      text: "Chart CV",
    },
  };
  const yearOptions = [
    {
      value: 2024,
      label: "2024",
    },
    {
      value: 2023,
      label: "2023",
    },
    {
      value: 2022,
      label: "2022",
    },
  ];
  const defaultMonthModel = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
  };
  const labelsMonth = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const [data, setData] = useState({
    labels: labelsMonth,
    datasets: [],
  });

  let getData = async () => {
    let res = await getSumByYearCv(valueYear);
    if (res.errCode === 0) {
      let monthModel = { ...defaultMonthModel };
      res.data.forEach((item) => {
        monthModel[item.month] = item.total;
      });
      let newData = [];
      for (let key in monthModel) {
        newData.push(monthModel[key]);
      }
      setData({
        labels: labelsMonth,
        datasets: [
          {
            label: "USD",
            data: newData,
          },
        ],
      });
    }
  };
  let handleOnChange = (value) => {
    setValueYear(value);
  };
  useEffect(() => {
    getData();
  }, [valueYear]);
  return (
    <div className="col-12 grid-margin">
      <div className="card">
        <div className="card-body">
          <h4 className="card-title">Đồ thị doanh thu các gói xem ứng viên</h4>
          <Row>
            <Col xs={12} xxl={12}>
              <Select
                onChange={(value) => handleOnChange(value)}
                style={{ width: "50%" }}
                size="default"
                defaultValue={valueYear}
                options={yearOptions}
              ></Select>
            </Col>
          </Row>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default ChartCv;
