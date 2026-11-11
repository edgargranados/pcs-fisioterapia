# PCS Fisioterapia

Consulta de Pol Carmona en Mataró. El catalán está en `/` y el castellano en `/es`.

```bash
npm install
npm run dev
```

La web queda en `http://127.0.0.1:3847`.

`WHATSAPP_NUMBER` activa el botón de WhatsApp tras el formulario (con prefijo 34). `LEADS_ADMIN_PASSWORD` abre `/admin`, donde se leen las solicitudes. Sin base de datos externa, las citas se guardan en memoria y se pierden al parar el servidor. En el alojamiento de la app, Postgres las conserva.

## OVH, plan Starter

El plan Starter no ejecuta Node. Sirve el HTML estático y guarda las citas con PHP y la base MySQL de 250 MB incluida.

1. En el panel de OVH crea la base MySQL y anota servidor, nombre, usuario y contraseña. Elige PHP 8.3 y el entorno Stable64.
2. Genera el paquete:

```bash
npm run build:ovh
```

3. Copia `ovh/config.sample.php` a `ovh/config.local.php` y rellena la base, el WhatsApp (con prefijo 34) y el hash del panel:

```bash
php -r "echo password_hash('tu-clave', PASSWORD_DEFAULT), PHP_EOL;"
```

4. Vuelve a lanzar `npm run build:ovh`. El resultado queda en `ovh-dist/`, con `config.local.php` incluido si ya existe. Ese archivo no entra en git.
5. Sube **el contenido** de `ovh-dist/` por FTP a la carpeta `www` del hosting.
6. En phpMyAdmin, importa `schema.sql`.
7. Apunta `pcsfisioterapia.com` al hosting desde la zona DNS del dominio.

Las solicitudes se ven en `https://pcsfisioterapia.com/admin`. El límite del plan es 1 GB de disco: la web, el vídeo y las fotos caben.
