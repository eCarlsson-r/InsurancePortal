import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

interface TodoItem {
    id: string;
    task: string;
    completed: boolean;
}

const Todo = ({ todo, remove, update, toggleComplete }: {
    todo: TodoItem;
    remove: (id: string) => void;
    update: (id: string, task: string) => void;
    toggleComplete: (id: string) => void;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [task, setTask] = useState(todo.task);

    const handleUpdate = (evt: unknown) => {
        evt.preventDefault();
        update(todo.id, task);
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="Todo">
                <form className="Todo-edit-form" onSubmit={handleUpdate}>
                    <input onChange={(e) => setTask(e.target.value)} value={task} type="text" className="form-control" />
                    <button className="btn btn-primary btn-sm mt-2">Save</button>
                </form>
            </div>
        );
    }

    return (
        <div className="Todo d-flex justify-content-between align-items-center mb-2">
            <li
                onClick={() => toggleComplete(todo.id)}
                className={todo.completed ? "Todo-task completed text-muted text-decoration-line-through" : "Todo-task"}
                style={{ listStyle: 'none', cursor: 'pointer' }}
            >
                {todo.task}
            </li>
            <div className="Todo-buttons">
                <button className="btn btn-outline-primary btn-sm mr-1" onClick={() => setIsEditing(true)}>
                    <i className="fa fa-pencil" />
                </button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => remove(todo.id)}>
                    <i className="fa fa-trash" />
                </button>
            </div>
        </div>
    );
};

const NewTodoForm = ({ createTodo }: { createTodo: (todo: TodoItem) => void }) => {
    const [task, setTask] = useState("");

    const handleSubmit = (evt: unknown) => {
        evt.preventDefault();
        createTodo({ task, id: uuidv4(), completed: false });
        setTask("");
    };

    return (
        <form className="NewTodoForm form-inline mt-3" onSubmit={handleSubmit}>
            <div className="form-group mr-2">
                <input
                    type="text"
                    placeholder="New Todo"
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    className="form-control"
                    required
                />
            </div>
            <button className="btn btn-primary">Add</button>
        </form>
    );
};

function TodoList() {
  const [todos, setTodos] = useState([
    { id: uuidv4(), task: "Analyze system requirements", completed: false },
    { id: uuidv4(), task: "Design database schema", completed: true },
    { id: uuidv4(), task: "Implement authentication", completed: false },
  ]);

  const create = (newTodo: unknown) => setTodos([...todos, newTodo]);
  const remove = (id: string) => setTodos(todos.filter(todo => todo.id !== id));
  const update = (id: string, updatedTask: string) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, task: updatedTask } : todo)));
  };
  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)));
  };

  return (
    <div className="TodoList">
      <ul className="p-0">{todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          remove={remove}
          update={update}
          toggleComplete={toggleComplete}
        />
      ))}</ul>
      <NewTodoForm createTodo={create} />
    </div>
  );
}

export default TodoList;
