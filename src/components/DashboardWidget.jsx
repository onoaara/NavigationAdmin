import "./DashboardWidget.css";

const DashboardWidget = ({ title, value, icon, color }) => {
  return (
    <div className="dashboard-widget" style={{ borderTop: `4px solid ${color || "#3f51b5"}` }}>
      <div className="widget-icon" style={{ backgroundColor: `${color}15`, color: color }}>
        {icon}
      </div>
      <div className="widget-info">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </div>
  );
};

export default DashboardWidget;
