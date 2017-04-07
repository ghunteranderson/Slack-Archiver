// Route to doGet
function doPost(e) {
  return doGet(e)
}


// Prepare to catch error and dispatch action to doStandup
function doGet(e) {
  init_config();
  return doStandup(e);
}


function doStandup(e) {
  // Verify that API token is correct
  if (e.parameters["token"] != PROPS["token"])
    throw "ERROR: Authentication error. Bad token";

  // Pull out the message
  var text = e.parameters["text"];
  if (text == undefined)
    throw "ERROR: Missing parameter text";
  // Pull out the User ID
  var user_id = e.parameters["user_id"];
  if (user_id == undefined)
    throw "ERROR: Missing parameter user_id";


  // Resolve who the user is
  var user = User.findById(user_id);
  if (user == undefined) {
    Logger.log("Unkown user. Recording in datasource." + e);
    user = new User();
    user.user_id = user_id;
    user.full_name = e.parameters["user_name"];
    user.user_name = e.parameters["user_name"];
    user.save();
  }

  // Write Standup
  Logger.log("RECEIVED: " + user.full_name + ": " + text);
  writeMessage(user, text);
  user.markActive();
  return ContentService.createTextOutput("Standup logged successfully.");
}


function writeMessage(user, message) {
  var file = getCurrentDoc();
  var body = DocumentApp.openById(file.getId()).getBody();
  body.appendParagraph(user.full_name + ": " + message + "\n");

  //var text = body.editAsText();
  //var name = text.findText(user.user_name + ":");
  //name.getElement().asText().setBold(name.getStartOffset(), name.getEndOffsetInclusive(), true);
}

function getCurrentDoc() {
  var sheet_id = SpreadsheetApp.getActiveSpreadsheet().getId();
  var parentFolderFind = DriveApp.getFileById(sheet_id).getParents();
  var parentFolderId = parentFolderFind.next().getId();

  // Get folder by id
  var parentFolder = DriveApp.getFolderById(parentFolderId);

  // Search for file
  var files = parentFolder.getFilesByName(todaysFileName());

  while (files.hasNext()) {
    return files.next();
  }
  return createNewFile(parentFolder, todaysFileName());

}

function todaysFileName() {
  return Utilities.formatDate(new Date(), "CST", "yyyy-MM-dd");
}

function createNewFile(parentFolder, filename) {
  doc = DocumentApp.create(filename);
  file = DriveApp.getFileById(doc.getId());

  // Move file from old folder to new
  sourceFolder = file.getParents().next();
  parentFolder.addFile(file);
  sourceFolder.removeFile(file);

  formatNewDocument(doc);

  return file;
}

function formatNewDocument(doc) {
  return
}

function test() {
  e = {
    "parameters": {
      "user_name": "ghunteranderson",
      "token": "JoGppGNvXhxmEU2lwJU4714a",
      "user_id": "123",
      "text": "Testing the script"
    }
  };

  doGet(e);
}