function DashboardCard({icon, iconBg, title, value, unit, subtitle}) {
    return (
        <div className="card border-0 shadow-sm p-3 bg-white h-100 custom-card-hover"
             style={{ transition: "all 0.25s ease-in-out" }}
        >
            <div className="d-flex align-items-center">
                <div className={`${iconBg} p-3 rounded me-3`}>
                    <i className={`bi bi-${icon} fs-4`}></i>
                </div>
                <div className="overflow-hidden">
                    <h6 className="text-muted mb-1 text-uppercase small fw-bold">{title}</h6>
                    <h3 className="fw-bold mb-0">
                        {value} {unit && <span className="fs-6 text-muted fw-normal">{unit}</span>}
                    </h3>
                    {subtitle && (
                        <small className="text-muted text-xs d-block text-truncate">
                            {subtitle}
                        </small>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DashboardCard;