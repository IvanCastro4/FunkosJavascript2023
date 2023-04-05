/*hace el espacio en el que van a mostrarse los elementos del carrito*/
const pintarCarrito = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "flex";
    const modalHeader = document.createElement("div");
    modalHeader.className = "modalHeader";
    modalHeader.innerHTML = `
<h1 class="modalHeaderTitulo"> Carrito.</h1>
`;
    modalContainer.append(modalHeader);
    /*botón para cerrar la ventana del carrito*/
    const modalbutton = document.createElement("h1");
    modalbutton.innerText = "Cerrar[X]";
    modalbutton.className = "modalHeaderButton";
    modalbutton.addEventListener("click", () => {
        modalContainer.style.display = "none";
    });
    /*se recorre el arreglo de productos para obtener las características*/
    modalHeader.append(modalbutton);
    carrito.forEach((producto) => {
        let carritoContent = document.createElement("div");
        carritoContent.className = "modalContent";
        carritoContent.innerHTML = `
<img src=${producto.img}>
<h3>${producto.nombre}</h3>
<p>$${producto.precio} </p>
<span class= "restar"> - </span>
<p> Cantidad: ${producto.cantidad}</p>
<span class= "sumar"> + </span>
<p>Total:$ ${producto.cantidad * producto.precio}</p>
<span class="borrarProducto"> ❌ </span>
`;
        /*si el producto es más de 1, se puede restar, si es uno se deberá eliminar directamente con el botón correspondiente*/
        modalContainer.append(carritoContent);
        let restar = carritoContent.querySelector(".restar");
        restar.addEventListener("click", () => {
            if (producto.cantidad !== 1) {
                producto.cantidad--;
                Toastify({
                    text: "Eliminaste una unidad",
                    duration: 3000,
                    close: true,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, orange, aquamarine)",
                    },
                    onClick: function () { },
                }).showToast();
            }
            else {
                Toastify({
                    text: "Puedes quitar el producto en ❌",
                    duration: 3000,
                    close: false,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
                    style: {
                        background: "linear-gradient(to right, orange, aquamarine)",
                    },
                    onClick: function () { },
                }).showToast();
            }
            saveLocal();
            pintarCarrito();
            carritoContador();
        });
        /*si el producto es 1 o más se puede seguir sumando (no puse límite de inventario)*/
        let sumar = carritoContent.querySelector(".sumar");
        sumar.addEventListener("click", () => {
            Toastify({
                text: "Agregaste una unidad",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, orange, aquamarine)",
                },
                onClick: function () { }, // Callback after click
            }).showToast();
            producto.cantidad++;
            saveLocal();
            pintarCarrito();
            carritoContador();
        });
        /*se busca el id del producto para eliminarlo si coincide*/
        let eliminar = carritoContent.querySelector(".borrarProducto");
        eliminar.addEventListener("click", () => {
            Toastify({
                text: "Eliminaste un producto",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, orange, aquamarine)",
                },
                onClick: function () { }, // Callback after click
            }).showToast();
            eliminarProducto(producto.id);
        });
    });
    /*recorre el carrito multiplicando el precio*cantidad y sumando el resultado de los ítems existentes, dando un total global*/
    const total = carrito.reduce((acc, el) => acc + el.precio * el.cantidad, 0);
    const totalCompra = document.createElement("div");
    totalCompra.className = "totalContent";
    /*si el carrito está vació te aparece el texto que lo indica*/
    if (total > 0) {
        totalCompra.innerHTML = `<h1 >Total a pagar:  $ ${total} </h1> `;
        totalCompra.style.display = "flex";
        modalContainer.append(totalCompra);
    } else {
        totalCompra.innerHTML = `<h1 >Tu carrito está vacío </h1> `;
        totalCompra.style.display = "flex";
        modalContainer.append(totalCompra);
    }
    const compraFinal = document.createElement("button");
    compraFinal.className = "compraFinal";
    compraFinal.innerText = "Comprar";
    /*desaparece el boton comprar si no hay productos en carrito*/
    if (total > 0) {
        modalContainer.append(compraFinal);
    }
    compraFinal.addEventListener("click", mostrarTexto);
    function mostrarTexto() {
        Swal.fire({
            title: "Comprar Carrito",
            html: `¿Desea realizar esta compra de ${carrito.reduce((acc, producto) => acc + producto.cantidad, 0)} productos por $${total}? `,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, finalizar",
            cancelButtonText: "No, volver al carrito",
        }).then((result) => {
            if (result.isConfirmed) {
                modalContainer.style.display = "none";
                carrito.splice(0, carrito.length);
                carritoContador();
                saveLocal();
                Swal.fire({
                    title: "¡Compra realizada con éxito!",
                    text: "¡Gracias, vuelva prontos!",
                    imageUrl:
                        "https://sm.ign.com/t/ign_latam/news/t/the-simpso/the-simpsons-creator-confirms-apu-wont-be-written-out-of-the_cmb2.1200.jpg",
                    imageWidth: 300,
                    imageHeight: 200,
                    imageAlt: "Imagen de Apu feliz porque le compraron",
                });
            }
        });
    }
};

/*cuando se elimina el producto se selecciona el id  y se borra, rehaciendo el carrito sin él*/
verCarrito.addEventListener("click", pintarCarrito);
const eliminarProducto = (id) => {
    const foundId = carrito.find((element) => element.id === id);
    carrito = carrito.filter((carritoId) => {
        return carritoId !== foundId;
    });
    carritoContador();
    saveLocal();
    pintarCarrito();
};
/*te cuenta la extensión del carrito para decirte la cantidad de productos, y se guarda localmente*/
function carritoContador() {
    let numeroNuevo = carrito.reduce(
        (acc, producto) => acc + producto.cantidad, 0);
    //cantidadCarrito.innerText= numeroNuevo;
    cantidadCarrito.style.display = "block";
    localStorage.setItem("numeroNuevo", JSON.stringify(numeroNuevo));
    cantidadCarrito.innerText = JSON.parse(localStorage.getItem("numeroNuevo"));
}
carritoContador();
saveLocal;
