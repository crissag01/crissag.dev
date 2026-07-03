# Guía: Subir a GitHub

## Paso 1: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `crissag.dev` (o similar)
3. Descripción: "Professional portfolio with React, TypeScript, and n8n workflows"
4. Selecciona **Public** (para que sea visible)
5. NO inicialices con README (ya tenemos uno)
6. Click "Create repository"

## Paso 2: Conectar Repositorio Local

En PowerShell o terminal (en la carpeta del proyecto):

```powershell
cd c:\Users\criss\Downloads\Dominio\crissag.dev
git remote add origin https://github.com/crissag01/crissag.dev.git
git branch -M main
git push -u origin main
```

**Reemplaza `crissag01` con tu usuario de GitHub**

## Paso 3: Verificar en GitHub

- Ve a https://github.com/crissag01/crissag.dev
- Verifica que todos los archivos están presentes
- Revisa que el README se muestra correctamente

## Paso 4: Configurar GitHub Pages (Opcional pero Recomendado)

1. En GitHub, ve a Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main`, carpeta: `/root`
4. Click Save

**Nota:** Para que funcione correctamente con Vite, necesitarás:
- Actualizar `vite.config.ts` con `base: '/crissag.dev/'` si el repo no es usuario.github.io
- O deployer manualmente a cada push

## Paso 5: Deploy a Hostinger

### Opción A: Subir dist/ por FTP
```bash
npm run build
# Sube carpeta dist/ a /public_html via FTP
```

### Opción B: Usar Hostinger Git (Si lo soporta)
```bash
# En servidor Hostinger
git clone https://github.com/crissag01/crissag.dev.git
cd crissag.dev
npm install
npm run build
# Apunta dominio a carpeta dist/
```

### Opción C: Vercel (Recomendado - Gratis)
1. Ve a https://vercel.com/import
2. Conecta tu repositorio de GitHub
3. Selecciona `crissag.dev`
4. Framework: Vite
5. Deploy
6. Apunta tu dominio .dev en Hostinger a Vercel

## Próximos Pasos

- [ ] Crear repositorio en GitHub
- [ ] Conectar repositorio local
- [ ] Verificar en GitHub
- [ ] Configurar dominio .dev en Hostinger
- [ ] Configurar SSL (HTTPS)
- [ ] Hacer primero commit con actualizaciones

## Comandos Útiles

```bash
# Ver estado del repositorio
git status

# Ver commits
git log --oneline

# Hacer cambios y push
git add .
git commit -m "Descripción de cambios"
git push origin main

# Crear nueva rama para features
git checkout -b feature/nombre-feature
git push origin feature/nombre-feature
```

