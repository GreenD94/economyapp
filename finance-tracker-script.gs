/* ===================================================
   FINANCE TRACKER - Hernando
   Ejecuta buildFinanceTracker() una sola vez.
   =================================================== */

var META = 15000;
var AHORRO_INICIAL = 4100;
var AHORRO_MENSUAL = 2000;

var C_HDR    = '#1a5c38';
var C_HDR_TXT = '#ffffff';
var C_ACCENT = '#ffd54f';
var C_ALT    = '#f0f9f4';
var C_TOTAL  = '#c8e6c9';
var C_DANGER = '#ffcdd2';
var C_WARN   = '#fff9c4';
var C_INFO   = '#e3f2fd';

// Inicio y fin del mes actual como formulas de fecha
var MES_INI = 'DATE(YEAR(TODAY()),MONTH(TODAY()),1)';
var MES_FIN = 'DATE(YEAR(TODAY()),MONTH(TODAY())+1,1)';

function buildFinanceTracker() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename('Finance Tracker Hernando');

  var names = ['Dashboard','Ingresos','Gastos','Presupuesto','Wishlist','Patrimonio','Decisor'];

  names.forEach(function(name) {
    if (!ss.getSheetByName(name)) ss.insertSheet(name);
  });

  ss.getSheets().forEach(function(s) {
    if (names.indexOf(s.getName()) === -1) {
      try { ss.deleteSheet(s); } catch(e) {}
    }
  });

  names.forEach(function(name, i) {
    ss.setActiveSheet(ss.getSheetByName(name));
    ss.moveActiveSheet(i + 1);
  });

  setupDashboard(ss.getSheetByName('Dashboard'));
  setupIngresos(ss.getSheetByName('Ingresos'));
  setupGastos(ss.getSheetByName('Gastos'));
  setupPresupuesto(ss.getSheetByName('Presupuesto'));
  setupWishlist(ss.getSheetByName('Wishlist'));
  setupPatrimonio(ss.getSheetByName('Patrimonio'));
  setupDecisor(ss.getSheetByName('Decisor'));

  ss.setActiveSheet(ss.getSheetByName('Dashboard'));
  SpreadsheetApp.flush();
  Browser.msgBox('Finance Tracker listo. A ahorrar!');
}

// ─── HELPERS ──────────────────────────────────────────────────────────────

function hdr(s, row, cols, text) {
  s.getRange(row, 1, 1, cols).merge()
   .setValue(text)
   .setBackground(C_HDR).setFontColor(C_HDR_TXT)
   .setFontWeight('bold').setHorizontalAlignment('center').setFontSize(12);
}

function sub(s, row, cols, text) {
  s.getRange(row, 1, 1, cols).merge()
   .setValue(text).setBackground('#e8f5e9').setFontWeight('bold').setFontSize(11);
}

function cols(s, row, headers, bg) {
  headers.forEach(function(h, i) {
    s.getRange(row, i+1).setValue(h).setFontWeight('bold')
     .setBackground(bg || '#c8e6c9').setHorizontalAlignment('center');
  });
}

function $$(r) { r.setNumberFormat('"$"#,##0.00'); }
function pct(r) { r.setNumberFormat('0.0%'); }

// SUMIFS por mes actual - mucho mas robusto que SUMPRODUCT con MONTH/YEAR
function sumMes(sheet, montoCol) {
  return '=SUMIFS(' + sheet + '!' + montoCol + ':' + montoCol +
         ',' + sheet + '!A:A,">="&' + MES_INI +
         ',' + sheet + '!A:A,"<"&' + MES_FIN + ')';
}

function sumMesCat(sheet, montoCol, cat) {
  return '=SUMIFS(' + sheet + '!' + montoCol + ':' + montoCol +
         ',' + sheet + '!A:A,">="&' + MES_INI +
         ',' + sheet + '!A:A,"<"&' + MES_FIN +
         ',' + sheet + '!B:B,"' + cat + '")';
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────

function setupDashboard(s) {
  s.clear();
  s.setColumnWidth(1, 240);
  s.setColumnWidth(2, 190);
  s.setColumnWidth(3, 190);
  s.setColumnWidth(4, 190);
  s.setRowHeight(1, 45);

  s.getRange('A1:D1').merge()
   .setValue('FINANCE TRACKER - HERNANDO')
   .setBackground(C_HDR).setFontColor(C_ACCENT)
   .setFontSize(15).setFontWeight('bold')
   .setHorizontalAlignment('center').setVerticalAlignment('middle');

  sub(s, 3, 4, 'META DE AHORRO');

  // Bloque de progreso
  var lbl = function(r, text) { s.getRange(r,1).setValue(text).setFontWeight('bold'); };

  lbl(4,  'Meta total:');
  s.getRange(4,2).setValue(META); $$(s.getRange(4,2));

  lbl(5,  'Ahorro acumulado:');
  s.getRange(5,2).setFormula('=Patrimonio!B3'); $$(s.getRange(5,2));

  lbl(6,  'Faltante:');
  s.getRange(6,2).setFormula('=B4-B5'); $$(s.getRange(6,2));

  lbl(7,  '% Completado:');
  s.getRange(7,2).setFormula('=B5/B4');
  pct(s.getRange(7,2));
  s.getRange(7,2).setBackground(C_ACCENT).setFontWeight('bold').setFontSize(13);

  lbl(8,  'Ahorro mensual (objetivo):');
  s.getRange(8,2).setValue(AHORRO_MENSUAL); $$(s.getRange(8,2));

  lbl(9,  'Meses restantes:');
  s.getRange(9,2).setFormula('=ROUNDUP(B6/B8,0)');

  lbl(10, 'Fecha estimada meta:');
  s.getRange(10,2).setFormula('=DATE(YEAR(TODAY()),MONTH(TODAY())+B9,1)');
  s.getRange(10,2).setNumberFormat('MMMM YYYY');

  sub(s, 12, 4, 'MES ACTUAL');

  lbl(13, 'Ingresos del mes:');
  s.getRange(13,2).setFormula(sumMes('Ingresos','C')); $$(s.getRange(13,2));

  lbl(14, 'Gastos del mes:');
  s.getRange(14,2).setFormula(sumMes('Gastos','D')); $$(s.getRange(14,2));

  lbl(15, 'Ahorro separado (objetivo):');
  s.getRange(15,2).setValue(AHORRO_MENSUAL); $$(s.getRange(15,2));

  lbl(16, 'Disponible restante:');
  s.getRange(16,2).setFormula('=B13-B14-B15'); $$(s.getRange(16,2));

  s.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
     .whenNumberLessThan(0).setBackground(C_DANGER)
     .setRanges([s.getRange('B16')]).build()
  ]);

  sub(s, 18, 4, 'GASTOS DEL MES POR CATEGORIA');

  var catList = ['Alimentacion','Higiene','Salud','Casa','Gym','Claude','Ocio','Imprevistos','Caprichos','Tecnologia'];
  catList.forEach(function(cat, i) {
    var r = 19 + i;
    s.getRange(r,1).setValue(cat);
    s.getRange(r,2).setFormula(sumMesCat('Gastos','D',cat));
    $$(s.getRange(r,2));
    if (i % 2 === 1) s.getRange(r,1,1,2).setBackground(C_ALT);
  });

  s.setFrozenRows(1);
}

// ─── INGRESOS ─────────────────────────────────────────────────────────────

function setupIngresos(s) {
  s.clear();
  hdr(s, 1, 5, 'REGISTRO DE INGRESOS');
  cols(s, 2, ['Fecha','Fuente','Monto','Tipo','Notas'], '#c8e6c9');

  var yr = new Date().getFullYear();
  var mn = new Date().getMonth();

  var data = [
    [new Date(yr,mn,15), 'Shokworks', 1500, 'Fijo', ''],
    [new Date(yr,mn,15), 'Jokers',     700, 'Fijo', ''],
    [new Date(yr,mn,30), 'Jokers',     700, 'Fijo', ''],
  ];

  data.forEach(function(row, i) {
    var r = 3 + i;
    s.getRange(r,1).setValue(row[0]).setNumberFormat('dd/MM/yyyy');
    s.getRange(r,2).setValue(row[1]);
    s.getRange(r,3).setValue(row[2]); $$(s.getRange(r,3));
    s.getRange(r,4).setValue(row[3]);
    s.getRange(r,5).setValue(row[4]);
    if (i%2===1) s.getRange(r,1,1,5).setBackground(C_ALT);
  });

  var tot = 3 + data.length + 1;
  s.getRange(tot,1,1,5).setBackground(C_TOTAL);
  s.getRange(tot,1).setValue('TOTAL MES').setFontWeight('bold');
  s.getRange(tot,3).setFormula('=SUM(C3:C'+(tot-1)+')').setFontWeight('bold');
  $$(s.getRange(tot,3));

  s.setColumnWidth(1,120); s.setColumnWidth(2,150); s.setColumnWidth(3,120);
  s.setColumnWidth(4,100); s.setColumnWidth(5,220);
  s.setFrozenRows(2);
}

// ─── GASTOS ───────────────────────────────────────────────────────────────

function setupGastos(s) {
  s.clear();
  hdr(s, 1, 5, 'REGISTRO DE GASTOS');
  cols(s, 2, ['Fecha','Categoria','Descripcion','Monto','Tipo'], '#ffcdd2');

  var yr = new Date().getFullYear();
  var mn = new Date().getMonth();

  // Para agregar gastos nuevos: copiar una fila y editar.
  // Categorias validas: Alimentacion, Higiene, Salud, Casa, Gym, Claude, Ocio, Imprevistos, Caprichos, Tecnologia
  var data = [
    [new Date(yr,mn,1),  'Gym',    'Mensualidad gym',                  15,    'Necesidad'],
    [new Date(yr,mn,1),  'Claude', 'Suscripcion Claude AI',            20,    'Productividad'],
    [new Date(yr,mn,10), 'Salud',  'Ortodoncista - 1er ajuste',        17.50, 'Necesidad'],
    [new Date(yr,mn,24), 'Salud',  'Ortodoncista - 2do ajuste',        17.50, 'Necesidad'],
    [new Date(yr,mn,2),  'Higiene','Higiene personal (shampoo, etc)',   30,    'Necesidad'],
    [new Date(yr,mn,5),  'Casa',   'Limpieza bano (cloro, coletos)',    40,    'Calidad de vida'],
    [new Date(yr,mn,1),  'Casa',   'Contribucion primo',               125,   'Calidad de vida'],
  ];

  data.forEach(function(row, i) {
    var r = 3 + i;
    s.getRange(r,1).setValue(row[0]).setNumberFormat('dd/MM/yyyy');
    s.getRange(r,2).setValue(row[1]);
    s.getRange(r,3).setValue(row[2]);
    s.getRange(r,4).setValue(row[3]); $$(s.getRange(r,4));
    s.getRange(r,5).setValue(row[4]);
    if (i%2===1) s.getRange(r,1,1,5).setBackground(C_ALT);
  });

  s.setColumnWidth(1,120); s.setColumnWidth(2,140); s.setColumnWidth(3,270);
  s.setColumnWidth(4,110); s.setColumnWidth(5,160);
  s.setFrozenRows(2);
}

// ─── PRESUPUESTO ──────────────────────────────────────────────────────────

function setupPresupuesto(s) {
  s.clear();
  hdr(s, 1, 4, 'PRESUPUESTO MENSUAL');
  cols(s, 2, ['Categoria','Presupuesto','Gastado este mes','Diferencia'], '#c8e6c9');

  // [nombre, presupuesto, categoria_gastos o null]
  var items = [
    ['Ahorro (transferir al cobrar)',        2000, null],
    ['Alimentacion',                          250, 'Alimentacion'],
    ['Salud y Ortodoncista',                   35, 'Salud'],
    ['Gym',                                    15, 'Gym'],
    ['Claude suscripcion',                     20, 'Claude'],
    ['Casa (limpieza + contribucion primo)',   165, 'Casa'],
    ['Higiene personal',                       50, 'Higiene'],
    ['Ocio (cine, salidas)',                   20, 'Ocio'],
    ['Imprevistos',                           200, 'Imprevistos'],
    ['Caprichos',                               0, 'Caprichos'],
    ['Tecnologia',                              0, 'Tecnologia'],
  ];

  var cfRules = [];
  items.forEach(function(item, i) {
    var r = 3 + i;
    s.getRange(r,1).setValue(item[0]);
    s.getRange(r,2).setValue(item[1]); $$(s.getRange(r,2));

    if (item[2] === null) {
      s.getRange(r,3).setValue(0);
    } else {
      s.getRange(r,3).setFormula(sumMesCat('Gastos','D',item[2]));
    }
    $$(s.getRange(r,3));

    s.getRange(r,4).setFormula('=B'+r+'-C'+r);
    $$(s.getRange(r,4));

    cfRules.push(SpreadsheetApp.newConditionalFormatRule()
     .whenNumberLessThan(0).setBackground(C_DANGER)
     .setRanges([s.getRange(r,4)]).build());
    cfRules.push(SpreadsheetApp.newConditionalFormatRule()
     .whenNumberGreaterThanOrEqualTo(0).setBackground(C_TOTAL)
     .setRanges([s.getRange(r,4)]).build());

    if (i%2===1) s.getRange(r,1,1,4).setBackground(C_ALT);
  });
  s.setConditionalFormatRules(cfRules);

  var last = 3 + items.length - 1;
  var tot  = last + 2;
  s.getRange(tot,1,1,4).setBackground(C_TOTAL);
  s.getRange(tot,1).setValue('INGRESOS TOTALES').setFontWeight('bold');
  s.getRange(tot,2).setValue(2900).setFontWeight('bold'); $$(s.getRange(tot,2));
  s.getRange(tot,3).setFormula('=SUM(B3:B'+last+')').setFontWeight('bold'); $$(s.getRange(tot,3));
  s.getRange(tot,4).setFormula('=B'+tot+'-C'+tot).setFontWeight('bold'); $$(s.getRange(tot,4));

  s.getRange(tot+2,1,1,4).merge()
   .setValue('El dia que cobres: mueve $2,000 a otra cuenta ANTES de gastar nada.')
   .setBackground(C_WARN).setWrap(true).setFontStyle('italic');

  s.setColumnWidth(1,270); s.setColumnWidth(2,140);
  s.setColumnWidth(3,180); s.setColumnWidth(4,140);
  s.setFrozenRows(2);
}

// ─── WISHLIST ─────────────────────────────────────────────────────────────

function setupWishlist(s) {
  s.clear();
  hdr(s, 1, 6, 'WISHLIST INTELIGENTE');
  cols(s, 2, ['Articulo','Precio','Prioridad','Estado','Semaforo','Notas'], '#b3e5fc');

  var today = new Date();
  var items = [
    ['Limpieza bano (cloro, desinfectante, desengrasante, 2 coletos)', 40, 'Alta', 'Pendiente', 'Salud - comprar ya'],
    ['Higiene personal (jabon, shampoo, acond., desodorante, cremas)', 60, 'Alta', 'Pendiente', 'Necesidad basica'],
    ['Armario plastico para organizar tus cosas',                      55, 'Alta', 'Pendiente', 'Ordena el espacio'],
    ['Aislante techo de zinc (papel reflectivo o similar)',            80, 'Alta', 'Pendiente', 'El calor afecta el sueno'],
    ['Cine',                                                           20, 'Baja', 'Pendiente', 'Max $20 una vez al mes'],
  ];

  var cfRules = [];
  items.forEach(function(item, i) {
    var r = 3 + i;
    s.getRange(r,1).setValue(item[0]);
    s.getRange(r,2).setValue(item[1]); $$(s.getRange(r,2));
    s.getRange(r,3).setValue(item[2]);
    s.getRange(r,4).setValue(item[3]);
    // Semaforo: formula simple sin emojis para evitar errores de encoding
    s.getRange(r,5).setFormula(
      '=IF(D'+r+'="Comprado","COMPRADO",' +
        'IF(C'+r+'="Alta",' +
          'IF(B'+r+'<=50,"COMPRAR YA","ESPERA 72H"),' +
        '"ESPERA 7 DIAS"))'
    );
    s.getRange(r,6).setValue(item[4]);
    if (i%2===1) s.getRange(r,1,1,6).setBackground(C_ALT);

    cfRules.push(SpreadsheetApp.newConditionalFormatRule()
     .whenTextContains('COMPRAR').setBackground('#c8e6c9')
     .setRanges([s.getRange(r,5)]).build());
    cfRules.push(SpreadsheetApp.newConditionalFormatRule()
     .whenTextContains('72H').setBackground(C_WARN)
     .setRanges([s.getRange(r,5)]).build());
    cfRules.push(SpreadsheetApp.newConditionalFormatRule()
     .whenTextContains('7 DIAS').setBackground(C_DANGER)
     .setRanges([s.getRange(r,5)]).build());
    cfRules.push(SpreadsheetApp.newConditionalFormatRule()
     .whenTextContains('COMPRADO').setBackground(C_TOTAL)
     .setRanges([s.getRange(r,5)]).build());
  });
  s.setConditionalFormatRules(cfRules);

  s.setColumnWidth(1,370); s.setColumnWidth(2,90);
  s.setColumnWidth(3,90);  s.setColumnWidth(4,100);
  s.setColumnWidth(5,130); s.setColumnWidth(6,230);
  s.setFrozenRows(2);
}

// ─── PATRIMONIO ───────────────────────────────────────────────────────────

function setupPatrimonio(s) {
  s.clear();
  hdr(s, 1, 3, 'PATRIMONIO MES A MES');
  cols(s, 2, ['Mes','Patrimonio acumulado','Crecimiento'], '#c8e6c9');

  // B3 = ahorro actual. Actualiza este valor cada mes con tu ahorro real.
  // El Dashboard y todas las proyecciones se ajustan automaticamente.
  var today = new Date();
  var cfRules = [];

  for (var i = 0; i < 9; i++) {
    var d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    var r = 3 + i;
    s.getRange(r,1).setValue(d).setNumberFormat('MMMM YYYY');
    if (i === 0) {
      s.getRange(r,2).setValue(AHORRO_INICIAL);
      s.getRange(r,3).setValue('-');
    } else {
      s.getRange(r,2).setFormula('=B'+(r-1)+'+'+AHORRO_MENSUAL);
      s.getRange(r,3).setFormula('=B'+r+'-B'+(r-1));
      $$(s.getRange(r,3));
      s.getRange(r,3).setBackground('#c8e6c9');
    }
    $$(s.getRange(r,2));
    if (i%2===1) s.getRange(r,1).setBackground(C_ALT);

    cfRules.push(SpreadsheetApp.newConditionalFormatRule()
     .whenNumberGreaterThanOrEqualTo(META)
     .setBackground(C_ACCENT).setBold(true)
     .setRanges([s.getRange(r,2)]).build());
  }
  s.setConditionalFormatRules(cfRules);

  s.getRange(13,1,1,3).merge()
   .setValue('Actualiza B3 cada mes con tu ahorro real. Las proyecciones se recalculan automaticamente.')
   .setBackground(C_WARN).setWrap(true).setFontStyle('italic');

  s.setColumnWidth(1,170); s.setColumnWidth(2,210); s.setColumnWidth(3,160);
  s.setFrozenRows(2);
}

// ─── DECISOR ──────────────────────────────────────────────────────────────

function setupDecisor(s) {
  s.clear();
  s.setColumnWidth(1,290); s.setColumnWidth(2,300);

  hdr(s, 1, 2, 'DECISOR DE COMPRAS');

  s.getRange('A3:B3').merge()
   .setValue('Llena los campos en azul - el sistema te dice si comprar o esperar')
   .setBackground(C_WARN).setHorizontalAlignment('center').setFontStyle('italic');

  var inputs = [
    [5,  'Articulo que quieres comprar:',       'Escribe aqui'],
    [6,  'Precio estimado ($):',                0],
    [7,  'Mejora tu SALUD (1=nada, 5=mucho):',  3],
    [8,  'Mejora tu PRODUCTIVIDAD (1-5):',       3],
    [9,  'Mejora tu COMODIDAD diaria (1-5):',    3],
    [10, 'Dias que llevas queriendolo:',         1],
  ];

  inputs.forEach(function(row) {
    s.getRange(row[0],1).setValue(row[1]).setFontWeight('bold');
    var cell = s.getRange(row[0],2);
    cell.setValue(row[2]).setBackground(row[0]===5 ? C_WARN : C_INFO);
    if (row[0] === 6) $$(cell);
    if (row[0] >= 7) cell.setNumberFormat('0');
  });

  s.getRange(12,1).setValue('Puntaje (0-10):').setFontWeight('bold');
  s.getRange(12,2)
   .setFormula('=MIN(10,ROUND(((B7+B8+B9)/3)*1.5+IF(B6<=20,3,IF(B6<=100,1,0))+IF(B10>=7,2,IF(B10>=3,1,0)),1))')
   .setBackground('#e8eaf6').setFontWeight('bold');

  s.getRange(14,1).setValue('VEREDICTO:').setFontWeight('bold').setFontSize(14);
  s.getRange(14,2)
   .setFormula(
     '=IF(B6<=20,"COMPRAR - menos de $20 sin culpa",' +
       'IF(B12>=7.5,"COMPRAR - Vale la pena",' +
         'IF(B12>=5,"ESPERA 72 horas y decide de nuevo",' +
           'IF(B10>=7,"Llevas 7 dias - ya no es impulso",' +
             '"ESPERA - No es prioritario ahora"))))'
   )
   .setFontWeight('bold').setFontSize(12);

  s.setConditionalFormatRules([
    SpreadsheetApp.newConditionalFormatRule()
     .whenTextContains('COMPRAR').setBackground('#c8e6c9').setBold(true)
     .setRanges([s.getRange('B14')]).build(),
    SpreadsheetApp.newConditionalFormatRule()
     .whenTextContains('72 horas').setBackground(C_WARN)
     .setRanges([s.getRange('B14')]).build(),
    SpreadsheetApp.newConditionalFormatRule()
     .whenTextContains('ESPERA -').setBackground(C_DANGER)
     .setRanges([s.getRange('B14')]).build(),
  ]);

  hdr(s, 16, 2, 'REGLA DE LOS 3 NIVELES');
  [
    ['$0 - $20',    'Compra sin culpa, no necesitas pensarlo'],
    ['$20 - $100',  'Espera 72 horas. Si aun lo quieres, compralo'],
    ['Mas de $100', 'Espera 7 dias. Evalua el impacto real en tu vida'],
  ].forEach(function(row, i) {
    var r = 17+i;
    s.getRange(r,1).setValue(row[0]).setFontWeight('bold');
    s.getRange(r,2).setValue(row[1]);
    if (i%2===1) s.getRange(r,1,1,2).setBackground(C_ALT);
  });

  hdr(s, 21, 2, 'CATEGORIAS - VELOCIDAD DE COMPRA');
  [
    ['COMPRA INMEDIATA', 'Higiene, Salud, Comida, Gym, Claude, Ortodoncista, Limpieza bano'],
    ['72 HORAS',         'Armario, Ropa util, Salidas, Decoracion, Articulos $20-$100'],
    ['7 DIAS',           'Electronicos, Suscripciones nuevas, Cualquier compra mayor a $100'],
  ].forEach(function(row, i) {
    var r = 22+i;
    s.getRange(r,1).setValue(row[0]).setFontWeight('bold');
    s.getRange(r,2).setValue(row[1]);
    if (i%2===1) s.getRange(r,1,1,2).setBackground(C_ALT);
  });

  s.setFrozenRows(1);
}
