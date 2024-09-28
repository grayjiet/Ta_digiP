import { Outlet, Link } from '@tanstack/react-router';

const Layout = () => (
  <>
    <header>
      <h1>Cafe application</h1>
      <nav>
        <ul>
          <li>
            <Link to="/">Cafes</Link>
          </li>
          <li>
            <Link to="/employee">Employees</Link>
          </li>
        </ul>
      </nav>
    </header>
    <main>
      <Outlet />
    </main>
  </>
);

export default Layout;