import db from "../models/index";
const { Op } = require("sequelize");
require('dotenv').config();
var nodemailer = require('nodemailer');
let sendmail = (note, userMail, link = null) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        }
    });

    var mailOptions = {
        from: process.env.EMAIL_APP,
        to: userMail,
        subject: 'Thông báo từ trang Job Finder',
        html: note
    };
    if (link)
    {
        mailOptions.html = note + ` <br>
        xem thông tin bài viết <a href='${process.env.URL_REACT}/${link}'>Tại đây</a> `
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
        } else {
        }
    });
}
let handleCreateNewPost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.categoryJobCode || !data.addressCode || !data.salaryJobCode || !data.amount || !data.timeEnd || !data.categoryJoblevelCode || !data.userId
                || !data.categoryWorktypeCode || !data.experienceJobCode || !data.genderPostCode || !data.descriptionHTML || !data.descriptionMarkdown || data.isHot === ''
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
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
                if (!company) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Người dùng không thuộc công ty'
                    })
                    return
                }
                else {
                    if (company.statusCode == "S1") {
                        if (data.isHot == '1') {
                            if (company.allowHotPost > 0) {
                                company.allowHotPost -= 1
                                await company.save({silent: true})
                            }
                            else {
                                resolve({
                                    errCode: 2,
                                    errMessage: 'Công ty bạn đã hết số lần đăng bài viết nổi bật'
                                })
                                return
                            }
                        }
                        else {
                            if (company.allowPost > 0) {
                                company.allowPost -= 1
                                await company.save({silent: true})
                            }
                            else {
                                resolve({
                                    errCode: 2,
                                    errMessage: 'Công ty bạn đã hết số lần đăng bài viết bình thường'
                                })
                                return
                            }
                        }
                        let detailPost = await db.DetailPost.create({
                            name: data.name,
                            descriptionHTML: data.descriptionHTML,
                            descriptionMarkdown: data.descriptionMarkdown,
                            categoryJobCode: data.categoryJobCode,
                            addressCode: data.addressCode,
                            salaryJobCode: data.salaryJobCode,
                            amount: data.amount,
                            categoryJoblevelCode: data.categoryJoblevelCode,
                            categoryWorktypeCode: data.categoryWorktypeCode,
                            experienceJobCode: data.experienceJobCode,
                            genderPostCode: data.genderPostCode,
                        })
                        await db.Post.create({
                            statusCode: 'PS3',
                            timeEnd: data.timeEnd,
                            userId: data.userId,
                            isHot: data.isHot,
                            detailPostId: detailPost.id
                        })
                        resolve({
                            errCode: 0,
                            errMessage: 'Tạo bài tuyển dụng thành công hãy chờ quản trị viên duyệt'
                        })
                    }
                    else {
                        resolve({
                            errCode: 2,
                            errMessage: 'Công ty bạn đã bị chặn không thể đăng bài'
                        })
                    }
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleReupPost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.postId || !data.timeEnd) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
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
                if (!company) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Người dùng không thuộc công ty'
                    })
                    return
                }
                else {
                    let post = await db.Post.findOne({
                        where: {id: data.postId}
                    })
                    if (!post)
                    {
                        resolve({
                            errCode: 2,
                            errMessage: 'Bài viết không tồn tại'
                        })
                        return
                    }
                    else {
                        if (post.isHot == '1') {
                            if (company.allowHotPost > 0) {
                                company.allowHotPost -= 1
                                await company.save()
                            }
                            else {
                                resolve({
                                    errCode: 2,
                                    errMessage: 'Công ty bạn đã hết số lần đăng bài viết nổi bật'
                                })
                                return
                            }
                        }
                        else {
                            if (company.allowPost > 0) {
                                company.allowPost -= 1
                                await company.save()
                            }
                            else {
                                resolve({
                                    errCode: 2,
                                    errMessage: 'Công ty bạn đã hết số lần đăng bài viết bình thường'
                                })
                                return
                            }
                        }
                        await db.Post.create({
                            statusCode: 'PS3',
                            timeEnd: data.timeEnd,
                            userId: data.userId,
                            isHot: post.isHot,
                            detailPostId: post.detailPostId
                        })
                        resolve({
                            errCode: 0,
                            errMessage: 'Tạo bài tuyển dụng thành công hãy chờ quản trị viên duyệt'
                        })

                    }
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleUpdatePost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.categoryJobCode || !data.addressCode || !data.salaryJobCode || !data.amount || !data.timeEnd || !data.categoryJoblevelCode
                || !data.categoryWorktypeCode || !data.experienceJobCode || !data.genderPostCode || !data.descriptionHTML
                || !data.descriptionMarkdown || !data.id || !data.userId
            ) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let post = await db.Post.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (post) {
                    let otherPost = await db.Post.findOne({
                        where: {detailPostId: post.detailPostId,id: {
                            [Op.ne]: post.id
                        }}
                    })
                    if (otherPost) {
                        let newDetailPost = await db.DetailPost.create({
                            name: data.name,
                            descriptionHTML: data.descriptionHTML,
                            descriptionMarkdown: data.descriptionMarkdown,
                            categoryJobCode: data.categoryJobCode,
                            addressCode: data.addressCode,
                            salaryJobCode: data.salaryJobCode,
                            amount: data.amount,
                            categoryJoblevelCode: data.categoryJoblevelCode,
                            categoryWorktypeCode: data.categoryWorktypeCode,
                            experienceJobCode: data.experienceJobCode,
                            genderPostCode: data.genderPostCode,
                        })
                        post.detailPostId = newDetailPost.id
                    }
                    else {
                        let detailPost = await db.DetailPost.findOne({
                            where: {id: post.detailPostId},
                            attributes: {
                                exclude: ['statusCode']
                            },
                            raw: false
                        })
                        detailPost.name =  data.name,
                        detailPost.descriptionHTML =  data.descriptionHTML,
                        detailPost.descriptionMarkdown =  data.descriptionMarkdown,
                        detailPost.categoryJobCode =  data.categoryJobCode,
                        detailPost.addressCode =  data.addressCode,
                        detailPost.salaryJobCode =  data.salaryJobCode,
                        detailPost.amount =  data.amount,
                        detailPost.categoryJoblevelCode =  data.categoryJoblevelCode,
                        detailPost.categoryWorktypeCode =  data.categoryWorktypeCode,
                        detailPost.experienceJobCode =  data.experienceJobCode,
                        detailPost.genderPostCode =  data.genderPostCode,
                        await detailPost.save()
                    }
                    post.userId = data.userId
                    post.statusCode = 'PS3'
                    await post.save()
                    resolve({
                        errCode: 0,
                        errMessage: 'Đã chỉnh sửa bài viết thành công hãy chờ quản trị viên duyệt'
                    })
                } else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Bài đăng không tồn tại !'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleBanPost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.postId || !data.note || !data.userId) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let foundPost = await db.Post.findOne({
                    where: { id: data.postId },
                    raw: false
                })
                if (foundPost) {
                    foundPost.statusCode = 'PS4'
                    await foundPost.save()
                    await db.Note.create({
                        postId: foundPost.id,
                        note: data.note,
                        userId: data.userId
                    })
                    let user = await db.User.findOne({
                        where: { id: foundPost.userId },
                        attributes: {
                            exclude: ['userId']
                        }
                    })
                    sendmail(`Bài viết #${foundPost.id} của bạn đã bị chặn vì ${data.note}`, user.email,`admin/list-post/${foundPost.id}`)

                    resolve({
                        errCode: 0,
                        errMessage: 'Đã chặn bài viết thành công'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tồn tại bài viết'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let handleActivePost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id || !data.userId || !data.note) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let foundPost = await db.Post.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (foundPost) {
                    foundPost.statusCode = 'PS3'
                    await foundPost.save()
                    await db.Note.create({
                        postId: foundPost.id,
                        note: data.note,
                        userId: data.userId
                    })
                    let user = await db.User.findOne({
                        where: { id: foundPost.userId },
                        attributes: {
                            exclude: ['userId']
                        }
                    })
                    sendmail(`Bài viết #${foundPost.id} của bạn đã được mở lại vì: ${data.note}`, user.email,`admin/list-post/${foundPost.id}`)
                    resolve({
                        errCode: 0,
                        errMessage: 'Đã mở lại trạng thái chờ duyệt'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tồn tại bài viết'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let handleAcceptPost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!data.id || !data.statusCode) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let foundPost = await db.Post.findOne({
                    where: { id: data.id },
                    raw: false
                })
                if (foundPost) {
                    foundPost.statusCode = data.statusCode
                    if (data.statusCode == "PS1") {
                        foundPost.timePost = new Date().getTime()
                    }
                    await foundPost.save()
                    let note = data.statusCode == "PS1" ? "Đã duyệt bài thành công" : data.note
                    await db.Note.create({
                        postId: foundPost.id,
                        note: note,
                        userId: data.userId
                    })
                    let user = await db.User.findOne({
                        where: { id: foundPost.userId },
                        attributes: {
                            exclude: ['userId']
                        }
                    })
                    if (data.statusCode == "PS1")
                    {
                        sendmail(note, user.email,`detail-job/${foundPost.id}`)
                    }
                    else {
                        sendmail(`Bài viết #${foundPost.id} của bạn đã bị từ chối`, user.email,`admin/list-post/${foundPost.id}`)
                    }
                    resolve({
                        errCode: 0,
                        errMessage: data.statusCode == "PS1" ? 'Duyệt bài thành công' : 'Đã từ chối bài thành công'
                    })
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tồn tại bài viết'
                    })
                }
            }

        } catch (error) {
            reject(error)
        }
    })
}
let getListPostByAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.limit || !data.offset || !data.companyId) {
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
                        limit: +data.limit,
                        offset: +data.offset,
                        attributes: {
                            exclude: ['detailPostId']
                        },
                        nest: true,
                        raw: true,
                        include: [
                            {
                                model: db.DetailPost, as: 'postDetailData', attributes: ['id', 'name', 'descriptionHTML', 'descriptionMarkdown', 'amount'],
                                include: [
                                    { model: db.Allcode, as: 'jobTypePostData', attributes: ['value', 'code'] },
                                    { model: db.Allcode, as: 'workTypePostData', attributes: ['value', 'code'] },
                                    { model: db.Allcode, as: 'salaryTypePostData', attributes: ['value', 'code'] },
                                    { model: db.Allcode, as: 'jobLevelPostData', attributes: ['value', 'code'] },
                                    { model: db.Allcode, as: 'genderPostData', attributes: ['value', 'code'] },
                                    { model: db.Allcode, as: 'provincePostData', attributes: ['value', 'code'] },
                                    { model: db.Allcode, as: 'expTypePostData', attributes: ['value', 'code'] }
                                ]
                            },
                            { model: db.Allcode, as: 'statusPostData', attributes: ['value', 'code'] },
                            { model: db.User, as: 'userPostData',
                                attributes: {
                                    exclude: ['userId']
                                },
                                include: [
                                    {model : db.Company, as: 'userCompanyData'}
                                ]
                            }
                        ]
                    }
                    if (data.censorCode) {
                        objectFilter.where = {...objectFilter.where,statusCode: data.censorCode}
                    }
                    if (data.search) {
                        objectFilter.where = {
                            ...objectFilter.where,
                            [Op.or]: [
                                db.Sequelize.where(db.sequelize.col('postDetailData.name'),{
                                    [Op.like]: `%${data.search}%`
                                }),
                                {
                                    id : {
                                        [Op.like]: `%${data.search}%`
                                    }
                                }
                            ]
                        }
                    }
                    let post = await db.Post.findAndCountAll(objectFilter)
                    resolve({
                        errCode: 0,
                        data: post.rows,
                        count: post.count
                    })
                }
            }
        } catch (error) {
            reject(error.message)
        }
    })


}

let getAllPostByAdmin = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.limit || !data.offset) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let objectFilter = {
                    order: [['updatedAt', 'DESC']],
                    limit: +data.limit,
                    offset: +data.offset,
                    attributes: {
                        exclude: ['detailPostId']
                    },
                    nest: true,
                    raw: true,
                    include: [
                        {
                            model: db.DetailPost, as: 'postDetailData', attributes: ['id', 'name', 'descriptionHTML', 'descriptionMarkdown', 'amount'],
                            include: [
                                { model: db.Allcode, as: 'jobTypePostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'workTypePostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'salaryTypePostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'jobLevelPostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'genderPostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'provincePostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'expTypePostData', attributes: ['value', 'code'] }
                            ]
                        },
                        { model: db.Allcode, as: 'statusPostData', attributes: ['value', 'code'] },
                        {
                            model: db.User, as: 'userPostData', attributes: { exclude: ['userId'] },
                            include: [
                                { model: db.Company, as: 'userCompanyData' }
                            ]
                        }
                    ],
                    order: [['updatedAt', 'DESC']],
                }
                // if (data.search) {
                //     objectFilter.include[0].where = {name: {[Op.like]: `%${data.search}%`}}
                // }
                if (data.censorCode) {
                    objectFilter.where = {statusCode : data.censorCode}
                }
                if (data.search) {
                    objectFilter.where = { ...objectFilter.where,
                        [Op.or]: [
                            db.Sequelize.where(db.sequelize.col('postDetailData.name'),{
                                [Op.like]: `%${data.search}%`
                            }),
                            {
                                id : {
                                    [Op.like]: `%${data.search}%`
                                }
                            },
                            db.Sequelize.where(db.sequelize.col('userPostData.userCompanyData.name'),{
                                [Op.like]: `%${data.search}%`
                            }),
                        ]
                    }
                }
                let post = await db.Post.findAndCountAll(objectFilter)
                resolve({
                    errCode: 0,
                    data: post.rows,
                    count: post.count
                })
            }
        } catch (error) {
            reject(error.message)
        }
    })


}
let getDetailPostById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let post = await db.Post.findOne({
                    where: {
                        id: id
                    },
                    attributes: {
                        exclude: ['detailPostId']
                    },
                    nest: true,
                    raw: true,
                    include: [
                        {
                            model: db.DetailPost, as: 'postDetailData', attributes: ['id', 'name', 'descriptionHTML', 'descriptionMarkdown', 'amount'],
                            include: [
                                { model: db.Allcode, as: 'jobTypePostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'workTypePostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'salaryTypePostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'jobLevelPostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'genderPostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'provincePostData', attributes: ['value', 'code'] },
                                { model: db.Allcode, as: 'expTypePostData', attributes: ['value', 'code'] }
                            ]
                        }
                    ]
                })
                if (post) {
                    let user = await db.User.findOne({
                        where: { id: post.userId },
                        attributes: {
                            exclude: ['userId']
                        }
                    })
                    let company = await db.Company.findOne({
                        where: { id: user.companyId }
                    })
                    post.companyData = company
                    resolve({
                        errCode: 0,
                        data: post,
                    })
                }
                else {
                    resolve({
                        errCode: 0,
                        errMessage: 'Không tìm thấy bài viết'
                    })
                }
            }
        } catch (error) {
            reject(error.message)
        }
    })
}
let getFilterPost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let objectFilter = ''
            if (data.salaryJobCode !== '' || data.categoryWorktypeCode !== '' || data.experienceJobCode !== '' || data.categoryJoblevelCode !== '') {
                let querySalaryJob = ''
                if (data.salaryJobCode !== '')
                    querySalaryJob = data.salaryJobCode.split(',').map((data, index) => {
                        return { salaryJobCode: data }
                    })

                let queryWorkType = ''
                if (data.categoryWorktypeCode !== '')
                    queryWorkType = data.categoryWorktypeCode.split(',').map((data, index) => {
                        return { categoryWorktypeCode: data }
                    })

                let queryExpType = ''
                if (data.experienceJobCode !== '')
                    queryExpType = data.experienceJobCode.split(',').map((data, index) => {
                        return { experienceJobCode: data }
                    })
                let queryJobLevel = ''
                if (data.categoryJoblevelCode !== '')
                    queryJobLevel = data.categoryJoblevelCode.split(',').map((data, index) => {
                        return { categoryJoblevelCode: data }
                    })
                objectFilter = {
                    where: {
                        [Op.and]: [
                            queryExpType && { [Op.or]: [...queryExpType] },
                            queryWorkType && { [Op.or]: [...queryWorkType] },
                            querySalaryJob && { [Op.or]: [...querySalaryJob] },
                            queryJobLevel && { [Op.or]: [...queryJobLevel] }
                        ]
                    },
                    raw: true,
                    nest: true,
                    attributes: {
                        exclude: ['statusCode']
                    }
                }
            }
            else {
                objectFilter = {
                    raw: true,
                    nest: true,
                    attributes: {
                        exclude: ['statusCode']
                    }
                }
            }
            if (data.categoryJobCode && data.categoryJobCode !== '') objectFilter.where = { ...objectFilter.where, categoryJobCode: data.categoryJobCode }
            if (data.addressCode && data.addressCode !== '') objectFilter.where = { ...objectFilter.where, addressCode: data.addressCode }
            if (data.search) objectFilter.where = {...objectFilter.where,name: {[Op.like] : `%${data.search}%`}}
            let listDetailPost = await db.DetailPost.findAll(objectFilter)
            let listDetailPostId = listDetailPost.map(item => {
                return {
                    detailPostId: item.id
                }
            })

            let postFilter = {
                where: {
                    statusCode: 'PS1',
                    [Op.or]: listDetailPostId,
                },
                order: [['timePost', 'DESC']],
                include: [
                    {
                        model: db.DetailPost, as: 'postDetailData', attributes: ['id', 'name', 'descriptionHTML', 'descriptionMarkdown', 'amount'],
                        include: [
                            { model: db.Allcode, as: 'jobTypePostData', attributes: ['value', 'code'] },
                            { model: db.Allcode, as: 'workTypePostData', attributes: ['value', 'code'] },
                            { model: db.Allcode, as: 'salaryTypePostData', attributes: ['value', 'code'] },
                            { model: db.Allcode, as: 'jobLevelPostData', attributes: ['value', 'code'] },
                            { model: db.Allcode, as: 'genderPostData', attributes: ['value', 'code'] },
                            { model: db.Allcode, as: 'provincePostData', attributes: ['value', 'code'] },
                            { model: db.Allcode, as: 'expTypePostData', attributes: ['value', 'code'] }
                        ]
                    },
                    {
                        model: db.User, as: 'userPostData',
                        attributes: {
                            exclude: ['userId']
                        },
                        include: [
                            { model: db.Company, as: 'userCompanyData'},
                        ]
                    }
                ],
                raw: true,
                nest: true
            }
            if (data.limit && data.offset) {
                postFilter.limit = +data.limit
                postFilter.offset = +data.offset
            }
            if (data.isHot == 1) {
                postFilter.where = { ...postFilter.where, isHot: data.isHot }
            }
            let res = await db.Post.findAndCountAll(postFilter)

            resolve({
                errCode: 0,
                data: res.rows,
                count: res.count
            })


        } catch (error) {
            reject(error)
        }
    })
}

let getStatisticalTypePost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            let res = await db.Post.findAll({
                where: {
                    statusCode: 'PS1'
                },
                include: [
                    {
                        model: db.DetailPost, as: 'postDetailData', attributes: [],
                        include: [
                            { model: db.Allcode, as: 'jobTypePostData', attributes: ['value', 'code'] }
                        ],
                    }
                ],
                attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('postDetailData.categoryJobCode')), 'amount']],
                group: ['postDetailData.categoryJobCode'],
                order: [[db.sequelize.literal('amount'), 'DESC']],
                limit: +data.limit,
                raw: true,
                nest: true
            })
            let totalPost = await db.Post.findAndCountAll({
                where: {
                    statusCode: 'PS1'
                },
            })
            resolve({
                errCode: 0,
                data: res,
                totalPost: totalPost.count
            })
        }
        catch (error) {
            reject(error)
        }
    })
}

let getListNoteByPost = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let res = await db.Note.findAndCountAll({
                    where: {postId: data.id},
                    limit: +data.limit,
                    offset: +data.offset,
                    include: [
                        {model: db.User , as: 'userNoteData' ,
                            attributes: {
                                exclude: ['userId']
                            }
                        }
                    ],
                    order: [['createdAt', 'DESC']],
                    raw: true,
                    nest: true
                })
                resolve({
                    errCode: 0,
                    data: res.rows,
                    count: res.count
                })

            }
        } catch (error) {
            reject(error.message)
        }
    })
}

module.exports = {
    handleCreateNewPost: handleCreateNewPost,
    handleUpdatePost: handleUpdatePost,
    handleBanPost: handleBanPost,
    handleAcceptPost: handleAcceptPost,
    getListPostByAdmin: getListPostByAdmin,
    getAllPostByAdmin: getAllPostByAdmin,
    getDetailPostById: getDetailPostById,
    handleActivePost: handleActivePost,
    getFilterPost: getFilterPost,
    getStatisticalTypePost: getStatisticalTypePost,
    getListNoteByPost: getListNoteByPost,
    handleReupPost: handleReupPost
}