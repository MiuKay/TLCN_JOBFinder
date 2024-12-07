import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {paymentOrderSuccessService} from '../../../service/userService'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect,
    useParams,
    useLocation,
    useHistory
} from "react-router-dom";


function useQuery() {
    const { search } = useLocation();
    
    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

function PaymentSuccess(props) {
    let query = useQuery();
    const [message, setMessage] = useState("Đang xử lý")
    useEffect(() => {
        let orderData =  JSON.parse(localStorage.getItem("orderData"))
        if(orderData){
            orderData.paymentId = query.get("paymentId")
            orderData.token = query.get("token")
            orderData.PayerID = query.get("PayerID")
            createNewOrder(orderData)
        }
        else {
            setMessage("Thông tin đơn hàng không hợp lệ")
        }
    }, [])
    let createNewOrder = async (data) =>{
        let res = await paymentOrderSuccessService(data)
        if(res && res.errCode == 0){
            toast.success(res.errMessage)
            localStorage.removeItem("orderData")
            setMessage("Chúc mừng bạn đã mua lượt đăng bài thành công")
        }else{
            toast.error(res.errMessage)
        }
    }
    const history = useHistory()
    return (

        <div style={{height:'50vh',textAlign:'center'}}> 
           {message}
           {message === 'Chúc mừng bạn đã mua lượt đăng bài thành công' && <div className='mt-5'><button onClick={() => history.push("/admin/add-post") } style={{backgroundColor: "green"}}>Đăng bài ngay</button></div>}
        </div>

    );
}

export default PaymentSuccess;
