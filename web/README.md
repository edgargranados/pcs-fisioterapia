# PCS Fisioterapia

Consulta de Pol Carmona en Mataró. Castellano en `/` y catalán en `/ca`.

```bash
npm install
npm run dev
```

La web queda en `http://127.0.0.1:3847`.

`WHATSAPP_NUMBER` activa el botón de WhatsApp tras el formulario (con prefijo 34). `LEADS_ADMIN_PASSWORD` abre `/admin`, donde se leen las solicitudes. Sin base de datos externa, las citas se guardan en memoria y se pierden al parar el servidor. En el alojamiento de la app, Postgres las conserva.
