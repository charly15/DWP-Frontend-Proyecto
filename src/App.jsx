import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Home from "./pages/Home";
import ProductoDetalle from "./pages/ProductoDetalle";
import Contactos from "./pages/Contactos";
import Perfil from "./pages/Perfil";
import MainLayout from "./layouts/MainLayout"; 
import Dashboard from "./pages/Dashboard";
import ErrorPage from "./pages/ErrorPage";

function App() {
  return (
    <Routes>

      <Route path="/" element={<LoginPage />} />
      <Route path="/Login" element={<LoginPage />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/producto/:id" element={<ProductoDetalle />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/contactos" element={<Contactos />} />
      <Route path="/Perfil" element={<Perfil />} />


      <Route element={<MainLayout />}>
        <Route path="/Dashboard" element={<Dashboard />} />
      </Route>


      <Route path="/ErrorPage" element={<ErrorPage />} />
      

      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;
