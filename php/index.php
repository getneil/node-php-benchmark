<?php
  require 'vendor/autoload.php';

  $app  = new Phluid\App();
  $conn = mysqli_connect("192.168.9.5", "root", "test", "benchmark", 4003);
  if (mysqli_connect_errno()) {
    die("Error connecting " . mysqli_error($conn));
  } else {
    echo 'DB Connected successfully';
  }

  // add some handlers

  $app->get('/list', function( $request, $response ) use ($conn) {
    $qry    = "SELECT * FROM user;";
    $result = $conn->query($qry);
    $data   = array();
    while($row = mysqli_fetch_array($result)) {
      $data[] = $row;
    }
    $response->renderText(json_encode($data));
  });

  $app->post('/create', function( $request, $response )  use ($conn) {
    $body = "";
    $request->on( 'data', function ($data) use (&$body) {
      $body .= $data;
    });
    $request->on( 'end', function () use (&$body, $response, $conn) {
      $data = json_decode($body);
      $hash = new Illuminate\Hashing\BcryptHasher();
      if(!$data->email && !$data->password)
      {
        $response->renderText("Missing arguments");
      }
      var_dump($data->email);
      $firstName   = ($data->firstName) ? $data->firstName : " ";
      $lastName    = ($data->lastName) ? $data->lastName : " ";
      $description = ($data->description) ? $data->description : " ";
      $qry         = sprintf("INSERT INTO user (email, password, firstName, lastName, description) VALUES ('%s', '%s', '%s', '%s', '%s')", $data->email, $hash->make($data->password, array("rounds" => 12)), $firstName, $lastName, $description);
      $result      = $conn->query($qry);
      if(!$result) {
        die("Failed insertion: ". mysql_error());
      }
      $response->renderText("Created");
    });
  });

  $app->listen( 4000 );