let productos =[]
fetch("./productos.json")
.then(response => response.json())
.then(data => {
    productos = data;
    cargarProductos(productos);
}
    )
const contenidoTienda = document.getElementById("contenidoTienda");
const verCarrito = document.getElementById("verCarrito");
const modalContainer = document.getElementById("modalContainer");
const cantidadCarrito =document.querySelector("#cantidadCarrito");
//const cantidadCarrito = document.getElementById("cantidadCarrito");

/*te guarda el contenido del carrito */
let carrito = JSON.parse(localStorage.getItem("carrito")) ||[];
/*recorre los elementos para obtener imagen, nombre y precio*/
function cargarProductos(productos){
productos.forEach((producto) => {
    let content = document.createElement("div");
    content.className = "card";
    content.innerHTML = `
<img src="${producto.img}">
<h3>${producto.personaje}</h3>
<p class="precio">${"$" + producto.precio}</p>
`;
/*se crea el botón comprar*/
    contenidoTienda.append(content);
    let comprar = document.createElement("button")
    comprar.innerText = "Agregar al carrito";
    comprar.className = "comprar";
    content.append(comprar);
/*si se da click en comprar se agrega al carrito y si se duplica el producto se suma la cantidad*/
    comprar.addEventListener("click", () => {
        Toastify({
            text: "Agregaste un producto",
            duration: 3000,
            close: true,
            gravity: "top", 
            position: "right",
            stopOnFocus: true,
            style: {
            background: "linear-gradient(to right, #00b09b, aquamarine)",
            },
            onClick: function(){} // Callback after click
          }).showToast();
        const repetir = carrito.some((repetirProducto) => repetirProducto.id === producto.id);
        if (repetir) {
            carrito.map((prod) => {
                if (prod.id === producto.id) {
                    prod.cantidad++;

                }
            });
        }
        /*si el producto no está duplicado se agrega normalmente*/
        else {
            carrito.push({
                id: producto.id,
                img: producto.img,
                nombre: producto.personaje,
                precio: producto.precio,
                cantidad: producto.cantidad,
            });
        }

        /*se actualiza la cantidad de productos en carrito y se guarda localmente*/
        carritoContador();
        saveLocal();
    });
})};
const saveLocal =() =>{
localStorage.setItem("carrito", JSON.stringify(carrito));
};
