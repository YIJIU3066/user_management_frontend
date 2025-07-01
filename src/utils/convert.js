const JOB_MAP = { 0: "工程師", 1: "學生", 2: "教師", 3: "無業" };
const GENDER_MAP = { 0: "女", 1: "男" };

const convertGenderToNumber = (gender) => {
  return gender === "男" ? 1 : 0;
};

const convertJobToNumber = (job) => {
  const jobIndex = Object.values(JOB_MAP).indexOf(job);
  return jobIndex !== -1 ? jobIndex : 0;
};

const convertGenderToString = (gender) => {
  return gender === 1 ? "男" : "女";
};

const convertJobToString = (job) => {
  return JOB_MAP[job] || "工程師";
};

const formatDateForInput = (dateString) => {
  if (!dateString) return "";

  // 移除空格並轉換為 yyyy-MM-dd 格式
  const cleanDate = dateString.replace(/\s/g, "");

  // 如果已經是正確格式，直接返回
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleanDate)) {
    return cleanDate;
  }

  // 如果是其他格式，嘗試轉換
  try {
    const date = new Date(cleanDate);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("日期轉換失敗：", error);
    return "";
  }
};
export {
  JOB_MAP,
  GENDER_MAP,
  convertGenderToNumber,
  convertJobToNumber,
  convertGenderToString,
  convertJobToString,
  formatDateForInput,
};
