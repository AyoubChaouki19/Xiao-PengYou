import { useState } from "react";
import { useEffect, useRef } from "react";
import { Tasks } from "./components/Task";
import React from "react";
import "./App.css";
import axios from "axios";
function App() {
  const inputRef = useRef(null);
  const [todoList, setTodoList] = useState([]);
  const [newTask, setNewTask] = useState("");
  const dateTime = new Date();
  const dateObj = typeof dateTime === "string" ? new Date(dateTime) : dateTime;
  const hour = dateObj.getHours();
  let greeting;
  if (hour >= 5 && hour < 12) {
    greeting = "Good Morning";
  } else if (hour >= 12 && hour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Night";
  }
  useEffect(() => {
    //Running the logic we want to pass after refreshing
    //using axios to run a getRequest that you can see in insomnia
    axios.get("http://localhost:3004/tasks").then((response) => {
      setTodoList(response.data);
    });
    inputRef.current.focus();
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  };
  const handleChange = (event) => {
    setNewTask(event.target.value);
  };
  const addTask = async () => {
    if (newTask.trim() === "") {
      alert("Please enter a valid task.");
      return;
    }
    // NORMAL BECAUSE ID IS NOT GOTTEN FROM THE SERVER SO SEND IT TO TASK COMPONENT JUST THINK OF THE FLOW
    const task = {
      text: newTask,
      completed: false,
    };
    await axios.post("http://localhost:3004/tasks", task);
    axios.get("http://localhost:3004/tasks").then((res) => {
      setTodoList(res.data);
      setNewTask("");
    });
    // setTodoList((prevTodoList) => [...prevTodoList, response.data]);
  };
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:3004/tasks/${id}`).then((response) => {
      const updatedTodoList = todoList.filter((task) => {
        return task.id !== id;
      });
      setTodoList(updatedTodoList);
    });
  };
  const crossTask = async (id) => {
    await axios
      .put(`http://localhost:3004/tasks/completed/${id}`)
      .then((response) => {
        const updatedTodoList = todoList.map((task) => {
          if (task.id === id) {
            return { ...task, completed: !task.completed };
          } else {
            return task;
          }
        });
        setTodoList(updatedTodoList);
      });
  };
  const clearTasks = async () => {
    const completedTasks = todoList.filter((task) => task.completed);
    for (const completedTask of completedTasks) {
      await deleteTask(completedTask.id);
    }
    const updatedTodoList = todoList.filter((task) => !task.completed);
    setTodoList(updatedTodoList);
  };
  return (
    <div className="App">
      <div className="left__container">
        <h1>{greeting} Ayoub</h1>
        <h1>GET STUFF DONE LIST</h1>
      </div>
      <div className="right__container">
        <div className="input__container">
          <input
            type="text"
            onChange={handleChange}
            value={newTask}
            onKeyDown={handleKeyPress}
            ref={inputRef}
          />
          <div className="add__task__btn">
            <button
              onClick={() => {
                addTask();
              }}
            >
              ADD
            </button>
            <button
              className="clear__btn"
              onClick={() => {
                clearTasks();
              }}
            >
              CLEAR
            </button>
          </div>
        </div>
        <div className="tasks__container">
          {todoList.map((task) => {
            return (
              <Tasks
                task={task.text}
                id={task.id}
                state={task.completed}
                deleteTask={deleteTask}
                crossTask={crossTask}
              ></Tasks>
            );
          })}
        </div>
      </div>
    </div>
  );
}
export default App;
