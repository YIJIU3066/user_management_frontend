import React from "react";
import "../styles/tool_bar.css";

const ToolBar = ({
  viewMode = "list",
  onViewModeChange,
  searchValue = "",
  onSearchChange,
  onAddUser,
  page = 1,
  onPrevPage,
  onNextPage,
  totalPage = 1,
}) => {
  return (
    <div className="tool-bar">
      <div className="tool-bar-left">
        <button
          className={viewMode === "list" ? "active" : ""}
          onClick={() => onViewModeChange && onViewModeChange("list")}
        >
          List
        </button>
        <button
          className={viewMode === "table" ? "active" : ""}
          onClick={() => onViewModeChange && onViewModeChange("table")}
        >
          Table
        </button>
      </div>
      <div className="tool-bar-center">
        <div className="search-container">
          <input
            className="search-bar"
            type="text"
            placeholder="搜尋使用者..."
            value={searchValue}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
          <img src="search.png" alt="search" className="search-icon" />
        </div>
      </div>
      <div className="tool-bar-right">
        <button className="add-btn" onClick={onAddUser}>
          ＋
        </button>
        <button className="page-btn" onClick={onPrevPage} disabled={page <= 1}>
          {"<"}
        </button>
        <span className="page-num">{page}</span>
        <button
          className="page-btn"
          onClick={onNextPage}
          disabled={page >= totalPage}
        >
          {">"}
        </button>
      </div>
    </div>
  );
};

export default ToolBar;
