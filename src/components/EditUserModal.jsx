import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
} from "@mui/material";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const EditUserModal = ({ open, onClose, user, onEditUser }) => {
  const [editUser, setEditUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    phone: "",
    matricNumber: "",
    gender: "",
  });

  useEffect(() => {
    if (user) {
      setEditUser(user);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditUser({
      ...editUser,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditUser(editUser);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          Edit User
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            name="firstName"
            value={editUser.firstName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={editUser.lastName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Email"
            name="email"
            value={editUser.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            type="email"
          />
          <TextField
            label="Date of Birth"
            name="dob"
            value={editUser.dob}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Phone Number"
            name="phone"
            value={editUser.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            type="tel"
          />
          <TextField
            label="Matric Number"
            name="matricNumber"
            value={editUser.matricNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            type="number"
          />
          <TextField
            label="Gender"
            name="gender"
            value={editUser.gender}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            select
          >
            <MenuItem value="M">M</MenuItem>
            <MenuItem value="F">F</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default EditUserModal;
