import React from "react";
import UserCard from "./user_card";
import "../styles/views.css";

const Views = ({ users = [], viewMode = "list", onEdit }) => {
  if (viewMode === "table") {
    return (
      <div className="view-container">
        <div className="view-table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>姓名</th>
                <th>性別</th>
                <th>生日</th>
                <th>職業</th>
                <th>電話</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center" }}>
                    查無資料
                  </td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr
                    key={idx}
                    className="user-table-row"
                    onClick={() => onEdit(user)}
                  >
                    <td>{user.name}</td>
                    <td>{user.gender}</td>
                    <td>{user.birthday || "-"}</td>
                    <td>{user.job}</td>
                    <td>{user.phone}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  return (
    <div className="view-container">
      <div className={"view-list-container"}>
        {users.length === 0 ? (
          <div
            className="no-data"
            // style={{ textAlign: "center", width: "100%" }}
          >
            查無資料
          </div>
        ) : (
          users.map((user, idx) => (
            <UserCard key={idx} user={user} onEdit={onEdit} />
          ))
        )}
      </div>
    </div>
  );
};

export default Views;
