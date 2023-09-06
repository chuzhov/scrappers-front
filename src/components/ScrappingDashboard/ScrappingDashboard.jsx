import './ScrappingDashboard.css';

const ScrappingDashboard = props => {
  return (
    <div className="dashboard-wrapper">
      <p className="dash__title">
        Сайт: <span className="dash__site-name">EN</span>
      </p>
      <p className="dash__regular">
        Час останнього сканування: <span>2023-09-03 20:00</span>
      </p>
    </div>
  );
};

export default ScrappingDashboard;
