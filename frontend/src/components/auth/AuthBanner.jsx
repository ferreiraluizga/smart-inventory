function AuthBanner() {
    return (
        <div className="col-md-6 d-none d-md-flex bg-warning text-dark justify-content-center align-items-center">
            <div className="text-center">
                <h1 className="display-4 fw-bold">
                    Smart Inventory
                </h1>

                <p className="lead">
                    Gerencie seu estoque de forma inteligente.
                </p>
            </div>
        </div>
    );
}

export default AuthBanner;