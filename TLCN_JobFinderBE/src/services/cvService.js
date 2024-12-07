import db from "../models/index";
import CommonUtils from "../utils/CommonUtils";
const { Op, and } = require("sequelize");
let caculateMatchCv = async (file, mapRequired) => {
  let myMapRequired = new Map(mapRequired);
  if (myMapRequired.size === 0) {
    return 0;
  }
  let match = 0;
  let cvData = await CommonUtils.pdfToString(file);
  cvData = cvData.pages;
  cvData.forEach((item) => {
    item.content.forEach((data) => {
      for (let key of myMapRequired.keys()) {
        if (
          CommonUtils.flatAllString(data.str).includes(
            CommonUtils.flatAllString(myMapRequired.get(key))
          )
        ) {
          myMapRequired.delete(key);
          match++;
        }
      }
    });
  });
  return match;
};
let caculateMatchUserWithFilter = async (userData, listSkillRequired) => {
  let match = 0;
  let myListSkillRequired = new Map();
  listSkillRequired.forEach((item) => {
    myListSkillRequired.set(item.id, item.name);
  });
  let userskill = await db.UserSkill.findAll({
    where: { userId: userData.userId },
  });
  for (let key of myListSkillRequired.keys()) {
    let temp = [...userskill];
    temp.forEach((item, index) => {
      if (item.SkillId === key) {
        userskill.splice(index, 1);
        match++;
      }
    });
  }
  let matchFromCV = await caculateMatchCv(userData.file, myListSkillRequired);
  return match + matchFromCV;
};
let getMapRequiredSkill = (mapRequired, post) => {
  for (let key of mapRequired.keys()) {
    if (
      !CommonUtils.flatAllString(post.postDetailData.descriptionHTML).includes(
        CommonUtils.flatAllString(mapRequired.get(key).toLowerCase())
      )
    ) {
      mapRequired.delete(key);
    }
  }
};
let handleCreateCv = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.userId || !data.file || !data.postId || !data.description) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        let cv = await db.Cv.create({
          userId: data.userId,
          file: data.file,
          postId: data.postId,
          isChecked: 0,
          description: data.description,
        });
        if (cv) {
          resolve({
            errCode: 0,
            errMessage: "Đã gửi CV thành công",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Đã gửi CV thất bại",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllListCvByPost = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.postId || !data.limit || !data.offset) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        let cv = await db.Cv.findAndCountAll({
          where: { postId: data.postId },
          limit: +data.limit,
          offset: +data.offset,
          nest: true,
          raw: true,
          include: [
            {
              model: db.User,
              as: "userCvData",
              attributes: {
                exclude: ["userId", "file", "companyId"],
              },
              include: [
                {
                  model: db.Account,
                  as: "userAccountData",
                  attributes: {
                    exclude: ["password"],
                  },
                },
              ],
            },
          ],
        });
        let postInfo = await db.Post.findOne({
          where: { id: data.postId },
          include: [
            {
              model: db.DetailPost,
              as: "postDetailData",
              attributes: [
                "id",
                "name",
                "descriptionHTML",
                "descriptionMarkdown",
                "amount",
              ],
              include: [
                {
                  model: db.Allcode,
                  as: "jobTypePostData",
                  attributes: ["value", "code"],
                },
                {
                  model: db.Allcode,
                  as: "workTypePostData",
                  attributes: ["value", "code"],
                },
                {
                  model: db.Allcode,
                  as: "salaryTypePostData",
                  attributes: ["value", "code"],
                },
                {
                  model: db.Allcode,
                  as: "jobLevelPostData",
                  attributes: ["value", "code"],
                },
                {
                  model: db.Allcode,
                  as: "genderPostData",
                  attributes: ["value", "code"],
                },
                {
                  model: db.Allcode,
                  as: "provincePostData",
                  attributes: ["value", "code"],
                },
                {
                  model: db.Allcode,
                  as: "expTypePostData",
                  attributes: ["value", "code"],
                },
              ],
            },
          ],
          raw: true,
          nest: true,
        });
        let listSkills = await db.Skill.findAll({
          where: {
            categoryJobCode: postInfo.postDetailData.jobTypePostData.code,
          },
        });
        let mapRequired = new Map();
        listSkills = listSkills.map((item) => {
          mapRequired.set(item.id, item.name);
        });
        console.log(mapRequired);
        getMapRequiredSkill(mapRequired, postInfo);
        for (let i = 0; i < cv.rows.length; i++) {
          let match = await caculateMatchCv(cv.rows[i].file, mapRequired);
          cv.rows[i].file =
            Math.round((match / mapRequired.size + Number.EPSILON) * 100) + "%";
        }
        resolve({
          errCode: 0,
          data: cv.rows,
          count: cv.count,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getDetailCvById = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.cvId || !data.roleCode) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        let cv = await db.Cv.findOne({
          where: { id: data.cvId },
          raw: false,
          nest: true,
          include: [
            {
              model: db.User,
              as: "userCvData",
              attributes: {
                exclude: ["userId", "file", "companyId"],
              },
            },
          ],
        });
        if (data.roleCode !== "CANDIDATE") {
          cv.isChecked = 1;
          await cv.save();
        }
        if (cv.file) {
          cv.file = new Buffer.from(cv.file, "base64").toString("binary");
        }
        resolve({
          errCode: 0,
          data: cv,
        });
      }
    } catch (error) {
      reject(error.message);
    }
  });
};
let getAllCvByUserId = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.userId || !data.limit || !data.offset) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        let cv = await db.Cv.findAndCountAll({
          where: { userId: data.userId },
          limit: +data.limit,
          offset: +data.offset,
          raw: true,
          nest: true,
          order: [["createdAt", "DESC"]],
          attributes: {
            exclude: ["file"],
          },
          include: [
            {
              model: db.Post,
              as: "postCvData",
              include: [
                {
                  model: db.DetailPost,
                  as: "postDetailData",
                  attributes: [
                    "id",
                    "name",
                    "descriptionHTML",
                    "descriptionMarkdown",
                    "amount",
                  ],
                  include: [
                    {
                      model: db.Allcode,
                      as: "jobTypePostData",
                      attributes: ["value", "code"],
                    },
                    {
                      model: db.Allcode,
                      as: "workTypePostData",
                      attributes: ["value", "code"],
                    },
                    {
                      model: db.Allcode,
                      as: "salaryTypePostData",
                      attributes: ["value", "code"],
                    },
                    {
                      model: db.Allcode,
                      as: "jobLevelPostData",
                      attributes: ["value", "code"],
                    },
                    {
                      model: db.Allcode,
                      as: "genderPostData",
                      attributes: ["value", "code"],
                    },
                    {
                      model: db.Allcode,
                      as: "provincePostData",
                      attributes: ["value", "code"],
                    },
                    {
                      model: db.Allcode,
                      as: "expTypePostData",
                      attributes: ["value", "code"],
                    },
                  ],
                },
              ],
            },
          ],
        });
        resolve({
          errCode: 0,
          data: cv.rows,
          count: cv.count,
        });
      }
    } catch (error) {
      reject(error.message);
    }
  });
};

let getStatisticalCv = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.fromDate || !data.toDate || !data.companyId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      }
      let company = await db.Company.findOne({
        where: { id: data.companyId },
      });
      if (company) {
        let listUserOfCompany = await db.User.findAll({
          where: { companyId: company.id },
          attributes: ["id"],
        });
        listUserOfCompany = listUserOfCompany.map((item) => {
          return {
            userId: item.id,
          };
        });
        let listPost = await db.Post.findAndCountAll({
          where: {
            [Op.and]: [{ [Op.or]: listUserOfCompany }],
          },
          include: [
            {
              model: db.User,
              as: "userPostData",
              attributes: {
                exclude: ["userId"],
              },
            },
            {
              model: db.DetailPost,
              as: "postDetailData",
              attributes: {
                exclude: ["statusCode"],
              },
            },
          ],
          nest: true,
          raw: true,
          limit: +data.limit,
          offset: +data.offset,
          order: [["createdAt", "ASC"]],
        });
        let listPostId = listPost.rows.map((item) => ({
          postId: item.id,
        }));

        let listCv = await db.Cv.findAll({
          where: {
            createdAt: {
              [Op.and]: [
                { [Op.gte]: `${data.fromDate} 00:00:00` },
                { [Op.lte]: `${data.toDate} 23:59:59` },
              ],
            },
            [Op.and]: [{ [Op.or]: listPostId }],
          },
          attributes: [
            "postId",
            [db.sequelize.fn("COUNT", db.sequelize.col("postId")), "total"],
          ],
          group: ["postId"],
        });
        listPost.rows = listPost.rows.map((post) => {
          let count = 1;
          let length = listCv.length;
          if (length == 0) {
            return {
              ...post,
              total: 0,
            };
          }
          for (let cv of listCv) {
            if (cv.postId == post.id) {
              return {
                ...post,
                total: cv.total,
              };
            } else if (count == length) {
              return {
                ...post,
                total: 0,
              };
            }
            count++;
          }
        });
        resolve({
          errCode: 0,
          data: listPost.rows,
          count: listPost.count,
        });
      } else {
        resolve({
          errCode: 1,
          errMessage: "Không tìm thấy công ty",
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let fillterCVBySelection = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.limit || !data.offset) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        let objectFillter = {
          where: {
            isFindJob: 1,
            file: {
              [Op.ne]: null,
            },
          },
          include: [
            {
              model: db.User,
              as: "userSettingData",
              attributes: {
                exclude: ["userId"],
              },
            },
            {
              model: db.Allcode,
              as: "jobTypeSettingData",
              attributes: ["value", "code"],
            },
            {
              model: db.Allcode,
              as: "expTypeSettingData",
              attributes: ["value", "code"],
            },
            {
              model: db.Allcode,
              as: "salaryTypeSettingData",
              attributes: ["value", "code"],
            },
            {
              model: db.Allcode,
              as: "provinceSettingData",
              attributes: ["value", "code"],
            },
          ],
          limit: +data.limit,
          offset: +data.offset,
          raw: true,
          nest: true,
        };
        if (data.categoryJobCode)
          objectFillter.where = {
            ...objectFillter.where,
            categoryJobCode: data.categoryJobCode,
          };
        let isHiddenPercent = false;
        let listUserSetting = await db.UserSetting.findAndCountAll(
          objectFillter
        );
        let listSkillRequired = [];
        let bonus = 0;
        if (data.experienceJobCode) {
          bonus++;
        }
        if (data.salaryCode) {
          bonus++;
        }
        if (data.provinceCode) {
          bonus++;
        }
        if (bonus > 0) {
          listUserSetting.rows.map((item) => {
            item.bonus = 0;
            if (item.expTypeSettingData.code === data.experienceJobCode) {
              item.bonus++;
            }
            if (item.salaryTypeSettingData.code === data.salaryCode) {
              item.bonus++;
            }
            if (item.provinceSettingData.code === data.provinceCode) {
              item.bonus++;
            }
          });
        }
        let lengthSkill = 0;
        let lengthOtherSkill = 0;
        if (data.listSkills) {
          data.listSkills = data.listSkills.split(",");
          lengthSkill = data.listSkills.length;
          listSkillRequired = await db.Skill.findAll({
            where: { id: data.listSkills },
            attributes: ["id", "name"],
          });
        }
        if (data.otherSkills) {
          data.otherSkills = data.otherSkills.split(",");
          lengthOtherSkill = data.otherSkills.length;
          data.otherSkills.forEach((item) => {
            listSkillRequired.push({
              id: item,
              name: item,
            });
          });
        }
        if (listSkillRequired.length > 0 || bonus > 0) {
          for (let i = 0; i < listUserSetting.rows.length; i++) {
            let match = await caculateMatchUserWithFilter(
              listUserSetting.rows[i],
              listSkillRequired
            );
            if (bonus > 0) {
              listUserSetting.rows[i].file =
                Math.round(
                  ((match + listUserSetting.rows[i].bonus) /
                    (lengthSkill * 2 + bonus + lengthOtherSkill) +
                    Number.EPSILON) *
                    100
                ) + "%";
            } else {
              listUserSetting.rows[i].file =
                Math.round(
                  (match / (lengthSkill * 2 + lengthOtherSkill) +
                    Number.EPSILON) *
                    100
                ) + "%";
            }
          }
        } else {
          isHiddenPercent = true;
          listUserSetting.rows = listUserSetting.rows.map((item) => {
            delete item.file;
            return item;
          });
        }
        resolve({
          errCode: 0,
          data: listUserSetting.rows,
          count: listUserSetting.count,
          isHiddenPercent: isHiddenPercent,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};

let checkSeeCandiate = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.userId && !data.companyId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        let company;
        if (data.userId !== "null") {
          let user = await db.User.findOne({
            where: { id: data.userId },
            attributes: {
              exclude: ["userId"],
            },
          });
          company = await db.Company.findOne({
            where: { id: user.companyId },
            attributes: ["id", "allowCv", "allowCvFree"],
            raw: false,
          });
        } else {
          company = await db.Company.findOne({
            where: { id: data.companyId },
            attributes: ["id", "allowCv", "allowCvFree"],
            raw: false,
          });
        }
        if (!company) {
          resolve({
            errCode: 2,
            errMessage: "Không tìm thấy công ty người dùng sở hữu",
          });
        } else {
          if (company.allowCvFree > 0) {
            company.allowCvFree -= 1;
            await company.save();
            resolve({
              errCode: 0,
              errMessage: "Ok",
            });
          } else if (company.allowCv > 0) {
            company.allowCv -= 1;
            await company.save();
            resolve({
              errCode: 0,
              errMessage: "Ok",
            });
          } else {
            resolve({
              errCode: 1,
              errMessage: "Công ty bạn đã hết lượt xem",
            });
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  handleCreateCv: handleCreateCv,
  getAllListCvByPost: getAllListCvByPost,
  getDetailCvById: getDetailCvById,
  getAllCvByUserId: getAllCvByUserId,
  getStatisticalCv: getStatisticalCv,
  fillterCVBySelection: fillterCVBySelection,
  checkSeeCandiate: checkSeeCandiate,
};
