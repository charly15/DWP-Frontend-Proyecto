import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Select, Upload, message } from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import MainLayout from "../layouts/MainLayout";

const { Option } = Select;

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products");
      if (!response.ok) throw new Error("Error al obtener productos");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      message.error(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/products/${id}`, { method: "DELETE" });
      message.success("Producto eliminado");
      fetchProducts();
    } catch (error) {
      message.error("Error al eliminar producto");
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setModalVisible(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data.imageUrl;
    } catch (error) {
      message.error("Error al subir imagen");
    }
  };

  const handleSubmit = async (values) => {
    try {
      let url = "http://localhost:5000/api/products";
      let method = "POST";

      if (editingProduct) {
        url = `http://localhost:5000/api/products/${editingProduct.id}`;
        method = "PUT";
      }

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("category", values.category);

      if (values.image && values.image.file) {
        formData.append("image", values.image.file.originFileObj);
      }

      await fetch(url, {
        method,
        body: formData,
      });

      message.success(editingProduct ? "Producto actualizado" : "Producto agregado");
      setModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error("Error al guardar producto");
    }
  };

 const columns = [
  { title: "Nombre", dataIndex: "name", key: "name" },
  { title: "Descripción", dataIndex: "description", key: "description" },
  { title: "Categoría", dataIndex: "category", key: "category" },
  {
    title: "Imagen",
    dataIndex: "image",
    key: "image",
    render: (image) => image ? <img src={image} alt="Producto" style={{ width: 50, height: 50, objectFit: "cover" }} /> : "Sin imagen",
  },
  {
    title: "Acciones",
    key: "actions",
    render: (_, record) => (
      <>
        <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} style={{ marginRight: 8 }} />
        <Button icon={<DeleteOutlined />} danger onClick={() => handleDelete(record.id)} />
      </>
    ),
  },
];

  return (
    <div>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ marginBottom: 16 }}>
        Agregar Producto
      </Button>
      <Table dataSource={products} columns={columns} rowKey="id" />

      <Modal
        title={editingProduct ? "Editar Producto" : "Agregar Producto"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} encType="multipart/form-data">
          <Form.Item name="name" label="Nombre" rules={[{ required: true, message: "Ingresa el nombre del producto" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Descripción">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="category" label="Categoría" rules={[{ required: true }]}>
            <Select>
              <Option value="Emotes">Emotes</Option>
              <Option value="Avatares">Avatares</Option>
              <Option value="Pantallas">Pantallas</Option>
            </Select>
          </Form.Item>
          <Form.Item name="image" label="Imagen">
            <Upload beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Subir Imagen</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Dashboard;
