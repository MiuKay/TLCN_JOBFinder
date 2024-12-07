const { Op, and, where } = require("sequelize");
import e from "express";
import db from "../models/index";
const cloudinary = require("../utils/cloudinary");
require("dotenv").config();
var nodemailer = require("nodemailer");
let sendmail = (note, userMail, link = null) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  var mailOptions = {
    from: process.env.EMAIL_APP,
    to: userMail,
    subject: "Thông báo từ trang Job Finder",
    html: note,
  };
  if (link) {
    mailOptions.html =
      note +
      ` <br>
        xem thông tin công ty <a href='${process.env.URL_REACT}/${link}'>Tại đây</a> `;
  }

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
    } else {
    }
  });
};
let checkCompany = (name, id = null) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!name) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let company = null;
        if (id) {
          company = await db.Company.findOne({
            where: { name: name, id: { [Op.ne]: id } },
          });
        } else {
          company = await db.Company.findOne({
            where: { name: name },
          });
        }
        if (company) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let checkUserPhone = (userPhone) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userPhone) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let account = await db.Account.findOne({
          where: { phonenumber: userPhone },
        });
        if (account) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

let handleCreateNewCompany = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.phonenumber ||
        !data.address ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown ||
        !data.amountEmployer ||
        !data.userId
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        if (await checkCompany(data.name)) {
          resolve({
            errCode: 2,
            errMessage: "Tên công ty đã tồn tại",
          });
        } else {
          let thumbnailUrl = "";
          let coverimageUrl = "";
          if (data.thumbnail && data.coverimage) {
            const uploadedThumbnailResponse = await cloudinary.uploader.upload(
              data.thumbnail,
              {
                upload_preset: "dev_setups",
              }
            );
            const uploadedCoverImageResponse = await cloudinary.uploader.upload(
              data.coverimage,
              {
                upload_preset: "dev_setups",
              }
            );
            thumbnailUrl = uploadedThumbnailResponse.url;
            coverimageUrl = uploadedCoverImageResponse.url;
          }

          let company = await db.Company.create({
            name: data.name,
            thumbnail: thumbnailUrl,
            coverimage: coverimageUrl,
            descriptionHTML: data.descriptionHTML,
            descriptionMarkdown: data.descriptionMarkdown,
            website: data.website,
            address: data.address,
            phonenumber: data.phonenumber,
            amountEmployer: data.amountEmployer,
            taxnumber: data.taxnumber,
            statusCode: "S1",
            userId: data.userId,
            censorCode: data.file ? "CS3" : "CS2",
            file: data.file ? data.file : null,
          });
          let user = await db.User.findOne({
            where: { id: data.userId },
            raw: false,
            attributes: {
              exclude: ["userId"],
            },
          });

          let account = await db.Account.findOne({
            where: { userId: data.userId },
            raw: false,
          });

          if (user && account) {
            user.companyId = company.id;
            await user.save();
            account.roleCode = "COMPANY";
            await account.save();
            resolve({
              errCode: 0,
              errMessage: "Đã tạo công ty thành công",
              companyId: company.id,
            });
          } else {
            resolve({
              errCode: 2,
              errMessage: "Không tìm thấy người dùng",
            });
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let handleUpdateCompany = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.id ||
        !data.name ||
        !data.phonenumber ||
        !data.address ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown ||
        !data.amountEmployer
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        if (await checkCompany(data.name, data.id)) {
          resolve({
            errCode: 2,
            errMessage: "Tên công ty đã tồn tại",
          });
        } else {
          let res = await db.Company.findOne({
            where: {
              id: data.id,
            },
            raw: false,
          });
          if (res) {
            if (res.statusCode == "S1") {
              if (data.thumbnail) {
                let thumbnailUrl = "";
                const uploadedThumbnailResponse =
                  await cloudinary.uploader.upload(data.thumbnail, {
                    upload_preset: "dev_setups",
                  });
                thumbnailUrl = uploadedThumbnailResponse.url;
                res.thumbnail = thumbnailUrl;
              }
              if (data.coverimage) {
                let coverImageUrl = "";
                const uploadedcoverImageResponse =
                  await cloudinary.uploader.upload(data.coverimage, {
                    upload_preset: "dev_setups",
                  });
                coverImageUrl = uploadedcoverImageResponse.url;
                res.coverimage = coverImageUrl;
              }
              res.name = data.name;
              res.descriptionHTML = data.descriptionHTML;
              res.descriptionMarkdown = data.descriptionMarkdown;
              res.website = data.website;
              res.address = data.address;
              res.amountEmployer = data.amountEmployer;
              res.taxnumber = data.taxnumber;
              res.phonenumber = data.phonenumber;
              if (data.file) {
                res.file = data.file;
                res.censorCode = "CS3";
              } else if (res.file) {
                res.censorCode = "CS3";
              } else {
                res.censorCode = "CS2";
              }
              await res.save();
              resolve({
                errCode: 0,
                errMessage: "Đã sửa thông tin công ty thành công",
              });
            } else {
              resolve({
                errCode: 2,
                errMessage:
                  "Công ty bạn đã bị chặn không thể thay đổi thông tin",
              });
            }
          } else {
            resolve({
              errCode: 2,
              errMessage: "Không tìm thấy công ty",
            });
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let handleBanCompany = (companyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!companyId) {
        resolve({
          errCode: 1,
          errMessage: `Missing required parameters !`,
        });
      } else {
        let foundCompany = await db.Company.findOne({
          where: { id: companyId },
          raw: false,
        });
        if (!foundCompany) {
          resolve({
            errCode: 2,
            errMessage: `Công ty không tồn tại`,
          });
        }
        foundCompany.statusCode = "S2";
        await foundCompany.save();
        resolve({
          errCode: 0,
          message: `Đã dừng hoạt động công ty`,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let handleUnBanCompany = (companyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!companyId) {
        resolve({
          errCode: 1,
          errMessage: `Missing required parameters !`,
        });
      } else {
        let foundCompany = await db.Company.findOne({
          where: { id: companyId },
          raw: false,
        });
        if (!foundCompany) {
          resolve({
            errCode: 2,
            errMessage: `Công ty không tồn tại`,
          });
        } else {
          foundCompany.statusCode = "S1";
          await foundCompany.save();
          resolve({
            errCode: 0,
            message: `Đã mở hoạt động cho công ty`,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
// let handleAccecptCompany = (data) => {
//     return new Promise(async (resolve, reject) => {
//         try {

//             if (!data.companyId) {
//                 resolve({
//                     errCode: 1,
//                     errMessage: `Missing required parameters !`
//                 })
//             } else {
//                 let foundCompany = await db.Company.findOne({
//                     where: { id: data.companyId },
//                     raw: false
//                 })
//                 if (foundCompany) {
//                     if (data.note == 'null')
//                     {
//                         foundCompany.censorCode = "CS1"
//                     }
//                     else {
//                         foundCompany.censorCode = "CS2"
//                     }
//                     await foundCompany.save()
//                     let note = data.note != 'null' ? data.note : `Công ty ${foundCompany.name} của bạn đã kiểm duyệt thành công`
//                     let user = await db.User.findOne({
//                         where: { id: foundCompany.userId },
//                         attributes: {
//                             exclude: ['userId']
//                         }
//                     })
//                     if (data.note != 'null') {
//                         sendmail(`Công ty bạn đã bị từ chối vì: ${note}`, user.email,"admin/edit-company")
//                     }
//                     else {
//                         sendmail(`Công ty của bạn đã được kiểm duyệt thành công`,user.email,`detail-company/${foundCompany.id}`)
//                     }
//                     resolve({
//                         errCode: 0,
//                         errMessage: data.note != 'null' ? "Đã quay lại trạng thái chờ" : "Đã duyệt công ty thành công"
//                     })
//                 }
//                 else {
//                     resolve({
//                         errCode: 2,
//                         errMessage: 'Không tồn tại bài viết'
//                     })
//                 }
//             }

//         } catch (error) {
//             reject(error)
//         }
//     })
// }
let handleAccecptCompany = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.companyId) {
        resolve({
          errCode: 1,
          errMessage: `Missing required parameters !`,
        });
      } else {
        let foundCompany = await db.Company.findOne({
          where: { id: data.companyId },
          raw: false,
        });
        if (foundCompany) {
          if (data.note == "null") {
            foundCompany.censorCode = "CS1";
          } else {
            foundCompany.censorCode = "CS2";
          }
          await foundCompany.save();
          let note =
            data.note != "null"
              ? data.note
              : `Công ty ${foundCompany.name} của bạn đã kiểm duyệt thành công`;
          let user = await db.User.findOne({
            where: { id: foundCompany.userId },
            attributes: {
              exclude: ["userId"],
            },
          });
          if (data.note != "null") {
            sendmail(
              `Công ty bạn đã bị từ chối vì: ${note}`,
              user.email,
              "admin/edit-company"
            );
          } else {
            sendmail(
              `Công ty của bạn đã được kiểm duyệt thành công`,
              user.email,
              `detail-company/${foundCompany.id}`
            );
          }
          resolve({
            errCode: 0,
            errMessage:
              data.note != "null"
                ? "Đã từ chối công ty"
                : "Đã duyệt công ty thành công",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Không tồn tại bài viết",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

// let handleAccecptCompany = (data) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       if (!data.companyId) {
//         resolve({
//           errCode: 1,
//           errMessage: `Missing required parameters !`,
//         });
//       } else {
//         let foundCompany = await db.Company.findOne({
//           where: { id: data.companyId },
//           raw: false,
//         });
//         if (foundCompany) {
//           if (data.note === "null") {
//             foundCompany.censorCode = "CS1"; // Đã duyệt công ty thành công
//           } else if (data.note === "reject") {
//             foundCompany.censorCode = "CS2"; // Công ty bị từ chối
//           } else {
//             foundCompany.censorCode = "CS3"; // Quay lại trạng thái chờ
//           }

//           await foundCompany.save();

//           let note =
//             data.note !== "null" && data.note !== "reject"
//               ? data.note
//               : `Công ty ${foundCompany.name} của bạn đã kiểm duyệt thành công`;
//           let user = await db.User.findOne({
//             where: { id: foundCompany.userId },
//             attributes: {
//               exclude: ["userId"],
//             },
//           });

//           if (data.note !== "null" && data.note !== "reject") {
//             sendmail(
//               `Công ty của bạn đã được kiểm duyệt thành công`,
//               user.email,
//               `detail-company/${foundCompany.id}`
//             );
//           } else if (data.note === "reject") {
//             sendmail(
//               `Công ty bạn đã bị từ chối vì: ${note}`,
//               user.email,
//               "admin/edit-company"
//             );
//           } else {
//             sendmail(
//               `Công ty của bạn đã quay lại trạng thái chờ`,
//               user.email,
//               "admin/edit-company"
//             );
//           }

//           resolve({
//             errCode: 0,
//             errMessage:
//               data.note === "null"
//                 ? "Đã duyệt công ty thành công"
//                 : data.note === "reject"
//                 ? "Công ty đã bị từ chối"
//                 : "Đã quay lại trạng thái chờ",
//           });
//         } else {
//           resolve({
//             errCode: 2,
//             errMessage: "Không tồn tại bài viết",
//           });
//         }
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

let handleAddUserCompany = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.phonenumber || !data.companyId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        let company = await db.Company.findOne({
          where: { id: data.companyId },
        });
        if (company) {
          let isExist = await checkUserPhone(data.phonenumber);
          if (isExist) {
            let account = await db.Account.findOne({
              where: {
                phonenumber: data.phonenumber,
              },
              raw: false,
            });
            if (account.roleCode != "EMPLOYER") {
              resolve({
                errCode: 1,
                errMessage: "Tài khoản không phải là nhà tuyển dụng",
              });
            } else {
              let user = await db.User.findOne({
                where: { id: account.userId },
                attributes: {
                  exclude: ["userId"],
                },
                raw: false,
              });
              if (user.companyId) {
                resolve({
                  errCode: 3,
                  errMessage: "Nhân viên đã có công ty",
                });
              } else {
                user.companyId = data.companyId;
                await user.save();
                resolve({
                  errCode: 0,
                  errMessage: "Đã thêm nhà tuyển dụng vào công ty",
                });
              }
            }
          } else {
            resolve({
              errCode: 2,
              errMessage: "Số điện thoại không tồn tại !",
            });
          }
        } else {
          resolve({
            errCode: 2,
            errMessage: "Công ty không tồn tại !",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getListCompany = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.limit || !data.offset) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        let objectFilter = {
          offset: +data.offset,
          limit: +data.limit,
          where: { statusCode: "S1" },
        };
        if (data.search) {
          objectFilter.where = {
            ...objectFilter.where,
            name: { [Op.like]: `%${data.search}%` },
          };
        }
        let company = await db.Company.findAndCountAll(objectFilter);
        resolve({
          errCode: 0,
          data: company.rows,
          count: company.count,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getDetailCompanyById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        let company = await db.Company.findOne({
          where: { id: id },
          include: [
            {
              model: db.Allcode,
              as: "censorData",
              attributes: ["value", "code"],
            },
          ],
          nest: true,
          raw: true,
        });
        if (!company) {
          resolve({
            errCode: 0,
            errorMessage: "Không tồn tại công ty",
          });
        } else {
          let listUserOfCompany = await db.User.findAll({
            where: { companyId: company.id },
            attributes: ["id"],
          });
          listUserOfCompany = listUserOfCompany.map((item) => {
            return {
              userId: item.id,
            };
          });
          company.postData = await db.Post.findAll({
            where: {
              [Op.and]: [{ statusCode: "PS1" }, { [Op.or]: listUserOfCompany }],
            },
            order: [["createdAt", "DESC"]],
            limit: 5,
            offset: 0,
            attributes: {
              exclude: ["detailPostId"],
            },
            nest: true,
            raw: true,
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
          });
          if (company.file) {
            company.file = new Buffer(company.file, "base64").toString(
              "binary"
            );
          }
          resolve({
            errCode: 0,
            data: company,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getDetailCompanyByUserId = (data) => {
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
          });
        } else {
          company = await db.Company.findOne({
            where: { id: data.companyId },
          });
        }
        if (!company) {
          resolve({
            errCode: 2,
            errMessage: "Không tìm thấy công ty người dùng sở hữu",
          });
        } else {
          if (company.file) {
            company.file = new Buffer(company.file, "base64").toString(
              "binary"
            );
          }
          resolve({
            errCode: 0,
            data: company,
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllUserByCompanyId = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.limit || !data.offset || !data.companyId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter !",
        });
      } else {
        let res = await db.User.findAndCountAll({
          where: { companyId: data.companyId },
          limit: +data.limit,
          offset: +data.offset,
          attributes: {
            exclude: ["password", "userId"],
          },
          include: [
            {
              model: db.Allcode,
              as: "genderData",
              attributes: ["value", "code"],
            },
            {
              model: db.Account,
              as: "userAccountData",
              attributes: {
                exclude: ["password"],
              },
              include: [
                {
                  model: db.Allcode,
                  as: "roleData",
                  attributes: ["value", "code"],
                },
                {
                  model: db.Allcode,
                  as: "statusAccountData",
                  attributes: ["value", "code"],
                },
              ],
            },
          ],
          raw: true,
          nest: true,
        });
        resolve({
          errCode: 0,
          data: res.rows,
          count: res.count,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
let handleQuitCompany = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.userId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        let user = await db.User.findOne({
          where: {
            id: data.userId,
          },
          attributes: {
            exclude: ["userId"],
          },
          raw: false,
        });
        if (user) {
          let account = await db.Account.findOne({
            where: { userId: user.id },
            raw: false,
          });
          if (account.roleCode == "COMPANY") {
            account.roleCode = "EMPLOYER";
            await account.save();
          }
          let company = await db.Company.findOne({
            where: { id: user.companyId },
          });
          await db.Post.update(
            {
              userId: company.userId,
            },
            {
              where: { userId: user.id },
            }
          );
          user.companyId = null;
          await user.save();
          resolve({
            errCode: 0,
            errMessage: "Đã rời công ty thành công",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Người dùng không tồn tại",
          });
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};
let getAllCompanyByAdmin = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.limit || data.offset === "") {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters !",
        });
      } else {
        let objectFilter = {
          order: [["updatedAt", "DESC"]],
          limit: +data.limit,
          offset: +data.offset,
          attributes: {
            exclude: ["detailPostId"],
          },
          nest: true,
          raw: true,
          include: [
            {
              model: db.Allcode,
              as: "statusCompanyData",
              attributes: ["value", "code"],
            },
            {
              model: db.Allcode,
              as: "censorData",
              attributes: ["value", "code"],
            },
          ],
        };
        if (data.search) {
          objectFilter.where = {
            [Op.or]: [
              {
                name: { [Op.like]: `%${data.search}%` },
              },
              {
                id: { [Op.like]: `%${data.search}%` },
              },
            ],
          };
        }
        if (data.censorCode) {
          objectFilter.where = {
            ...objectFilter.where,
            censorCode: data.censorCode,
          };
        }
        let company = await db.Company.findAndCountAll(objectFilter);
        resolve({
          errCode: 0,
          data: company.rows,
          count: company.count,
        });
      }
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = {
  handleCreateNewCompany: handleCreateNewCompany,
  handleUpdateCompany: handleUpdateCompany,
  handleBanCompany: handleBanCompany,
  handleUnBanCompany: handleUnBanCompany,
  handleAddUserCompany: handleAddUserCompany,
  getListCompany: getListCompany,
  getDetailCompanyById: getDetailCompanyById,
  getDetailCompanyByUserId: getDetailCompanyByUserId,
  getAllUserByCompanyId: getAllUserByCompanyId,
  handleQuitCompany: handleQuitCompany,
  getAllCompanyByAdmin: getAllCompanyByAdmin,
  handleAccecptCompany: handleAccecptCompany,
};
