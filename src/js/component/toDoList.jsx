import React, { useEffect, useState } from 'react';


const ToDoList = () => {

    const [userNotFound, setUserNotFound] = useState(false)
    const [username, setUsername] = useState('carlosdlacoste')
    const [inputValue, setInputValue] = useState("");
    const [taskList, setTaskList] = useState([]);
    const [itemCount, setItemCount] = useState(0);

    const loadTasks = () => {
        fetch(`https://assets.breatheco.de/apis/fake/todos/user/${username}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => {
                if(resp.ok){
                    setUserNotFound(true)
                }
                console.log(resp.status);
                // console.log(resp.text())
                return resp.json();
            })
            .then(data => {
                console.log(data);
                setTaskList(data);
                setItemCount(data.length);
    
            })
            .catch(err => {
                setUserNotFound(false)
            })
    }

    useEffect(() => {
        loadTasks()
    }, [])

    const handleAddTask = (event) => {

        if (event.key == "Enter" && inputValue != "") {
            fetch(`https://assets.breatheco.de/apis/fake/todos/user/${username}`, {
                method: "PUT",
                body: JSON.stringify(taskList),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(resp => {
                    console.log(resp.ok);
                    console.log(resp.status);
                    // console.log(resp.text());
                    if (resp.ok) {
                        setTaskList([...taskList, {
                            label: inputValue,
                            done: false
                        }]);
                        event.target.value = "";
                        setInputValue(event.target.value);
                        setItemCount(itemCount + 1);
                    }
                    return resp.json();
                })
                .then(data => {
                    console.log(data);
                })
                .catch(error => {
                    console.log(error);
                });
        }else{
            setInputValue(event.target.value)
        }
    }

    const handleDeleteTask = (positionList) => {
        setTaskList(

            taskList.filter((taskList, taskIndex) => taskIndex != positionList)
        );
        setItemCount(itemCount - 1);
    }

    const deleteAllTasks = () => {

        fetch(`https://assets.breatheco.de/apis/fake/todos/user/${username}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(resp => {
                console.log(resp.ok);
                if(resp.ok){
                    setUserNotFound(false) 
                }
                console.log(resp.status);
                return resp.json();
            })
            .then(data => {
                console.log(data);

            })
            .catch(err => {
                console.log(err);
            })
    }

    const createUser = () => {

        fetch(`https://assets.breatheco.de/apis/fake/todos/user/${username}`, {
            method: "POST",
            body: JSON.stringify([]), 
            headers: {
                "Content-Type": "application/json",
            }
        })  
        .then(resp => {
            if(resp.ok){
                loadTasks()
                // setUserNotFound(true)
            }
            return resp.json();
        })
        .then(data => {
            console.log(data);

        })
        .catch(err => {
            console.log(err);
        })
    }


    return (
        <>
            <div className='container'>
                <h1 className='text-center text-success'>ToDo List with Fetch 📋</h1>
                {!userNotFound && 
                    <div className='d-flex flex-column justify-content-center my-3'>
                        <h4>Insert an username:</h4>
                        <input type="text" onChange={(evento) => setUsername(evento.target.value)} value={username} placeholder="nombre de usuario" className="form-control mb-2" />
                        <button onClick={() => createUser()} className='btn btn-primary' >Create User</button>
                    </div>
                }
                {  userNotFound && <>
                <div className="input-group my-3">
                    <input type="text" onKeyUp={handleAddTask} className="form-control" placeholder="What do you need to do?" aria-label="Username" aria-describedby="basic-addon1" />
                </div>
                <ul className="list-group">
                    {/* {
                        taskList.length == 0 && <li className="list-group-item">No hay tareas pendientes</li>
                    } */}
                    {   taskList && taskList.map((element, index) => (

                            <li key={index} className="list-group-item d-flex justify-content-between">{element.label} {" "}
                                <button type="button" onClick={() => handleDeleteTask(index)} className="btn-close" aria-label="Close"></button>
                            </li>

                        ))
                    }
                    {
                        taskList.length != 0 && <li className="list-group-item bg-dark text-light">{itemCount}{" "}item left</li>
                    }
                </ul>
                <button type="button" onClick={() => deleteAllTasks()} className="btn btn-danger mt-4" style={{ width: "100%" }}>Delete all tasks</button>
                </>}
            </div>
        </>
    );

};

export default ToDoList;
