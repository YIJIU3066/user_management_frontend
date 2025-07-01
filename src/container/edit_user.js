import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import "../styles/add_user.css";
import axios from "../utils/axios";
import {
  JOB_MAP,
  convertGenderToNumber,
  convertJobToNumber,
} from "../utils/convert";
import { validateForm, formatPhoneNumber } from "../utils/validation";

// 圖片移除 imgurl
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EditUser = ({ user, onClose, onExit, onUserEdited }) => {
  const [form, setForm] = useState({
    id: 0,
    name: "",
    gender: "男",
    birthday: "",
    job: "",
    phone: "",
    imgFile: null,
    imgSrc: "",
  });

  const [errors, setErrors] = useState({});
  const [edited, setEdited] = useState(false);

  // 當 user 資料載入時，初始化表單
  useEffect(() => {
    // console.log(user);
    if (user) {
      setForm({
        name: user.name || "",
        gender: user.gender,
        birthday: user.birthday || "",
        job: user.job,
        phone: user.phone || "",
        imgFile: null,
        imgSrc: user.imgSrc ? `${API_BASE_URL}${user.imgSrc}` : "",
      });
    }
  }, [user]);

  const jobOptions = Object.values(JOB_MAP).map((job) => ({
    value: job,
    label: job,
  }));

  const customStyles = {
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#333" : "#fff",
      color: state.isFocused ? "#fff" : "#333",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: "#333",
        color: "#fff",
      },
    }),
    control: (provided, state) => ({
      ...provided,
      borderColor: errors.job ? "#dc3545" : state.isFocused ? "#333" : "#ddd",
      boxShadow: errors.job
        ? "0 0 0 1px #dc3545"
        : state.isFocused
        ? "0 0 0 1px #333"
        : "none",
      "&:hover": {
        borderColor: errors.job ? "#dc3545" : "#333",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#333",
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 2,
    }),
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdited(true);
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleJobChange = (selectedOption) => {
    setForm((prev) => ({
      ...prev,
      job: selectedOption ? selectedOption.value : "",
    }));
    if (errors.job) {
      setErrors((prev) => ({ ...prev, job: "" }));
    }
  };

  // 處理性別選擇
  const handleGender = (gender) => {
    setForm({ ...form, gender });
  };

  const handleImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 驗證檔案類型
      if (!file.type.startsWith("image/")) {
        Swal.fire({
          title: "Error",
          text: "請選擇圖片檔案",
          icon: "error",
        });
        return;
      }

      // 驗證檔案大小（例如 5MB）
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "Error",
          text: "圖片檔案不能超過 5MB",
          icon: "error",
        });
        return;
      }

      setForm((prev) => ({
        ...prev,
        imgFile: file,
        imgSrc: URL.createObjectURL(file),
      }));
    }
  };

  // 拖曳上傳圖片
  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleImg({ target: { files: [files[0]] } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleRemoveImg = () => {
    setForm((prev) => ({ ...prev, imgFile: null, imgSrc: "" }));
  };

  // 更新使用者
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = validateForm(form);

    if (!validation.isValid) {
      setErrors(validation.errors);

      // 顯示第一個錯誤
      const firstError = Object.values(validation.errors)[0];
      Swal.fire({
        title: "Please Fix Error",
        text: firstError,
        icon: "error",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("gender", convertGenderToNumber(form.gender));
      formData.append("birthday", form.birthday);
      formData.append("job", convertJobToNumber(form.job));
      formData.append("phone", form.phone);

      if (form.imgFile) {
        formData.append("imgSrc", form.imgFile);
      } else {
        formData.append("imgSrc", "");
      }

      const response = await axios.put(`/users/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Success",
        text: "Update User Success!",
        icon: "success",
      });

      console.log("Update Success", response.data);

      if (onUserEdited) {
        onUserEdited();
      }

      onClose();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Update Failed",
        icon: "error",
      });
      console.error("新增使用者失敗：", error.message);
    }
  };

  // 刪除使用者
  const handleDelete = async () => {
    // console.log(user);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/users/${user.id}`);

        Swal.fire("Deleted!", "User has been deleted.", "success");

        if (onUserEdited) {
          onUserEdited();
        }

        onClose();
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: "Delete Failed",
          icon: "error",
        });
      }
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="add-user">
      <div className="add-user-container">
        <button
          className="close-btn"
          onClick={() => (edited ? onExit() : onClose())}
        >
          ×
        </button>
        <h2>Edit User</h2>
        <form className="add-user-form" onSubmit={handleSubmit}>
          {/* name */}
          <div className="form-row">
            <label className="attr">姓名</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
            {errors.name && (
              <span className="error-message">{errors.name}</span>
            )}
          </div>

          {/* gender */}
          <div className="form-row">
            <label className="attr">性別</label>
            <div className="gender-group">
              <button
                type="button"
                className={form.gender === "男" ? "active" : ""}
                onClick={() => handleGender("男")}
              >
                生理男
              </button>
              <button
                type="button"
                className={form.gender === "女" ? "active" : ""}
                onClick={() => handleGender("女")}
              >
                生理女
              </button>
            </div>
            {errors.gender && (
              <span className="error-message">{errors.gender}</span>
            )}
          </div>

          {/* birthday */}
          <div className="form-row">
            <label htmlFor="birthday" className="attr">
              生日
            </label>
            <input
              id="birthday"
              name="birthday"
              type="date"
              min="1900-01-01"
              // max={new Date().toISOString().split("T")[0]}
              value={form.birthday}
              onChange={handleChange}
              required
            />
          </div>
          {errors.birthday && (
            <span className="error-message">{errors.birthday}</span>
          )}

          {/* job */}
          <div className="form-row">
            <label className="attr">職業</label>
            <div className="job-group">
              <Select
                name="job"
                value={jobOptions.find((option) => option.value === form.job)}
                onChange={handleJobChange}
                options={jobOptions}
                styles={customStyles}
                placeholder="請選擇職業"
                isClearable
              />
            </div>
            {errors.job && <span className="error-message">{errors.job}</span>}
          </div>

          {/* phone */}
          <div className="form-row">
            <label className="attr">電話</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              // value={formatPhoneNumber(form.phone)}
              onBlur={(e) =>
                setForm((prev) => ({
                  ...prev,
                  phone: formatPhoneNumber(e.target.value),
                }))
              }
              onChange={handleChange}
              required
            />
          </div>
          {errors.phone && (
            <span className="error-message">{errors.phone}</span>
          )}

          {/* img */}
          <div className="form-row">
            <label className="attr">照片</label>
            <div className="img-upload-group">
              {form.imgSrc ? (
                // 有圖片時顯示預覽
                <div className="img-preview">
                  <img src={form.imgSrc} alt="預覽" />
                  <div className="img-actions">
                    <label className="change-img-btn">
                      <span>更換</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImg}
                      />
                    </label>
                    <button
                      type="button"
                      className="remove-img-btn"
                      onClick={handleRemoveImg}
                    >
                      移除
                    </button>
                  </div>
                </div>
              ) : (
                // 沒有圖片時顯示上傳按鈕
                <label
                  className="upload-btn"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <img
                    className="upload-icon"
                    src="up-loading.png"
                    alt="upload"
                  />
                  <span>點擊或拖曳上傳圖片</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImg}
                  />
                </label>
              )}
            </div>
          </div>
          {/* buttons */}
          <div className="form-submit">
            <button type="submit" className="submit-btn">
              Update User
            </button>
            <button type="button" className="delete-btn" onClick={handleDelete}>
              Delete User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
