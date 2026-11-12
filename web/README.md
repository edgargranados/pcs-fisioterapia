# PCS Fisioterapia

Consulta de Pol Carmona en Mataró. El catalán está en `/` y el castellano en `/es`.

```bash
npm install
npm run dev
```

La web queda en `http://127.0.0.1:3847`.

`WHATSAPP_NUMBER` activa el botón de WhatsApp tras el formulario (con prefijo 34). `LEADS_ADMIN_PASSWORD` abre `/admin`, donde se leen las solicitudes. Sin base de datos externa, las citas se guardan en memoria y se pierden al parar el servidor. En el alojamiento de la app, Postgres las conserva.

## OVH, plan Starter

El plan Starter no ejecuta Node. La rama `ovh` de GitHub contiene el HTML, el PHP y las fotos. OVH copia esa rama en `www` cuando entra un push.

```bash
npm run publish:ovh
```

Eso genera el sitio y lo sube a `ovh`. La rama `main` sigue siendo el código fuente.

En el panel de OVH, el directorio `www` tiene que estar vacío. Repositorio: `git@github.com:edgargranados/pcs-fisioterapia.git`. Rama: `ovh`. La clave SSH que muestra OVH se añade al repositorio como deploy key de solo lectura. El webhook de esa pantalla se configura en GitHub para el evento push.

La base MySQL, el WhatsApp y la contraseña del panel van en `config.local.php`, en la carpeta que contiene `www`, no dentro de `www`. Parte de `ovh/config.sample.php`. Ese archivo no entra en git. En phpMyAdmin se importa `schema.sql` una sola vez.

Las solicitudes se ven en `https://pcsfisioterapia.com/admin`. El límite del plan es 1 GB de disco.
