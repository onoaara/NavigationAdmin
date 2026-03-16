import { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

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
  });
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setCab({
      name: initialData.name || "",
      phoneNumber: initialData.phoneNumber || "",
      carModel: initialData.carModel || "",
      plateNumber: initialData.plateNumber || "",
      image: initialData.image || "",
    });
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCab((prevCab) => ({
      ...prevCab,
      [name]: value,
    }));
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

export default AddEditCabModal;
