import e from "express";
import db from "../models/index";
const cloudinary = require('../utils/cloudinary');
const { Op, and } = require("sequelize");
let handleCreateNewAllCode = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.type || !data.value || !data.code) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {

                let res = await db.Allcode.findOne({
                    where: { code: data.code }
                })

                if (res) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Mã code đã tồn tại !'
                    })
                } else {
                    let imageUrl = ""
                    if (data.image) {
                        const uploadedResponse = await cloudinary.uploader.upload(data.image, {
                            upload_preset: 'dev_setups'
                        })
                        imageUrl = uploadedResponse.url
                    }
                    await db.Allcode.create({
                        type: data.type,
                        value: data.value,
                        code: data.code,
                        image: imageUrl
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}
let getAllCodeService = (typeInput) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!typeInput) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {

                let allcode = await db.Allcode.findAll({
                    where: { type: typeInput }
                })
                resolve({
                    errCode: 0,
                    data: allcode
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleUpdateAllCode = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.value || !data.code) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let res = await db.Allcode.findOne({
                    where: {
                        code: data.code
                    },
                    raw: false
                })
                if (res) {
                    let imageUrl = ""
                    if (data.image) {
                        const uploadedResponse = await cloudinary.uploader.upload(data.image, {
                            upload_preset: 'dev_setups'
                        })
                        imageUrl = uploadedResponse.url
                        res.image = imageUrl
                    }
                    res.value = data.value
                    res.code = data.code
                    res = await res.save();
                    if (res)
                        resolve({
                            errCode: 0,
                            errMessage: 'Đã chỉnh sửa thành công'
                        })
                    else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Có lỗi trong quá trình chỉnh sửa'
                        })
                    }
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tồn tại code'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let getDetailAllcodeByCode = (code) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!code) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let data = await db.Allcode.findOne({
                    where: { code: code }
                })
                if (data)
                    resolve({
                        errCode: 0,
                        data: data
                    })
                else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Không tìm thấy code'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}
let handleDeleteAllCode = (code) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!code) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let foundAllCode = await db.Allcode.findOne({
                    where: { code: code }
                })
                if (!foundAllCode) {
                    resolve({
                        errCode: 2,
                        errMessage: `Không tồn tại code`
                    })
                }
                else {
                    await db.Allcode.destroy({
                        where: { code: code }
                    })
                    resolve({
                        errCode: 0,
                        errMessage: `Đã xóa thành công`
                    })
                }
            }

        } catch (error) {
            if (error.message.includes('a foreign key constraint fails')) {
                resolve({
                    errCode: 3,
                    errMessage: `Bạn không thể xóa thông tin này vì các dữ liệu khác liên quan`
                })
            }
            reject(error.message)
        }
    })
}
let getListAllCodeService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(!data.offset)
            if (!data.type || !data.limit || !data.offset) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let objectFilter = {
                    where: { type: data.type },
                    offset: +data.offset,
                    limit: +data.limit
                }
                if (data.search) {
                    objectFilter.where = { ...objectFilter.where, value: { [Op.like]: `%${data.search}%` } }
                }

                let allcode = await db.Allcode.findAndCountAll(objectFilter)
                resolve({
                    errCode: 0,
                    data: allcode.rows,
                    count: allcode.count
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getListJobTypeAndCountPost = async (data) => {
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
                            { model: db.Allcode, as: 'jobTypePostData', attributes: ['value', 'code', 'image'] }
                        ],
                    }
                ],
                attributes: [[db.sequelize.fn('COUNT', db.sequelize.col('postDetailData.categoryJobCode')), 'amount']],
                group: ['postDetailData.categoryJobCode'],
                order: [[db.sequelize.literal('amount'), 'DESC']],
                limit: +data.limit,
                offset: +data.offset,
                raw: true,
                nest: true
            })
            resolve({
                errCode: 0,
                data: res
            })
        }
        catch (error) {
            reject(error)
        }
    })
}

let handleCreateNewSkill = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.categoryJobCode) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {

                let res = await db.Skill.findOne({
                    where: { categoryJobCode: data.categoryJobCode, name: data.name }
                })

                if (res) {
                    resolve({
                        errCode: 2,
                        errMessage: 'Tên kĩ năng đã có trong lĩnh vực này !'
                    })
                } else {
                    await db.Skill.create({
                        name: data.name,
                        categoryJobCode: data.categoryJobCode
                    })
                    resolve({
                        errCode: 0,
                        errMessage: 'ok'
                    })
                }

            }
        } catch (error) {
            reject(error)
        }
    })
}

let handleDeleteSkill = (id) => {
    return new Promise(async (resolve, reject) => {
        try {

            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: `Missing required parameters !`
                })
            } else {
                let foundSkill = await db.Skill.findOne({
                    where: { id: id }
                })
                if (!foundSkill) {
                    resolve({
                        errCode: 2,
                        errMessage: `Không tồn tại kĩ năng`
                    })
                }
                else {
                    let isSkillUsed = await db.UserSkill.findOne({
                        where: { skillId: id }
                    })
                    if (isSkillUsed) {
                        resolve({
                            errCode: 3,
                            errMessage: `Bạn không thể xóa thông tin này vì các dữ liệu khác liên quan`
                        })
                    }
                    else {
                        await db.Skill.destroy({
                            where: { id: id }
                        })
                    }
                    resolve({
                        errCode: 0,
                        errMessage: `Đã xóa thành công`
                    })
                }
            }

        } catch (error) {
            reject(error.message)
        }
    })
}

let getAllSkillByJobCode = (categoryJobCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!categoryJobCode) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            }
            else {
                let objectFilter = {
                    include: [
                        { model: db.Allcode, as: 'jobTypeSkillData', attributes: ['value', 'code'] }
                    ],
                    raw: true,
                    nest: true
                }
                if (categoryJobCode !== 'getAll') {
                    objectFilter.where = {
                        [Op.and]: [
                            db.Sequelize.where(db.sequelize.col('jobTypeSkillData.code'),{
                                [Op.eq]: categoryJobCode
                            }),
                        ]
                    }
                }
                let skills = await db.Skill.findAll(objectFilter)
                resolve({
                    errCode: 0,
                    data: skills
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getListSkill = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.limit || !data.offset) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            }
            else {
                let objectFilter = {
                    include: [
                        { model: db.Allcode, as: 'jobTypeSkillData', attributes: ['value', 'code'] }
                    ],
                    limit: +data.limit,
                    offset: +data.offset,
                    raw: true,
                    nest: true
                }
                if (data.search) {
                    objectFilter.where = {
                        ...objectFilter.where,
                        name: {
                            [Op.like]: `%${data.search}%`
                        }
                    }
                }
                if (data.categoryJobCode) {
                    objectFilter.where = {
                        ...objectFilter.where,
                        [Op.and]: [
                                db.Sequelize.where(db.sequelize.col('jobTypeSkillData.code'),{
                                    [Op.eq]: data.categoryJobCode
                                }),
                            ]
                    }
                }
                let skills = await db.Skill.findAndCountAll(objectFilter)
                resolve({
                    errCode: 0,
                    data: skills.rows,
                    count: skills.count
                })
            }
        } catch (error) {
            reject(error)
        }
    })
}

let handleUpdateSkill = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.id || !data.categoryJobCode) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let res = await db.Skill.findOne({
                    where: {
                        id: data.id
                    },
                    raw: false
                })
                if (res) {
                    res.name = data.name
                    res.categoryJobCode = data.categoryJobCode
                    res = await res.save();
                    if (res)
                        resolve({
                            errCode: 0,
                            errMessage: 'Đã chỉnh sửa thành công'
                        })
                    else {
                        resolve({
                            errCode: 1,
                            errMessage: 'Có lỗi trong quá trình chỉnh sửa'
                        })
                    }
                }
                else {
                    resolve({
                        errCode: 2,
                        errMessage: 'Không tồn tại kĩ năng'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}

let getDetailSkillById = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let data = await db.Skill.findOne({
                    where: { id: id },
                    include: [
                        {model: db.Allcode, as: 'jobTypeSkillData', attributes: ['value','code']}
                    ],
                    nest: true,
                    raw: true
                })
                if (data)
                    resolve({
                        errCode: 0,
                        data: data
                    })
                else {
                    resolve({
                        errCode: 1,
                        errMessage: 'Không tìm thấy code'
                    })
                }
            }
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = {
    handleCreateNewAllCode: handleCreateNewAllCode,
    getAllCodeService: getAllCodeService,
    handleUpdateAllCode: handleUpdateAllCode,
    getDetailAllcodeByCode: getDetailAllcodeByCode,
    handleDeleteAllCode: handleDeleteAllCode,
    getListAllCodeService: getListAllCodeService,
    getListJobTypeAndCountPost: getListJobTypeAndCountPost,
    handleCreateNewSkill, handleDeleteSkill,
    getAllSkillByJobCode, getListSkill,
    handleUpdateSkill, getDetailSkillById
}