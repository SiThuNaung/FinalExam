"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, TextField, List, ListItem, ListItemText } from "@mui/material";

export default function Customer() {
  const [customers, setCustomers] = useState([]);
  const [newCustomer, setNewCustomer] = useState({ name: "", dateOfBirth: "", memberNumber: "", interests: "" });
  const [editMode, setEditMode] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/api/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const handleAddOrUpdateCustomer = async () => {
    try {
      if (editMode) {
        await axios.put(`/api/customers/${editingCustomerId}`, newCustomer);
      } else {
        await axios.post("/api/customers", newCustomer);
      }
      fetchCustomers();
      setNewCustomer({ name: "", dateOfBirth: "", memberNumber: "", interests: "" });
      setEditMode(false);
      setEditingCustomerId(null);
    } catch (error) {
      console.error(`Error ${editMode ? 'updating' : 'adding'} customer:`, error);
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await axios.delete(`/api/customers/${id}`);
      fetchCustomers();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }
  };

  const handleEditCustomer = (customer) => {
    setNewCustomer({
      name: customer.name,
      dateOfBirth: customer.dateOfBirth.split('T')[0], // Format date for input
      memberNumber: customer.memberNumber,
      interests: customer.interests,
    });
    setEditMode(true);
    setEditingCustomerId(customer._id);
  };

  return (
    <div>
      <h1>Customer Management</h1>
      <div>
        <TextField
          label="Name"
          value={newCustomer.name}
          onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
          required
        />
        <TextField
          type="date"
          label="Date of Birth"
          value={newCustomer.dateOfBirth}
          onChange={(e) => setNewCustomer({ ...newCustomer, dateOfBirth: e.target.value })}
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Member Number"
          type="number"
          value={newCustomer.memberNumber}
          onChange={(e) => setNewCustomer({ ...newCustomer, memberNumber: e.target.value })}
          required
        />
        <TextField
          label="Interests"
          value={newCustomer.interests}
          onChange={(e) => setNewCustomer({ ...newCustomer, interests: e.target.value })}
          required
        />
        <Button onClick={handleAddOrUpdateCustomer} variant="contained">
          {editMode ? "Update Customer" : "Add Customer"}
        </Button>
        {editMode && (
          <Button
            onClick={() => {
              setNewCustomer({ name: "", dateOfBirth: "", memberNumber: "", interests: "" });
              setEditMode(false);
              setEditingCustomerId(null);
            }}
            variant="outlined"
            style={{ marginLeft: '10px' }}
          >
            Cancel
          </Button>
        )}
      </div>
      <List>
        {customers.map((customer) => (
          <ListItem key={customer._id}>
            <ListItemText
              primary={`${customer.name} (Member #: ${customer.memberNumber})`}
              secondary={`DOB: ${new Date(customer.dateOfBirth).toLocaleDateString()}, Interests: ${customer.interests}`}
            />
            <Button onClick={() => handleEditCustomer(customer)} variant="outlined">Edit</Button>
            <Button onClick={() => handleDeleteCustomer(customer._id)} variant="outlined" style={{ marginLeft: '10px' }}>Delete</Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
