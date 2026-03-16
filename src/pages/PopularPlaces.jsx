import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
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
} from "@mui/material";
import "./PopularPlaces.css";

const PopularPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [placeName, setPlaceName] = useState("");
  const [placeActivities, setPlaceActivities] = useState("");
  const [placeImage, setPlaceImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchPlacesData = async () => {
      try {
        const placesCollection = collection(db, "popularPlaces");
        const placesSnapshot = await getDocs(placesCollection);
        const placesList = placesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPlaces(placesList);
      } catch (error) {
        console.error("Error fetching popular places: ", error);
      }
    };

    fetchPlacesData();
  }, []);

  const handleAddPlace = async () => {
    try {
      setUploading(true);
      let imageUrl = "";
      if (placeImage) {
        const imageRef = ref(storage, `popularPlaces/${placeImage.name}`);
        await uploadBytes(imageRef, placeImage);
        imageUrl = await getDownloadURL(imageRef);
      }
      const placesCollection = collection(db, "popularPlaces");
      await addDoc(placesCollection, {
        name: placeName,
        activities: placeActivities,
        image: imageUrl,
      });
      const placesSnapshot = await getDocs(placesCollection);
      const placesList = placesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlaces(placesList);
      setPlaceName("");
      setPlaceActivities("");
      setPlaceImage(null);
      setUploading(false);
    } catch (error) {
      console.error("Error adding popular place: ", error);
      setUploading(false);
    }
  };

  const handleDeletePlace = async (placeId) => {
    try {
      await deleteDoc(doc(db, "popularPlaces", placeId));
      const placesSnapshot = await getDocs(collection(db, "popularPlaces"));
      const placesList = placesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPlaces(placesList);
    } catch (error) {
      console.error("Error deleting popular place: ", error);
    }
  };

  return (
    <div className="popular-places-page">
      <h2>Popular Places</h2>
      <Box
        className="place-form"
        component="form"
        noValidate
        autoComplete="off"
      >
        <Typography variant="h6">Add Popular Place</Typography>
        <TextField
          label="Place Name"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Activities"
          value={placeActivities}
          onChange={(e) => setPlaceActivities(e.target.value)}
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
          <input
            type="file"
            hidden
            onChange={(e) => setPlaceImage(e.target.files[0])}
          />
        </Button>
        {placeImage && (
          <Typography variant="body2" color="text.secondary">
            {placeImage.name}
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddPlace}
          sx={{ mt: 2 }}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Add Place"}
        </Button>
      </Box>
      <Grid container spacing={3} className="places-grid" sx={{ mt: 4 }}>
        {places.map((place) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={place.id}>
            <Card className="place-card">
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {place.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Activities: {place.activities}
                </Typography>
                <img
                  src={place.image}
                  alt={place.name}
                  style={{ width: "100%", height: "auto", marginTop: 10 }}
                />
                <Button
                  size="small"
                  color="secondary"
                  variant="contained"
                  onClick={() => handleDeletePlace(place.id)}
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

export default PopularPlaces;
