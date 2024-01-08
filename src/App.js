import Landing from './Pages/Landing';
import Main from './Pages/Main';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/room/:id' element={<Main/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
