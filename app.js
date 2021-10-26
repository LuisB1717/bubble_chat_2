
const botones = document.getElementById("botones")
const userName = document.getElementById("userName")
const onlyUSER = document.getElementById("onlyUser")
const imgPerfil = document.querySelector(".perfil-img")
const myForm = document.getElementById("myForm")
const inputMensaje = document.getElementById("inputMensaje")

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    botones.innerHTML =  `
    <button id="btnCerrar" class="btn btn-outline-light">
     Cerrar sesión
    </button>
    
    `
    myForm.classList.remove("d-none")

    contenidoChat(user)
    // ...  
    cerrarSesion()
  } else {
   
    botones.innerHTML =  `
    <button id="btnAcceder" type="button" class="btn btn-outline-light">Acceder</button>
    `
    console.clear()
    console.log("no hay usuarios")
    onlyUSER.innerHTML =  `<p class="text-center mt-5 lead">Debes Iniciar Sesion</p>
    `
    imgPerfil.src = ""
    userName.textContent = ""
    myForm.classList.add("d-none")
    iniciarSesion()
  }
})

const contenidoChat = (user) => {
  let displayName = user.displayName
  let userid = user.uid
  let photoURL= user.photoURL
  userName.textContent = displayName
  const bienvenida = document.createElement("p")
  bienvenida.innerHTML = `<p class="text-center mt-5 lead">Bienvenido ${displayName}</p>`
  onlyUSER.prepend(bienvenida)
  imgPerfil.src = photoURL
  
  myForm.addEventListener("submit", (e) => {
    e.preventDefault()
    if (inputMensaje.value.trim() != "") {
      firebase
        .firestore()
        .collection("chat")
        .add({
          texto: inputMensaje.value,
          uid: userid,
          name: user.displayName,
          img: user.photoURL,
          date: Date.now(),
        })
        .then((res) => {
          console.log("mensaje enviado", res)
        })
        .catch((e) => console.log("Error inesperado: ", e))
      inputMensaje.value = ""
    } else {
      console.log("no hay data")
      return
    }
  })


  firebase
    .firestore()
    .collection("chat")
    .orderBy("date")
    .onSnapshot((query) => {
      onlyUSER.innerHTML = ``
      query.forEach((e) => {
        console.log(e.data().uid)
        if (e.data().uid === userid) {
          onlyUSER.innerHTML += `<div class="d-flex justify-content-end container">
    
          <span class="alert alert-primary">Yo:&nbsp;${e.data().texto}</span        
          </div>`
        } else {
          onlyUSER.innerHTML += `<div class="d-flex justify-content-start container">
           
          <span class="alert alert-secondary">${e.data().name}:&nbsp;${e.data().texto}</span>
          </div>`
          console.log("mensajes")
      
        }
        // <img src ="${e.data().img}"></img>
        onlyUSER.scrollTop = onlyUSER.scrollHeight
        console.log(e.data().texto)
      })
    })
}


const iniciarSesion = () => {
  let btnAcceder = document.getElementById("btnAcceder")
  btnAcceder.addEventListener("click", async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider()
      await firebase.auth().signInWithPopup(provider)
    } catch (error) {
      console.log(error)
    }
  })
}


const cerrarSesion = () => {
  let btnCerrar = document.getElementById("btnCerrar")
  btnCerrar.addEventListener("click", () => {
    console.log("quieres cerrar sesion")
    firebase.auth().signOut()
  })
}
