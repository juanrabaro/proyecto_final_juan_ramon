# Proyecto final Juan Ramón

## Enlace para ver el proyecto

> [!IMPORTANT]
> El despliegue del backend al ser una capa gratuita la que estoy dentro de la plataforma es necesario cuando se queda un tiempo si usarse esperar 1 minuto aproximadamente para que funciona el backend. Se puede comprobar si hay que esperar o no dependiendo de si el siguiente enlace muestra un mensaje o no, en cuyo caso habrá que esperar.

[Enlace al proyecto](https://task-master-3q3ne1zqx-juanrabaros-projects.vercel.app/)

## Para desplegar el proyecto en local

**1 -** Después de hacer el git clone vete a la ruta del proyecto

**2 -** Desde la esa misma ruta(ruta raíz) ejecuta lo siguiente:

```javascript
npm install
```

Y después:

```javascript
npm run dual
```

Esto ejecutará todo lo necesario, el **backend (puerto 4000)** y **frontend (puerto 5173)** a la misma vez.

La base de datos está desplegada en **MongoDB Atlas** así que no es necesario usar **Docker** para desplegar una base de datos en local.
