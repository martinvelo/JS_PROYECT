
//constantes a utilizar

const categorias = document.querySelectorAll('#categorias a');
const apiUrl = 'https://fakestoreapi.com/products';
let productosArray = [];
const hombre = document.getElementById('hombre');
const mujer = document.getElementById('mujer');
const electronica = document.getElementById('electronica');
const todas = document.getElementById('todas');
const carrito = JSON.parse(localStorage.getItem('carrito')) || []; 
const carritoContainer = document.getElementById('vent-carrito');
const cantidadCarritoSpan = document.getElementById('num-carrito');
const urlActual = window.location.href;
const ppal = document.getElementById('vent-ppal');
const ventProd = document.getElementById('ventprod');

function mostrarProducto(newcard) {
    const ppal = document.getElementById('vent-ppal');
    const card = document.createElement('div');
    card.classList.add('card');
    card.classList.add('shadow');
    card.innerHTML = `
        <P id="idppal" style="display: none">${newcard.id}</P>
        <img src="${newcard.image}">
        <h2>${newcard.title}</h2>
        <p id="titulo">Precio: $${newcard.price ? newcard.price.toFixed(2) : 'N/A'}</p>   
        <h3 id="cod" style="display: none">Categoría: ${newcard.category}</h3>
        <P style="display: none">${newcard.description}</P>
        <div class="btn-container">
            <button class="btn">Comprar</button>
            <button class="btn-info" id="miId">Mas info</button>
        </div>`;
    ppal.appendChild(card);
}

// Función para actualizar el contador del carrito
function actualizarContadorCarrito() {
    cantidadCarritoSpan.textContent = carrito.length;
    const totalCarrito = calcularTotalCarrito(carrito);
}

function calcularTotalCarrito(carrito) {
    let total = 0;
    for (let i = 0; i < carrito.length; i++) {
        total += carrito[i].price;
    }
    const totalCarritoElement = document.getElementById('total-carrito');
    totalCarritoElement.textContent = `Total del carrito: $${total.toFixed(2)}     `;

    const pagarButton = document.createElement('button');
    pagarButton.id = 'pagar';
    pagarButton.textContent = 'PAGAR TODO';
    pagarButton.addEventListener('click', function() {
        Swal.fire({
            title: '¿Deseas pagar todo el carrito?',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'Si',
            denyButtonText: `No`,
        })
        .then((result) => {
            if (result.isConfirmed) { 
                Swal.fire('¡Gracias por su compra!', '', 'success');
                carrito.length = 0;
                localStorage.setItem('carrito', JSON.stringify(carrito));
                actualizarContadorCarrito();
                carritoContainer.innerHTML = '';
                const vacio = document.getElementById('vacio');
                vacio.style.display = "block";
                const totalCarritoElement = document.getElementById('total-carrito');
                totalCarritoElement.style.display = "none";
            }

        })
    });

    // Agrega el botón al elemento totalCarritoElement
    totalCarritoElement.appendChild(pagarButton);
}



// conexion con la API (Excluyendo Carrito.html)

if (urlActual.includes('index.html')) {
    fetch(apiUrl)
    .then(respuesta => respuesta.json())
    .then(products => {
        productosArray = products;
        console.log(productosArray);
        productosArray.forEach(product => {
            mostrarProducto(product);
            eventotarjeta()
        });
        actualizarContadorCarrito();
    })
    // En caso de error conexion con el API carga en LOCAL
    .catch(err => {
        Swal.fire(
            'No se carga la información. Verifica la conexión',
            'Los datos cargarán de manera local',
            'question'
        );
        fetch('./productos.json')
            .then(respuesta => respuesta.json())
            .then(localProducts => {
                productosArray = localProducts;
                console.log(productosArray);
                productosArray.forEach(product => {
                    mostrarProducto(product);
                });
                
                actualizarContadorCarrito();
            })
            .catch(localError => {
                console.error('Error al cargar datos locales', localError);
            });
    });
    
}

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

//Mas info producto
eventotarjeta()

function eventotarjeta() {
    const tarjetas = document.querySelectorAll(".btn-info");
    tarjetas.forEach(tarjeta => {
        tarjeta.addEventListener('click', (evento) => {
            const producto1 = evento.currentTarget.parentNode.parentNode;
            const nuevoDiv = document.createElement('div');
            nuevoDiv.classList.add('estilos-personalizados'); 
            nuevoDiv.innerHTML = producto1.innerHTML;
            ppal.innerHTML = ''; 
            ppal.appendChild(nuevoDiv);
        });
    });
}


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
                
                actualizarContadorCarrito();
            } else if (result.isDenied) {
                Swal.fire('No se agregó al carrito', '', 'info');
            }
        });
    }
});


// HTML del carrito y lógica de eliminación de items

document.addEventListener('DOMContentLoaded', function () {
   
    // Cards del carrito
    carrito.forEach(function (producto, index) {
        const productoItem = document.createElement('div');
        productoItem.classList.add('card');
        productoItem.classList.add('shadow');
        const vacio = document.getElementById('vacio');
        productoItem.id = "cardcarrito";
        productoItem.innerHTML = ` 
            <img src="${producto.image}">
            <h3>${producto.title}</h3>
            <p>Precio: $${parseFloat(producto.price).toFixed(2)}</p> 
            <button class="remover-btn" data-index="${index}">Eliminar</button>`;
            vacio.style.display = "none";
            actualizarContadorCarrito();

        // Eliminar producto del carrito
        const removerBtn = productoItem.querySelector('.remover-btn');
        removerBtn.addEventListener('click', function () {
            const index = parseInt(removerBtn.getAttribute('data-index')); 
            carrito.splice(index, 1); 
            localStorage.setItem('carrito', JSON.stringify(carrito)); 
            carritoContainer.removeChild(productoItem); 
            const totalcarrito1 = document.getElementById('total-carrito');
            totalcarrito1.style = "none";
            if (carrito.length === 0) {
                vacio.style.display = "block";
            } else {
                vacio.style.display = "none";
            }

        // Actualizar el contador del carrito
            actualizarContadorCarrito();
        });

        carritoContainer.appendChild(productoItem);
        
        function calcularTotalCarrito() {
            let totalCarrito = 0;
            
            carrito.forEach(function (producto) {
                totalCarrito += producto.price;
            });
            const totalCarritoElement = document.getElementById('total-carrito');
            totalCarritoElement.textContent = `Total del carrito: $${totalCarrito.toFixed(2)}   `;
        }
        
        document.addEventListener('DOMContentLoaded', function () {
        
            carrito.forEach(function (producto, index) {
        
                // Eliminar producto del carrito
                const removerBtn = productoItem.querySelector('.remover-btn');
                removerBtn.addEventListener('click', function () {
                    const index = parseInt(removerBtn.getAttribute('data-index'));
                    const productoRemovido = carrito[index];
                    totalCarrito -= productoRemovido.price;
                    carrito.splice(index, 1);
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    carritoContainer.removeChild(productoItem);
                    calcularTotalCarrito();
                    actualizarContadorCarrito();
                    if (carrito.length === 0) {
                        vacio.style.display = "block";
                    } else {
                        vacio.style.display = "none";
                    }
                });
        
                
            });
        
           
            calcularTotalCarrito();

           
           


            
        });
        
        
    })});