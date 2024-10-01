import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const api_url_username = 'https://playground.4geeks.com/todo/users/pancho'; //Modificar el nombre de usuario con el valor del usuario que crearon
  const [username, setUsername] = useState('');
  const [usertodos, setUserTodos] = useState({});

  useEffect(() => {
    getListTodos();
  	//return () => '';
  }, []);

  const getListTodos = async () => {
    const response = await fetch(api_url_username);
    if (response.ok) {
      const data = await response.json();
      setUsername(data.name);
      setUserTodos(data.todos);
    } else {
      console.log('Error: ', response.status, response.statusText);
      return {error: {status: response.status, statusText: response.statusText}};
    };
  };

  return (
    <main>
      <header className='header'>
        <h1>Todo List</h1>
      </header>

      <section className='todo-input-section'>
        <div className='todo-input-wrapper'>
          <input type='text' id='todo-input' placeholder='Escribe la tarea' />
          <button id='add-button'>Agregar</button>
        </div>
      </section>

      <section className='todo-list-section'>
        {usertodos && usertodos.length ?
          <ul id='todo-list'>
            {usertodos.map((todo) => 
              <li className='todo-item' key={todo.id}>
                <span className='task-text'>{todo.label}</span>
                <button className='complete-button'>Marcar como hecha</button>
                <button className='delete-button'>Eliminar</button>
              </li>
            )}
          </ul>
        :
          <div className="dots"></div>
        }
      </section>
    </main>
  );
}

export default App;