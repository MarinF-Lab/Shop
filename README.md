# Eternal Garden — flores de limpiapipas

Aplicación web para un taller de flores de limpiapipas: calcula el costo real
de cada flor, lleva materiales e inventario por color, y registra los pedidos
con los colores que pidió cada cliente y cómo pagó. Incluye una tienda pública
para que tus clientes vean el catálogo y te dejen su pedido.

## Las cuatro secciones

La app se recorre con la barra de abajo: **Ramo · Flores · Taller · Caja**. Un
punto naranjo marca la sección que pide atención (pedidos atrasados, precios
que quedaron cortos, material que falta). La cabecera resume el día y tiene el
botón **+** para anotar un pedido; el botón redondo de la cuenta abre Ajustes.

- **Ramo** es la agenda. Arriba, la franja *Por hacer* con todos los pedidos
  sin terminar en orden de entrega; al centro, el pedido más urgente (o el que
  elijas) dibujado como ramo con sus colores, con sus flores, entrega, notas,
  avance (*Anotado · Armando · Listo*), pago y los botones *Editar*,
  *Registrar abono* y *Marcar como entregado*. Debajo, la lista completa y lo
  entregado el último mes, con buscador.
- **Flores**: cuánto cuesta cada flor, en cuánto la vendes y cuánto te queda,
  con el aviso *Revisa estos precios* y el historial de costos. Tocar una flor
  abre su receta en cinco pasos.
- **Taller**: lo que falta para los pedidos, el muestrario de materiales por
  tipo con su PPP, el registro de compras y su historial.
- **Caja**: el **total caja** (efectivo) y el **total banco** (transferencias)
  del mes —lo cobrado menos las compras pagadas con ese medio—, lo que falta
  cobrar pedido por pedido, la ganancia de lo entregado y los colores más usados.

Los colores de los dibujos salen del color elegido para cada material o, si no
tiene uno, de su nombre ("Rosa", "Verde claro", "Celeste"…).

## Flores y agenda de pedidos

- **Receta de la flor**, en cinco pasos: *Nombre y precio*; *Pétalos* (puede
  haber varios: cuántos tiene la flor, cuántos limpiapipas lleva cada uno y
  cuántos de ellos van de cada color; por ejemplo, el tulipán tiene 4 pétalos
  de 3 limpiapipas, 2 del color primario y 1 del secundario); *Complementos*
  (relleno, centro, hojas…, con nombre y cantidades libres); *Otros
  materiales*, en la medida del inventario (20 cm de una varilla de 30); y
  *Resumen* con el costo de cada parte y la ganancia. La mano de obra no se
  cobra ni suma al costo. Las recetas de antes se convierten solas al abrirlas.
- **Pedidos**: los anotas tú, en una hoja de cuatro pasos (*Cliente*,
  *Flores*, *Entrega*, *Pago*). Cada pedido guarda cliente, Instagram,
  teléfono, fecha de pedido (se pone sola y es editable), fecha de entrega,
  forma de entrega con dirección y notas. En *Hechos* se ve el último mes; lo
  anterior, con *Ver anteriores* o con el buscador.
- **Colores por pedido**: por cada flor escribes la cantidad y eliges un color
  por cada color de cada pétalo y por cada complemento; viene marcado el
  habitual de la receta y se ve cuánto queda de cada uno.
- **Envoltura del ramo**: en *Entrega* eliges papel, celofán o sin envoltura
  y cuántos pliegos. No se cobra aparte: cuenta como costo.
- **Materiales**: en los pedidos por hacer ves lo que usarán frente al stock;
  al entregar se muestra lo que se usará según la receta (con la envoltura),
  puedes escribir o ajustar cada cantidad, y se descuenta del stock; el pedido
  guarda lo que se usó.
- **Pagos**: efectivo o transferencia, con abonos; un pago mixto son dos pagos.
  Cada pedido indica si está pagado, abonado o por cobrar.

## Tienda pública

`tienda.html` es la página donde los clientes encargan. Se comparte con una
dirección corta, `tienda.html?t=eternal-garden`, que se elige en el **Perfil
de la tienda** (botón con la tiendita, en la cabecera de la app). Ahí también
se abre o cierra la tienda y se cambian el logo, el nombre, el texto de
bienvenida, el Instagram, el WhatsApp y los **días mínimos para entregar**.

- Se muestran las flores marcadas con *Mostrar en la tienda pública* en el
  paso 1 de su receta, con su foto (que se sube ahí mismo) o su dibujo.
- El cliente elige la cantidad y el color de cada pétalo y complemento; solo
  ve los colores con stock, descontando lo que piden los pedidos por hacer, y
  la tienda no deja pedir más de lo que hay.
- Elige la envoltura, la fecha (no antes del mínimo de días), si retira, se
  juntan o es envío, y deja su nombre, WhatsApp e Instagram.
- El pedido entra a Ramo como **Nuevo · tienda**, con un aviso arriba y un
  punto en la pestaña. Se **confirma** o se **rechaza** (queda cancelado).
- La app publica sola lo que ve el cliente unos segundos después de cada
  cambio: el perfil y los colores disponibles en `publico/tienda`, cada flor
  en `catalogo/` y su foto en `fotos/`. Las fotos y el logo se achican en el
  teléfono y se guardan en Firestore, sin Firebase Storage.

Los colores de los materiales se eligen de la paleta, de *Mis colores* o con
**Otro color** (rueda de color o código como `#C8A2C8`); los que se agregan
quedan guardados en la paleta.

## Instalar en el teléfono

La planilla es una PWA: desde el navegador del teléfono, **Agregar a la pantalla
de inicio** (Android: menú ⋮ → *Instalar aplicación*; iPhone: Compartir →
*Agregar a inicio*). Se abre como una app, con el icono de la flor y sin barra
del navegador.

El service worker (`sw.js`) guarda la planilla, los iconos y el SDK de Firebase,
así que con la sesión ya iniciada la app abre aunque no haya señal; los datos
salen de la caché offline de Firestore y se suben al volver la conexión. No
intercepta Firestore ni el inicio de sesión, que siempre van a la red.

La página siempre se pide primero a la red, así que los cambios publicados
llegan solos. Si cambias la lógica de `sw.js` o la lista de archivos que guarda,
sube su `VERSION` para que se renueve la caché. También guarda las fuentes
(Fraunces y Nunito Sans) para que sin señal la app se vea igual.

La PWA necesita HTTPS (o `localhost`): abriendo el archivo con doble clic no se
instala. La tienda pública lleva el icono, pero no es instalable: la app es la
planilla del taller.

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

1. Abre `planilla-costos.html` y entra con Google. **Ramo** te muestra lo que
   hay que hacer; **Caja**, cómo va el mes.
2. Carga tus materiales con su precio de compra y su unidad.
3. Crea productos indicando qué materiales lleva cada uno: el costo se calcula
   solo, y tú eliges el margen o el precio final.
4. En Taller llevas tus materiales y, si trabajas con stock, las unidades
   ya fabricadas.
5. Marca los productos que quieras vender y pulsa **Publicar catálogo**.
6. Copia la dirección de tu tienda (`tienda.html?tienda=TU_UID`) y compártela.
   Los pedidos que dejen tus clientes entran solos a tu agenda.

Flores y el inventario tienen su buscador, sus filtros y su orden; los pedidos
se buscan desde Ramo y se ordenan por fecha de entrega.

Sin el parámetro `?tienda=`, `tienda.html` muestra su catálogo de ejemplo y
envía los pedidos por WhatsApp.

## Tipos y materiales

Cada material tiene un **tipo** (Limpiapipas, Varillas, Cinta, Envoltura u
otro que crees con *+ Tipo*), un color y la **medida de cada unidad** con su
unidad (u, cm, m, g, ml, pliego u otra que escribas): una varilla mide 30 cm,
un rollo de cinta 25 m, un limpiapipas 1 u. Se elige al crear el material
(desde *+ Material* o desde una compra) y en *Editar*. Las cantidades del
Taller, la compra, la receta, el pedido y la entrega llevan su unidad
("4 u (120 cm)"). El Taller los muestra como un
muestrario por tipo; tocar uno abre su stock (se escribe directo), lo que
piden los pedidos y los botones *Editar* y *Registrar compra*. En *Editar* se
cambian nombre, tipo, color y medida, y en *Más opciones* quedan los datos de
antes (unidad de uso, costo manual o por paquete, pliegos, stock mínimo).

Los materiales de versiones anteriores toman su tipo de su última compra, de
su nombre o de la categoría que tenían.

## Historial de costos

Cada vez que cambia el costo de un material se anota el valor anterior y el
nuevo. En la ficha del material aparece cuánto subió y desde cuándo, y en
Flores se avisa de los productos cuyo precio quedó corto porque sus insumos
subieron.

## Compras · PPP

En el Taller, *+ Compra* registra cada bolsa que compras: tipo (o uno nuevo),
material (o uno nuevo, con su color), bolsas, unidades por bolsa, precio por
bolsa, proveedor, fecha y **cómo pagaste** (efectivo o transferencia). Muestra
el total, el precio por unidad y cómo cambia el PPP del tipo. El historial de
compras es una lista: tocar una compra la abre para corregirla. Las compras
anteriores sin medio de pago cuentan como transferencia.

Cada tipo tiene su **precio promedio ponderado (PPP)**: gasto total ÷ unidades
totales de todas sus compras. Todos los colores de limpiapipas comparten un
mismo PPP, sin rastrear de qué bolsa sale cada uno. Por ejemplo, una bolsa de
30 a $800, una de 100 a $1.800, una de 100 a $2.000 y cinco de 100 a $900 dan
$9.100 por 730 unidades: PPP $12,47.

- Cada compra suma sus unidades al stock del material; corregirla o quitarla
  ajusta el stock.
- Los materiales comprados pasan a costar el PPP de su tipo, así que el costo
  y la ganancia de cada flor se actualizan solos, y el cambio queda en el
  historial de costos.
- **Cargar stock actual** anota lo que ya tienes como compra inicial, a su
  costo de hoy, sin volver a sumarlo al stock.

## Guardado

Cada cambio se sube a Firestore al momento, por colección: si una falla (por
ejemplo, si faltan sus reglas en Firebase), las demás se guardan igual, el
estado dice qué pasó y se reintenta sola cada 10 segundos.

## Seguridad

Las reglas de `firestore.rules` garantizan que:

- Solo el dueño lee y escribe sus materiales, productos, pedidos, historial
  de costos y ajustes.
- El catálogo publicado y los datos de contacto son de lectura pública.
- Cualquiera puede **crear** un pedido desde la tienda, solo con los campos
  permitidos y tamaños acotados, siempre como `pendiente` y `nuevo`; nadie
  puede leer, editar ni borrar los pedidos de otra persona.
- Las fotos de las flores son de lectura pública; solo la dueña las sube.
- La dirección corta (`enlaces/{nombre}`) es pública; solo su dueña la crea,
  cambia o borra.

Cada vez que cambian estas reglas hay que publicarlas en la consola de
Firebase (Firestore Database → Reglas → pegar `firestore.rules` → Publicar).
