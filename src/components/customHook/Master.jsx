import useFetch from "./useFetch";
const Master=()=>{
  const { data, loading, error } = useFetch(
    'https://jsonplaceholder.typicode.com/posts'
  );
  
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  
  return (
    <ul>
      {data.map((post) => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
export default Master;