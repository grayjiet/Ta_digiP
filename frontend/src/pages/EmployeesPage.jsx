import React, { useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEmployees, deleteEmployee } from '../api/employees';
import { fetchCafes } from '../api/cafes';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '@mui/material';
import { useNavigate, useSearch } from '@tanstack/react-router';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const EmployeePage = () => {
  const navigate = useNavigate();
  const search = useSearch({ strict: false });
  const queryClient = useQueryClient();

  // Fetch employees using React Query
  const { data: employeesData, isLoading: isLoadingEmployees, error: errorEmployees } = useQuery({
    queryKey: ['employees', search?.cafe],
    queryFn: () => fetchEmployees(search?.cafe),
  });

  // Fetch cafés using React Query
  const { data: cafesData, isLoading: isLoadingCafes, error: errorCafes } = useQuery({
    queryKey: ['cafes'],
    queryFn: fetchCafes,
  });

  console.log('Fetched Cafes:', cafesData);

  // Mutation to delete an employee
  const deleteMutation = useMutation({
    mutationFn: (employeeId) => deleteEmployee(employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries(['employees', search?.cafe]);
    },
  });

  // Handle deleting an employee
  const handleDelete = (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      deleteMutation.mutate(employeeId);
    }
  };

  // Map the café ID and name from the employee data
  const rowData = useMemo(() => {
    if (!employeesData?.employees || !cafesData?.cafes) return [];

    // Create a mapping from cafe name to the corresponding cafe object (with id and name)
    const cafeMap = cafesData.cafes.reduce((acc, cafe) => {
      acc[cafe.name] = cafe;
      return acc;
    }, {});

    // Map each employee to include the cafe name and id directly from the employee data
    return employeesData.employees.map((employee) => {
      const cafe = cafeMap[employee.cafe] || {};
      return {
        ...employee,
        cafe_name: cafe.name || 'Unknown',
        cafe_id: cafe.id || 'Unknown',
      };
    });
  }, [employeesData, cafesData]);

  if (isLoadingEmployees || isLoadingCafes) return <div>Loading...</div>;
  if (errorEmployees || errorCafes) return <div>Error loading data.</div>;

  // Define the columns for the Ag-Grid
  const columns = [
    { headerName: 'Employee ID', field: 'id', width: 120 },
    { headerName: 'Name', field: 'name', width: 150 },
    { headerName: 'Email Address', field: 'email_address', width: 200 },
    { headerName: 'Phone Number', field: 'phone_number', width: 150 },
    { headerName: 'Days Worked', field: 'days_worked', width: 120 },
    { headerName: 'Café ID', field: 'cafe_id', width: 150 }, // Display the café ID
    { headerName: 'Café Name', field: 'cafe_name', width: 150 },  // Display the café name directly from the employee data
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params) => (
        <div className="employee-actions">
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={() => {
              navigate({ to: `/employee/edit/${params.data.id}` });
            }}
            style={{ marginRight: '8px' }}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={() => handleDelete(params.data.id)}
          >
            Delete
          </Button>
        </div>
      ),
      width: 180,
    },
  ];

  return (
    <div className="employee-container">
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: '20px' }}
        onClick={() => navigate({ to: '/employee/add' })}
      >
        Add New Employee
      </Button>
      <div className="ag-theme-alpine" style={{ height: '70vh', width: '100%' }}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columns}
          domLayout="autoHeight"
          defaultColDef={{ resizable: true }}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default EmployeePage;