# JS_PROYECT
PROYECTO E-COMERCEConstantes 
En general, este código está diseñado para una tienda en línea que muestra productos, permite filtrarlos por categorías, agregarlos al carrito, ver detalles adicionales y realizar un pago simulado. También incluye manejo de errores en caso de problemas de conexión y utiliza almacenamiento local para mantener el carrito entre sesiones.

Constantes y Variables Iniciales: El código comienza definiendo varias constantes y variables, como las categorías, la URL de la API, un array de productos, elementos del DOM (Document Object Model) como botones, contenedores y elementos para el carrito.

Función mostrarProducto(newcard): Esta función se utiliza para crear y mostrar tarjetas de productos en la página. Toma un objeto newcard como entrada y lo utiliza para generar el contenido HTML de una tarjeta de producto que se agrega al elemento con el id vent-ppal.

Funciones actualizarContadorCarrito y calcularTotalCarrito: Estas funciones se utilizan para mantener actualizado el contador del carrito y calcular el total de los productos en el carrito.

Conexión con la API: El código utiliza una solicitud fetch para obtener datos de la API (o carga datos locales en caso de error de conexión). Luego, recorre los productos y llama a la función mostrarProducto para mostrarlos en la página.

Filtrado por Categorías: Se han definido botones (como "Hombre," "Mujer," "Electrónica," y "Todas") que permiten filtrar los productos según sus categorías. Al hacer clic en uno de estos botones, se actualiza la página con los productos correspondientes.

Manejo del Carrito de Compras: Cuando se hace clic en el botón "Comprar" de un producto, se agrega el producto al carrito, se muestra un mensaje emergente y se llama a actualizarContadorCarrito. En la sección del carrito, se pueden eliminar productos y se actualiza el total del carrito.

Eventos de "Mas Info": Cuando se hace clic en el botón "Mas info" en una tarjeta de producto, se crea un nuevo div con estilos personalizados para mostrar más detalles del producto. Esto se logra con la función eventotarjeta.

Comentario y Comentarios en el Código: Es importante destacar que el código está comentado, lo que es muy útil para otros desarrolladores o para ti mismo para comprender cómo funciona cada parte del código.

Consideraciones: Este código utiliza la biblioteca Swal para mostrar ventanas emergentes y requiere que esta biblioteca esté incluida en tu proyecto
