const express = require("express");
const admin = require("firebase-admin");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const db = admin.firestore();


const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({ storage });


router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("PRODUCTS").get();
    if (snapshot.empty) return res.json([]);

    const products = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        image: data.image ? `http://localhost:5000/uploads/${data.image}` : "",
      };
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener productos", error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("PRODUCTS").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ msg: "Producto no encontrado" });
    }

    const product = docSnap.data();
    res.json({ id: docSnap.id, ...product, image: product.image ? `http://localhost:5000/uploads/${product.image}` : "" });
  } catch (error) {
    res.status(500).json({ msg: "Error al obtener producto", error: error.message });
  }
});


router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, description, category } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({ msg: "Faltan campos obligatorios" });
    }

    let imageName = "";
    if (req.file) {
      imageName = req.file.filename; 
    }

    const newProduct = { name, description, category, image: imageName, createdAt: new Date() };

    const docRef = await db.collection("PRODUCTS").add(newProduct);
    res.status(201).json({ id: docRef.id, ...newProduct });
  } catch (error) {
    res.status(500).json({ msg: "Error al agregar producto", error: error.message });
  }
});


router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category } = req.body;

    if (!name || !category) {
      return res.status(400).json({ msg: "Faltan campos obligatorios" });
    }

    let updateData = { name, description, category };

    if (req.file) {
      updateData.image = req.file.filename; // Solo guardamos el nombre del archivo
    }

    await db.collection("PRODUCTS").doc(id).update(updateData);
    res.json({ msg: "Producto actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al actualizar producto", error: error.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("PRODUCTS").doc(id).delete();
    res.json({ msg: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error al eliminar producto", error: error.message });
  }
});


router.use("/uploads", express.static(path.join(__dirname, "../uploads")));

module.exports = router;
