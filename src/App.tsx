// src/App.tsx
import React from 'react';
import TaskTable from './components/TaskTable';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
function App() {
  return (
    <div className="App">
      <h1>Task Manager</h1>
      <LoginForm />
    </div>
  );
}

export default App;
