# Funcionalidades de la Buvette de Bel'Air

Bienvenido al proyecto **Bel'Air's Buvette**! Este documento resume las funcionalidades clave de la aplicación web y del design system diseñados para que los asistentes del festival gestionen sus tokens y realicen pedidos.

## Funcionalidades

### Como desarrollador/a, quiero un componente Token Balance para mostrar el saldo del asistente

Reglas:
- El componente acepta `drinkTokens` y `foodTokens` como props
- Los tokens de bebida y comida son visualmente distintos (iconos y colores diferentes)
- Un saldo cero renderiza el contador en gris con la etiqueta "Sin tokens restantes"
- El componente es responsivo en todos los tamaños de pantalla
- Una story de Storybook muestra todos los estados: saldo normal, saldo cero y saldo mixto

### Como asistente del festival, quiero explorar el menú en la aplicación web

Reglas:
- La página del menú está dividida en dos secciones: Bebidas y Comida
- La sección Bebidas muestra subcategorías: No Alcohólicas (gratis) y Alcohólicas (Normal: 1 token, Premium: 2 tokens)
- La sección Comida muestra subcategorías: Snacks (1 token) y Comidas (3 tokens)
- Cada tarjeta de artículo muestra el nombre y el coste en tokens; las bebidas no alcohólicas muestran "Gratis"
- Los artículos que el usuario no puede permitirse aparecen visualmente atenuados pero siguen siendo accesibles
- El menú es filtrable por categoría (Todo / Bebidas / Comida)

### Como asistente del festival, quiero añadir artículos a un carrito y ver el total acumulado

Reglas:
- Hacer clic en "Añadir al carrito" añade el artículo al panel lateral/cajón del carrito
- El carrito muestra el coste acumulado en tokens de bebida y tokens de comida por separado
- Los artículos pueden eliminarse o ajustar su cantidad en el carrito
- Si añadir un artículo supera el saldo disponible, el botón de añadir se deshabilita para ese artículo y un tooltip explica el motivo
- El subtotal del carrito se actualiza en tiempo real

### Como asistente del festival, quiero realizar mi pedido desde el carrito

Reglas:
- El botón "Realizar pedido" solo está activo cuando el carrito no está vacío y el saldo es suficiente
- Al hacer clic aparece un modal de confirmación con el resumen completo del pedido y el tiempo estimado de preparación
- Tras confirmar, el pedido se envía y el usuario es redirigido a la página de estado del pedido
- El saldo mostrado se actualiza inmediatamente tras el pedido
- En caso de error (por ejemplo, fallo de red), el carrito se conserva y se muestra un toast de error

### Como asistente del festival, quiero una página de estado del pedido para hacer seguimiento

Reglas:
- La página muestra el estado actual: Pendiente, Confirmado, Listo para recoger o Cancelado
- En estado Confirmado, se muestra una cuenta regresiva del tiempo estimado de preparación en vivo
- En estado Listo para recoger, se muestra un banner de ancho completo "Tu pedido está listo! "
- La página se actualiza automáticamente cada 30 segundos
- Un botón de cancelar solo es visible cuando el pedido está en estado Pendiente

### Como asistente del festival, quiero modificar o cancelar mi pedido pendiente

Reglas:
- Un botón "Editar pedido" aparece en la página de estado cuando el pedido está en estado Pendiente
- Al hacer clic se abre el carrito pre-rellenado con los artículos actuales del pedido
- Las mismas reglas de carrito y verificación de saldo se aplican durante la modificación
- Un botón "Cancelar pedido" muestra un diálogo de confirmación antes de cancelar
- Tras una cancelación exitosa, aparece un banner de éxito y el saldo se actualiza

### Como grupo de asistentes, quiero participar en un pedido grupal conjunto

Reglas:
- Una entrada "Unirse a un pedido grupal" en la página de pedido permite introducir un código
- El asistente selecciona el número de tokens de bebida y comida a contribuir (hasta su saldo disponible)
- Una pantalla resumen muestra el total de tokens agrupados, el coste restante y la aportación de cada participante
- Al enviar la contribución, se redirige a la página de estado del pedido

### Como asistente del festival, quiero transferir tokens a otro asistente

Reglas:
- Una página "Transferir tokens" permite introducir el ID del destinatario
- Se pueden transferir hasta 3 tokens de bebida y 3 tokens de comida por transacción
- Los selectores de tokens respetan el saldo disponible y el máximo de 3 por tipo
- Un paso de confirmación muestra el origen, el destino y los importes antes de enviar
- Aparece una notificación de éxito tras la transferencia confirmada y el saldo en la página de inicio se actualiza

### Como asistente del festival, quiero recibir recordatorios de hidratación en la aplicación web

Reglas:
- Aparece una notificación en forma de banner en la app recordando al asistente que beba agua
- El mensaje es amigable y fomenta el consumo responsable
- El banner se cierra automáticamente tras 30 segundos pero puede cerrarse manualmente
- Los recordatorios de hidratación aparecen cada hora entre las 11:00 y las 19:00
- Si el asistente ha realizado más de 3 pedidos de bebidas alcohólicas en la última hora, los recordatorios aparecen cada 30 minutos
- Una página de historial de notificaciones muestra los recordatorios pasados
