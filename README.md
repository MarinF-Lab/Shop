# Costos y precios

Aplicación web para emprendedores: calcula el costo real de lo que produces,
le pone precio con el margen que definas, y lleva materiales, inventario y
pedidos. Incluye una tienda pública para que tus clientes vean el catálogo y
te dejen su pedido.

Son dos páginas HTML sin dependencias ni compilación:

| Archivo | Para quién |
|---|---|
| `planilla-costos.html` | Panel de gestión. Requiere cuenta de Google. |
| `tienda.html` | Tienda pública. La abre cualquiera, sin cuenta. |
| `firestore.rules` | Reglas de seguridad de la base de datos. |

## Cómo funciona

Cada cuenta de Google es dueña de su propia tienda. Todo cuelga de su `uid`:

```
tiendas/{uid}                    settings (moneda, impuesto, datos de la tienda)
tiendas/{uid}/materiales/{id}    materiales e insumos, con su stock
tiendas/{uid}/productos/{id}     productos, recetas, costos y márgenes
tiendas/{uid}/pedidos/{id}       pedidos propios y los que llegan de la tienda
tiendas/{uid}/catalogo/{id}      lo publicado, de lectura pública
tiendas/{uid}/publico/tienda     nombre y WhatsApp que ve el cliente
```

Firestore es la fuente de verdad. El navegador guarda una copia para que
puedas seguir trabajando sin señal, y sube los cambios al recuperar conexión.
Esa copia se separa por cuenta, así que en un equipo compartido nadie ve los
datos de otra persona.

## Puesta en marcha

### 1. Crear el proyecto en Firebase

1. Entra a [console.firebase.google.com](https://console.firebase.google.com) y crea un proyecto.
2. Agrega una **app web** (el ícono `</>`) y copia el objeto de configuración.
3. Pega esos valores en la constante `FIREBASE` de **ambos** archivos
   (`planilla-costos.html` y `tienda.html`). Son claves públicas por diseño:
   lo que protege los datos son las reglas, no el secreto de estas claves.

### 2. Habilitar el acceso con Google

1. **Authentication → Sign-in method → Google → Habilitar.**
2. Elige un correo de soporte y guarda.
3. **Authentication → Settings → Authorized domains:** agrega el dominio donde
   publiques la página. Sin este paso, el acceso falla con
   *"Este sitio todavía no está autorizado en Firebase"*.

### 3. Crear la base de datos y publicar las reglas

1. **Firestore Database → Crear base de datos** (modo producción).
2. Publica las reglas de este repositorio:

   ```bash
   firebase deploy --only firestore:rules
   ```

   O pega el contenido de `firestore.rules` en **Firestore → Reglas → Publicar**.

### 4. Publicar las páginas

Cualquier hosting de archivos estáticos sirve. Con Firebase Hosting:

```bash
firebase init hosting   # carpeta pública: la raíz del repositorio
firebase deploy --only hosting
```

El acceso con Google **no funciona abriendo el archivo con doble clic**
(`file://`): necesita un dominio servido por HTTP y autorizado en Firebase.

## Uso diario

1. Abre `planilla-costos.html` y entra con Google.
2. Carga tus materiales con su precio de compra y su unidad.
3. Crea productos indicando qué materiales lleva cada uno: el costo se calcula
   solo, y tú eliges el margen o el precio final.
4. Marca los productos que quieras vender y pulsa **Publicar catálogo**.
5. Copia la dirección de tu tienda (`tienda.html?tienda=TU_UID`) y compártela.
   Los pedidos que dejen tus clientes entran solos a tu agenda.

Sin el parámetro `?tienda=`, `tienda.html` muestra su catálogo de ejemplo y
envía los pedidos por WhatsApp.

## Seguridad

Las reglas de `firestore.rules` garantizan que:

- Solo el dueño lee y escribe sus materiales, productos, pedidos y ajustes.
- El catálogo publicado y los datos de contacto son de lectura pública.
- Cualquiera puede **crear** un pedido desde la tienda, con campos validados,
  pero nadie puede leer, editar ni borrar los pedidos de otra persona.
