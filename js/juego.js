/*
NOTAS:

variableEl significa que es una variable que apunta a un elemento del DOM
por ejemplo: juegoEl (es el div que representa al juego)

las posiciones del juego siempre van de 0 a 2 para las filas y columnas,
osea que la posicion del centro seria 1,1

*/


var juego = {
  /*filas es un array de 3 posiciones con otro array vacio dentro de
  cada una de esas posiciones.*/
  filas:[[],[],[]],
  espacioVacio:{
    fila:2,
    columna:2
  },
  crearPieza(numero,fila, columna){
    var nuevoElemento = $('<div>');
        nuevoElemento.addClass('pieza');

        nuevoElemento.css({
          backgroundImage:'url(piezas/' + numero + '.jpg)',
          top: fila * 200,
          left: columna * 200
        });

    return {
      el:nuevoElemento,
      numero:numero,
      filaInicial:fila,
      columnaInicial:columna,
    };
  },
  instalarPiezas(juegoEl){
    var counter = 1;
    // con ayuda del for vamos a crear las 8 piezas del 1 al 8
    for (var fila = 0; fila < 3; fila++) {
      for (var columna = 0; columna < 3; columna++) {

        if(fila == this.espacioVacio.fila && columna == this.espacioVacio.columna) {

          this.filas[fila][columna] = null;

        }else{

          var pieza = this.crearPieza(counter++,fila,columna);
          juegoEl.append(pieza.el);
          this.filas[fila][columna] = pieza;

        }
      }
    }

    /* no es estrictamente necesario retornar algo ya que
    la misión de esta función solo es instalar las piezas en el elemento
    pero siempre intentaremos retornas un valor. En este caso el elemento #juego
    con las piezas instaladas*/

    return juegoEl;
  },
  moverFichaFilaColumna(ficha,fila,columna){
    ficha.el.css({
      top: fila * 200,
      left: columna * 200
    })
  },
  guardarEspacioVacio(fila,columna){
    this.espacioVacio.fila = fila;
    this.espacioVacio.columna = columna;

    this.filas[fila][columna] = null;
  },
  intercambiarPosicionConEspacioVacio(fila, columna){
    var ficha = this.filas[fila] && this.filas[fila][columna];
    if(ficha){
      this.filas[this.espacioVacio.fila][this.espacioVacio.columna] = ficha;
      this.moverFichaFilaColumna(ficha,this.espacioVacio.fila,this.espacioVacio.columna);
      this.guardarEspacioVacio(fila,columna);
    }
  },
  moverHaciaAbajo(){
    var filaOrigen = this.espacioVacio.fila-1;
    var columnaOrigen = this.espacioVacio.columna;

    this.intercambiarPosicionConEspacioVacio(filaOrigen, columnaOrigen);
  },
  moverHaciaArriba(){
    var filaOrigen = this.espacioVacio.fila+1;
    var columnaOrigen = this.espacioVacio.columna;

    this.intercambiarPosicionConEspacioVacio(filaOrigen, columnaOrigen);
  },
  moverHaciaLaDerecha(){
    var filaOrigen = this.espacioVacio.fila;
    var columnaOrigen = this.espacioVacio.columna-1;

    this.intercambiarPosicionConEspacioVacio(filaOrigen, columnaOrigen);
  },
  moverHaciaLaIzquierda(){
    var filaOrigen = this.espacioVacio.fila;
    var columnaOrigen = this.espacioVacio.columna+1;

    this.intercambiarPosicionConEspacioVacio(filaOrigen, columnaOrigen);
  },
  chequearSiGano(){
    for (var f = 0; f < this.filas.length; f++) {
      for (var c = 0; c < this.filas.length; c++) {
        var ficha = this.filas[f][c];
        if(ficha && !(ficha.filaInicial == f && ficha.columnaInicial == c)){
          return false;
        }
      }
    }
    return alert('ganaste!');
  },
  capturarTeclas(){
    /* otra vez debemos guardar el this en otra variables
     ya que queremos invocarlo en otra funcion y tiene su propio this */
    var that = this;
    $(document).keydown(function(evento) {
        switch(evento.which) {
            case 37:
              that.moverHaciaLaIzquierda();
            break;

            case 38:
              that.moverHaciaArriba();
            break;

            case 39:
              that.moverHaciaLaDerecha();
            break;

            case 40:
              that.moverHaciaAbajo();
            break;

            default: return; // exit this handler for other keys
        }

        that.chequearSiGano();
        /*
          frenamos el comportamiento por defecto de la tecla para que no
          genere algun efecto indeseado
        */
        evento.preventDefault();
    });

  },
  mezclarFichas(veces){
    if(veces<=0){return;}

    var that = this;
    var funciones = ['moverHaciaAbajo','moverHaciaArriba','moverHaciaLaIzquierda','moverHaciaLaDerecha'];
    var numeroRandom = Math.floor(Math.random() * 4);
    var nombreDeFuncion = funciones[numeroRandom];
    this[nombreDeFuncion]();

    setTimeout(function(){
      that.mezclarFichas(veces-1);
    },10);
  },
  iniciar:function(el,nivel){
    this.instalarPiezas(el);
    this.mezclarFichas(nivel);
    this.capturarTeclas();
  }
}

function start()
{	
	document.getElementById('juego').style.display = "";
	document.getElementById('niveles').style.display = "none";
	
	var nivel = $('input[name=group]:checked').val();	
	var elemento = $('#juego');
		
	juego.iniciar(elemento,nivel);
	juego.moverHaciaAbajo();	
}

