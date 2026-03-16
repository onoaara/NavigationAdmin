import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

const CabDetails = () => {
  const { id } = useParams();
  const [cab, setCab] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCabDetails = async () => {
      const cabDoc = doc(db, "cabs", id);
      const cabSnapshot = await getDoc(cabDoc);
      if (cabSnapshot.exists()) {
        setCab({ id: cabSnapshot.id, ...cabSnapshot.data() });
      } else {
        console.error("Cab not found!");
      }
      setLoading(false);
    };

    fetchCabDetails();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    cab && (
      <Card>
        <CardMedia
          component="img"
          height="200"
          image={cab.image}
          alt={cab.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {cab.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Phone: {cab.phoneNumber}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Car Model: {cab.carModel}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Plate Number: {cab.plateNumber}
          </Typography>
        </CardContent>
      </Card>
    )
  );
};

export default CabDetails;
