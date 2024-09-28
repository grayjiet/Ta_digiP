import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCafes, deleteCafe } from '../api/cafes';
import { AgGridReact } from 'ag-grid-react';
import { Button, TextField } from '@mui/material';
import { useNavigate } from '@tanstack/react-router';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';


const CafePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();  // Used to refetch data after mutations
  const [locationFilter, setLocationFilter] = useState('');

  // Fetching cafes data using react-query
  const { data, isLoading, error } = useQuery({
    queryKey: ['cafes'],
    queryFn: () => fetchCafes(locationFilter),
  });

  console.log("data", data);

  // Delete cafe mutation
  const deleteCafeMutation = useMutation({
    mutationFn: (cafeId) => deleteCafe(cafeId),
    onSuccess: () => {
      // Refetch the cafes list after deletion
      queryClient.invalidateQueries(['cafes']);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading cafes</div>;
  }

  const cafes = data?.cafes || []; // Ensure cafes is an array


  console.log('Fetched Cafes:', cafes);
  // Filter cafes by location
  const filteredCafes = cafes.filter(cafe => 
    cafe.location.toLowerCase().includes(locationFilter.toLowerCase())
  );

  const columns = [
    { 
      headerName: 'Logo', 
      field: 'logo', 
      cellRenderer: (params) => <img src={params.value} alt="logo" style={{ height: '50px' }} />, 
      width: 80  
    },
    { headerName: 'Name', field: 'name', width: 150 },
    { 
      headerName: 'Description', 
      field: 'description', 
      width: 250 
    },
    { 
      headerName: 'Employees', 
      field: 'employees', 
      width: 120,
      cellRenderer: (params) => (
        <Button size="small" onClick={() => navigate({ to: 'cafe/employee', search: { cafe: params.data.name } })}>
          View Employees
        </Button>
      ),
    },
    { headerName: 'Location', field: 'location', width: 150 },
    {
      headerName: 'Actions',
      field: 'actions',
      cellRenderer: (params) => (
        <div className="cafe-actions">
          <Button 
            variant="contained" 
            color="primary"
            size="small" 
            onClick={() => navigate({ to: `/edit`, search: { id: params.data.id } })}
          >
            Edit
          </Button>
          <Button 
            size="small" 
            variant="contained"
            color="secondary"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this cafe?')) {
                deleteCafeMutation.mutate(params.data.id);
              }
            }}
          >
            Delete
          </Button>
        </div>
      ),
      width: 180,  
    },
  ];

  return (
    <div className="cafe-container">
      <div className="filter-section">
        <TextField
          label="Filter by Location"
          variant="outlined"
          value={locationFilter}
          onChange={(word) => setLocationFilter(word.target.value)}
          style={{ marginBottom: '20px' }}
        />
      </div>
      <Button
        className="add-cafe-button"
        variant="contained"
        color="primary"
        onClick={() => navigate({ to: '/cafe/add' })}
      >
        Add New Café
      </Button>
      <div className="ag-theme-alpine" style={{ height: '400px', width: '100%' }}>
        <AgGridReact
          rowData={filteredCafes}  
          columnDefs={columns}
          domLayout="autoHeight"  
          defaultColDef={{ resizable: true }}
          overlayNoRowsTemplate="<span>No cafes available</span>" 
          pagination={true} 
        />
      </div>
    </div>
  )
};

export default CafePage;