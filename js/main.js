//Recupero los productos del LocalStorage y lo parseo
const productosEnStorage = JSON.parse(localStorage.getItem("productos")) || [];

//Guardo los productos en el LocalStorage
localStorage.setItem("productos", JSON.stringify(productos));

//Recupero los productos del carrito desde el LocalStorage
let carritoEnStorage = JSON.parse(localStorage.getItem("carrito")) || [];

//Creo un carrito para guardar los productos a comprar
const carrito = [];

//Obtenemos el div contenedor
const contenedorProductos = document.getElementById("contenedorProductos");

// Obtener el elemento del ícono de carga
const loadingIcon = document.getElementById("loading");

// Función para mostrar el ícono de carga
const mostrarCargando = () => {
    contenedorProductos.innerHTML = "";
    loadingIcon.style.display = "block";
};

// Función para ocultar el ícono de carga
const ocultarCargando = () => {
    loadingIcon.style.display = "none";
};

//Creamos la funcion mostrarProductos
const mostrarProductos = (productos) => {
    contenedorProductos.innerHTML = "";
    productos.forEach(producto => {
        const card = document.createElement("div");
        card.classList.add("col-xl-4", "col-md-6", "col-sm-12");

        card.innerHTML = `
            <div class="card">
                <img src= "${producto.imagen}" class="card-img-top imgProductos" alt="${producto.nombre}">
                <div class="text-center">
                    <h2>${producto.nombre}</h2>
                    <p class="desc">${producto.descripcion}</p>
                    <b>$${producto.precio}</b><br>
                    <button class= "btn colorBoton" id="boton${producto.id}">Agregar</button>
                </div>
            </div>
        `

        contenedorProductos.appendChild(card);

        const boton = document.getElementById(`boton${producto.id}`);

        boton.addEventListener("click", () => {
            agregarAlCarrito(producto.id);
        });
    });
}

const simularCargaProductos = (productos) => {
    mostrarCargando();
    setTimeout(() => {
        mostrarProductos(productos);
        ocultarCargando();
    }, 600);
};

mostrarProductos(productos);

let filtroCategoria = "todos";
let filtroPrecio = null;

const filtradoPorCategoria = document.getElementById("productosFiltrados");

filtradoPorCategoria.addEventListener("click", (e) => {
    filtroCategoria = e.target.getAttribute("data-filter");
    aplicarFiltros();
});

// Filtro por precio
const filtrarPorPrecio = document.getElementById("filtroPrecio");

filtrarPorPrecio.addEventListener("click", (e) => {
    filtroPrecio = e.target.innerHTML;
    aplicarFiltros();
});

const aplicarFiltros = () => {
    let productosFiltrados = productosEnStorage;

    // Filtrar por categoría
    if (filtroCategoria !== 'todos') {
        productosFiltrados = productosFiltrados.filter((producto) =>
            producto.categoria === filtroCategoria.toLowerCase()
        );
    }

    // Filtrar por precio
    if (filtroPrecio) {
        if (filtroPrecio === "Menor a Mayor") {
            productosFiltrados = productosFiltrados.sort((a, b) => a.precio - b.precio);
        } else if (filtroPrecio === "Mayor a Menor") {
            productosFiltrados = productosFiltrados.sort((a, b) => b.precio - a.precio);
        }
    }

    simularCargaProductos(productosFiltrados);
};


const agregarAlCarrito = (id) => {

    const productoEnCarrito = carritoEnStorage.find(producto => producto.id === id);

    if (productoEnCarrito) {
        // Si el producto ya está en el carrito, simplemente aumenta la cantidad.
        productoEnCarrito.cantidad++;

    } else {
        // Si el producto no está en el carrito, agrégalo con cantidad 1.
        const productoSeleccionado = productos.find(producto => producto.id === id);
        carritoEnStorage.push(productoSeleccionado);
    }

    // Recalcula el precio total para todos los productos en el carrito.
    const total = carritoEnStorage.reduce((acc, producto) => {
        producto.precioTotal = producto.precio * producto.cantidad;
        return acc + producto.precioTotal
    }, 0);

    // Guarda los datos actualizados en sessionStorage
    localStorage.setItem("carrito", JSON.stringify(carritoEnStorage));

    // Actualiza el total en el carrito
    localStorage.setItem("total", total);

    dibujarCarrito();
}

// Evento de boton carrito
const btnCarrito = document.getElementById("btnCarrito");

const carritoTable = document.getElementById("carritoTable");

let costoTotal = 0;

btnCarrito.addEventListener("click", () => {
    if (carritoTable) {
        if (carritoTable.style.display === "block") {
            carritoTable.style.display = "none";
        } else {
            carritoTable.style.display = "block";
            dibujarCarrito();
        }
    }
});

// Dibujar el Carrito
const dibujarCarrito = () => {
    // Selecciona el elemento de la lista del carrito
    const listaCarrito = document.getElementById("items");

    // Limpia el contenido anterior del carrito
    listaCarrito.innerHTML = '';

    carritoEnStorage.forEach(productosEnStorage => {
        const { imagen, nombre, cantidad, precio, id } = productosEnStorage;
        // Crea una fila para el producto en el carrito
        const row = document.createElement("tr");
        row.className = "productoCarrito";
        row.innerHTML = `
            <td><img src="${imagen}" alt="${nombre}"/></td>
            <td>${nombre}</td>
            <td>${cantidad}</td>
            <td>$${precio}</td>
            <td>$${productosEnStorage.precioTotal}</td>
            <td>
                <button id="+${id}" class="btn btn-success">+</button>
                <button id="-${id}" class="btn btn-danger">-</button>
            </td>
        `;

        // Agrega la fila al carrito
        listaCarrito.appendChild(row);

        // Agrega eventos a los botones de aumento y disminución
        const btnAgregar = document.getElementById(`+${id}`);
        const btnRestar = document.getElementById(`-${id}`);

        btnAgregar.addEventListener("click", () => aumentarCantidad(id));
        btnRestar.addEventListener("click", () => restarCantidad(id));
    });

    dibujarFooter();
};


const aumentarCantidad = (id) => {
    const indexProductoCarrito = carritoEnStorage.findIndex((productosEnStorage) => productosEnStorage.id === id);

    if (indexProductoCarrito !== -1) {
        carritoEnStorage[indexProductoCarrito].cantidad++;
        carritoEnStorage[indexProductoCarrito].precioTotal = carritoEnStorage[indexProductoCarrito].cantidad * carritoEnStorage[indexProductoCarrito].precio;
    }

    // Guarda los datos actualizados en sessionStorage
    localStorage.setItem("carrito", JSON.stringify(carritoEnStorage));
    dibujarCarrito();
}

const restarCantidad = (id) => {
    const indexProductoCarrito = carritoEnStorage.findIndex((productosEnStorage) => productosEnStorage.id === id);

    if (indexProductoCarrito !== -1) {
        if (carritoEnStorage[indexProductoCarrito].cantidad > 1) {
            carritoEnStorage[indexProductoCarrito].cantidad--;
            carritoEnStorage[indexProductoCarrito].precioTotal = carritoEnStorage[indexProductoCarrito].cantidad * carritoEnStorage[indexProductoCarrito].precio;
        } else {
            // Si la cantidad es 1 o menor, simplemente elimina el producto del carrito
            carritoEnStorage.splice(indexProductoCarrito, 1);
        }
    }

    // Guarda los datos actualizados en sessionStorage
    localStorage.setItem("carrito", JSON.stringify(carritoEnStorage));
    dibujarCarrito();
}

const generarTotales = () => {
    costoTotal = carritoEnStorage.reduce((total, { precioTotal }) => total + precioTotal, 0)
    const cantidadTotal = carritoEnStorage.reduce((total, { cantidad }) => total + cantidad, 0)

    return {
        costoTotal: costoTotal,
        cantidadTotal: cantidadTotal
    }
}

const footCarrito = document.getElementById("totales");
// Dibujar Footer
const dibujarFooter = () => {
    if (carritoEnStorage.length > 0) {
        footCarrito.innerHTML = "";

        let footer = document.createElement("tr");

        footer.innerHTML = `
            <th>
                <b>Totales:</b>
            </th>
            <td></td>
            <td>${generarTotales().cantidadTotal}</td>
            <td></td>
            <td>$${generarTotales().costoTotal}</td>
            <td>
                <button id="btnFinalizarCompra" class="btn btn-success">Finalizar Compra</button>
            </td>
        `;

        footCarrito.append(footer);
    } else {
        footCarrito.innerHTML = "<h3>No hay producto en carrito</h3>";
    }
    const btnFinalizarCompra = document.getElementById("btnFinalizarCompra");
    if (btnFinalizarCompra) {
        btnFinalizarCompra.addEventListener("click", () => Comprar());
    }
};

const Comprar = () => {
    if (carritoEnStorage.length > 0) {
        const respuesta = confirm("¿Desea continuar con la compra?");
        if (respuesta) {
            carritoEnStorage = [];
            alert("La compra se realizó con éxito");
            localStorage.setItem("carrito", JSON.stringify(carritoEnStorage));
            dibujarCarrito();
        } else {
            alert("Compra cancelada");
        }
    } else {
        alert("El carrito está vacío");
    }
}
