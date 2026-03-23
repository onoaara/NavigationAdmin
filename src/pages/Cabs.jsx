import { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Paper,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  IconButton,
} from "@mui/material";
import { toast } from "sonner";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./Cabs.css";

const Cabs = () => {
  const [cabs, setCabs] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCab, setCurrentCab] = useState(null);

  useEffect(() => {
    const fetchCabsData = async () => {
      const cabsCollection = collection(db, "cabs");
      const cabsSnapshot = await getDocs(cabsCollection);
      const cabsList = cabsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCabs(cabsList);
    };

    fetchCabsData();
  }, []);

  const handleAddCab = async (cab) => {
    try {
      const cabsCollection = collection(db, "cabs");
      await addDoc(cabsCollection, cab);
      const cabsSnapshot = await getDocs(cabsCollection);
      const cabsList = cabsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCabs(cabsList);
      setIsAddModalOpen(false);
      toast.success("Cab added successfully!");
    } catch (error) {
      toast.error("Error adding cab: " + error.message);
    }
  };

  const handleEditCab = async (updatedCab) => {
    try {
      const cabDoc = doc(db, "cabs", currentCab.id);
      await updateDoc(cabDoc, updatedCab);
      const cabsSnapshot = await getDocs(collection(db, "cabs"));
      const cabsList = cabsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCabs(cabsList);
      setIsEditModalOpen(false);
      toast.success("Cab updated successfully!");
    } catch (error) {
      toast.error("Error updating cab: " + error.message);
    }
  };

  const handleDeleteCab = async (cabId) => {
    try {
      await deleteDoc(doc(db, "cabs", cabId));
      const cabsSnapshot = await getDocs(collection(db, "cabs"));
      const cabsList = cabsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCabs(cabsList);
      toast.success("Cab deleted successfully!");
    } catch (error) {
      toast.error("Error deleting cab: " + error.message);
    }
  };

  return (
    <div className="cabs-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Cabs</h2>
        <Button
          className="add-cab-button"
          variant="contained"
          color="primary"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Cab
        </Button>
      </div>
      <TableContainer component={Paper} elevation={0} sx={{ mt: 3 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Car Model</TableCell>
              <TableCell>Plate Number</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cabs.map((cab) => (
              <TableRow key={cab.id} hover>
                <TableCell>
                  <Avatar
                    src={cab.image}
                    alt={cab.name}
                    variant="rounded"
                    sx={{ width: 50, height: 50 }}
                  />
                </TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>{cab.name}</TableCell>
                <TableCell>{cab.phoneNumber}</TableCell>
                <TableCell>{cab.carModel}</TableCell>
                <TableCell>{cab.plateNumber}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => {
                      setCurrentCab(cab);
                      setIsEditModalOpen(true);
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteCab(cab.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddEditCabModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCab}
        title="Add Cab"
      />
      <AddEditCabModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditCab}
        initialData={currentCab}
        title="Edit Cab"
      />
    </div>
  );
};

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

const AddEditCabModal = ({
  open,
  onClose,
  onSubmit,
  initialData = {},
  title,
}) => {
  const [cab, setCab] = useState({
    name: "",
    phoneNumber: "",
    carModel: "",
    plateNumber: "",
    image: "",
    ...initialData,
  });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCab({
      ...cab,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    if (imageFile) {
      const imageRef = ref(storage, `cabs/${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);
      cab.image = imageUrl;
    }
    onSubmit(cab);
    setIsUploading(false);
    onClose();
    setCab({
      name: "",
      phoneNumber: "",
      carModel: "",
      plateNumber: "",
      image: "",
    });
    setImageFile(null);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" component="h2">
          {title}
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            value={cab.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={cab.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            inputMode="tel"
          />
          <TextField
            label="Car Model"
            name="carModel"
            value={cab.carModel}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Plate Number"
            name="plateNumber"
            value={cab.plateNumber}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            margin="normal"
            sx={{ mt: 2 }}
          >
            Upload Image
            <input type="file" hidden onChange={handleImageChange} />
          </Button>
          {isUploading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            disabled={isUploading}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default Cabs;
