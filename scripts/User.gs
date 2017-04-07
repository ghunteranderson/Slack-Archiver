/**
* User class that holds user information and provides an interface to the datasource
*/
function User(property_array){
  this.user_id = undefined;
  this.full_name = undefined;
  this.active_date = undefined;
  this.new_user = true;
  this.user_name = undefined;
  
  // Insert properties if passed
  if(property_array != undefined){
    this.user_id = property_array[0];
    this.full_name = property_array[1];
    this.active_date = property_array[2];
    this.user_name = property_array[3];
    this.new_user = false;
  }
  /**
  * Save this user back to a given spreadsheet
  */
  this.save = function(spreadsheet){
    // Locate the sheet
    var sheet = SpreadsheetApp.getActive().getSheetByName("users");
    // Locate the row from which the value came
    var row;
    for(row=1; sheet.getRange(row, 1).getValue() != this.user_id
               && sheet.getRange(row, 1).getValue() != "" 
               && row <= User.MAX_USERS; row++){
      var value = sheet.getRange(row, 1).getValue();
      Logger.log(value);
    }
    // Check bounds
    if(row >= User.MAX_USERS && this.new_user)
      throw "Error saving new user. Max limit reached";
    else if(row >= User.MAXUSERS && !this.new_user)
      throw "Error saving existing user, ID not found."
    // Perform save if row was found
    Logger.log("Saving " + this.user_id + " to row " + row + ".");
    sheet.getRange(row, 1).setValue(this.user_id);
    sheet.getRange(row, 2).setValue(this.full_name);
    sheet.getRange(row, 3).setValue(this.active_date);
    sheet.getRange(row, 4).setValue(this.user_name);
    SpreadsheetApp.flush();
  }
  
  /**
  * Test equality (of keys)
  */
  this.equals =  function(user){
    return user instanceof User && user.user_id == this.user_id;
  }
  
  /**
  * Log user info for debugging
  */
  this.log = function(){
    Logger.log("{id: '" + this.user_id + "', name: '" + this.full_name + "', last_active: '" + this.active_date + "'}");
  }
  
  /**
  * Updates the active date timestamp
  */
  this.markActive = function(){
    this.active_date = Utilities.formatDate(new Date(), "CST", "yyyy-MM-dd");
    this.save();
  }
  
  this.activeToday = function(){
    return this.active_date == Utilities.formatDate(new Date(), "CST", "yyyy-MM-dd");
  }
  
}


/* The maxium users that can be loaded from the datasource */
User.MAX_USERS = 50;
User.NUMBER_OF_ATTRIBUTES = 4
/* cache to hold users */
User.cache = undefined;


/** 
* Loads users from datasource. The current cache is trased and replaced with a fresh read
*/
User.loadUsers = function() {
  container = []
  var sheet = SpreadsheetApp.getActive().getSheetByName("users");
  var user_grid = sheet.getRange(2, 1, User.MAX_USERS, User.NUMBER_OF_ATTRIBUTES).getDisplayValues();
  for(var i=0; user_grid[i][0] != "" && i<user_grid.length; i++){
    try{
      container.push(new User(user_grid[i]));
    } catch(e){
      Logger.log("Error while loading user: " + e);
    }
  }
  User.cache = container;
  return container;
}


/**
* Get a pointer to the user cache. If cache is not loaded, the data will first be loaded.
*/
User.getUsers = function(){
  if(User.cache == undefined)
    User.loadUsers();
  return User.cache;
}

/**
* Searches the cache for a user with the given Id.
* Returns undefined if id is not foud
*/
User.findById = function(id){
  if(User.cache == undefined)
    User.loadUsers();
  for(var index=0; index<User.cache.length; index++){
   if(User.cache[index].user_id == id)
     return User.cache[index];
  }
  return undefined;
}




function testDate(){
  users = User.getUsers();
  users[0].markActive();
  users[0].save();
}


