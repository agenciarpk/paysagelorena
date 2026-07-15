/**
 * Paysage Lorena — captura de leads do formulário da LP → Google Sheets.
 *
 * Este script deve ficar VINCULADO a uma planilha do Google Sheets
 * (criado por Extensões > Apps Script dentro da planilha).
 *
 * Publicação (uma vez):
 *   Implantar > Nova implantação > Tipo: "App da Web"
 *     - Executar como: Eu (sua conta)
 *     - Quem pode acessar: Qualquer pessoa
 *   Copie a URL que termina em /exec e cole em
 *   assets/js/main.js  →  var LEAD_ENDPOINT = '...'
 */

var SHEET_NAME = 'Leads';
var HEADERS = ['Data/Hora', 'Nome', 'E-mail', 'Telefone', 'Tipologia', 'Mensagem', 'Origem'];

function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try { data = JSON.parse(e.postData.contents); }
      catch (err) { data = (e && e.parameter) || {}; }
    } else {
      data = (e && e.parameter) || {};
    }

    getSheet_().appendRow([
      new Date(),
      data.nome || '',
      data.email || '',
      data.telefone || '',
      data.interesse || '',
      data.mensagem || '',
      data.origem || 'paysagelorena.com.br'
    ]);

    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/* Permite testar a URL no navegador (deve responder um JSON de status). */
function doGet() {
  return json_({ ok: true, service: 'paysage-leads' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
