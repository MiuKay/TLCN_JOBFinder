import userService from "../services/userService";

let handleCreateNewUser = async (req, res) => {
  try {
    let data = await userService.handleCreateNewUser(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let handleUpdateUser = async (req, res) => {
  try {
    let data = await userService.updateUserData(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let handleBanUser = async (req, res) => {
  try {
    let data = await userService.banUser(req.body.data.id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let handleUnbanUser = async (req, res) => {
  try {
    let data = await userService.unbanUser(req.body.data.id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let handleLogin = async (req, res) => {
  try {
    let data = await userService.handleLogin(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let handleChangePassword = async (req, res) => {
  try {
    let data = await userService.handleChangePassword(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let getAllUser = async (req, res) => {
  try {
    let data = await userService.getAllUser(req.query);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let getDetailUserById = async (req, res) => {
  try {
    let data = await userService.getDetailUserById(req.query.id);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};
let checkUserPhone = async (req, res) => {
  try {
    let data = await userService.checkUserPhone(req.query.phonenumber);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let changePaswordByPhone = async (req, res) => {
  try {
    let data = await userService.changePaswordByPhone(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let setDataUserSetting = async (req, res) => {
  try {
    let data = await userService.setDataUserSetting(req.body);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

module.exports = {
  handleCreateNewUser: handleCreateNewUser,
  handleUpdateUser: handleUpdateUser,
  handleBanUser: handleBanUser,
  handleUnbanUser: handleUnbanUser,
  handleLogin: handleLogin,
  handleChangePassword: handleChangePassword,
  getAllUser: getAllUser,
  getDetailUserById: getDetailUserById,
  checkUserPhone: checkUserPhone,
  changePaswordByPhone,
  setDataUserSetting,
};
