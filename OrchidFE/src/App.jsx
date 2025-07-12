import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/toast.css';
import ManageOrchids from './components/ManageOrchids';
import EditOrchid from './components/EditOrchid';
import HomeScreen from './pages/HomeScreen';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import DetailOrchid from './pages/DetailOrchid';
import Register from './pages/Register';
import Footer from './components/Footer';
import { ProtectedRoute, AdminRoute, StaffRoute } from './components/ProtectedRoute';
import MyOrders from './pages/MyOrders';
import Users from './pages/Users';
import OrdersPage from "./pages/Orders";

function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== '/login' && location.pathname !== '/register' && <NavBar />}
      <Routes>
        <Route path='/' element={<HomeScreen/>}/>
        <Route path='/detail/:id' element={<DetailOrchid/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        
        {/* Protected Routes - Admin & Staff only */}
        <Route path='/manage' element={
          <StaffRoute>
            <ManageOrchids/>
          </StaffRoute>
        }/>
        <Route path='/edit/:id' element={
          <StaffRoute>
            <EditOrchid/>
          </StaffRoute>
        }/>
        
        {/* Admin only routes */}
        <Route path='/users' element={
          <AdminRoute>
            <Users />
          </AdminRoute>
        }/>
        
        {/* Protected routes - All authenticated users */}
        <Route path='/my-orders' element={
          <ProtectedRoute>
            <MyOrders />
          </ProtectedRoute>
        }/>
        <Route path='/orders' element={
          <StaffRoute>
            <OrdersPage />
          </StaffRoute>
        }/>
      </Routes>
      {location.pathname !== '/login' && location.pathname !== '/register' && <Footer />}
      
      {/* Toast Container for notifications */}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  )
}

export default App