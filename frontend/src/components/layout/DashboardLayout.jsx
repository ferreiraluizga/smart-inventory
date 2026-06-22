import Sidebar from "../ui/sidebar/Sidebar";

function DashboardLayout({ children }) {
    return (
        <div className="container-fluid min-vh-100 bg-light p-0">
            
            <div className="p-4 pt-5 pb-5 mb-5" style={{ overflowY: "auto" }}>
                {children}
            </div>

            <Sidebar />
        </div>
    );
}

export default DashboardLayout;
