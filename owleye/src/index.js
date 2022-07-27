import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes,Route} from 'react-router-dom';
import Login from './pages/Login.js';
import Registration from './pages/Registration.js';

export default function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Registration/>}/>
      </Routes>
    </BrowserRouter>
  )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);