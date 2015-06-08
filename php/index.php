<?php
  require './vendor/autoload.php';

  $app        = new \Slim\Slim();
  $hash       = new \Illuminate\Hashing\BcryptHasher();
  function connect () {
    $servername = "192.168.9.5:4003";
    $username   = "root";
    $password   = "test";
    $conn       = mysql_connect($servername, $username, $password);
    if (!$conn) {
      die("Connection Failed:! " . mysql_error());
    }
    mysql_select_db('benchmark', $conn);
    return $conn;
  }

  $app->get('/list', function () use ($app) {
    $query      = "SELECT * FROM user;";
    $connection = connect();
    $result     = mysql_query($query);
    if (!$result) {
      die('Invalid query: ' . mysql_error());
    }
    $json = array();
    while($row = mysql_fetch_assoc($result)){
      $json[] = $row;
    }
    $app->response->headers->set('Content-Type', 'application/json');
    mysql_close($connection);
    $app->response->setBody(json_encode($json));
    return true;
  });

  $app->post('/create', function () use($hash, $app){
    $data     = $app->request->post();
    if(!$data) {
      $data = $app->request->getBody();
    }
    $password = $hash->make($data['password']);
    $query      = sprintf("INSERT INTO `user` (`email`, `password`, `firstName`, `lastName`, `description`) VALUES ('%s', '%s', '%s', '%s', '%s');", $data['email'], $password, $data['firstName'], $data['lastName'], $data['description']);
    // var_dump($query);
    $connection = connect();
    $result     = mysql_query($query) or die(mysql_error());
    // var_dump($result);
    return $app->response->setStatus(200);
    mysql_close($connection);
  });

  $app->run();