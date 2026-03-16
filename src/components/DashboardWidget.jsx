import React from "react";
import "./DashboardWidget.css";

const DashboardWidget = ({ title, value }) => {
  return (
    <div className="dashboard-widget">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};

export default DashboardWidget;
