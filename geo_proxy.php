<?php
// PHP Proxy example for Yahoo! Web services.
// Original author: Jason Levitt, December 7th, 2005
// Modified by Richard Clark, April 26, 2012

// Allowed hostname (api.local and api.travel are also possible here)
define ('HOSTNAME', 'http://glocal.research.yahoo.com/geo-location/rest-api/rest.php/');

// Get the REST call path from the AJAX application
$query = $_GET['query'];
$url = HOSTNAME.'?query='.$query;

// Open the Curl session
$session = curl_init($url);

// Don't return HTTP headers. Do return the contents of the call
curl_setopt($session, CURLOPT_HEADER, false);
curl_setopt($session, CURLOPT_RETURNTRANSFER, true);

// Make the call
$xml = curl_exec($session);

// The web service returns XML. Set the Content-Type appropriately
header("Content-Type: text/xml");

echo $xml;
curl_close($session);

?>
