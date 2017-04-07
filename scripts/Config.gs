//USER_NAMES = {};
PROPS = {};

function init_config(){
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  // Load general properties
  var props_sheet = spreadsheet.getSheetByName("properties");
  load_props_from_sheet(props_sheet, 50, PROPS);
  
  // Load user names
  //var users_sheet = spreadsheet.getSheetByName("users");
  //load_props_from_sheet(users_sheet, 50, USER_NAMES);
  
  //Logger.log(USER_NAMES);
  Logger.log(PROPS);

}

function load_props_from_sheet(sheet, maxsize, container){
  
  var props_grid = sheet.getRange(1, 1, maxsize, 2).getDisplayValues();
  for(var i=0; i<maxsize; i++){
    if(props_grid[i][0] != "")
      container[props_grid[i][0]] = props_grid[i][1];
  }
}
