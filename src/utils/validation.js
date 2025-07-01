export const validateForm = (formData) => {
  const errors = {};
  // name validation
  if (!formData.name || formData.name.trim() === "") {
    errors.name = "姓名不能為空";
  }

  // gender validation
  if (
    !formData.gender ||
    (formData.gender !== "男" && formData.gender !== "女")
  ) {
    errors.gender = "請選擇性別";
  }

  // birthday validation
  if (!formData.birthday) {
    errors.birthday = "請選擇生日";
  } else {
    const selectedDate = new Date(formData.birthday);
    const today = new Date();
    const minDate = new Date("1900-01-01");

    if (selectedDate > today) {
      errors.birthday = "生日不能是未來日期";
    } else if (selectedDate < minDate) {
      errors.birthday = "生日日期無效";
    }
  }

  // job validation
  if (!formData.job) {
    errors.job = "請選擇職業";
  }

  // phone validation
  if (!formData.phone) {
    errors.phone = "電話號碼不能為空";
  } else {
    const phoneNumbers = formData.phone.replace(/\D/g, "");

    if (phoneNumbers.length < 8) {
      errors.phone = "電話號碼至少為 8 位數字";
    } else if (phoneNumbers.length > 15) {
      errors.phone = "電話號碼不能超過 15 位數字";
    }

    if (!/^[\d\s\-\(\)\+]+$/.test(formData.phone)) {
      errors.phone = "電話號碼只能包含數字、空格、-、()、+";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 電話號碼格式化
export const formatPhoneNumber = (phone) => {
  // 移除所有非數字字元
  const numbers = phone.replace(/[^\d]/g, "");
  if (!numbers) return "";

  if (numbers.length <= 4) {
    return numbers;
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 4)}-${numbers.slice(4)}`;
  } else {
    return `${numbers.slice(0, 4)}-${numbers.slice(4, 7)}-${numbers.slice(7)}`;
  }
};
