# proyecto_final_juan_ramon

## Para iniciar el proyecto en local:

**1 -** Después de hacer el git clone vete a la ruta del proyecto

**2 -** Debes tener iniciado Docker ya que la base de datos en MongoDB se ejecuta ahí.

**3 -** Desde la ruta raíz del proyecto ejecutar lo siguiente:

```javascript
npm install
```

Y después:

```javascript
npm run dual
```

Esto ejecutará el **contenedor de docker(puerto 27018)**, el **backend (puerto 4000)** y **frontend (puerto 5173)** a la misma vez.

> [!IMPORTANT]
> Para el frontend no hay validaciones en ningún sitio todavía porque veo mejor centrarme en las funcionalidades básicas antes.
