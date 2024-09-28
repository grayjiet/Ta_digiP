import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchEmployees } from '../api/employees';
import { AgGridReact } from 'ag-grid-react';
import { Button } from '@mui/material';
import { useNavigate, useLocation } from '@tanstack/react-router';

const EmployeeByCafe = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location object

  // Extract the search parameters from the URL using URLSearchParams
  const searchParams = new URLSearchParams(location.search);
  const cafeId = searchParams.get('cafe'); // Get the `id` parameter from the URL

  console.log("cafe id is " + cafeId);
  console.log("calling the axios function");
  // Fetching employees data using react-query
  const { data, isLoading, error } = useQuery({
    queryKey: ['employees', cafeId],
    queryFn: () => fetchEmployees(cafeId), // Use the cafeId to fetch employees
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading employees: {error.message}</div>;
  }

  const employees = data?.employees || [];

  const columns = [
    { headerName: 'ID', field: 'id', width: 100 },
    { headerName: 'Name', field: 'name', width: 150 },
    { headerName: 'Email', field: 'email_address', width: 250 },
    { headerName: 'Phone', field: 'phone_number', width: 150 },
    { headerName: 'Gender', field: 'gender', width: 100 },
    { headerName: 'Start Date', field: 'start_date', width: 150 },
    { headerName: 'Days Worked', field: 'days_worked', width: 120 },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Employees for Café: {cafeId}</h2>
      <Button
        variant="contained"
        color="primary"
        style={{ marginBottom: '20px' }}
        onClick={() => navigate({ to: '/' })}
      >
        Back to Cafes
      </Button>
      <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
        <AgGridReact
          rowData={employees}
          columnDefs={columns}
          domLayout="normal"
          defaultColDef={{ resizable: true }}
          overlayNoRowsTemplate="<span>No employees available</span>"
          pagination={false}
        />
      </div>
    </div>
  );
};

export default EmployeeByCafe;