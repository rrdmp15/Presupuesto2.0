let ingresos = [];
let egresos = [];
let button = document.querySelector("#button")
let btnClear = document.querySelector("#btn-clear");
let totalIngresos = calcularTotal(ingresos);
let totalEgresos = calcularTotal(egresos);

document.addEventListener('DOMContentLoaded', loadDataFromLocalStorage);

button.addEventListener("click", ()=>{
  let tipo = document.querySelector('select[name="tipo"]').value;
  let descripcion = document.querySelector('input[name="descripcion"]').value;
  let valor = parseInt(document.querySelector('input[name="valor"]').value);

  if (tipo === "ingreso") {
    ingresos.unshift({ descripcion, valor });
    totalIngresos = calcularTotal(ingresos);
  } else {
    egresos.unshift({ descripcion, valor });
    totalEgresos = calcularTotal(egresos);
  }

  localStorage.setItem("ingreso", JSON.stringify(ingresos));

  localStorage.setItem("egreso", JSON.stringify(egresos));

  if (tipo === "ingreso") {
    mostrarIngreso(ingresos[0]);
  } else {
    mostrarEgreso(egresos[0]);
  }

  document.querySelector("#totalIngresos").textContent = totalIngresos;
  document.querySelector("#totalEgresos").textContent = totalEgresos;
  actualizarTotales();
  actualizarPorcentajes();

  let presupuesto = calcularPresupuesto();
  document.querySelector("#presupuesto").textContent = presupuesto;

  let ingresosTabla = parseInt(calcularTotal(ingresos))
  let egresosTabla = parseInt(calcularTotal(egresos))



let chartDom = document.getElementById('grafica');
let myChart = echarts.init(chartDom, null, {
  renderer: 'canvas',
  useDirtyRect: true
});

let option;

option = {
  xAxis: {
    type: 'category',
    data: [ 'ingresos','egresos']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [ingresosTabla, egresosTabla],
      type: 'bar'
    }
  ]
};

myChart.setOption(option);
})

btnClear.addEventListener("click", function() {
	localStorage.clear();
});

let contador = 0;

function mostrarIngreso(val) {
  let tabla = document.querySelector("#tablaIngresosTbody");
  let plantilla = `
    <tr>
      <td>${val.descripcion}</td>
      <td>${val.valor}</td>
      <td></td>
      <td class="celdaEliminarIngreso-${contador}"></td>
    </tr>
  `;
  tabla.insertAdjacentHTML("beforeend", plantilla);

  let celdaEliminar = document.querySelector(`.celdaEliminarIngreso-${contador}`);
  let botonEliminar = document.createElement("button");
  botonEliminar.innerHTML = '<i class="fas fa-times"></i>';
  botonEliminar.setAttribute("class", "btn btn-danger btn-sm eliminar");
  botonEliminar.setAttribute("type", "button");
  botonEliminar.addEventListener("click", function() {
    eliminarIngreso(ingresos, ingresos.length - 1);
    tabla.deleteRow(tabla.rows.length - 1);
    actualizarTotales();
    actualizarPorcentajes();
  });
  celdaEliminar.appendChild(botonEliminar);

  contador++;
}

function mostrarEgreso(val) {
  let tabla = document.querySelector("#tablaEgresosTbody");
  let porcentaje = ((val.valor / totalEgresos) * 100).toFixed(2) + "%";
  let plantilla = `
    <tr>
      <td>${val.descripcion}</td>
      <td>${val.valor}</td>
      <td>${porcentaje}</td>
      <td class="celdaEliminar-${contador}"></td>
    </tr>
  `;
  tabla.insertAdjacentHTML("beforeend", plantilla);

  let celdaEliminar = document.querySelector(`.celdaEliminar-${contador}`);
  let botonEliminar = document.createElement("button");
  botonEliminar.innerHTML = '<i class="fas fa-times"></i>';
  botonEliminar.setAttribute("class", "btn btn-danger btn-sm eliminar");
  botonEliminar.setAttribute("type", "button");
  botonEliminar.addEventListener("click", function() {
    eliminarEgreso(egresos, egresos.length - 1);
    tabla.deleteRow(tabla.rows.length - 1);
    actualizarTotales();
    actualizarPorcentajes();
  });
  celdaEliminar.appendChild(botonEliminar);

  contador++;
}

function calcularTotal(arreglo) {
  let total = 0;
  for (let i = 0; i < arreglo.length; i++) {
    total += arreglo[i].valor;
  }
  return total;
}

function calcularPresupuesto() {
  let porcentajeEgresos = totalEgresos / totalIngresos * 100;
  document.querySelector("#porcentajeEgresos").textContent = porcentajeEgresos.toFixed(2) + "%";
  return totalIngresos - totalEgresos;
}

function eliminarEgreso(arreglo, indice) {
  arreglo.splice(indice, 1);
  actualizarPorcentajes();
}

function eliminarIngreso(arreglo, indice) {
  arreglo.splice(indice, 1);
}

function actualizarTotales() {
  document.querySelector("#totalIngresos").textContent = totalIngresos;
  document.querySelector("#totalEgresos").textContent = totalEgresos;
  
  let presupuesto = calcularPresupuesto();
  document.querySelector("#presupuesto").textContent = presupuesto;
  
  let porcentajeEgresos = totalEgresos / totalIngresos * 100;
  document.querySelector("#porcentajeEgresos").textContent = porcentajeEgresos.toFixed(2) + "%";
  
}  
  
function actualizarPorcentajes() {
  for (let i = 0; i < egresos.length; i++) {
    let porcentaje = (egresos[i].valor / totalEgresos) * 100;
    let fila = document.querySelector("#tablaEgresos").rows[i + 1];
    fila.cells[2].textContent = porcentaje.toFixed(2) + "%";
  }
}

function loadDataFromLocalStorage() {
  const dataIngresos = JSON.parse(localStorage.getItem('ingreso'));
  const dataEgresos = JSON.parse(localStorage.getItem('egreso'));

  if(dataIngresos && dataEgresos){
    ingresos.unshift(...dataIngresos)
    egresos.unshift(...dataEgresos)
  } else {
    return
  }

  totalIngresos = calcularTotal(ingresos);
  totalEgresos = calcularTotal(egresos);

  ingresos.forEach(() => {
    mostrarIngreso(ingresos[0]);
  });
  
  egresos.forEach(() => {
    mostrarEgreso(egresos[0]);
  });
  
  document.querySelector("#totalIngresos").textContent = totalIngresos;
  document.querySelector("#totalEgresos").textContent = totalEgresos;
  actualizarTotales();
  actualizarPorcentajes();

  let presupuesto = calcularPresupuesto();
  document.querySelector("#presupuesto").textContent = presupuesto;
}







