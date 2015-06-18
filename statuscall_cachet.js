// Status Array
var cachetStatus = ["Operational", "Performance Issues", "Partial Outage", "Major Outage"];


call.Answer();

// request status from StatusPage.io API
var response = sys.Web(config.GetKeyValue("CachetUrl") + "/api/v1/components", "GET", {});
sys.Log("Response status code: " + response.StatusCode);

// Check response code
if(response.StatusCode = 200) {
	var respObj = JSON.parse(response.ResponseBody);
	var issueFound = false;
	
	// look through each StatusPage component for a status other than Operational
	respObj.data.every(function(comp, index, array) {
		if(comp.status > 1) {
			if(issueFound)
				call.Say("Also, ");
			call.Say("We are experiencing " + cachetStatus[comp.status - 1] + " on " + comp.name);
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
