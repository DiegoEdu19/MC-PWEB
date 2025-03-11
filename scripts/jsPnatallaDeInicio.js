const matriculaGlobal = "2043558";
const llaveSecreta = "10743ccc-a2f2-41ce-8085-1f5851aeb025";
const dominioUrl="https://redsocial.luislepe.tech"

$(document).ready(function () {
    obtenerPublicaciones();
});

function obtenerPublicaciones() {
    $.ajax({
        url: dominioUrl + `/api/Publicaciones/all/${matriculaGlobal}`, 
        method: "GET",
        dataType: "json",
        crossDomain: true,
    })
    .done(function(result){
        result.forEach(function(element){
            if (element.idUsuario == matriculaGlobal) {
                $("#publicacionReciente").append(mostrarPublicacionMia(element));
              } else {
                $("#publicacionReciente").append(mostrarPublicacionesAjenas(element));
              }
        })
    })
    .fail(function(xhr, status, error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al traer publicaciones',
          text: `Ocurrió un error al intentar cargar las publicaciones: ${error}`,
        });
      });
}
function crearPublicacion(publicacion) {
    $.ajax({
        url: dominioUrl + `/api/Publicaciones`, 
        method: "POST",
        dataType: "json",
        crossDomain: true,
        contentType: "application/json",
        data: JSON.stringify({
            idPublicacion: 0,
            idUsuario: matriculaGlobal,
            llave_Secreta: llaveSecreta,
            contenido: publicacion
        })
    })
    .done(function(result){
        mostrarPublicacionMia(result);
        $("#contenidoMio").val('');
    })
    .fail(function(xhr, status, error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al publicar',
          text: `Ocurrió un error al intentar publicar: ${error}`,
        });
    });
}
$("#botonPublicar").on("click", function() {
    const contenido = $("#contenidoMio").val();
    if (contenido.trim() !== "") {
        crearPublicacion(contenido);
    } else {
        Swal.fire({
          icon: 'warning',
          title: 'Publicación vacía',
          text: 'Por favor, escribe algo antes de publicar.',
        });
    }
});

$("#botonPublicar").on("click", function() {
    const contenido = $("#contenidoPublicacion").val();
    if (contenido.trim() !== "") {
        crearPublicacion(contenido);
    } else {
        Swal.fire({
          icon: 'warning',
          title: 'Publicación vacía',
          text: 'Por favor, escribe algo antes de publicar.',
        });
    }
});

function mostrarPublicacionMia(publicacion){
    var contenedorMio= `
            <div class="post mb-4 p-5 border">
    <div class="d-flex align-items-center mb-2">
        <div class="ms-3">
            <strong>${publicacion.nombre}</strong> <strong>${publicacion.idUsuario}</strong> <strong>${publicacion.idPublicacion}</strong>
            <p class="text-muted" style="font-size: 0.9rem;">${moment(publicacion.fechaCreacion).fromNow()}</p>
        </div>
        <div class="ms-auto">
                        <div class="dropdown">
                            <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                                <i class="bi bi-gear"></i>
                            </button>
                            <ul class="dropdown-menu dropdown-menu-end">
                                <li><button class="dropdown-item" onclick="">Editar</button></li>
                                <li><button class="dropdown-item text-danger" onclick="">Eliminar</button></li>
                            </ul>
                        </div>
            </div>
    </div>
    <div class="post-content mb-3">
        <p>${publicacion.contenido}</p>
    </div>
    <div class="d-flex justify-content-between align-items-center">
        <div>
            <button class="btn btn-outline-primary me-2" type="button">
                <i class="bi bi-hand-thumbs-up"></i> Like (${publicacion.cantidadLikes})
            </button>
            <a href="publicaciones.html">
                <button class="btn btn-outline-secondary" type="button">
                    <i class="bi bi-chat-left-text"></i> Comentar (${publicacion.cantidadComentarios})
                </button>
            </a>
        </div>
    </div>
        </div>
        `;
        return contenedorMio;
}


function mostrarPublicacionesAjenas(publicacion) {
    var contenedorAjeno= `
            <div class="post mb-4 p-5 border">
    <div class="d-flex align-items-center mb-2">
        <div class="ms-3">
            <strong>${publicacion.nombre}</strong> <strong>${publicacion.idUsuario}</strong> <strong>${publicacion.idPublicacion}</strong>
            <p class="text-muted" style="font-size: 0.9rem;">${moment(publicacion.fechaCreacion).fromNow()}</p>
        </div>
    </div>
    <div class="post-content mb-3">
        <p>${publicacion.contenido}</p>
    </div>
    <div class="d-flex justify-content-between align-items-center">
        <div>
            <button class="btn btn-outline-primary me-2" type="button">
                <i class="bi bi-hand-thumbs-up"></i> Like (${publicacion.cantidadLikes})
            </button>
            <a href="publicaciones.html">
                <button class="btn btn-outline-secondary" type="button">
                    <i class="bi bi-chat-left-text"></i> Comentar (${publicacion.cantidadComentarios})
                </button>
            </a>
        </div>
    </div>
        </div>
        `;
        return contenedorAjeno;
    };






