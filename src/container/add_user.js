import React, { useState } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import "../styles/add_user.css";
import axios from "../utils/axios";
import { validateForm, formatPhoneNumber } from "../utils/validation";
import {
  JOB_MAP,
  convertGenderToNumber,
  convertJobToNumber,
} from "../utils/convert";

const AddUser = ({ onClose, onExit, onUserAdded }) => {
  const [form, setForm] = useState({
    id: 0,
    name: "",
    gender: "男",
    birthday: "",
    job: "",
    phone: "",
    imgFile: null,
    imgUrl: "",
  });

  const [errors, setErrors] = useState({});
  const [edited, setEdited] = useState(false);

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

  // 處理圖片
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
        imgUrl: URL.createObjectURL(file),
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
    setForm((prev) => ({ ...prev, imgFile: null, imgUrl: "" }));
  };

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
      }

      const response = await axios.post("/users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Success",
        text: "Add User Success!",
        icon: "success",
      });

      console.log("新增使用者成功：", response.data);

      if (onUserAdded) {
        onUserAdded();
      }

      onClose();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Something Wrong",
        icon: "error",
      });
      console.error("新增使用者失敗：", error.message);
    }
  };

  return (
    <div className="add-user">
      <div className="add-user-container">
        <button
          className="close-btn"
          onClick={() => (edited ? onExit() : onClose())}
        >
          ×
        </button>
        <h2>Add User</h2>
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
            {errors.birthday && (
              <span className="error-message">{errors.birthday}</span>
            )}
          </div>

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
              // value={formatPhoneNumber(form.phone)}
              value={form.phone}
              onBlur={(e) =>
                setForm((prev) => ({
                  ...prev,
                  phone: formatPhoneNumber(e.target.value),
                }))
              }
              onChange={handleChange}
              required
            />
            {errors.phone && (
              <span className="error-message">{errors.phone}</span>
            )}
          </div>

          {/* img */}
          <div className="form-row">
            <label className="attr">照片</label>
            <div className="img-upload-group">
              {form.imgUrl ? (
                // 有圖片時顯示預覽
                <div className="img-preview">
                  <img src={form.imgUrl} alt="預覽" />
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
          {/* submit */}
          <div className="form-submit">
            <button type="submit" className="submit-btn" onClick={handleSubmit}>
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
