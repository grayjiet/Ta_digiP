import { createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import Layout from '../components/layout.jsx';
import CafePage from '../pages/CafePage.jsx';
import EmployeePage from '../pages/EmployeesPage.jsx';
import EditCafePage from '../pages/EditCafePage.jsx';
import AddCafePage from '../pages/AddCafePage.jsx';
import EditEmployeePage from '../pages/EditEmployeePage.jsx';
import AddEmployeePage from '../pages/AddEmployeePage.jsx';
import EmployeeByCafe from '../pages/EmployeeByCafe.jsx';

const rootRoute = createRootRoute({
  component: Layout,
});

const cafeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: CafePage,
});

const employeeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employee',
  component: EmployeePage,
});

// Place editCafeRoute under rootRoute if it's supposed to be accessed directly via /edit
const editCafeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/edit',
  component: EditCafePage,
});

const addCafeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cafe/add',
  component: AddCafePage,
})

const editEmployeeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employee/edit/$id',
  component: EditEmployeePage,
  // loader: ({ params }) => {
  //   // params.id should be the employee ID
  //   return fetchEmployeeById(params.id);
  // }
});

const addEmployeeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employee/add',
  component: AddEmployeePage,
});

const employeeByCafeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'cafe/employee',
  component: EmployeeByCafe,
});

// Keep route tree simple without unnecessary nesting
const routeTree = rootRoute.addChildren([
  cafeRoute,
  employeeRoute,
  editCafeRoute,
  addCafeRoute,
  editEmployeeRoute,
  addEmployeeRoute,
  employeeByCafeRoute,
]);

const router = createRouter({
  routeTree,
});

export default router;