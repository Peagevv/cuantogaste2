const mongoose = require("mongoose");

const gastoSchema = new mongoose.Schema(
  {
    descripcion: {
      type: String,
      required: true,
    },
    monto: {
      type: Number,
      required: true,
      min: 0,
    },
    categoria: {
      type: String,
      required: true,
    },
    fecha: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Gasto", gastoSchema);
