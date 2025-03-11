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
function editarPublicacion(idPublicacion, contenido) {
    $.ajax({
        url: dominioUrl + `/api/Publicaciones/${idPublicacion}`, 
        method: "PUT",
        dataType: "json",
        contentType: "application/json",
        crossDomain: true,
        data: JSON.stringify({
            idPublicacion: idPublicacion,
            idUsuario: matriculaGlobal,
            llave_Secreta: llaveSecreta,
            contenido: contenido
        })
    })
    .done(function(result){
        Swal.fire({
          icon: 'success',
          title: 'Publicación editada',
          text: 'La publicación se ha editado correctamente.',
        });
        obtenerPublicaciones();
    })
    .fail(function(xhr, status, error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al editar publicación',
          text: `Ocurrió un error al intentar editar la publicación: ${error}`,
        });
    });
}

$(document).on("click", ".botonEditar", function() {
    const idPublicacion = $(this).attr("id").split("-")[1];
    const contenidoElemento = $(`#contenidoModificable-${idPublicacion}`);
    const nuevoContenido = prompt("Editar publicación:", contenidoElemento.text());
    if (nuevoContenido !== null && nuevoContenido.trim() !== "") {
        editarPublicacion(idPublicacion, nuevoContenido);
        contenidoElemento.text(nuevoContenido);
    }
});

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

function eliminarPublicacion(idPublicacion,contenido) {
    $.ajax({
        url: dominioUrl + `/api/Publicaciones/${idPublicacion}`, 
        method: "DELETE",
        dataType: "json",
        contentType: "application/json",
        crossDomain: true,
        data: JSON.stringify({
            idPublicacion: idPublicacion,
            idUsuario: matriculaGlobal,
            llave_Secreta: llaveSecreta,
            contenido: contenido
        })
    })
    .done(function(result){
        Swal.fire({
          icon: 'success',
          title: 'Publicación eliminada',
          text: 'La publicación se ha eliminado correctamente.',
        });
        obtenerPublicaciones();
    })
    .fail(function(xhr, status, error) {
        Swal.fire({
          icon: 'error',
          title: 'Error al eliminar publicación',
          text: `Ocurrió un error al intentar eliminar la publicación: ${error}`,
        });
    });
}
$(document).on("click", ".botonEliminar", function() {
    const idPublicacion = $(this).attr("id").split("-")[1];
    if (confirm("¿Estás seguro de que quieres eliminar esta publicación?")) {
        eliminarPublicacion(idPublicacion);
    }
});

function mostrarPublicacionMia(publicacion){
    var contenedorMio = `
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
                            <li><button class="dropdown-item botonEditar" id="editar-${publicacion.idPublicacion}">Editar</button></li>
                            <li><button class="dropdown-item text-danger botonEliminar" id="eliminar-${publicacion.idPublicacion}">Eliminar</button></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="post-content mb-3">
                <p id="contenidoModificable-${publicacion.idPublicacion}">${publicacion.contenido}</p>
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





