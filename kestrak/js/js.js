 $(document).ready(function (){
	            $("#submit").click(function (){
	                //$(this).animate(function(){
	                    $('html, body').animate({
	                        scrollTop: $("#result").offset().top
	                    }, 900);
	                //});
	            });
	        });
	        function jumpto(anchor){
			    window.location.href = "#"+anchor;
			}
			
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
								if(typeof $package["EventCountry"][x] == "undefined") {
									nothing = {US: "US"};
									for (var propertyName in nothing) {
										$package["EventCountry"][x] = propertyName;
									}
								}
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
							map_address[y] = "Postal+Office+"+$package["EventCity"][y].textContent.replace(" ", "+")+"+"+$package["EventState"][y].textContent+"+"+$package["EventCountry"][y].toString()+"+"+$package["EventZIPCode"][y].textContent;
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
	        
	        // GET EVENTS FROM UPS 

	        function getEventsUPS(id) {
		        the_ids = id;
		        list_Events = [];
		        url = $.get('https://kestrak-saescapa.c9.io/kestrak/php/ups.php?number=' + the_ids + '', function(data) {
			        xml = url.responseText;
			        xmlDoc = $.parseXML(xml),
		            $xml = $(xmlDoc);
		            //console.log($xml.find("Package").find("Activity").find("ActivityLocation").find("PostalCode").contents());
		            if (typeof $xml.find("Description").contents()[1] != "undefined") {
			            console.log("Great start!")
			            $package = [],
			            $package["Event"] = $xml.find("Package").find("Activity").find("Status").find("Description").contents(),
			            $package["EventTime"] = $xml.find("Package").find("Activity").find("Time").contents(),
			            $package["EventDate"] = $xml.find("Package").find("Activity").find("Date").contents(),
			            $package["EventCity"] = $xml.find("Package").find("Activity").find("ActivityLocation").find("City").contents(),
			            $package["EventState"] = $xml.find("Package").find("Activity").find("ActivityLocation").find("StateProvinceCode").contents(),
			            $package["EventCountry"] = $xml.find("Package").find("Activity").find("ActivityLocation").find("CountryCode").contents(),
			            $package["EventZIPCode"] = $xml.find("Package").find("Activity").find("ActivityLocation").find("PostalCode").contents();
						console.log($package);
						//Store all information in one array:
						for (x = 0; x < $package["Event"].length - 1 ; x++) {
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
							map_address[y] = $package["EventCity"][y].textContent.replace(" ", "+")+"+"+$package["EventState"][y].textContent+"+"+$package["EventCountry"][y].textContent;
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
	        
	   
	        function packageInfo() {
		        if($("#packageId").val()) {
			        var packageid = $("#packageId").val(); // SAMPLE: var packageid = "9400110200793451928780";
			        var	pattern_USPS = /\b((420 ?\d\d\d\d\d ?)?(91|93|94|01|03|04|70|23|13)\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d\d\d ?\d\d\d\d( ?\d\d)?)\b/i,
			        	pattern_USPS_2 = /\b((M|P[A-Z]?|D[C-Z]|LK|EA|V[A-Z]|R[A-Z]|CP|CJ|LC|LJ) ?\d\d\d ?\d\d\d ?\d\d\d ?[A-Z]?[A-Z]?)\b/i,
			        	pattern_UPS = /\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/i,
			        	pattern_FEDEX = /\b((96\d\d\d\d\d ?\d\d\d\d|96\d\d|\d\d\d\d) ?\d\d\d\d ?\d\d\d\d( ?\d\d\d)?)\b/i;
			        	
			        var	match_USPS = packageid.match(pattern_USPS),
			        	match_USPS_2 = packageid.match(pattern_USPS_2),
			        	match_UPS = packageid.match(pattern_UPS),
			        	match_FEDEX = packageid.match(pattern_FEDEX);
	    
	   		        if(match_USPS != null || match_USPS_2 != null) {
		   		        console.log("USPS DETECTED!");
		   		        getEventsUSPS(packageid);
						setTimeout(function() { googlemaps(); event_Table(); }, 1000);
						$("#error_1").hide();
						$("#error_2").hide();
					} /*else if(typeof match_USPS_2 != "undefined" && !getEventsUSPS_2(packageid)) {
						
					} */else if(match_UPS != null) {
						console.log("UPS DETECTED!");
						getEventsUPS(packageid);
						setTimeout(function() { googlemaps(); event_Table(); }, 1000);
						$("#error_1").hide();
						$("#error_2").hide();
					} /*else if(typeof match_FEDEX != "undefined" && !getEventsFEDEX(packageid)) {
						
					} */else {
						console.log("ERROR");	
						$("#error_1").show();
					}
				} else {
					$("#error_2").show();
				}
	        }
	        
	        function event_Table() {
			    var table = "";
			    list_Events;
				for (v = 1; v < list_Events.length ; v++) {
					table += "<tr><th scope='row'>" + v + "</th>";
					table += "<td>" + list_Events[v][0].textContent + "</td>";
					table += "<td>" + list_Events[v][2].textContent + "</td>";
					table += "<td>" + list_Events[v][3].textContent + ", " + list_Events[v][4].textContent + ", " + list_Events[v][5] + "</td></tr>";
				};
				$(".table_body").append(table);
			}
	        
			 // list_Events = [ [Action occuring (0), Time (1), Date (2), City (3), State (4), Country (5), ZIP Code (6), Array of Latitudes (7), Array of Longtitudes (8)] ]; 
			 
	        function googlemaps() {
		        console.log("Here we go!");
	        var map = new google.maps.Map(document.getElementById('map'), {
				zoom: 10,
			    center: new google.maps.LatLng(parseFloat(list_Events[0][7][0].textContent), parseFloat(list_Events[0][8][0].textContent)),
			    mapTypeId: google.maps.MapTypeId.ROADMAP
			});

			var infowindow = new google.maps.InfoWindow();
			
			var marker, i;
			
			var flightPlanCoordinates = [];
			for (u = 0; u < list_Events.length; u++) {
				flightPlanCoordinates.push(new google.maps.LatLng(parseFloat(list_Events[u][7][0].textContent), parseFloat(list_Events[u][8][0].textContent)));
			};
			  var flightPath = new google.maps.Polyline({
			    path: flightPlanCoordinates,
			    geodesic: true,
			    strokeColor: '#FF0000',
			    strokeOpacity: 1.0,
			    strokeWeight: 2
			  });
			
			  flightPath.setMap(map);
			  
			  
			for (i = 0; i < list_Events.length; i++) {
				if (i == 0) {
					marker = new google.maps.Marker({
			        	position: new google.maps.LatLng(parseFloat(list_Events[i][7][0].textContent), parseFloat(list_Events[i][8][0].textContent)),
			        	map: map,
			        	icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
					});
				} else if (i == list_Events.length - 1) {
					marker = new google.maps.Marker({
			        	position: new google.maps.LatLng(parseFloat(list_Events[i][7][0].textContent), parseFloat(list_Events[i][8][0].textContent)),
			        	map: map,
			        	icon: 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png'
					});
				} else {
				    marker = new google.maps.Marker({
				        position: new google.maps.LatLng(parseFloat(list_Events[i][7][0].textContent), parseFloat(list_Events[i][8][0].textContent)),
				        map: map
				    });
			    }
			
			    google.maps.event.addListener(marker, 'click', (function(marker, i) {
			        return function() {
			            infowindow.setContent(list_Events[i][3].textContent);
			            infowindow.open(map, marker);
			        }
			    })(marker, i));
			}}