/**
 * Creates runtime spreadsheet templates. If spreadsheet already exist,
 * it will be deleted and recreated... this probably isn't the best
 * approach but it works for now.
*/
function initSpreadsheet(){
  for(var member in initSpreadsheet){
    initSpreadsheet[member]();
  }
  SpreadsheetApp.flush();
}


initSpreadsheet.user = function(){
  var spreadsheet = SpreadsheetApp.getActive();
  var user_sheet = spreadsheet.getSheetByName('user');
  if(user_sheet){
    spreadsheet.deleteSheet(user_sheet);
  }
  var fields = [['key', 'full_name', 'last_active_date', 'user_names']];
  user_sheet =  spreadsheet.insertSheet('user');
  user_sheet.getRange(1, 1, 1, fields[0].length).setValues(fields)
}


initSpreadsheet.props = function(){
  var spreadsheet = SpreadsheetApp.getActive();
  var props_sheet = spreadsheet.getSheetByName('properties')
  if(props_sheet){
    spreadsheet.deleteSheet(props_sheet);
  }
  var fields = [['token'], ['standup_postback_url']];
  props_sheet = spreadsheet.insertSheet('properties');
  props_sheet.getRange(1, 1, fields.length, 1).setValues(fields)
}
