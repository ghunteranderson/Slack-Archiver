/**
 * An object of properties (key/value pairs) initialized by calling
 * init_config()
 */
PROPS = {};

/**
 * Pulls properties from the spreadsheet's 'properties' tab. Note that there
 * should not be empty rows in the 'properties' tab before the last entry.
 */
function init_config() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();

  // Load general properties
  var props_sheet = spreadsheet.getSheetByName("properties");
  load_props_from_sheet(props_sheet, 50, PROPS);

  //Logger.log(USER_NAMES);
  Logger.log(PROPS);
}

/**
 * Read key/value properties from a spreadsheet and add them to an object as
 * attributes.
 * @param {Spreadsheet} sheet - Sheet (tab) that contains properties
 * @param {int} maxsize - the maximum number of properties to load
 * @param {object} container - the object inwhich to assign the attributes
 */
function load_props_from_sheet(sheet, maxsize, container) {
  var props_grid = sheet.getRange(1, 1, maxsize, 2).getDisplayValues();
  for (var i = 0; i < maxsize; i++) {
    if (props_grid[i][0] != "")
      container[props_grid[i][0]] = props_grid[i][1];
  }
}