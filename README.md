# PCS Fisioterapia

Web de Pol Carmona, fisioterapeuta en Mataró (Carrer Via Sèrgia 32). La aplicación está en la carpeta `web/`, lista para servir `pcsfisioterapia.com` en la raíz de ese dominio.

Incluye versión en castellano y en catalán, páginas de las cinco terapias y de los pueblos del Maresme, formulario de cita y un panel privado para leer las solicitudes.

## Cómo verla en local

```bash
cd web
npm install
npm run dev
```

Abre `http://127.0.0.1:3847`.

## Citas

El formulario pide nombre, teléfono y, si la persona quiere, email. Al enviarlo, la solicitud se guarda y aparece el botón de WhatsApp.

- En local, sin `DATABASE_URL`, se usa una base Postgres en memoria (se vacía al reiniciar).
- Publicado, la app usa su propia base Postgres.

Para leer las solicitudes entra en `/admin`. Hace falta la variable `LEADS_ADMIN_PASSWORD`. Sin ella el panel no muestra datos.

El botón de WhatsApp usa `WHATSAPP_NUMBER` (por ejemplo `34600111222`). Si no está definida, la solicitud se guarda igual y la página explica que Pol llamará al teléfono dejado en el formulario.

## Posicionamiento

La home apunta a «fisioterapeuta en Mataró». Hay una página de la consulta, una por terapia (manual, punción seca, neuromodulación, ejercicio terapéutico y readaptación) y una por pueblo cercano, en castellano y catalán, con `hreflang`, sitemap y datos estructurados del negocio.
