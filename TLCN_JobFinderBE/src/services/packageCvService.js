import db from "../models/index";
const { Op, and } = require("sequelize");
import paypal, { order } from 'paypal-rest-sdk'
require('dotenv').config();
paypal.configure({
    'mode': 'sandbox',
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
});

let getAllPackage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.limit || !data.offset) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let objectFilter = {
                    offset: +data.offset,
                    limit: +data.limit
                }
                if (data.search) {
                    objectFilter.where = {name: {[Op.like]: `%${data.search}%`}}
                }
                let packageCvs = await db.PackageCv.findAndCountAll(objectFilter)
                resolve({
                    errCode: 0,
                    data: packageCvs.rows,
                    count: packageCvs.count
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getAllToSelect = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
                let packageCvs = await db.PackageCv.findAll()
                resolve({
                    errCode: 0,
                    data: packageCvs
                })
        } catch (error) {
            reject(error)
        }
    })
}

let getPackageById = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let packageCvs = await db.PackageCv.findOne({
                    where: { id: data.id }
                })
                if (packageCvs) {
                    resolve({
                        errCode: 0,
                        data: packageCvs
                    })
                }
                else {
                    resolve({
                        errCode: 0,
                        errMessage: 'Không tìm thấy dữ liệu gói sản phẩm'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}

let getPaymentLink = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.amount) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`

                })
            }
            else {
                let infoItem = await db.PackageCv.findOne({
                    where: { id: data.id }
                })
                let item = [{
                    "name": `${infoItem.name}`,
                    "sku": infoItem.id,
                    "price": infoItem.price,
                    "currency": "USD",
                    "quantity": data.amount
                }]

                let create_payment_json = {
                    "intent": "sale",
                    "payer": {
                        "payment_method": "paypal"
                    },
                    "redirect_urls": {
                        "return_url": `${process.env.URL_REACT}/admin/paymentCv/success`,
                        "cancel_url": `${process.env.URL_REACT}/admin/paymentCv/cancel`
                    },
                    "transactions": [{
                        "item_list": {
                            "items": item
                        },
                        "amount": {
                            "currency": "USD",
                            "total": +data.amount * infoItem.price
                        },
                        "description": "This is the payment description."
                    }]
                };

                paypal.payment.create(create_payment_json, function (error, payment) {
                    if (error) {
                        resolve({
                            errCode: -1,
                            errMessage: error,
                        })

                    } else {
                        resolve({
                            errCode: 0,
                            link: payment.links[1].href
                        })

                    }
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}

let paymentOrderSuccess = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.PayerID || !data.paymentId || !data.token || !data.packageCvId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameter !'
                })
            } else {
                let infoItem = await db.PackageCv.findOne({
                    where: { id: data.packageCvId }
                })
                let execute_payment_json = {
                    "payer_id": data.PayerID,
                    "transactions": [{
                        "amount": {
                            "currency": "USD",
                            "total": +data.amount * infoItem.price
                        }
                    }]
                };

                let paymentId = data.paymentId;

                paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
                    if (error) {
                        resolve({
                            errCode: 0,
                            errMessage: error
                        })
                    } else {
                        let OrderPackageCV = await db.OrderPackageCV.create({
                            packageCvId: data.packageCvId,
                            userId: data.userId,
                            currentPrice: infoItem.price,
                            amount: +data.amount
                        })
                        if (OrderPackageCV) {
                            let user = await db.User.findOne({
                                where: { id: data.userId },
                                attributes: {
                                    exclude: ['userId']
                                }
                            })
                            let company = await db.Company.findOne({
                                where: { id: user.companyId },
                                raw: false
                            })
                            if (company) {
                                company.allowCv += +infoItem.value * +data.amount
                                company.save({silent: true})
                            }
                        }
                        resolve({
                            errCode: 0,
                            errMessage: 'Hệ thống đã ghi nhận lịch sử mua của bạn'
                        })
                    }
                });
            }
        } catch (error) {
            reject(error)
        }
    })
}

let setActiveTypePackage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id || data.isActive === '') {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let packageCv = await db.PackageCv.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (!packageCv) {
                    resolve({
                        errCode: 2,
                        errMessage: `Gói sản phẩm không tồn tại`
                    })
                }
                else {
                    packageCv.isActive = data.isActive
                    await packageCv.save()
                    resolve({
                        errCode: 0,
                        errMessage: data.isActive == 0 ? `Gói sản phẩm đã ngừng kích hoạt` : `Gói sản phẩm đã hoạt động`
                    })

                }
            }

        } catch (error) {
            reject(error)
        }
    })
}

let creatNewPackageCv = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.price || !data.value) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let packageCv = await db.PackageCv.create({
                    name: data.name,
                    value: data.value,
                    price: data.price,
                    isActive: 1
                })
                if (packageCv) {
                    resolve({
                        errCode: 0,
                        errMessage: 'Tạo gói sản phẩm thành công'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Tạo gói sản phẩm thất bại'
                    })
                }
            }
        } catch (error) {
            if (error.message.includes('Validation error')) {
                resolve({
                    errCode: 2,
                    errMessage: 'Tên gói sản phẩm đã tồn tại'
                })
            }
            else {
                reject(error)
            }
        }
    })
}

let updatePackageCv = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.price || !data.value || !data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let packageCv = await db.PackageCv.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (packageCv) {
                    packageCv.name = data.name
                    packageCv.price = data.price
                    packageCv.value = data.value
                    await packageCv.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Cập nhật thành công'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Cập nhật thất bại'
                    })
                }
            }
        } catch (error) {
            if (error.message.includes('Validation error')) {
                resolve({
                    errCode: 2,
                    errMessage: 'Tên gói sản phẩm đã tồn tại'
                })
            }
            else {
                reject(error)
            }
        }
    })
}

let getStatisticalPackage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.fromDate || !data.toDate ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            }
            else {
                let filterListPackage = {}
                if (data.limit && data.offset) {
                    filterListPackage.limit = +data.limit
                    filterListPackage.offset = +data.offset
                }
                let listPackage = await db.PackageCv.findAndCountAll(filterListPackage)
                let listOrderPackage = await db.OrderPackageCV.findAll({
                    where: {
                        createdAt: { [Op.and]: [{ [Op.gte]: `${data.fromDate} 00:00:00` }, { [Op.lte]: `${data.toDate} 23:59:59` }] }
                    },
                    attributes: ['packageCvId',[db.sequelize.literal('SUM(amount)'), 'count'],[db.sequelize.literal('SUM(currentPrice * amount)'), 'total']],
                    order: [[db.Sequelize.literal('total'), 'DESC']],
                    group: ['packageCvId'],
                    nest: true,
                })
                const sum = listOrderPackage.reduce(
                    (previousValue, currentValue) => previousValue + currentValue.total,
                    0
                  );
                listPackage.rows = listPackage.rows.map(packageCv => {
                    let count = 1
                    let length = listOrderPackage.length
                    if (length == 0) {
                        return {
                            ...packageCv,
                            count: 0,
                            total: 0
                        }
                    }
                    for (let order of listOrderPackage) {
                        if (order.packageCvId == packageCv.id) {
                            return {
                                ...packageCv,
                                count: order.count,
                                total: order.total
                            }
                        }
                        else if (count == length) {
                            return {
                                ...packageCv,
                                total: 0,
                                count: 0
                            }
                        }
                        count++
                    }
                }
                )
                resolve({
                    errCode: 0,
                    data: listPackage.rows,
                    count: listPackage.count,
                    sum: sum
                })
            }
        }
        catch (error) {
            reject(error)
        }
    })
}

let getHistoryTrade = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.companyId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let company = await db.Company.findOne({
                    where: { id: data.companyId }
                })
                if (!company) {
                    resolve({
                        errCode: 2,
                        errorMessage: 'Không tồn tại công ty',
                    })
                }
                else {
                    let listUserOfCompany = await db.User.findAll({
                        where: { companyId: company.id },
                        attributes: ['id'],
                    })
                    listUserOfCompany = listUserOfCompany.map(item => {
                        return {
                            userId: item.id
                        }
                    })
                    let objectFilter = {
                        where: {
                            [Op.and]: [{ [Op.or]: listUserOfCompany }]
                        },
                        order: [['updatedAt', 'DESC']],
                        nest: true,
                        raw: true,
                        include: [
                            { model: db.User, as: 'userOrderCvData',
                                attributes: {
                                    exclude: ['userId']
                                },
                            },
                            { model: db.PackageCv, as: 'packageOrderCvData'}
                        ]
                    }

                    if (data.limit && data.offset) {
                        objectFilter = {
                            ...objectFilter,
                            limit: +data.limit,
                            offset: +data.offset
                        }
                    }

                    if (data.fromDate && data.toDate) {
                        objectFilter.where = {
                            ...objectFilter.where,
                            createdAt: { [Op.and]: [{ [Op.gte]: `${data.fromDate} 00:00:00` }, { [Op.lte]: `${data.toDate} 23:59:59` }] }
                        }
                    }

                    let res = await db.OrderPackageCV.findAndCountAll(objectFilter)

                    resolve({
                        errCode: 0,
                        data: res.rows,
                        count: res.count
                    })
                }
            }
        } catch (error) {
            reject(error.message)
        }
    })

}

let getSumByYear = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.year) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                    let objectFilter = {
                        attributes: [[db.sequelize.literal('SUM(currentPrice * amount)'), 'total'], [db.sequelize.fn('MONTH', db.sequelize.col('createdAt')),'month']],
                        where: {
                            [Op.and]: [
                                db.sequelize.where(db.sequelize.fn('YEAR', db.sequelize.col('createdAt')), data.year),
                            ],
                        },
                        group: db.sequelize.fn('MONTH', db.sequelize.col('createdAt'))
                    }

                    let res = await db.OrderPackageCV.findAll(objectFilter)

                    resolve({
                        errCode: 0,
                        data: res
                    })
                
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    getPaymentLink, paymentOrderSuccess, getAllPackage, setActiveTypePackage,
    getPackageById, creatNewPackageCv, updatePackageCv, getStatisticalPackage, getAllToSelect,
    getHistoryTrade, getSumByYear
}