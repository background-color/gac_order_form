var SHEET_ID = "";

function doGet(e) {
  var action = e.parameter.a;
  var sh = new orderSheetClass();
  var rtn;

  switch(action){
    case 'user':
      var users = sh._find('user');
      rtn = users[e.parameter.id];
      break;
    case 'item':
      rtn = sh._find('item');
      break;
    case 'order':
      break;
  };

  rtn = ContentService.createTextOutput(JSON.stringify(rtn));
  rtn.setMimeType(ContentService.MimeType.TEXT);
  return rtn;
}


/*
* OrderSheetClass
*/
var orderSheetClass = function(){
  this.sheet_id = SHEET_ID;

}

orderSheetClass.prototype._find = function(sheet_name) {
  var sheet = SpreadsheetApp.openById(this.sheet_id).getSheetByName(sheet_name);
  if(!sheet) return false;
  var last_row = sheet.getLastRow();
  var last_col = sheet.getLastColumn();
  var rows = sheet.getRange(1, 1, last_row, last_col).getValues();
  var keys = rows[0];
  var sheet_data = {};
  for (var i = 1, l = rows.length; i < l; i++) {
    var row = rows[i];
    var row_hash = {}
    row.map(function(item, index) {
      row_hash[keys[index]] = item;
    });
    sheet_data[row[0]] = row_hash;
  }
  return sheet_data;
}
