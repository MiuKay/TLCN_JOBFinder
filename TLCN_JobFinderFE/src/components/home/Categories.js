import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getListJobTypeAndCountPost } from '../../service/userService'
import Category from './Category'

const Categories = () => {
    const [allCategory, setAllCategory] = useState([])
    useEffect(async () => {
        let res = await getListJobTypeAndCountPost(
            {
                limit: 4,
                offset: 0
            }
        )
        if (res.errCode === 0)
            setAllCategory(res.data)
        else
            toast.error(res.message)
    }, [])
    return (
        <>
            <div class="row d-flex justify-contnet-center">
                {
                    allCategory.map((data, index) => {
                        return <Category data={data} key={index} />
                    })
                }

            </div>
        </>
    )
}

export default Categories
