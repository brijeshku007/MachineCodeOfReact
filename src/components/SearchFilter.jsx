import React, { useState } from "react"

const SearchFilter=()=>{
const items=["apple","banana","cherry","date","Elderberrry"];
const [query,setQuery]=useState('');

const filterItems=items.filter((item)=>{
   return item.toLowerCase().includes(query.toLowerCase());
})

  return(
    <div>
      <input
      type="text"
      placeholder="Search"
      value={query}
      onChange={(e)=>setQuery(e.target.value)}
      ></input>
      <ul>
        {filterItems.map((item,index)=>(
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
export default SearchFilter;