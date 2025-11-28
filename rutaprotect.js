const Modulos_Que_Ofrecemos= document.querySelector("#Modulos_Que_Ofrecemos") /* Primera Variable */
/*Menu ¿Como Funciona?*/
Modulos_Que_Ofrecemos.addEventListener("click", (O) => { /*Creo un evento*/

    O.preventDefault();
    const sectionO=document.querySelector(".Modulos_Que_Ofrecemos"); /*Para crear variable, que refleja la seccion que voy a ir, seleccionanado a que seccion voy */
    sectionO.scrollIntoView({behavior: "smooth"});/*Para que tenga propiedad de scroll al clicke<rlo, si en caso es subir o bajar */
} )