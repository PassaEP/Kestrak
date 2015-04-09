<?php
	$request = xmlrpc_encode_request("method", array(1, 2, 3));
	$context = stream_context_create(array('http' => array(
	    'method' => "POST",
	    'header' => "Content-Type: text/xml",
	    'content' => $request
	)));
	$file = file_get_contents("http://www.example.com/xmlrpc", false, $context);
?>

<html>
	<head>
	</head>
	<body>
		TEst123
	</body>
</html>