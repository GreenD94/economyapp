import type { GlossaryTerm } from '@/features/core/components/InfoModal.component';

export type InfoEntry = {
  title: string;
  howItWorks: string[];
  glossary: GlossaryTerm[];
};

const GLOSSARY_BASE: GlossaryTerm[] = [
  { term: 'Ahorro', definition: 'Dinero que guardas en lugar de gastar. Tu ahorro mensual es $2,000 — lo primero que separas cuando cobras.' },
  { term: 'Ahorro mensual objetivo', definition: 'La cantidad que decides ahorrar cada mes para llegar a tu meta. En tu caso: $2,000.' },
  { term: 'Calidad de vida', definition: 'Tipo de gasto que mejora tu comodidad o bienestar, pero no es urgente. Ejemplo: una almohada mejor.' },
  { term: 'Capricho', definition: 'Gasto impulsivo sin justificación racional. No aporta valor real, solo satisfacción momentánea.' },
  { term: 'Categoría de gasto', definition: 'Grupo al que pertenece cada gasto. Tus categorías: Alimentación, Higiene, Salud, Casa, Gym, Claude, Ocio, Imprevistos, Caprichos, Tecnología.' },
  { term: 'Comodidad', definition: 'Qué tanto mejora algo tu vida cotidiana en términos de facilidad y confort.' },
  { term: 'Compra impulsiva', definition: 'Compra no planeada motivada por emoción, no por necesidad o razonamiento.' },
  { term: 'Costo de oportunidad', definition: 'Lo que renuncias cuando gastas dinero. Si gastas $100 en algo innecesario, renuncias a $100 de ahorro.' },
  { term: 'Decisor de compras', definition: 'Herramienta que evalúa si una compra vale la pena basándose en precio, impacto y tiempo de espera.' },
  { term: 'Depreciación hedónica', definition: 'La emoción que sientes al comprar algo nuevo dura poco. Después de días o semanas, la satisfacción cae drásticamente.' },
  { term: 'Disponible', definition: 'Lo que te queda para gastar libremente después de separar el ahorro y cubrir todos los gastos del mes.' },
  { term: 'Excedido', definition: 'Cuando gastas más de lo que tenías presupuestado en una categoría.' },
  { term: 'Flujo de caja', definition: 'El movimiento de dinero que entra (ingresos) y sale (gastos) en un período. Positivo = ganas más de lo que gastas.' },
  { term: 'Gasto fijo', definition: 'Gasto que se repite igual cada mes. Ejemplo: renta, suscripción, gym.' },
  { term: 'Gasto variable', definition: 'Gasto que cambia de monto mes a mes. Ejemplo: comida, transporte, entretenimiento.' },
  { term: 'Ingreso extra', definition: 'Dinero que entra esporádicamente: bonos, freelance, ventas, regalos.' },
  { term: 'Ingreso fijo', definition: 'Salario o pago que recibes igual cada mes o período. Predecible y confiable.' },
  { term: 'Ingreso variable', definition: 'Ingreso que cambia según el trabajo realizado o ventas. Ejemplo: comisiones.' },
  { term: 'Liquidez', definition: 'Dinero disponible de inmediato (efectivo o en cuenta). Alta liquidez = puedes pagar lo que necesitas sin esperar.' },
  { term: 'Meta financiera', definition: 'Un objetivo monetario concreto con monto y plazo. Tu meta: $15,000 de ahorro.' },
  { term: 'Necesidad', definition: 'Gasto que no puedes evitar sin afectar tu salud, seguridad o funcionamiento básico.' },
  { term: 'Patrimonio neto', definition: 'Total de lo que has ahorrado o acumulado hasta ahora. Es tu riqueza real en este momento.' },
  { term: 'Presupuesto', definition: 'Plan que asigna cuánto puedes gastar en cada categoría antes de que empiece el mes.' },
  { term: 'Prioridad', definition: 'En la wishlist: Alta = lo necesitas pronto, Media = puedes esperar, Baja = es un deseo.' },
  { term: 'Productividad', definition: 'Qué tanto te ayuda algo a hacer más o mejor trabajo. Alta productividad = justifica el gasto.' },
  { term: 'Proyección', definition: 'Cálculo de cuánto tendrás ahorrado en meses futuros, asumiendo que sigues ahorrando $2,000/mes.' },
  { term: 'Puntaje', definition: 'Número de 0 a 10 que mide si una compra vale la pena. Se calcula con precio, impacto y días de espera.' },
  { term: 'Regla de las 72 horas', definition: 'Antes de comprar algo entre $20 y $100, espera 3 días. Si sigues queriéndolo, la compra es más racional.' },
  { term: 'Regla de los 7 días', definition: 'Para compras mayores de $100, espera una semana completa antes de decidir.' },
  { term: 'Salud financiera', definition: 'Estado general de tus finanzas: ahorras, no debes, tienes plan. Como la salud física, se cuida con hábitos.' },
  { term: 'Semáforo financiero', definition: 'Sistema de colores (verde/amarillo/rojo) que indica si una compra es prudente ahora mismo.' },
  { term: 'Valor percibido', definition: 'Lo que crees que vale algo para ti. A veces es mayor que el precio real; otras veces menor.' },
  { term: 'Wishlist inteligente', definition: 'Lista de cosas que quieres comprar, filtrada por un sistema que te hace esperar antes de decidir.' },
  { term: 'Zero-based budgeting', definition: 'Técnica donde cada peso de tus ingresos tiene un destino asignado. Nada queda "sin plan". Suma 0 al final.' },
];

export const INFO = {
  dashboard: {
    goal: {
      title: 'Meta de Ahorro',
      howItWorks: [
        'La barra muestra cuánto has ahorrado de tu meta de $15,000. La parte verde es lo que ya tienes. La parte gris es lo que falta.',
        'Toca la barra para ver todos los detalles: porcentaje, meses restantes y meta completa.',
        'Teoría: "Págate primero a ti mismo." Cada mes, antes de gastar un centavo, separas $2,000. Ese dinero ya no existe para gastos — existe solo para tu futuro.',
        'La disciplina de este paso es lo que separa a quien llega a la meta de quien siempre está "a punto de empezar."',
      ],
      glossary: GLOSSARY_BASE.filter(g => ['Ahorro', 'Ahorro mensual objetivo', 'Meta financiera', 'Patrimonio neto'].includes(g.term)),
    },
    mesActual: {
      title: 'Mes Actual',
      howItWorks: [
        'La primera barra muestra qué fracción de tus ingresos ya gastaste este mes. Si la barra está en rojo, gastas más de lo que ganas.',
        'La segunda barra muestra el ahorro del mes (objetivo $2,000). Si está llena, ya separaste tu ahorro.',
        '"Disponible" es lo que te queda después de ahorro y gastos. Si es negativo, estás en rojo este mes.',
        'El dinero disponible no es para gastar de inmediato — es tu colchón para imprevistos y gastos que aún no han llegado.',
      ],
      glossary: GLOSSARY_BASE.filter(g => ['Flujo de caja', 'Disponible', 'Ingreso fijo', 'Gasto fijo', 'Gasto variable'].includes(g.term)),
    },
    categorias: {
      title: 'Gastos por Categoría',
      howItWorks: [
        'Cada porción del gráfico representa una categoría de gasto. El tamaño de la porción es proporcional al monto gastado.',
        'Toca cualquier porción para ver el nombre de la categoría y cuánto llevas gastado en ella este mes.',
        'Las categorías con $0 de gasto no aparecen en el gráfico.',
        'Ver la distribución visual de tus gastos revela patrones que los números solos no muestran. ¿Dónde se va realmente tu dinero?',
      ],
      glossary: GLOSSARY_BASE.filter(g => ['Categoría de gasto', 'Gasto fijo', 'Gasto variable', 'Capricho', 'Necesidad'].includes(g.term)),
    },
  },
  transactions: {
    incomes: {
      title: 'Ingresos',
      howItWorks: [
        'Registro de todo el dinero que entra cada mes. Fijo: siempre igual (salario). Variable: cambia mes a mes. Extra: bonos, freelance, ventas esporádicas.',
        'Llevar este registro preciso te da el número real disponible para planificar. Estimar sin datos lleva a errores costosos.',
        'Principio: conoce tu número exacto antes de planificar cualquier gasto. Un ingreso mal calculado arruina todo el presupuesto.',
      ],
      glossary: GLOSSARY_BASE.filter(g => ['Ingreso fijo', 'Ingreso variable', 'Ingreso extra', 'Flujo de caja mensual', 'Flujo de caja'].includes(g.term)),
    },
    expenses: {
      title: 'Gastos',
      howItWorks: [
        'La pestaña de gastos tiene dos secciones: "Gastos frecuentes" y "Otros gastos".',
        '"Gastos frecuentes" son los que se repiten cada mes, cada 15 días o cada semana. Toca una tarjeta para ver los pagos esperados y confirmar cuánto pagaste.',
        'Los gastos fijos muestran el monto de siempre al confirmar. Los variables te piden que ingreses cuánto pagaste esta vez.',
        '"Otros gastos" son los únicos — compras espontáneas, imprevistos, cualquier gasto que no se repite.',
        'Toca cualquier tarjeta para ver opciones: editar, eliminar o quitar una confirmación.',
      ],
      glossary: [
        { term: 'Gasto frecuente',  definition: 'Plantilla de un gasto que se repite según su frecuencia. Genera slots de pago cada mes.' },
        { term: 'Otro gasto',       definition: 'Gasto único que no se repite. No tiene plantilla.' },
        { term: 'Fijo',             definition: 'El monto es siempre el mismo (ej. arriendo).' },
        { term: 'Variable',         definition: 'El monto cambia cada vez (ej. electricidad).' },
        { term: 'Confirmar pago',   definition: 'Registrar que pagaste un gasto frecuente en un slot determinado.' },
        { term: 'Quitar',           definition: 'Cancelar la confirmación de un pago. El slot vuelve a estar pendiente.' },
        { term: 'Clasificación',    definition: 'Cómo categorizas el gasto: Necesidad, Calidad de vida, Productividad o Capricho.' },
      ],
    },
  },
  finance: {
    budget: {
      title: 'Presupuesto',
      howItWorks: [
        'Antes de que empiece el mes, decides cuánto puedes gastar en cada categoría. La barra de cada categoría muestra cuánto llevas gastado.',
        'REGLA DE ORO: El día que cobras, mueve $2,000 a otra cuenta ANTES de tocar el dinero para gastos. El ahorro no es lo que sobra — es lo primero que sale.',
        'Cuando una barra está verde puedes gastar con calma. Amarilla: casi llegas al límite. Roja: ya te pasaste.',
        'Técnica Zero-Based Budgeting: cada peso de tus ingresos tiene un destino. Ahorro + gastos fijos + gastos variables = total de ingresos. Nada queda sin asignar.',
      ],
      glossary: GLOSSARY_BASE.filter(g => ['Presupuesto', 'Zero-based budgeting', 'Gasto fijo', 'Gasto variable', 'Excedido', 'Flujo de caja', 'Ahorro'].includes(g.term)),
    },
    networth: {
      title: 'Patrimonio',
      howItWorks: [
        'Cada mes registras cuánto tienes ahorrado en total. El sistema proyecta cuándo llegarás a $15,000 asumiendo $2,000 de ahorro por mes.',
        'La fila en verde es el mes en que alcanzas la meta. Las filas proyectadas son estimaciones — cambiarán si ahorras más o menos.',
        'Actualiza tu ahorro real al inicio de cada mes. Eso mantiene las proyecciones exactas.',
        'Ver tu patrimonio crecer mes a mes es el motivador más poderoso para mantener el hábito. La visualización transforma el esfuerzo en progreso tangible.',
      ],
      glossary: GLOSSARY_BASE.filter(g => ['Patrimonio neto', 'Ahorro', 'Proyección', 'Liquidez', 'Meta financiera'].includes(g.term)),
    },
  },
  onboarding: {
    goal: {
      title: 'Meta de Ahorro',
      howItWorks: [
        'Tu meta de ahorro es el monto total que quieres acumular. Puede ser un fondo de emergencia, el enganche de una casa, un viaje, o simplemente seguridad financiera.',
        'No hay una cantidad correcta — lo importante es tener un número concreto. Un objetivo vago ("quiero ahorrar más") no funciona; uno específico ("quiero $10,000") sí.',
        'Principio: "Págate primero a ti mismo." Antes de gastar en cualquier cosa, separa tu ahorro mensual. El ahorro no es lo que sobra — es lo primero que sale.',
      ],
      glossary: GLOSSARY_BASE.filter(g => ['Meta financiera', 'Ahorro', 'Fondo de emergencia', 'Patrimonio neto', 'Salud financiera'].includes(g.term)),
    },
    income: {
      title: 'Ingreso Mensual',
      howItWorks: [
        'Ingresa el dinero neto que recibes cada mes — lo que llega a tu cuenta después de impuestos y deducciones.',
        'Si tus ingresos varían (freelance, comisiones), usa un promedio conservador de los últimos 3 meses. Es mejor subestimar y tener excedente que sobreestimar y quedarte corto.',
        'Conocer tu número exacto es el primer paso de cualquier plan financiero. Todo lo demás — presupuesto, ahorro, gastos — depende de este dato.',
      ],
      glossary: GLOSSARY_BASE.filter(g => ['Ingreso fijo', 'Ingreso variable', 'Ingreso extra', 'Flujo de caja', 'Liquidez'].includes(g.term)),
    },
    savingsTarget: {
      title: 'Ahorro Mensual',
      howItWorks: [
        'Tu ahorro mensual es cuánto separas cada mes para avanzar hacia tu meta. La regla 50/30/20 sugiere: 50% para necesidades, 30% para deseos, 20% para ahorro.',
        'Ejemplo con $2,900/mes y regla 50/30/20: $1,450 necesidades · $870 deseos · $580 ahorro. Ajusta según tu situación real.',
        'Incluso si solo puedes ahorrar $50 al mes, el hábito importa más que el monto inicial. La cantidad que ahorras puede crecer con el tiempo.',
      ],
      glossary: GLOSSARY_BASE.filter(g => ['Ahorro mensual objetivo', 'Ahorro', 'Meta financiera', 'Presupuesto', 'Zero-based budgeting'].includes(g.term)),
    },
    fixedExpenses: {
      title: 'Gastos Fijos',
      howItWorks: [
        'Un gasto fijo es uno que pagas igual cada mes sin importar lo que hagas: renta, servicios, suscripciones, gym. Estos no cambian aunque gastes más o menos en otras cosas.',
        'No te preguntamos por salidas, restaurantes ni entretenimiento — esos son gastos variables que registras en la app cuando ocurren.',
        'Si no sabes un monto exacto, pon 0 y ajusta después. Esto es una estimación inicial, no un contrato.',
      ],
      glossary: GLOSSARY_BASE.filter(g => ['Gasto fijo', 'Gasto variable', 'Disponible', 'Presupuesto', 'Necesidad'].includes(g.term)),
    },
    plan: {
      title: 'Tu Plan de Ahorro',
      howItWorks: [
        'El plan que ves está calculado sobre lo que te queda disponible después de tus gastos fijos. Es el dinero que puedes decidir cómo usar.',
        'Relajado (20%) significa que guardas una quinta parte de lo disponible y el resto lo usas libremente. Agresivo (50%) significa que priorizas llegar a tu meta más rápido a cambio de menos dinero de bolsillo.',
        'Principio: págate primero a ti mismo. El ahorro sale el día que cobras, antes de cualquier otro gasto. Lo que queda es lo que puedes gastar.',
        'Puedes cambiar tu ritmo de ahorro en cualquier momento desde Configuración.',
      ],
      glossary: GLOSSARY_BASE.filter(g => ['Ahorro mensual objetivo', 'Meta financiera', 'Disponible', 'Flujo de caja', 'Liquidez', 'Salud financiera'].includes(g.term)),
    },
  },
  purchases: {
    wishlist: {
      title: 'Wishlist Inteligente',
      howItWorks: [
        'Antes de comprar algo que no es necesidad inmediata, lo agregas aquí. El sistema aplica la regla de 3 niveles según el precio.',
        'Menos de $20: puedes comprarlo sin culpa. Entre $20 y $100: espera 72 horas. Más de $100: espera 7 días.',
        'Si después de esperar sigues queriéndolo igual, la compra es racional — no fue un impulso pasajero.',
        'Psicología: el deseo de comprar algo nuevo baja 60–80% después de 72 horas. Las compras que sobreviven la espera generalmente son las que valen la pena.',
        'Color de la tarjeta: Verde = compra ya. Amarillo = espera. Rojo = descartado.',
      ],
      glossary: GLOSSARY_BASE.filter(g => ['Wishlist inteligente', 'Semáforo financiero', 'Compra impulsiva', 'Regla de las 72 horas', 'Regla de los 7 días', 'Capricho', 'Prioridad', 'Valor percibido'].includes(g.term)),
    },
    decision: {
      title: 'Decisor de Compras',
      howItWorks: [
        'Calculadora de decisión de compra. Ingresa el precio y cuántos días llevas queriendo comprarlo. Luego indica cuánto mejora tu salud, productividad y comodidad.',
        'El sistema calcula un puntaje de 0 a 10 y te da una recomendación: Verde (compra), Amarillo (espera), Rojo (no ahora).',
        'Fórmula: impacto personal (salud + productividad + comodidad ÷ 3) pesa 50%. Precio pesa 30%. Días esperando pesa 20%.',
        'Psicología: ponerle números a tus emociones reduce las decisiones impulsivas. Si algo puntúa bajo, es porque objetivamente no aporta suficiente valor para el costo.',
        'El Decisor no guarda datos — es una calculadora para momentos de duda.',
      ],
      glossary: GLOSSARY_BASE.filter(g => ['Decisor de compras', 'Puntaje', 'Salud financiera', 'Productividad', 'Comodidad', 'Compra impulsiva', 'Costo de oportunidad', 'Depreciación hedónica', 'Valor percibido'].includes(g.term)),
    },
  },
};
