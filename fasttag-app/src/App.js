// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './pages/Home';
// import Register from './pages/Register';
// import Login from './pages/Login';
// import Newfasttag from './pages/Newfasttag';
// import Mytag from './pages/mytag';
// import Header from './components/Header';
// import PrivateRoute from './components/PrivateRoute';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// function App() {
//   return (
//     <>
//       <Router>
//         <div className='container'>
//           <Header />
//           <Routes>
//             <Route path='/' element={<Home />} />
//             <Route path='/login' element={<Login />} />
//             <Route path='/register' element={<Register />} />

//             {/* Protected route for Newfasttag */}
//             <Route path='/newfasttag' element={<PrivateRoute />}>
//               <Route path='/newfasttag' element={<Newfasttag />} />
//             </Route>
//           </Routes>
//           {/*Protected Route for mytag*/}
//           <Route path='/mytag' element={<PrivateRoute />}>
//           <Route path='/mytag' element={<Mytag/>}>
//           </Route>
//         </div>
//       </Router>
//       <ToastContainer />
//     </>
//   );
// }

// export default App;

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Newfasttag from './pages/Newfasttag';
import Mytag from './pages/Mytag';
import Simulation from './pages/Simulation'
import PaymentResult from './pages/PaymentResult';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        <div className="container">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected route for Newfasttag */}
            <Route element={<PrivateRoute />}>
              <Route path="/newfasttag" element={<Newfasttag />} />
              <Route path="/mytag" element={<Mytag />} />
            </Route>
            <Route element={<PrivateRoute/>}>
            <Route path="/payment-result" element={<PaymentResult/>}/>
            <Route path='/payment-result' element={<PaymentResult/>}/>
             </Route>
             <Route element={<PrivateRoute/>}>
            <Route path="/simulation" element={<Simulation />}/>
            <Route path='/simulation' element={<Simulation/>}/>
             </Route>
          </Routes>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
