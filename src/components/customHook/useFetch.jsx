
// import { useState,useEffect } from "react";
// const useFetch=(url)=>{
//   const [data,setData]=useState(null);
//   const [loading,setLoading]=useState(true);
//   const [error,setError]=useState(null);
//   useEffect(()=>{
//     fetch(url)
//     .then((response)=>{
//       if(!response.ok){
//         throw new Error('failed to fetch data');
//       }
//       return response.json();
//     })
//     .then((data)=>{
//       setData(data);
//       setLoading(false);
//     }).catch((err)=>{
//       setError(err.message);
//       setLoading(false);
//     })

//   },[url])
//   return {data,loading,error};
// }
// export default useFetch;

//second way to fetch the data using async await

// import { useState,useEffect } from "react";
// const useFetch=(url)=>{
//   const [data,setData]=useState(null);
//   const [loading,setLoading]=useState(true);
//   const [error,setError]=useState(null);
//   useEffect(()=>{
//     const fetchData= async()=>{
//       try{
//         const response=await fetch(url);
//         if(!response.ok){
//           throw new Error('failed to fetch data');
//         }
//         const data=await response.json();
//         setData(data);
//         setLoading(false);
//       }catch(err){
//         setError(err.message);
//         setLoading(false);
//       }
//     }
//     fetchData();
//   },[url])
//   return {data,loading,error};
// }
// export default useFetch;

////3rd way we can also put the fetchData function outside the useEffect hook
// import { useState,useEffect } from "react";
// const useFetch=(url)=>{
//   const [data,setData]=useState(null);
//   const [loading,setLoading]=useState(true);
//   const [error,setError]=useState(null);
//   const fetchData=async()=>{
//     try{
//       const response=await fetch(url);
//       if(!response.ok){
//         throw new Error("data not fetched")
//       }
//       const data= await response.json();
//       setData(data);
//       setLoading(false);
//     }catch(err){
//       setError(err.message);
//       setLoading(false);
//     }
//   }
//   useEffect(()=>{
//     fetchData();
//   },[url])
//   return {data,loading,error}
// }
// export default useFetch;

////4th way useing axios library
import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(url);
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;
