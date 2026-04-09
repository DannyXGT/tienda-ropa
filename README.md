# bea milli's boutique

Tienda web en Next.js + panel de contenido en Sanity Studio.

## Estructura

- `src/`: storefront (catálogo, producto, carrito y checkout por WhatsApp).
- `studio/`: panel admin de Sanity para gestionar productos, colores, tallas y flags.

## Variables de entorno

### Storefront (`/.env`)

```env
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
```

### Studio (`/studio/.env`)

```env
SANITY_STUDIO_PROJECT_ID=your_project_id
SANITY_STUDIO_DATASET=production
```

Puedes copiar desde:

- `/.env.example`
- `/studio/.env.example`

## Desarrollo local

### 1) Storefront

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

### 2) Sanity Studio

```bash
cd studio
npm install
npm run dev
```

Abre `http://localhost:3333`.

## Flujo de contenido (cliente final)

1. Entrar al Studio.
2. Crear o editar productos.
3. Marcar `published = true`.
4. Opcional: marcar `featuredHome`, `newArrival` o `bestSeller`.
5. Guardar y publicar.

La tienda solo muestra productos publicados.

## Despliegue a producción

### Frontend (recomendado: Vercel)

1. Conectar repo de GitHub a Vercel.
2. Configurar variables:
   - `VITE_SANITY_PROJECT_ID`
   - `VITE_SANITY_DATASET`
3. Deploy.

### Studio

Desde `studio/`:

```bash
npm run deploy
```

También puedes desplegar Studio en Vercel como proyecto separado.

## Notas

- El checkout finaliza por WhatsApp (no pago directo dentro del sitio).
- El catálogo usa datos publicados en Sanity (`perspective: "published"`).
