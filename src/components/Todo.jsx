
import React from "react";
import { useState } from "react";
const Todo=()=>{
  const [tasks,setTasks]=useState([]);
  const [input ,setInput]=useState('');
  const [isEditing,setIsEditing]=useState(false);
  const [currentIndex,setCurrentIndex]=useState(null);
  //adding the task
  const addTask=()=>{
    if(input.trim()!=""){
      setTasks([...tasks,input]);
      setInput('');
    }
  }
  //remove task
  const removeTask=(index)=>{
    setTasks(tasks.filter((task,i)=>{
      return i!=index;
    }))
  }
  //enable edting
  const enable=(index)=>{
    setCurrentIndex(index);
    setIsEditing(true);
    setInput(tasks[index]);
  }
  //update task
  const updateTask = () => {
    if (input.trim() !== "") {
      const updatedTasks = [...tasks];
      updatedTasks[currentIndex] = input;
      setTasks(updatedTasks);
      setInput('');
      setIsEditing(false);
      setCurrentIndex(null);
    }
  };
  
  return(
    <div>
      <input type="text"
      value={input}
      placeholder={isEditing?"upadate task":"add task"}
      onChange={(e)=>setInput(e.target.value)}
      />
      {isEditing ?
       (<button onClick={updateTask}>update Task</button>)
        :(<button onClick={addTask}>add task</button>)
      }
      <ul>
        {tasks.map((task,index)=>{
          return(
            <li key={index}>
              {task} 
              <button onClick={()=>enable(index)}>update task</button>
              <button onClick={()=>removeTask(index)}>remove task</button>
              </li>
          )
        })}
      </ul>
      
   

    </div>
  )
}

export default Todo;