// 7. Fetch Data Using useEffect
// Question: Fetch and display a list of users from an API when the component mounts.
// import React, { useEffect, useState } from "react";

// const FetchUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetch("https://jsonplaceholder.typicode.com/users")
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         setUsers(data);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setIsLoading(false);
//       });
//   }, []);

//   return (
//     <div>
//       {isLoading && <h1>Loading...</h1>}
//       {error && <h1>Error: {error}</h1>}
//       {!isLoading && !error && (
//         <div>
//           {users.map((user) => (
//             <h3 key={user.id}>{user.name}</h3>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default FetchUsers;

////or
import React, { useEffect, useState } from "react";

const FetchUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Callback function for fetching data
  const fetchData = async () => {
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/users");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // useEffect to call the function
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      {isLoading && <h1>Loading...</h1>}
      {error && <h1>Error: {error}</h1>}
      {!isLoading && !error && (
        <div>
          {users.map((user) => (
            <h3 key={user.id}>{user.name}</h3>
          ))}
        </div>
      )}
    </div>
  );
};

export default FetchUsers;
