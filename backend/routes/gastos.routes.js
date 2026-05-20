const express = require("express");
const router = express.Router();
const Gasto = require("../models/Gasto");

// GET todos
router.get("/", async (req, res) => {
  const gastos = await Gasto.find().sort({ fecha: -1 });
  res.json(gastos);
});

// POST crear
router.post("/", async (req, res) => {
  try {
    const { descripcion, monto, categoria, fecha } = req.body;

    if (!descripcion || !monto || !categoria || !fecha) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    if (monto < 0) {
      return res.status(400).json({ error: "El monto no puede ser negativo" });
    }

    const nuevo = new Gasto({ descripcion, monto, categoria, fecha });
    await nuevo.save();

    res.json(nuevo);
  } catch (err) {
    res.status(500).json({ error: "Error al crear gasto" });
  }
});

// PUT actualizar
router.put("/:id", async (req, res) => {
  try {
    const actualizado = await Gasto.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(actualizado);
  } catch {
    res.status(500).json({ error: "Error al actualizar" });
  }
});

// DELETE eliminar
router.delete("/:id", async (req, res) => {
  try {
    await Gasto.findByIdAndDelete(req.params.id);
    res.json({ mensaje: "Eliminado" });
  } catch {
    res.status(500).json({ error: "Error al eliminar" });
  }
});

// RESUMEN
router.get("/resumen", async (req, res) => {
  const gastos = await Gasto.find();

  const total = gastos.reduce((acc, g) => acc + g.monto, 0);

  const porCategoria = {};
  gastos.forEach((g) => {
    porCategoria[g.categoria] = (porCategoria[g.categoria] || 0) + g.monto;
  });

  res.json({
    total,
    cantidad: gastos.length,
    porCategoria,
  });
});

module.exports = router;
