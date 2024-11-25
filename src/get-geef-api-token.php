<?php

if ( ! function_exists('curl_init')) {
  die ('Curl PHP package not installed');
}

$environments = array();

$environments['dev'] = [
  'api_url'    => 'http://api.geef.test/oauth/v2/login',
  'api_params' => [
    'client_id'     => '6_2m5ucapvup448o4wk04cssw8c448wc44wogck0gc04g40c48k0',
    'client_secret' => '2i9o70im49q8wow4oksowkw4cwcssoo084c4okc08cs00ws88c',
    'grant_type'    => 'client_credentials',
  ],
];

$environments['test'] = [
  'api_url'    => 'https://testomgeving.geef.nl/oauth/v2/login',
  'api_params' => [
    'client_id'     => '6_2m5ucapvup448o4wk04cssw8c448wc44wogck0gc04g40c48k0',
    'client_secret' => '2i9o70im49q8wow4oksowkw4cwcssoo084c4okc08cs00ws88c',
    'grant_type'    => 'client_credentials',
  ],
];
//
//$environments['test.onlinecollecteren.nl'] = [
//  'api_url'    => 'https://testomgeving.geef.nl/oauth/v2/login',
//  'api_params' => [
//    'client_id'     => '6_2m5ucapvup448o4wk04cssw8c448wc44wogck0gc04g40c48k0',
//    'client_secret' => '2i9o70im49q8wow4oksowkw4cwcssoo084c4okc08cs00ws88c',
//    'grant_type'    => 'client_credentials',
//  ],
//];

$environments['prod'] = [
  'api_url'    => 'https://api.geef.nl/oauth/v2/login',
  'api_params' => [
    'client_id'     => '5_5t29x09ueloog0s4gsokggkocswo00k8owckkkg8cscc0k8k00',
    'client_secret' => '2r73q7wu66yoo4c4gg4wgw4o4cgcss4kko0sgss8k0cgs4os8',
    'grant_type'    => 'client_credentials',
  ],
];

//$currHost = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : null;
//if ($currHost === null) {
//  exit;
//}
//
//if ( ! array_key_exists($currHost, $environments)) {
//  exit;
//}

$env = $_GET['env'] ?? null;
if ($env === null) {
  exit;
}
unset($_GET['env']);

$env    = $environments[$env];
$params = $env['api_params'];

// GET params
if (isset($_GET) && ! empty($_GET)) {
  $params = array_merge($params, $_GET);
}

// POST params (regular)
if (isset($_GET) && ! empty($_GET)) {
  $params = array_merge($params, $_POST);
}

// JSON post?
$json     = file_get_contents('php://input');
$jsonPost = json_decode($json, true);
if ($jsonPost !== null) {
  $params = array_merge($params, $jsonPost);
}

$url = $env['api_url'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_VERBOSE, 1);
curl_setopt($ch, CURLOPT_HEADER, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $params);

$response = curl_exec($ch);

$http_code   = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
$header      = substr($response, 0, $header_size);
$headers     = explode(PHP_EOL, $header);
$body        = substr($response, $header_size);

function cloneHeaders($headers)
{
  foreach ($headers as $header) {
    if (0 === strpos($header, 'Content-Length')) {
      continue;
    }
    if (0 === strpos($header, 'X-Powered-By')) {
      continue;
    }
    if (0 === strpos($header, 'Server')) {
      continue;
    }
    if (0 === strpos($header, 'HTTP/1.1 100')) {
      continue;
    }
    if (0 === strpos($header, 'Transfer-Encoding')) {
      continue;
    }

    header($header);
  }
}

if ($http_code !== 200) {
  cloneHeaders($headers);
  echo $body;
  exit;
}

$data = json_decode($body, true);
cloneHeaders($headers);

echo json_encode($data);
