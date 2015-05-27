call.Answer();

// request status from StatusPage.io API
var response = sys.Web("https://api.statuspage.io/v1/pages/" + config.GetKeyValue("StatusPageId") + "/components.json", "GET", {
		Headers: ["Authorization: OAuth " + config.GetKeyValue("StatusPageKey")]
	});
	
// Check response code
if(response.StatusCode = 200) {
	var respObj = JSON.parse(response.ResponseBody);
	var issueFound = false;
	
	// look through each StatusPage component for a status other than Operational
	respObj.every(function(comp, index, array) {
		if(comp.status != "operational") {
			if(issueFound)
				call.Say("Also, ");
			call.Say("We are experiencing " + comp.status.replace("_", " ") + " on " + comp.name);
			issueFound = true;
		}
		return true;
	});
	
	if(!issueFound) {
		call.Say("We are not currently experiencing any known issues on our network.");
	}else{
		call.Say("If your call is regarding any of these issues, are engineers are aware of them and working to resolve them.");
		call.Say("Otherwise, please hold the line and we'll connect you to a member of our support team as soon as possible");
	}	
}

call.Hangup();
