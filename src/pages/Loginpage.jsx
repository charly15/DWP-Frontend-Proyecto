import React, { useState } from "react";
import { Button, Input, Card, Typography, Space, message } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");  

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.msg || "Error al iniciar sesión");

      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("username", data.username); 

      message.success("Inicio de sesión exitoso!");
      navigate("/Home"); 
    } catch (error) {
      message.error(error.message);
    }
    setLoading(false);
  };

  
  const goToRegisterPage = () => {
    navigate("/register");
  };

  return (
    <div style={styles.page}>
      <Card style={styles.card}>
        <Title level={4} style={styles.siteName}>Nombre del sitio web</Title>
        <div style={styles.logo}>Logo</div>
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          <Text>Correo Electrónico</Text>
          <Input
            placeholder="Correo Electrónico"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Text>Contraseña</Text>
          <Input.Password
            placeholder="Contraseña"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="primary"
            block
            style={styles.loginButton}
            loading={loading}
            onClick={() => onFinish({ email, password })}
          >
            Iniciar sesión
          </Button>
          <Button
            block
            style={styles.registerButton}
            onClick={goToRegisterPage} 
          >
            Registrarse
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

export default LoginPage;
