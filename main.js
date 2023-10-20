const ppal = document.getElementById('vent-ppal');
const categorias = document.querySelectorAll('#categorias a');
const apiUrl = 'https://fakestoreapi.com/products';
let productosArray = [];
const hombre = document.getElementById('hombre');
const mujer = document.getElementById('mujer');
const electronica = document.getElementById('electronica');
const todas = document.getElementById('todas');
const carrito = JSON.parse(localStorage.getItem('carrito')) || []; // Obtener el carrito desde el almacenamiento local
const carritoContainer = document.getElementById('vent-carrito');
const cantidadCarritoSpan = document.getElementById('num-carrito');

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    cantidadCarritoSpan.textContent = carrito.length;
}

function mostrarProducto(newcard) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('shadow');
    card.innerHTML = `
        <img src="${newcard.image}">
        <h2>${newcard.title}</h2>
        <p>Precio: $${newcard.price ? newcard.price.toFixed(2) : 'N/A'}</p>
        <h3 id="cod" style="display: none">Categoría: ${newcard.category}</h3>
        <div class="btn-container">
            <button class="btn">Comprar</button>
            <button class="btn-info">Info</button>
        </div>`;
    ppal.appendChild(card);
}

fetch(apiUrl)
    .then(respuesta => respuesta.json())
    .then(products => {
        productosArray = products;
        console.log(productosArray);
        productosArray.forEach(product => {
            mostrarProducto(product);
        });
        // Actualizar el contador del carrito después de cargar los productos
        actualizarContadorCarrito();
    })
    .catch(error => {
        Swal.fire(
            'No se carga la información. Verifica la conexión',
            'Los datos cargarán de manera local',
            'question'
        );
        fetch('./productos.json')
            .then(respuesta => respuesta.json())
            .then(localProducts => {
                productosArray = localProducts;
                console.log('Cargando datos locales', productosArray);
                productosArray.forEach(product => {
                    mostrarProducto(product);
                });
                // Actualizar el contador del carrito después de cargar los productos locales
                actualizarContadorCarrito();
            })
            .catch(localError => {
                console.error('Error al cargar datos locales', localError);
            });
    });

// Filtrado por categorías //
hombre.addEventListener('click', () => {
    ppal.innerHTML = '';
    const productosFiltrados = productosArray.filter(product => product.category === "men's clothing");
    productosFiltrados.forEach(product => {
        mostrarProducto(product);
    });
});

mujer.addEventListener('click', () => {
    ppal.innerHTML = '';
    const productosFiltrados = productosArray.filter(product => product.category === "women's clothing");
    productosFiltrados.forEach(product => {
        mostrarProducto(product);
    });
});

electronica.addEventListener('click', () => {
    ppal.innerHTML = '';
    const productosFiltrados = productosArray.filter(product => product.category === 'electronics');
    productosFiltrados.forEach(product => {
        mostrarProducto(product);
    });
});

todas.addEventListener('click', () => {
    ppal.innerHTML = '';
    productosArray.forEach(product => {
        mostrarProducto(product);
    });
});

// Lógica del carrito de compras y agregado a local storage //

document.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('btn')) {
        const productagr = event.target.parentElement.parentElement;
        const title = productagr.querySelector('h2').textContent;
        const price = parseFloat(productagr.querySelector('p').textContent.replace('Precio: $', ''));
        const image = productagr.querySelector('img').src;

        const productoagregado = {
            title,
            price,
            image,
        };

        Swal.fire({
            title: '¿Deseas agregar el producto al carrito?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Agregar al Carrito',
            denyButtonText: 'No Agregar'
        }).then((result) => {
            if (result.isConfirmed) {
                carrito.push(productoagregado);
                localStorage.setItem('carrito', JSON.stringify(carrito));
                Swal.fire('Producto agregado al carrito', '', 'success');
                // Actualizar el contador del carrito
                actualizarContadorCarrito();
            } else if (result.isDenied) {
                Swal.fire('No se agregó al carrito', '', 'info');
            }
        });
    }
});

// HTML del carrito y lógica de eliminación de items
document.addEventListener('DOMContentLoaded', function () {
    carritoContainer.innerHTML = ''; // Limpiar el contenido del carrito al cargar la página

    // Cards del carrito
    carrito.forEach(function (producto, index) {
        const productoItem = document.createElement('div');
        productoItem.classList.add('card');
        productoItem.classList.add('shadow');
        productoItem.innerHTML = `
            <img src="${producto.image}" alt="${producto.title}">
            <h3>${producto.title}</h3>
            <p>Precio: $${parseFloat(producto.price).toFixed(2)}</p> <!-- Convertir a número antes de llamar a toFixed -->
            <button class="remover-btn" data-index="${index}">Eliminar</button>`;

        // Agregar un evento de clic para eliminar el producto del carrito
        const removerBtn = productoItem.querySelector('.remover-btn');
        removerBtn.addEventListener('click', function () {
            const index = parseInt(removerBtn.getAttribute('data-index')); // Obtener el índice del botón
            carrito.splice(index, 1); // Eliminar el producto del carrito
            localStorage.setItem('carrito', JSON.stringify(carrito)); // Actualizar el carrito en el almacenamiento local
            carritoContainer.removeChild(productoItem); // Eliminar la tarjeta del producto del carrito visualmente
            // Actualizar el contador del carrito
            actualizarContadorCarrito();
        });

        carritoContainer.appendChild(productoItem);
    });
});