const API = "http://98.87.21.92:3000/api/gastos";

const form = document.getElementById("formGasto");
const lista = document.getElementById("listaGastos");
const resumenDiv = document.getElementById("resumen");
const mensaje = document.getElementById("mensaje");
const btnGuardar = document.getElementById("btnGuardar");

let editandoId = null;
let grafica = null;

window.onload = () => {
  obtenerGastos();
  obtenerResumen();
};

async function obtenerGastos() {
  const res = await fetch(API);
  const data = await res.json();

  lista.innerHTML = "";

  if (data.length === 0) {
    lista.innerHTML = "<li>No hay gastos registrados todavía.</li>";
    return;
  }

  data.forEach((g) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${g.descripcion}</strong><br>
      Monto: $${g.monto}<br>
      Categoría: ${g.categoria}<br>
      Fecha: ${new Date(g.fecha).toLocaleDateString()}
      <div class="acciones">
        <button onclick="editar('${g._id}')">Editar</button>
        <button class="eliminar" onclick="eliminar('${g._id}')">Eliminar</button>
      </div>
    `;

    lista.appendChild(li);
  });
}

async function obtenerResumen() {
  const res = await fetch(API + "/resumen");
  const data = await res.json();

  resumenDiv.innerHTML = `
    <strong>Total gastado:</strong> $${data.total}<br>
    <strong>Número de gastos:</strong> ${data.cantidad}
  `;

  const categorias = Object.keys(data.porCategoria);
  const valores = Object.values(data.porCategoria);

  const ctx = document.getElementById("grafica").getContext("2d");

  if (grafica) {
    grafica.destroy();
  }

  if (categorias.length === 0) {
    return;
  }

  grafica = new Chart(ctx, {
    type: "pie",
    data: {
      labels: categorias,
      datasets: [
        {
          label: "Gastos por categoría",
          data: valores,
          backgroundColor: [
            "#ff6384",
            "#36a2eb",
            "#ffce56",
            "#4caf50",
            "#9c27b0",
            "#ff9800",
            "#00bcd4",
            "#e91e63",
          ],
        },
      ],
    },
  });
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const gasto = {
    descripcion: descripcion.value.trim(),
    monto: Number(monto.value),
    categoria: categoria.value.trim(),
    fecha: fecha.value,
  };

  if (!gasto.descripcion || !gasto.monto || !gasto.categoria || !gasto.fecha) {
    mensaje.innerText = "❌ Todos los campos son obligatorios";
    return;
  }

  if (gasto.monto < 0) {
    mensaje.innerText = "❌ El monto no puede ser negativo";
    return;
  }

  if (editandoId) {
    await fetch(API + "/" + editandoId, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gasto),
    });

    editandoId = null;
    btnGuardar.innerText = "Agregar gasto";
    mensaje.innerText = "✏️ Gasto actualizado correctamente";
  } else {
    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gasto),
    });

    mensaje.innerText = "✅ Gasto agregado correctamente";
  }

  form.reset();
  obtenerGastos();
  obtenerResumen();
});

async function editar(id) {
  const res = await fetch(API);
  const data = await res.json();

  const g = data.find((x) => x._id === id);

  descripcion.value = g.descripcion;
  monto.value = g.monto;
  categoria.value = g.categoria;
  fecha.value = g.fecha.split("T")[0];

  editandoId = id;
  btnGuardar.innerText = "Actualizar gasto";
  mensaje.innerText = "Editando gasto seleccionado";
}

async function eliminar(id) {
  await fetch(API + "/" + id, { method: "DELETE" });

  mensaje.innerText = "🗑️ Gasto eliminado correctamente";
  obtenerGastos();
  obtenerResumen();
}
