/**
 * Riads — Google Sheets webhook
 * Column layout (must match your sheet row 1):
 * date_order | full_name | phone | address | sku | qte | price | note
 *
 * note = orderid | product names (used for upsert / dedupe)
 */

const SPREADSHEET_ID = '1noCh6q_Q-G-fnFWUoPdiHJ7aVL-9r2BMdHTI2xrVl1I';
const SHEET_NAME = '';
const ORDER_ID_COLUMN = 8; // note (contains orderid)

function doGet() {
  return jsonResponse({ ok: true, message: 'Riads webhook is live', spreadsheet_id: SPREADSHEET_ID }, 200);
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(15000);
    const body = parseBody_(e);
    const sheet = getTargetSheet_();
    ensureHeader_(sheet);

    const orderid = String(body.orderid || body.order_id || '').trim();
    const row = buildRow_(body, orderid);
    const result = upsertOrderRow_(sheet, orderid, row);

    return jsonResponse({ ok: true, orderid: orderid, action: result.action }, 200);
  } catch (error) {
    return jsonResponse({ ok: false, error: String(error) }, 500);
  } finally {
    try {
      lock.releaseLock();
    } catch (_) {}
  }
}

function parseBody_(e) {
  const raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
  return JSON.parse(raw || '{}');
}

function getSpreadsheet_() {
  if (!SPREADSHEET_ID) throw new Error('SPREADSHEET_ID is empty');
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function formatPrice_(value, currency) {
  if (value === null || value === undefined || value === '') return '';
  var text = String(value).trim();
  if (/[A-Za-z\u0600-\u06FF]/.test(text)) return text;
  var n = Number(value);
  if (isNaN(n)) return text;
  var code = String(currency || 'SAR').trim() || 'SAR';
  return String(Math.round(n)) + ' ' + code;
}

function buildRow_(data, orderid) {
  var product = data.product || '';
  var note = orderid;
  if (product) note = orderid + ' | ' + product;

  var rawPrice = data.total_price != null ? data.total_price : (data.total_mad != null ? data.total_mad : '');

  return [
    data.date || '',
    data.name || data.customer_name || '',
    data.phone || data.phone_raw || '',
    data.country || data.address || 'Morocco',
    data.sku || '',
    data.quantity || data.qte || '',
    formatPrice_(rawPrice, data.currency || 'SAR'),
    note
  ];
}

function upsertOrderRow_(sheet, orderid, row) {
  if (orderid) {
    var existingRow = findOrderRow_(sheet, orderid);
    if (existingRow > 0) {
      sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
      return { action: 'updated' };
    }
  }
  sheet.appendRow(row);
  return { action: 'inserted' };
}

function findOrderRow_(sheet, orderid) {
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return -1;

  var numRows = lastRow - 1;
  var cells = sheet.getRange(2, ORDER_ID_COLUMN, numRows, 1).getValues();
  for (var i = 0; i < cells.length; i++) {
    var text = String(cells[i][0] || '').trim();
    if (text === orderid || text.indexOf(orderid + ' |') === 0) {
      return i + 2;
    }
  }
  return -1;
}

function getTargetSheet_() {
  var ss = getSpreadsheet_();
  if (SHEET_NAME) {
    return ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  }
  return ss.getSheets()[0];
}

function ensureHeader_(sheet) {
  var headers = getHeaders_();
  var firstRow = sheet.getRange(1, 1, 1, headers.length).getValues()[0];
  var hasHeader = firstRow.some(function (cell) {
    return String(cell || '').trim() !== '';
  });
  if (!hasHeader) {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
  }
}

function getHeaders_() {
  return ['date_order', 'full_name', 'phone', 'address', 'sku', 'qte', 'price', 'note'];
}

function jsonResponse(payload, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(Object.assign({ status: statusCode }, payload)))
    .setMimeType(ContentService.MimeType.JSON);
}
