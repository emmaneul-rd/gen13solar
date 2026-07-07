# Demo Checklist

## Gen 13 Solar — Client Demo Readiness

Verified on 2026-07-06. All checks below were performed with text/route/browser inspection only; no image assets were opened or modified.

- [x] Home carga
- [x] Services carga
- [x] Projects carga
- [x] About carga
- [x] Contact carga
- [x] Navbar funciona
- [x] Menú móvil funciona
- [x] CTA principal visible
- [x] Formulario visible
- [x] Footer completo
- [x] No links internos rotos
- [x] No placeholders críticos
- [x] Mobile 390px revisado
- [x] Tablet 768px revisado
- [x] Desktop 1440px revisado
- [x] Imágenes no fueron tocadas
- [x] Pendientes de cliente documentados

## Evidencia resumida

- `npm run check`: PASS (9 archivos HTML, referencias locales válidas).
- Servidor local `npm run dev` en `http://localhost:4173`: todas las rutas responden 200.
- Navegador (Playwright/Chromium): 5 rutas principales 200, 0 errores de consola.
- Mobile 390px: 0px de overflow horizontal, hamburguesa visible.
- Imágenes: solo verificadas por nombre/ruta; ninguna modificada.

## Pendientes de cliente (no bloquean la demo)

- URLs de redes sociales (Facebook / Instagram / LinkedIn) — actualmente `href="#"` con `onclick="return false"`.
- Revisión legal de Privacy y Terms (marcados como borrador).
- Verificación de claims estadísticos (288+ proyectos, 10+ años, etc.).
- Activación de FormSubmit.co tras el primer envío.
- Confirmación de dominio `gen13solarco.com` y área de servicio.

Ver detalle en `audit/CLIENT-DECISIONS-REQUIRED.md`.
