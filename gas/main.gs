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
  };

  return set_mine_type(rtn);
}

function doPost(e) {
  var user_id = e.parameter.user_id;
  var total_amount = e.parameter.total_amount;
  var items = [];
  var sh = new orderSheetClass();
  var rtn;

  for (var i = 1; i <= 10; i++) {
    items[i] = e.parameter["item_"+i];
  }

  if(!user_id || !total_amount){
    rtn = {is_success: false, error: "呼び出し方法が正しくありません"};
    return set_mine_type(rtn);
  }

  var id = sh._insert_order('order', user_id, total_amount, items);
  rtn = {is_success: true, id: id};
  return set_mine_type(rtn);
}

function set_mine_type(rtn){
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


orderSheetClass.prototype._insert_order = function(sheet_name, user_id, total_amount, items) {
  var sheet = SpreadsheetApp.openById(this.sheet_id).getSheetByName(sheet_name);
  if(!sheet) return false;
  var last_row = sheet.getLastRow();
  var today = new Date();

  var rows = [
    last_row,
    user_id,
    today,
    total_amount
  ];

  for (var i = 1, l = items.length; i < l; i++) {
    rows.push(items[i]);
  }

  sheet.getRange(last_row+1, 1, 1, 14).setValues([rows]);
  return last_row
}
