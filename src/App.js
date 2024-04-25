import { Routes,Route } from 'react-router';
import Mainpage from './pages/Mainpage';
import LoginPage from './pages/LoginPage';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  
  return (
    <div className="App">
    <Routes>
      <Route exact path='/' element={<Mainpage/>} />
      <Route exact path='/login' element={<LoginPage/>} />
     </Routes>
   
    </div>
  );
}

export default App;
