import companyService from '../services/companyService';

let handleCreateNewCompany = async (req, res) => {
    try {
        let data = await companyService.handleCreateNewCompany(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let handleUpdateCompany = async (req, res) => {
    try {
        let data = await companyService.handleUpdateCompany(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let handleBanCompany = async (req, res) => {
    try {
        let data = await companyService.handleBanCompany(req.body.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let handleUnBanCompany = async (req, res) => {
    try {
        let data = await companyService.handleUnBanCompany(req.body.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let handleAddUserCompany = async (req, res) => {
    try {
        let data = await companyService.handleAddUserCompany(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getListCompany = async (req, res) => {
    try {
        let data = await companyService.getListCompany(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getDetailCompanyById = async (req, res) => {
    try {
        let data = await companyService.getDetailCompanyById(req.query.id);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getDetailCompanyByUserId = async (req, res) => {
    try {
        let data = await companyService.getDetailCompanyByUserId(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let getAllUserByCompanyId = async (req, res) => {
    try {
        let data = await companyService.getAllUserByCompanyId(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
let handleQuitCompany = async (req, res) => {
    try {
        let data = await companyService.handleQuitCompany(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let getAllCompanyByAdmin = async (req, res) => {
    try {
        let data = await companyService.getAllCompanyByAdmin(req.query);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}

let handleAccecptCompany = async (req, res) => {
    try {
        let data = await companyService.handleAccecptCompany(req.body);
        return res.status(200).json(data);
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server'
        })
    }
}
module.exports = {
    handleCreateNewCompany: handleCreateNewCompany,
    handleBanCompany: handleBanCompany,
    handleUnBanCompany: handleUnBanCompany,
    handleUpdateCompany: handleUpdateCompany,
    handleAddUserCompany: handleAddUserCompany,
    getListCompany: getListCompany,
    getDetailCompanyById: getDetailCompanyById,
    getDetailCompanyByUserId: getDetailCompanyByUserId,
    getAllUserByCompanyId: getAllUserByCompanyId,
    handleQuitCompany: handleQuitCompany,
    getAllCompanyByAdmin: getAllCompanyByAdmin,
    handleAccecptCompany : handleAccecptCompany
}