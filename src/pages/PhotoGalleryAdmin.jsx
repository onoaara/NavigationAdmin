import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  Button,
  TextField,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
} from "@mui/material";
import "./PhotoGalleryAdmin.css";

const PhotoGalleryAdmin = () => {
  const [photos, setPhotos] = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoDescription, setPhotoDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const photosCollection = collection(db, "photos");
        const photosSnapshot = await getDocs(photosCollection);
        const photosList = photosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPhotos(photosList);
      } catch (error) {
        console.error("Error fetching photos: ", error);
      }
    };

    fetchPhotos();
  }, []);

  const handleAddPhoto = async () => {
    if (!photoFile) {
      alert("Please choose a photo to upload.");
      return;
    }

    setUploading(true);
    const filename = photoFile.name;
    const storageRef = ref(storage, filename);

    try {
      await uploadBytes(storageRef, photoFile);
      const url = await getDownloadURL(storageRef);

      await addDoc(collection(db, "photos"), {
        url,
        description: photoDescription,
        createdAt: serverTimestamp(),
      });

      const photosSnapshot = await getDocs(collection(db, "photos"));
      const photosList = photosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPhotos(photosList);
      setPhotoFile(null);
      setPhotoDescription("");
      setUploading(false);
    } catch (e) {
      console.error(e);
      setUploading(false);
      alert("There was an error while uploading the photo.");
    }
  };

  const handleDeletePhoto = async (photoId) => {
    try {
      await deleteDoc(doc(db, "photos", photoId));
      const photosSnapshot = await getDocs(collection(db, "photos"));
      const photosList = photosSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPhotos(photosList);
    } catch (error) {
      console.error("Error deleting photo: ", error);
    }
  };

  return (
    <div className="photo-gallery-page">
      <h2>Photo Gallery</h2>
      <Box
        className="photo-form"
        component="form"
        noValidate
        autoComplete="off"
      >
        <Typography variant="h6">Add Photo</Typography>
        <Button
          variant="contained"
          component="label"
          fullWidth
          margin="normal"
          sx={{ mt: 2 }}
        >
          Choose Photo
          <input
            type="file"
            hidden
            onChange={(e) => setPhotoFile(e.target.files[0])}
          />
        </Button>
        {photoFile && (
          <Typography variant="body2" color="text.secondary">
            {photoFile.name}
          </Typography>
        )}
        <TextField
          label="Photo Description"
          value={photoDescription}
          onChange={(e) => setPhotoDescription(e.target.value)}
          fullWidth
          margin="normal"
          required
          multiline
          rows={4}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPhoto}
          sx={{ mt: 2 }}
          disabled={uploading}
        >
          {uploading ? <CircularProgress size={24} /> : "Upload Photo"}
        </Button>
      </Box>
      <Grid container spacing={3} className="photos-grid" sx={{ mt: 4 }}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={photo.id}>
            <Card className="photo-card">
              <CardMedia
                component="img"
                height="200"
                image={photo.url}
                alt="Photo"
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {photo.description}
                </Typography>
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={() => handleDeletePhoto(photo.id)}
                  sx={{ mt: 2 }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default PhotoGalleryAdmin;
