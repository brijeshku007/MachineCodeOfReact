import { useParams } from "react-router-dom"; // useParams to get dynamic params

const User = () => {
  const { id } = useParams(); // Extract the dynamic user ID
  return <h2>User Profile for ID: {id}</h2>;
};

export default User;
