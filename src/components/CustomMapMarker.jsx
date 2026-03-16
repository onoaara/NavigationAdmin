import { Marker } from "@react-google-maps/api";

const CustomMapMarker = ({ position, title, description }) => {
  return <Marker position={position} title={title} description={description} />;
};

export default CustomMapMarker;
