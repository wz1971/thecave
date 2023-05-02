verificarEdad()
autenticarUsuario()

//Traer lista de productos y guardar en array local
const productList = []
fetch('./data/productList.json')
  .then(respuesta => respuesta.json())
  .then(lista => productList = [...lista])
  //.then(lista => {
  //  lista.forEach(item => productList.push(item))
  //})
  .catch(error => {
    Swal.fire("Hubo un error al cargar los datos")
    recargarPagina()
  })

//Capturar click en nav "comprar"
let navComprar = document.getElementById("comprar")
navComprar.addEventListener("click", listarTodo)

//Capturar click en nav "inicio" o en logo
let inicio = document.getElementById("inicio")
inicio.addEventListener("click", recargarPagina)
let logo = document.getElementsByClassName("navbar-brand")
logo[0].addEventListener("click", recargarPagina)

//Capturar click en nav "contacto" y renderizar página
let contacto = document.getElementById("contacto")
contacto.addEventListener("click", () => {
  wrapper.innerHTML = `
    <div class="contacto-items">
    <div id="contacto-text">
        <h2>¿Dónde estamos?</h2>
        <p>Hortiguera 1500<br>
            C1406CMF CABA<br>
            +54-9-11-2222-3333
        </p>
    </div>
    <div id="contacto-map">
    <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13130.680086145061!2d-58.44976913022461!3d-34.6377782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bccbca6ef4dbcd%3A0x44e45f4dd6dc7d06!2sHortiguera%201500%2C%20C1406CMF%20CABA!5e0!3m2!1ses-419!2sar!4v1669993430160!5m2!1ses-419!2sar"
        width="720" height="540" style="border:0;" allowfullscreen="" loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
</div>
`
})

//Capturar click en "carrito" y renderizar
let verCarrito = document.getElementById("carrito")
verCarrito.addEventListener("click", renderizarCarrito)

//Capturar Botón Buscar
let botonBuscar = document.getElementById("botonBuscar")
botonBuscar.addEventListener("click", buscarProducto)

//Funciones

//Renderizar Lista de Productos
function renderizarLista(arrayProductos) {
  let workArea = document.getElementById("wrapper")
  workArea.innerHTML = ""
  arrayProductos.forEach(({ id, nombre, precio, categoria, img, descripcion }) => {
    let tarjetaProd = document.createElement("div")
    tarjetaProd.classList = "card text-white bg-secondary tarjetaProd"
    tarjetaProd.innerHTML = `<img src="${img}" class="card-img-top" alt="${nombre}">
        <div class="card-body">
          <h3 class="card-title">${nombre}</h3>  
          <h4 class="card-title">${categoria}</h4>
          <p class="card-text">${descripcion}</p>
          <div class="card-price" >
            <a href="#" class="btn btn-dark btnComprar" id="${id}">Agregar</a>
            <h5>\$${precio}</h5>
          </div>
        </div>`
    workArea.appendChild(tarjetaProd)
    //Capturar boton Agregar
    let botonAgregar = document.getElementById(id)
    botonAgregar.addEventListener("click", agregarAlCarrito)
  })
}

//Listar todos los productos
function listarTodo() {
  let autenticado = localStorage.getItem("autenticado")
  if (autenticado) {
    renderizarLista(productList)
  } else {
    autenticarUsuario()
  }
}

//Recargar el wrapper inicial
function recargarPagina() {
  wrapper.innerHTML=`<div id="carousel" class="carousel slide" data-bs-ride="carousel">
  <div class="carousel-inner">
      <div class="carousel-item active">
          <img src="./img/main1.jpg" class="d-block w-100" alt="Whiskey and pipe">
      </div>
      <div class="carousel-item">
          <img src="./img/main2.jpg" class="d-block w-100" alt="Whiskey and cigar">
      </div>
      <div class="carousel-item">
          <img src="./img/main3.jpg" class="d-block w-100" alt="Beverages">
      </div>
      <div class="carousel-item">
          <img src="./img/main4.jpg" class="d-block w-100" alt="Cigars">
      </div>
      <div class="carousel-item">
          <img src="./img/main5.jpg" class="d-block w-100" alt="Talisker">
      </div>
  </div>
</div>`
}


//Agregar elemento al carrito
function agregarAlCarrito(e) {
  let carrito = JSON.parse(localStorage.getItem("carritoJSON")) || []
  let productoAgregado = productList.find((producto) => producto.id === Number(e.target.id))
  if (carrito.some((producto) => producto.id == productoAgregado.id)) {
    let index = carrito.findIndex((producto) => producto.id == productoAgregado.id)
    carrito[index].unidades++
    carrito[index].subtotal = carrito[index].precio * carrito[index].unidades
  } else {
    carrito.push({
      id: productoAgregado.id,
      nombre: productoAgregado.nombre,
      precio: productoAgregado.precio,
      unidades: 1,
      subtotal: productoAgregado.precio
    })
  }
  let carritoJSON = JSON.stringify(carrito)
  localStorage.setItem("carritoJSON", carritoJSON)
}

//Verificar edad del usuario
function verificarEdad() {
  let mayor = sessionStorage.getItem("esMayor")
  !mayor &&
    Swal.fire({
      title: "Eres mayor de 18 años?",
      text: "Esta página es sólo para mayores de 18",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Sí, soy mayor",
      denyButtonText: "No, soy menor",
    }).then((result) => {
      if (result.isConfirmed) {
        sessionStorage.setItem("esMayor", true)
        Swal.fire("Bienvenido a The Cave!", "", "success")
      } else if (result.isDenied) {
        Swal.fire("Ingreso no permitido a menores de edad", "", "error")
        window.location.replace("https://www.google.com/")
      }
    })
}

//Autenticar usuario
function autenticarUsuario() {
  let autenticado = localStorage.getItem("autenticado")
  !autenticado &&
    Swal.fire({
      title: "Ingresar al sistema",
      html: `<input type="text" id="login" class="swal2-input" placeholder="Usuario">
            <input type="password" id="password" class="swal2-input" placeholder="Contraseña">`,
      confirmButtonText: "Entrar",
      focusConfirm: false,
      preConfirm: () => {
        const login = Swal.getPopup().querySelector("#login").value
        const password = Swal.getPopup().querySelector("#password").value
        if (!login || !password) {
          Swal.showValidationMessage(`Please enter login and password`)
        }
        localStorage.setItem("usuario", login)
        localStorage.setItem("password", password)
        return { login: login, password: password }
      },
    }).then((result) => {
      Swal.fire(`Autenticando: ${result.value.login}`.trim())
      let usuario = localStorage.getItem("usuario")
      let password = localStorage.getItem("password")
      if (usuario === "walter" && password === "passwd") {
        localStorage.setItem("autenticado", true)
        Swal.fire("Bienvenido " + usuario)
      }
    })
}

//Renderizar el carrito
function renderizarCarrito() {
  let carritoGuardado = localStorage.getItem("carritoJSON")
  carritoGuardado = JSON.parse(carritoGuardado)
  if (!carritoGuardado || carritoGuardado.length === 0) {
    Swal.fire("No hay elementos en el carrito")
  } else {
    let workArea = document.getElementById("wrapper")
    workArea.innerHTML = ""
    let mostrarCarrito = document.createElement("div")
    mostrarCarrito.innerHTML = `
      <div class="carrito-body">
        <div id="carrito-title">
          <h3>Carrito de Compras</h3>
        </div>  
        <div id="carrito-table">
          <table class="table-dark">
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Cantidad</th>
                <th scope="col">Importe</th>
              </tr>
            </thead>
            <tbody id="carrito-lista"
            </tbody>
          </table>
        </div>
        <div id="lineaBoton">
          <div id="boton">
            <button type="button" class="btn btn-secondary" id="vaciarCarrito">Vaciar Carrito</button>
          </div>
          <div>
            <h4>Importe: </h4>
          </div>
          <div id="importe">
          </div>
          <div id="finCompra">
            <button type="button" class="btn btn-success" id="finalizarCompra">Finalizar Compra</button>
          </div>
        </div>
      </div>`
    workArea.appendChild(mostrarCarrito)
    let listarItem = document.getElementById("carrito-lista")
    let totalCompra = 0
    carritoGuardado.forEach((producto) => {
      let propArray = [producto.nombre, producto.unidades, producto.subtotal]
      let itemLista = document.createElement("tr")
      for (const value of propArray ) {
        let celda=document.createElement("td")
        celda.innerText=value
        itemLista.appendChild(celda)
        }
      listarItem.appendChild(itemLista)
      totalCompra += producto.subtotal
    })
    let mostrarTotal = document.getElementById("importe")
    let totalMostrado = document.createElement("p")  
    totalMostrado.innerText = totalCompra
    totalMostrado.setAttribute("id","totalcompra")
    console.log(totalMostrado)
    mostrarTotal.appendChild(totalMostrado)     
    let vaciar = document.getElementById("vaciarCarrito")
    vaciar.addEventListener("click", vaciarCarrito)
    let finalizar = document.getElementById("finalizarCompra")
    finalizar.addEventListener("click", finalizarCompra)
  }
}

  // To Do Manejar el stock de cada producto
function descontarStock() {}

// To Do Descontar del Carrito
function descontarDeCarrito() {}

//Vaciar el carrito
function vaciarCarrito() {
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: 'btn btn-success',
      cancelButton: 'btn btn-danger'
    },
    buttonsStyling: false
  })
  
  swalWithBootstrapButtons.fire({
    title: 'Estás seguro?',
    text: "No se puede volver atrás!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Si, vaciar carrito!',
    cancelButtonText: 'No, mantener carrito!',
    reverseButtons: true
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("carritoJSON")
      recargarPagina()
      swalWithBootstrapButtons.fire(
        'Borrado!',
        'El carrito está vacío.',
        'success'
      )
    } else if (
      result.dismiss === Swal.DismissReason.cancel
    ) {
      swalWithBootstrapButtons.fire(
        'Cancelado',
        'El carrito sigue intacto.',
        'error'
      )
    }
  })
}

//Buscar productos
function buscarProducto() {
  //Capturar cuadro de búsqueda
  let buscador = document.getElementById("textoBuscar").value.toLowerCase()
  if (!buscador) {
    Swal.fire("Ingrese algún texto para buscar")
  }
  let arrayResultados = productList.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(buscador) || producto.categoria.toLowerCase().includes(buscador)
  )
  if (arrayResultados.length > 0) {
    renderizarLista(arrayResultados)
  } else {
    Swal.fire("No se han encontrado productos de ese tipo.")
  }
}

function finalizarCompra() {
  Swal.fire({
    title: 'Muchas gracias por tu compra!\nTe redirigimos a la página de pagos.',
    showClass: {
      popup: 'animate__animated animate__fadeInDown'
    },
    hideClass: {
      popup: 'animate__animated animate__fadeOutUp'
    }
  })
  window.location.href = 'https://mercadopago.com.ar/'
  }
