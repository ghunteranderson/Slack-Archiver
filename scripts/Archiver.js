/**
 * Top level function ran by trigger once a month to archive standup files.
 */
function archiveStandups() {
  // Get parent folder
  var id = SpreadsheetApp.getActiveSpreadsheet().getId()
  var parent = DriveApp.getFileById(id).getParents().next();

  // Get date for month being archived
  var last_month_date = new Date();
  last_month_date.setMonth(last_month_date.getMonth() - 1);

  // Get files to move
  files = getLastMonthsStandups(parent, last_month_date);

  // Get destination
  destination = createArchiveFolder(parent, last_month_date);

  // Perform transfer
  transferFiles(parent, destination, files);
}


/**
 * Get a list of files all files that have not been archived for a given month.
 * @param {Folder} parent - Folder containing all unarchived standups
 * @param {Date} date - Date for the month of standups to pull
 * @return {File[]} - An array of all unarchived files for the given month
 */
function getLastMonthsStandups(parent, date) {
  var file_name_prefix = Utilities.formatDate(date, "CTS", "yyyy-MM");
  var all_files = parent.getFiles();
  var standup_files = [];

  while (all_files.hasNext()) {
    file = all_files.next();
    if (file.getName().indexOf(file_name_prefix) == 0)
      standup_files.push(file);
  }

  return standup_files;
}


/**
 * Create current archive folder. If any folder already exists, it is not
 * recreated.
 * @param {Folder} parent - Folder containing archives
 * @param {Date} date - Date for the month of archive folder
 */
function createArchiveFolder(parent, date) {
  // Get strings for folder names
  var year = Utilities.formatDate(date, "CTS", "YYYY")
  var month_as_number = Utilities.formatDate(date, "CTS", "MM");
  var month_name = Utilities.formatDate(date, "CTS", "MMMMM");
  // Access (or create) folders
  var year_folder = getOrCreateFolder(parent, year);

  return month_folder = getOrCreateFolder(year_folder, Utilities.formatString("%s %s %s", month_as_number, month_name, year));
}


/**
 * Get a folder from a parent by name. If the folder is not there, create it.
 * @param {Folder} parent - Direct parent of requested folder
 * @param {string} name - Name of the folder requested
 */
function getOrCreateFolder(parent, name) {
  folder_iterator = parent.getFoldersByName(name);
  if (folder_iterator.hasNext())
    return folder_iterator.next();
  else
    return parent.createFolder(name);
}


/**
 * Move all files from parent to destination. Files will no loger exist in parent.
 * @param {Folder} parent - Parent folder they will be moved from. Note that files can have multiple parents
 * @param {Folder} destination - New location of files (new parent)
 * @param {File[]} files - Array of files to transfer
*/
function transferFiles(parent, destination, files) {
  for (var i = 0; i < files.length; i++) {
    destination.addFile(files[i]);
    parent.removeFile(files[i]);
  }
}
