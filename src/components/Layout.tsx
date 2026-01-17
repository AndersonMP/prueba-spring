import { Link, Outlet, useLocation } from 'react-router-dom';

const Layout = () => {
    const location = useLocation();

    return (
        <div className="app-container">
            <header className="navbar">
                <div className="nav-brand">Hospital Manager</div>
                <nav>
                    <ul className="nav-links">
                        <li>
                            <Link to="/doctores" className={location.pathname.includes('/doctores') ? 'active' : ''}>Doctores</Link>
                        </li>
                        <li>
                            <Link to="/pacientes" className={location.pathname.includes('/pacientes') ? 'active' : ''}>Pacientes</Link>
                        </li>
                        <li>
                            <Link to="/especialidades" className={location.pathname.includes('/especialidades') ? 'active' : ''}>Especialidades</Link>
                        </li>
                        <li>
                            <Link to="/consultas" className={location.pathname.includes('/consultas') ? 'active' : ''}>Consultas</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <main className="content">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
