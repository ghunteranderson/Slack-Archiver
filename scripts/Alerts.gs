function sendStandupAlerts() {
  // Do not run on weekends
  if(badTime()){
    Logger.log("Bad time to run alerts. Probably the weekend.");
    return;
  }
  
  
  // Only run if there are late standups
  users = findInactiveUsers();
  if(users.length==0){
    Logger.log("All standups are in on time");
    return;
  }
  
  // Load config
  init_config()
  
  // Create messages
  var message = "Stand up warning: ";
  for(var i=0; i<users.length; i++){
    message += "@" + users[i].user_name;
    if(i < users.length-1)
      message +=  ", ";
  }
  
  // Create payload for options
  var form_data = {
    'text': message,
    'link_names': 1
  };
  
  // Create options for request
  var options = {
    'method' : 'post',
    'payload' : JSON.stringify(form_data)
  };
  
  // Post message
  response = UrlFetchApp.fetch(PROPS["standup_postback_url"], options);
  Logger.log(response.getContentText());
}

// Search for a list of all users who last active date is not today
function findInactiveUsers() {
  users = User.getUsers();
  inactive_users = [];
  for(var i=0; i < users.length; i++){
    if(!users[i].activeToday())
      inactive_users.push(users[i]);
  }
  return inactive_users;
}

// Returns true if it's a bad time to run the script. (ie weekend)
function badTime(){
  // Get day of week as a number
  now = Utilities.formatDate(new Date(), "CTS", "u");
  return now == "6" || now == "7" // True if it is Saturday or Sunday
}
