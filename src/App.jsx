import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const api_url_username = 'https://playground.4geeks.com/todo/users/ACA_SU_USUARIO'; //Modificar el nombre de usuario con el valor del usuario que crearon
  const api_url_todos = 'https://playground.4geeks.com/todo/todos/';
  const [username, setUsername] = useState('');
  const [usertodos, setUserTodos] = useState({});
  const [flagerror, setFlagError] = useState(false);

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
      console.log(data);
    } else {
      console.log('Error: ', response.status, response.statusText);
      setFlagError(true);
      return {error: {status: response.status, statusText: response.statusText}};
    };
  };

  const updateTodo = async (id, label, is_done) => {
    let data = {
                'label': label,
                'is_done': is_done
    };

    const response = await fetch(api_url_todos + id, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    //Acá el código que actualiza el state usertodos
  };

  const deleteTodo = async (id) => {
    const response = await fetch(api_url_todos + id, {
      method: 'DELETE'
    });

    //Acá el código que actualiza el state usertodos
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
          <input type='text' id='todo-input' placeholder='Escribe la tarea' />
          <button id='add-button'>Agregar</button>
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
                <button className='delete-button' onClick={ () => { deleteTodo(todo.id) } }>Eliminar</button>
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