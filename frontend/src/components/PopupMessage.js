import React from "react";
import "../styles/PopupMessage.css";

const PopupMessage = ({ type = "success", message, visible }) => {
    if (!visible) return null;

    return (
        <div className={`popup-message ${type}`}>
            {message}
        </div>
    );
};

export default PopupMessage;
