<?php
  require 'vendor/autoload.php';

  $app  = new Phluid\App();
  $conn = mysqli_connect(getenv("MYSQL_PORT_3306_TCP_ADDR"), "root", "test", "benchmark", getenv("MYSQL_PORT_3306_TCP_PORT"));
  if (mysqli_connect_errno()) {
    die("Error connecting " . mysqli_error($conn));
  } else {
    echo 'DB Connected successfully';
  }

  // add some handlers

  $app->get('/list', function( $request, $response ) use ($conn) {
    $result = $conn->query("SELECT * FROM user LIMIT 1000;");
    $data   = array();
    while($row = mysqli_fetch_array($result)) {
      $data[] = $row;
    }
    $response->renderText(json_encode($data),'application/json');
  });

  $app->post('/create', function( $request, $response )  use ($conn) {
    $body = "";
    $request->on( 'data', function ($data) use (&$body) {
      $body .= $data;
    });
    $request->on( 'end', function () use (&$body, $response, $conn) {
      $data   = json_decode($body);
      $result = $conn->query(sprintf("INSERT INTO user (email, password, firstName, lastName, description) VALUES ('%s', '%s', '%s', '%s', '%s')", $data->email, password_hash($data->password, PASSWORD_BCRYPT, array("cost" => 12)), $data->firstName, $data->lastName, $data->description));
      if(!$result) {
        die("Failed insertion: ". mysql_error());
      }
      $response->renderText("Created");
    });
  });

  $app->listen( 4000 );