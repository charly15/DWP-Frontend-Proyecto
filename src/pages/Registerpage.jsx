import React, { useState } from "react";
import { Button, Input, Card, Typography, Space, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", username: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onFinish = async () => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/auth/register", formData);
      message.success("Usuario registrado. Ahora inicie sesión.");
      navigate("/login");
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.msg || "Error al registrar.");
      } else {
        message.error("Error en el servidor.");
      }
    }
    setLoading(false);
  };

  return (
    <div className="login-container" style={styles.page}>
      <Card style={styles.card}>
        <Title level={4} style={styles.siteName}>Nombre del sitio web</Title>
        <div style={styles.logo}>Logo</div>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text>Correo Electrónico</Text>
          <Input 
            name="email"
            placeholder="Correo Electrónico" 
            value={formData.email} 
            onChange={handleChange} 
          />
          <Text>Usuario</Text>
          <Input 
            name="username"
            placeholder="Usuario" 
            value={formData.username} 
            onChange={handleChange} 
          />
          <Text>Contraseña</Text>
          <Input.Password 
            name="password"
            placeholder="Contraseña" 
            value={formData.password} 
            onChange={handleChange} 
          />
          <Button 
            type="primary" 
            block 
            style={styles.loginButton} 
            onClick={onFinish} 
            loading={loading}
          >
            Registrarse
          </Button>
          <Button block style={styles.registerButton}>
            <Link to="/login">Iniciar sesión</Link>
          </Button>
        </Space>
      </Card>
    </div>
  );
};

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f0f2f5",
  },
  card: {
    width: 400,
    textAlign: "center",
    padding: 20,
    borderRadius: 10,
  },
  siteName: {
    marginBottom: 10,
  },
  logo: {
    width: 60,
    height: 60,
    background: "#ddd",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 20px",
  },
  loginButton: {
    background: "#a7c7fc",
    border: "none",
    color: "black",
  },
  registerButton: {
    background: "#fff",
    border: "1px solid #ccc",
  },
};

export default RegisterPage;
