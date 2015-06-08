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

  $app->get('/list', function () {
    $query      = "SELECT * FROM benchmark.user;";
    $connection = connect();
    $result     = mysql_query($query);
    if (!$result) {
      die('Invalid query: ' . mysql_error());
    }
    $json = array();
    while($row = mysql_fetch_assoc($result)){
      $json[] = $row;
    }
    var_dump($json);
    mysql_close($connection);
  });

  $app->post('/create', function () use($hash, $app){
    $data     = $app->request->post();
    $password = $hash->make($data['password']);
    $query      = sprintf("INSERT INTO `user` (`email`, `password`, `firstName`, `lastName`, `description`) VALUES ('%s', '%s', '%s', '%s', '%s');", $data['email'], $password, $data['firstName'], $data['lastName'], $data['description']);
    var_dump($query);
    $connection = connect();
    $result     = mysql_query($query) or die(mysql_error());
    var_dump($result);
    mysql_close($connection);
  });

  $app->run();