<?php
    if(!isset($_GET["number"])) {
        die("There is no input number");
    }
    //die(phpinfo());
  //Configuration
  $access = "CCEB25A7F6614C23";
  $userid = "saescapa";
  $passwd = "Kestrak123";
  $wsdl = "wsdl/Track.wsdl";
  $operation = "ProcessTrack";
  $endpointurl = 'https://onlinetools.ups.com/ups.app/xml/Track'; //https://onlinetools.ups.com/ups.app/xml/Track or https://wwwcie.ups.com/webservices/Track
  $outputFileName = "XOLTResult.xml";

  function processTrack()
  {
      //create soap request
    $req['RequestOption'] = '15';
    $tref['CustomerContext'] = 'Add description here';
    $req['TransactionReference'] = $tref;
    $request['Request'] = $req;
    $request['InquiryNumber'] = $_GET["number"];
 	$request['TrackingOption'] = '02';

 	//echo "Request.......\n";
	//print_r($request);
    //echo "\n\n";
    return $request;
  }

  try
  {

    $mode = array
    (
         'soap_version' => 'SOAP_1_1',  // use soap 1.1 client
         'trace' => 1
    );

    // initialize soap client
  	$client = new SoapClient($wsdl , $mode);

  	//set endpoint url
  	$client->__setLocation($endpointurl);


    //create soap header
    $usernameToken['Username'] = $userid;
    $usernameToken['Password'] = $passwd;
    $serviceAccessLicense['AccessLicenseNumber'] = $access;
    $upss['UsernameToken'] = $usernameToken;
    $upss['ServiceAccessToken'] = $serviceAccessLicense;

    $header = new SoapHeader('http://www.ups.com/XMLSchema/XOLTWS/UPSS/v1.0','UPSSecurity',$upss);
    $client->__setSoapHeaders($header);


    //get response
  	$resp = $client->__soapCall($operation ,array(processTrack()));

    //get status
    //echo "Response Status: " . $resp->Response->ResponseStatus->Description ."\n";

    //save soap request and response to file
    $fw = fopen($outputFileName , 'w');
    fwrite($fw , "<?xml version=\"1.0\" encoding=\"UTF-8\"?> \n" . $client->__getLastResponse() . "\n");
    fclose($fw);
    //echo "<br> Request:<br>";
    //print_r("<?xml version=\"1.0\" encoding=\"UTF-8\" \n" . $client->__getLastResponse() . "\n");
    header('Content-type: text/xml');
    echo $client->__getLastResponse();
  }
  catch(Exception $ex)
  {
	  /* print_r($ex); */
    header('Content-type: text/xml');
    echo "<xml>Error</xml>";
  }
?>