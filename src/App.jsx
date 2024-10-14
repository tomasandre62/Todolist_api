import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const api_url_username = 'https://playground.4geeks.com/todo/users/Tomas_Ramirez'; //Modificar el nombre de usuario con el valor del usuario que crearon
  const api_url_todos = 'https://playground.4geeks.com/todo/todos/';
  const api_url_todosUser = 'https://playground.4geeks.com/todo/todos/Tomas_Ramirez';
  const [username, setUsername] = useState('');
  const [usertodos, setUserTodos] = useState({});
  const [flagerror, setFlagError] = useState(false);
  const [newTodo, setNewTodo] = useState('');


  useEffect(() => {
    getListTodos();
    //return () => '';
  }, []);

  const addTodo = async () => {
    if (newTodo.trim() === '') return;
    const data = { label: newTodo, is_done: false };
    const response = await fetch(api_url_todosUser, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const newTodoItem = await response.json();
      setUserTodos((prevTodos) => [...prevTodos, newTodoItem]);
      setNewTodo('');
    } else {
      console.log('Error al agregar la tarea');
    }
  };


  const getListTodos = async () => {
    const response = await fetch(api_url_username);
    if (response.ok) {
      const data = await response.json();
      setUsername(data.name);
      setUserTodos(data.todos);
      console.log(data);
    } else {
      console.log('Error: ', response.status, response.statusText);
      setFlagError(true);
      return { error: { status: response.status, statusText: response.statusText } };
    };
  };

  const updateTodo = async (id, label, is_done) => {
    const data = {
      label: label,
      is_done: is_done,
    };

    const response = await fetch(api_url_todos + id, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      setUserTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === id ? { ...todo, is_done } : todo
        )
      );
    } else {
      console.log('Error al actualizar la tarea');
    }
  };

  const deleteTodo = async (id) => {
    const response = await fetch(api_url_todos + id, {
      method: 'DELETE',
    });

    if (response.ok) {
      setUserTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } else {
      console.log('Error al eliminar la tarea');
    }
  };
  const deleteAllTodos = async () => {
    try {
        for (const todo of usertodos) {
            const response = await fetch(api_url_todos + todo.id, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Error al eliminar la tarea');
            }
        }
        setUserTodos([]);
    } catch (error) {
        console.error('Error al eliminar las tareas:', error);
        // Mostrar un mensaje de error al usuario
    }
};
  

  return (
    <main>
      <header className='header'>
        <h1>Todo List</h1>
      </header>
      {flagerror ?
        <section className='error-notice'>
          <div class="oaerror danger">
            <strong>Error:</strong> Ha ocurrido un error en la carga del listado de tareas
          </div>

        </section>
        :
        <>
          <section className='todo-input-section'>
            <div className='todo-input-wrapper'>
              <input
                type='text'
                id='todo-input'
                placeholder='Escribe la tarea'
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
              <button id='add-button' onClick={addTodo}>Agregar</button>
              <button id='delete-all-button' onClick={deleteAllTodos}>Eliminar Todas las Tareas</button>


            </div>
          </section>

          <section className='todo-list-section'>
            {usertodos && usertodos.length ?
              <ul id='todo-list'>
                {usertodos.map((todo) =>
                  <li className='todo-item' key={todo.id}>
                    {
                      !todo.is_done ?
                        <>
                          <span className='task-text'>{todo.label}</span>
                          <button className='complete-button' onClick={() => { updateTodo(todo.id, todo.label, true) }}>Marcar como hecha</button>
                        </>
                        :
                        <>
                          <span className='task-text is-done'>{todo.label}</span>
                          <button className='complete-button' onClick={() => { updateTodo(todo.id, todo.label, false) }}>Marcar como no hecha</button>
                        </>
                    }
                    <button className='delete-button' onClick={() => { deleteTodo(todo.id) }}>Eliminar</button>
                  </li>
                )}
              </ul>
              :
              <div className="dots"></div>
            }
          </section>
        </>
      }
    </main>
  );
}

export default App;