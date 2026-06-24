import Sidebar from "../ui/sidebar/Sidebar";
import { motion } from "framer-motion";

function DashboardLayout({ children }) {
    return (
        <div className="container-fluid min-vh-100 bg-light p-0">

            <div className="p-4 pt-5 pb-5 mb-5" style={{ overflowY: "auto" }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    {children}
                </motion.div>
            </div>

            <Sidebar />
        </div>
    );
}

export default DashboardLayout;
