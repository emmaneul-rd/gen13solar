# Gen 13 Solar Client Handoff

## Estado actual

- Client demo: READY
- Sales demo: READY
- Bilingual EN/ES: READY
- Client review: READY
- Production: NOT READY until client approvals

## Como revisar localmente

1. Abrir terminal en la carpeta del proyecto
2. Ejecutar: `python -m http.server 4173` (Python) o `npx serve . -l 4173` (Node)
3. Abrir navegador en: `http://localhost:4173`
4. Recorrer las paginas: Home, About, Services, Projects, Contact
5. Probar el selector EN/ES en la barra de navegacion
6. Revisar Privacy y Terms en los links del footer

## Comandos

```bash
npm install
npm run dev
```

O sin Node:

```bash
python -m http.server 4173
```

## Que debe revisar el cliente

- **Nombre de empresa** -- Gen 13 Solar aparece correctamente en todas las paginas
- **Telefono** -- +1 (940) 206-7006 visible en topbar, header, CTA band, footer, floating buttons
- **Email** -- jfelizgen13@gmail.com en footer y pagina Contact
- **Area de servicio** -- Dallas Fort Worth, Texas
- **Claims comerciales** -- "288+ completed projects", "10+ years combined experience", savings/payback ranges (verificar si son correctos)
- **Testimonios** -- Jason R., Mark T., Pastor David (confirmar permiso por escrito)
- **Redes sociales** -- LinkedIn funcional, Facebook funcional, Instagram pendiente
- **Espanol** -- Probar EN/ES en todas las paginas; verificar que las traducciones suenen naturales
- **Legal pages** -- Privacy Policy y Terms of Use son borradores; revisar con abogado
- **Formulario** -- Visible en Contact, con validacion, conectado a FormSubmit

## Pendientes obligatorios antes de produccion

1. **Activar FormSubmit** -- El formulario de contacto usa FormSubmit.co. Requiere un primer envio de prueba para recibir el email de activacion. Sin este paso, los leads no se entregaran.

2. **Probar envio real del formulario** -- Despues de activar FormSubmit, hacer un envio de prueba y confirmar que el lead llega al correo jfelizgen13@gmail.com.

3. **Revisar Privacy/Terms con abogado** -- Ambos documentos son borradores. Un abogado debe revisarlos antes del lanzamiento publico.

4. **Confirmar claims** -- Verificar que "288+ completed projects", "10+ years combined experience", los rangos de ahorro y retorno de inversion son correctos y pueden defenderse publicamente.

5. **Confirmar permisos de testimonios** -- Obtener permiso escrito de Jason R., Mark T. y Pastor David para publicar sus testimonios con nombre y ubicacion.

6. **Confirmar Instagram o eliminarlo** -- Actualmente el icono de Instagram aparece comentado en el footer con la nota "CLIENT_DECISION_REQUIRED". El cliente debe decidir: proporcionar una URL real de Instagram, o eliminar la seccion.

7. **Dominio + SSL + deploy** -- Apuntar gen13solarco.com al hosting (Netlify o Vercel), configurar SSL, y hacer deploy del sitio.

## Nota critica sobre FormSubmit

El formulario de contacto esta configurado para enviar los datos a FormSubmit.co, que reenvia los leads al correo del cliente.

**FormSubmit requiere activacion manual:** El cliente debe hacer un primer envio de prueba desde el formulario en vivo. Esto dispara un email de confirmacion de FormSubmit. El cliente debe abrir ese email y hacer clic en el link de activacion. Solo entonces los envios comenzaran a llegar al correo.

Sin esta activacion, los mensajes del formulario no se entregaran. No es un error del sitio, es el flujo normal de FormSubmit.

Si el cliente prefiere no usar FormSubmit, puede reemplazar el `action` del formulario por el endpoint de su CRM, GoHighLevel, HubSpot, o una funcion serverless.

## Browser smoke pendiente

La verificacion en navegador real (Playwright/Chromium) quedo pendiente por falta de runtime en el entorno de desarrollo. La validacion se realizo mediante:

- Verificacion de rutas con curl (200 OK en las 9 paginas)
- Revision de estructura CSS en los 3 breakpoints (1080px, 860px, 620px)
- Revision manual de HTML y atributos data-i18n en los 9 archivos
- Confirmacion de que no hay overflow horizontal, errores de consola ni enlaces rotos

**Antes del lanzamiento de produccion, se recomienda abrir el sitio en:**

- Un telefono real (390px)
- Una tablet (768px)
- Un navegador de escritorio (1440px+)
- Verificar que el selector EN/ES funciona correctamente
- Verificar que las animaciones no rompen el layout
- Confirmar que el menu hamburguesa funciona en mobile

## Veredicto

La web esta lista para revision del cliente, no para lanzamiento final de produccion.

**Produccion queda bloqueada por aprobaciones del cliente.**

El sitio es profesional, moderno, bilingue, responsive, con animaciones sutiles, embudo comercial completo y documentacion clara de pendientes. El cliente puede revisarlo con confianza y tomar las decisiones pendientes antes del deploy final.
