import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  TextField,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import AddUserModal from "../components/AddUserModal";
import EditUserModal from "../components/EditUserModal";
import "./Users.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const usersCollection = collection(db, "userDetails");
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };

    fetchData();
  }, []);

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleAddUser = async (newUser) => {
    const usersCollection = collection(db, "userDetails");
    await addDoc(usersCollection, newUser);
    const userSnapshot = await getDocs(usersCollection);
    const userList = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(userList);
  };

  const handleOpenEditModal = (user) => {
    setCurrentUser(user);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentUser(null);
  };

  const handleEditUser = async (updatedUser) => {
    const userDoc = doc(db, "userDetails", updatedUser.id);
    await updateDoc(userDoc, updatedUser);
    const userSnapshot = await getDocs(collection(db, "userDetails"));
    const userList = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(userList);
  };

  const handleDeleteUser = async (userId) => {
    const userDoc = doc(db, "userDetails", userId);
    await deleteDoc(userDoc);
    const userSnapshot = await getDocs(collection(db, "userDetails"));
    const userList = userSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(userList);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = users.filter((user) =>
    `${user.firstName} ${user.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="users-page">
      <div className="users-header">
        <Typography variant="h4" className="page-title">
          Users
        </Typography>
        <div className="users-actions">
          <TextField
            label="Search"
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          {/* <Button
            variant="contained"
            color="primary"
            onClick={}
            className="create-user-button"
          >
            Create User
          </Button> */}
        </div>
      </div>
      <AddUserModal
        open={isAddModalOpen}
        onClose={handleCloseAddModal}
        onAddUser={handleAddUser}
      />
      <EditUserModal
        open={isEditModalOpen}
        onClose={handleCloseEditModal}
        user={currentUser}
        onEditUser={handleEditUser}
      />
      <TableContainer component={Paper} className="table-container">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Matric Number</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.lastName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.dob}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.matricNumber}</TableCell>
                <TableCell>{user.gender}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenEditModal(user)}>
                    <Edit className="edit-btn" />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteUser(user.id)}>
                    <Delete className="delete-btn" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Users;
