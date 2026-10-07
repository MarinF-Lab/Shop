# Costos y precios — flores de limpiapipas

Aplicación web para un taller de flores de limpiapipas: calcula el costo real
de cada flor, lleva materiales e inventario por color, y registra los pedidos
con los colores que pidió cada cliente y cómo pagó. Incluye una tienda pública
para que tus clientes vean el catálogo y te dejen su pedido.

## Flores y pedidos

- **Receta de la flor**: tipo de limpiapipas de los pétalos, cuántos pétalos
  lleva en un color y cuántos en bicolor (primario + secundario), hojas (tipo y
  cantidad) y los materiales fijos (barra metálica, cinta…).
- **Pedido**: por cada flor eliges un color o bicolor, el primario, el
  secundario y el color de las hojas, entre los que tienes en stock. Al
  entregar se descuentan exactamente esos colores y el pedido guarda lo que se
  usó.
- **Pagos**: efectivo o transferencia, con abonos; un pago mixto son dos pagos.
  Cada pedido indica si está pagado, abonado o por cobrar.
- **Inicio** resume cuánto entró este mes en efectivo y por transferencia, lo
  que queda por cobrar y los colores más usados en los últimos 30 días.

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
tiendas/{uid}/historial/{id}     cómo fue cambiando el costo de cada material
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

## Formas de vender

El asistente pregunta cómo trabajas y ajusta la aplicación:

| Modo | Qué lleva | Cómo se descuenta al entregar |
|---|---|---|
| Por encargo | Materiales | Se produce contra el pedido, descontando materiales. |
| Con stock listo | Unidades fabricadas | Se descuenta de lo que ya tienes hecho. |
| Mixta | Ambos | Se usan primero las unidades hechas; solo lo que falte se fabrica descontando materiales. |

En modo mixto, **Fabricar** descuenta los materiales y suma las unidades a la
existencia del producto, así que lo ya hecho nunca vuelve a consumir materiales.

La tienda pública siempre trabaja por encargo: no muestra cantidades y el cliente
pide lo que necesite. El inventario es para ti, para saber si te alcanzan los
materiales; un número publicado quedaría viejo entre una publicación y la
siguiente.

## Uso diario

1. Abre `planilla-costos.html` y entra con Google. **Inicio** te muestra los
   pedidos que urgen, lo que falta comprar y cómo va la ganancia del mes.
2. Carga tus materiales con su precio de compra y su unidad.
3. Crea productos indicando qué materiales lleva cada uno: el costo se calcula
   solo, y tú eliges el margen o el precio final.
4. En Inventario llevas tus materiales y, si trabajas con stock, las unidades
   ya fabricadas.
5. Marca los productos que quieras vender y pulsa **Publicar catálogo**.
6. Copia la dirección de tu tienda (`tienda.html?tienda=TU_UID`) y compártela.
   Los pedidos que dejen tus clientes entran solos a tu agenda.

Cada lista (productos, pedidos, materiales) tiene su buscador, sus filtros y
su orden. Los pedidos se ordenan por urgencia: primero los abiertos, y dentro
de ellos lo que vence antes.

Sin el parámetro `?tienda=`, `tienda.html` muestra su catálogo de ejemplo y
envía los pedidos por WhatsApp.

## Categorías

Los materiales se agrupan por categoría: quien trabaja con limpiapipas tiene un
material en doce colores, no doce materiales sueltos. La categoría se elige de
un desplegable con las que ya usaste, o se crea al vuelo desde la ficha.

Cada categoría se pliega y muestra, sin abrirla, cuántos ítems tiene y cuánto
dinero representa; dentro, cada material es una línea que se abre al tocarla.
Al buscar, las categorías con coincidencias se abren solas. El lápiz de la
cabecera permite renombrar la categoría —si le pones el nombre de otra, se
fusionan— o eliminarla, en cuyo caso sus materiales pasan a "Sin categoría"
sin perderse.

Al armar un producto, el material se elige con botones dentro del propio
recuadro: primero la categoría, luego el color. Con menos de ocho materiales se
muestran todos directamente.

## Historial de costos

Cada vez que cambia el costo de un material se anota el valor anterior y el
nuevo. En la ficha del material aparece cuánto subió y desde cuándo, y en
Inicio se avisa de los productos cuyo precio quedó corto porque sus insumos
subieron.

## Seguridad

Las reglas de `firestore.rules` garantizan que:

- Solo el dueño lee y escribe sus materiales, productos, pedidos, historial
  de costos y ajustes.
- El catálogo publicado y los datos de contacto son de lectura pública.
- Cualquiera puede **crear** un pedido desde la tienda, con campos validados,
  pero nadie puede leer, editar ni borrar los pedidos de otra persona.
