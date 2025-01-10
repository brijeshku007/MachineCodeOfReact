import { useParams } from "react-router-dom"; // Use useParams to get dynamic route params

const User = () => {
  const { id } = useParams(); // Extract the userId from the URL
  return <h2>User Profile for ID: {id}</h2>;
};

export default User;
