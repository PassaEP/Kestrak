//GET EVENTS FROM USPS!
function getEventsUSPS(id) {
    the_ids = id;
    list_Events = [];
    url = $.get('http://production.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=<TrackFieldRequest USERID="085TEENH3886"><TrackID ID="' + the_ids + '"></TrackID></TrackFieldRequest>', function(data) {
        xml = url.responseText;
        xmlDoc = $.parseXML(xml),
        $xml = $(xmlDoc);
        if (typeof $xml.find("EventTime").contents()[1] != "undefined") {
            console.log("Great start!")
            $package = [],
            $package["Event"] = $xml.find("Event").contents(),
            $package["EventTime"] = $xml.find("EventTime").contents(),
            $package["EventDate"] = $xml.find("EventDate").contents(),
            $package["EventCity"] = $xml.find("EventCity").contents(),
            $package["EventState"] = $xml.find("EventState").contents(),
            $package["EventCountry"] = $xml.find("EventCountry").contents(),
            $package["EventZIPCode"] = $xml.find("EventZIPCode").contents();
			
			//Store all information in one array:
			for (x = 0; x < $package["Event"].length; x++) {
				if(typeof $package["EventTime"][x] != "undefined") {
					list_Events[x] = [];
					list_Events[x].push($package["Event"][x]),
					list_Events[x].push($package["EventTime"][x]),
					list_Events[x].push($package["EventDate"][x]),
					list_Events[x].push($package["EventCity"][x]),
					list_Events[x].push($package["EventState"][x]),
					list_Events[x].push($package["EventCountry"][x]),
					list_Events[x].push($package["EventZIPCode"][x]);
				} else {
					break;
				}
			};
			
			//Get all the addresses in one array:
			map_address = [];
			for (y = 0; y < list_Events.length; y++) {
				map_address[y] = "Postal+Office+"+$package["EventCity"][y].textContent.replace(" ", "+")+"+"+$package["EventState"][y].textContent+"+"+$package["EventCountry"][y].textContent+"+"+$package["EventZIPCode"][y].textContent;
			};
			
			//Get all coordinates (Lat, lng):
			for (z=0; z < map_address.length; z++) {
				map_url = 'https://maps.googleapis.com/maps/api/geocode/xml?address=' + map_address[z] + '&key=AIzaSyB-tsoyzmUQOvsKAk8CjwG-QYFEFNg1FTY';
				var request = new XMLHttpRequest();
				request.open("GET", map_url, false);
				request.send();
				map_xmls = request.responseXML;
				$map_xml = $(map_xmls);
				list_Events[z].push($map_xml.find("lat").contents()),
				list_Events[z].push($map_xml.find("lng").contents());
			};
			console.log("waw");
			$error = false;
			$("#error_1").hide();
			$("#error_2").hide();
	    } else {
			console.log("Error");
			$error = true;
			$("#error_1").show();
	    };
	    console.log($error);
	    if($error) {
		    console.log("true");
		    return false;
		    $("#error_1").show();
	    } else {
		    console.log("false");
		    return true;
		    $("#error_1").hide();
			$("#error_2").hide();
	    };
    });
}