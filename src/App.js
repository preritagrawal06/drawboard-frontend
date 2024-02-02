import Landing from './Pages/Landing';
import Main from './Pages/Main';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer/>
      <HashRouter>
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/room/:id' element={<Main/>}/>
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
