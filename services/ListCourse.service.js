const { ListCourse } = require("../models/ListCourse.model");
const { ListCategoryCourse } = require("../models/ListCategoryCrouse.model");
const { login } = require("../services/User.service");
const { User } = require("../models/User.model");

module.exports.createCourse = (req, res, next) => {
  const user = req.user._id;
  console.log(req.user._id);
  const {
    maKhoaHoc,
    biDanh,
    tenKhoaHoc,
    moTa,
    luotXem,
    danhGia,
    hinhAnh,
    ngayTao,
    soLuongHocVien,
    danhMucKhoaHoc,
    price,
  } = req.body;

  return ListCourse.create({
    maKhoaHoc,
    biDanh,
    tenKhoaHoc,
    moTa,
    luotXem,
    danhGia,
    hinhAnh,
    ngayTao,
    soLuongHocVien,
    danhMucKhoaHoc,
    nguoiTao: user,
    price
  })
    .then((course) => {
      console.log(course);
      return res.status(200).json(course);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

module.exports.getCourse = (req, res, next) => {
  const tenKhoaHoc = req.query.tenKhoaHoc;
  if (tenKhoaHoc) {
    return ListCourse.find({ tenKhoaHoc })
      .populate("danhMucKhoaHoc")
      .populate("nguoiTao")
      .populate("lstHocVien")
      .then((khoahoc) => {
        return res.status(200).json(khoahoc);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  } else {
    return ListCourse.find()
      .populate("danhMucKhoaHoc")
      .populate("nguoiTao")
      .populate("lstHocVien")
      .then((khoahoc) => {
        return res.status(200).json(khoahoc);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  }
};

module.exports.getCourseByCategoryID = (req, res, next) => {
  const { id } = req.params;
  ListCourse.find({ danhMucKhoaHoc: id })
    .then((khoahoc) => {
      console.log(khoahoc);
      return res.status(200).json(khoahoc);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

module.exports.paginationCourse = (req, res, next) => {
  var { currentPage, pageSize } = req.query;
  console.log(currentPage, pageSize);
  if (currentPage) {
    currentPage = parseInt(currentPage);
    if (currentPage < 1) {
      currentPage = 1;
    }
    var soLuongBoQua = (currentPage - 1) * pageSize;
    ListCourse.find({})
      .skip(soLuongBoQua)
      .limit(pageSize)
      .then((course) => {
        return res.status(200).json(course);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  } else {
    return ListCourse.find()
      .then((users) => {
        return res.status(200).json(users);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  }
};

module.exports.getCourseInfor = (req, res, next) => {
  const { maKhoaHoc } = req.query;

  ListCourse.find({ maKhoaHoc })
    .then((khoahoc) => {
      console.log(khoahoc);
      return res.status(200).json(khoahoc);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

module.exports.updateCourse = (req, res, next) => {
  const { id } = req.params;
  // console.log("user", id);
  // console.log("object", req.user);
  const {
    maKhoaHoc,
    biDanh,
    tenKhoaHoc,
    moTa,
    hinhAnh,
    ngayTao,
    maDanhMucKhoaHoc,
  } = req.body;
  ListCourse.findById(id)
    .then((course) => {
      if (!course) {
        return Promise.reject({ status: 404, message: "User Not Found" });
      }
      course.maKhoaHoc = maKhoaHoc;
      course.biDanh = biDanh;
      course.tenKhoaHoc = tenKhoaHoc;
      course.moTa = moTa;
      course.hinhAnh = hinhAnh;
      course.ngayTao = ngayTao;
      course.maDanhMucKhoaHoc = maDanhMucKhoaHoc;

      return course.save();
    })
    .then((course) => res.status(200).json(course))
    .catch((err) => {
      return res.status(500).json(err);
    });
};

module.exports.deleteCourse = (req, res, next) => {
  const { id } = req.params;
  let _course;
  ListCourse.findById(id)
    .then((course) => {
      if (!course) {
        return Promise.reject({
          status: 404,
          message: "course Not Found",
        });
      }
      _course = course;
      return course.deleteOne();
    })
    .then(() => res.status(200).json({ message: "delete successfully" }))
    .catch((err) => res.status(500).json({ message: err.message }));
};

module.exports.searchCourse = (req, res, next) => {
  var course = req.query.course;
  console.log(course)
  if (course) {
    ListCourse.find({
      maKhoaHoc: new RegExp(".*" + course + ".*", "i"),
    })
      .then((courses) => {
        return res.status(200).json(courses);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  }
};

module.exports.getListStudentOfCourse = (req, res, next) => {
  const maKhoaHoc = req.query.maKhoaHoc;
  if (maKhoaHoc) {
    return (
      ListCourse.find({ maKhoaHoc })
        .select("lstHocVien")
        .populate({
          path: "lstHocVien",
          populate: {
            path: "chiTietKhoaHocGhiDanh",
          },
        })
        // .populate("nguoiTao")
        // .populate("lstHocVien")
        .then((khoahoc) => {
          return res.status(200).json(khoahoc);
        })
        .catch((err) => {
          return res.status(500).json(err);
        })
    );
  }
};

module.exports.getCourseNotRegister = (req, res, next) => {
  const taiKhoan = req.query.taiKhoan;
  console.log(taiKhoan);
  User.find({ taiKhoan }).then((user) => {
    if (!user) {
      return Promise.reject({
        status: 404,
        message: "user not found",
      });
    }
    console.log("user", user);
    const id = user[0]._id;
    ListCourse.find({ lstHocVien: { $ne: id } })
      .then((khoahoc) => {
        console.log("khoaHoc", khoahoc);
        return res.status(200).json(khoahoc);
      })
      .catch((err) => {
        return res.status(500).json(err);
      });
  });
};

module.exports.getUserInforOfCourse = (req, res, next) => {
  const { maKhoaHoc } = req.query;
  console.log(maKhoaHoc);
  User.find({})
    // .populate("lstHocVien")
    .then((khoahoc) => {
      return res.status(200).json(khoahoc);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};

module.exports.registerByUser = async (req, res, next) => {
  const { maKhoaHoc, taiKhoan } = req.body;
  try {
    const khoahoc = await ListCourse.findOne({maKhoaHoc});
    if (!khoahoc) return res.status(404).json({ message: "khoahoc not found" });
    const user = await User.findById({_id: taiKhoan});
    if (!user) return res.status(404).json({ message: "user not found" });

    if (user.chiTietKhoaHocChoXetDuyet.indexOf(khoahoc._id) !== -1) {
      return res.status(404).json({ message: "Khóa học này đã được ghi danh" });
    } else user.chiTietKhoaHocChoXetDuyet.push(khoahoc._id);
    await user.save();
    return res.status(200).json({ message: "Ghi danh thành công" });
  } catch(e) {
    res.status(500).send(e);
  }
};

module.exports.getCourseSpendingApproved = (req, res, next) => {
  const { taiKhoan } = req.body;
  console.log(taiKhoan);
  User.find({ taiKhoan })
    .select({ chiTietKhoaHocChoXetDuyet: 1 })
    .populate("chiTietKhoaHocChoXetDuyet")
    .then((khoahoc) => {
      return res.status(200).json(khoahoc);
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
};
