import React from "react";
import "../styles/user_card.css";
import { formatPhoneNumber } from "../utils/validation";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const UserCard = ({ user, onEdit }) => {
  const { id, name, gender, job, birthday, phone, imgSrc } = user;

  const handleClick = () => {
    if (onEdit) {
      onEdit(user);
    }
  };
  return (
    <div className="user-card" onClick={handleClick}>
      <div className="user-card-img">
        {imgSrc ? (
          <img src={`${API_BASE_URL}${imgSrc}`} alt="User" />
        ) : (
          <img src="user_256.png" alt="User" />
        )}
      </div>
      <div className="user-card-info">
        <div className="user-info-item">
          <strong>
            {name} | {gender} | {job}
          </strong>
        </div>
        <div className="user-info-item">{birthday}</div>
        <div className="user-info-item">{formatPhoneNumber(phone)}</div>
      </div>
    </div>
  );
};

export default UserCard;
