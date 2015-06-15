<?php
  require 'vendor/autoload.php';

  $server = new CapMousse\ReactRestify\Server("MyAPP", "0.0.0.1");
  $conn   = mysql_connect("192.168.9.5:4003", "root", "test");
  if (!$conn) {
    die('Could not connect: ' . mysql_error());
  }
  echo 'DB Connected successfully';
  mysql_select_db("benchmark", $conn);

  $server->get('/', function ($request, $response, $next) use ($conn) {
    $qry    = "SELECT * FROM user;";
    $result = mysql_query($qry);
    $data   = array();
    while($row = mysql_fetch_assoc($result)) {
      $data[] = $row;
    }
    $response->write(json_encode($data));
    mysql_close($conn);
    $next();
  });

  $server->post('/',function( $request, $response, $next) use ($conn) {
    $post_body = file_get_contents('php://input');
    $test = $_POST;
    var_dump($post_body);
    var_dump($test);
    $hash = new Illuminate\Hashing\BcryptHasher();
    if(!$request->email && !$request->password)
    {
      $response->setStatus(500);
      return $next();
    }
    echo $request->email;
    $qry    = sprintf("INSERT INTO user (email, password, firstName, lastName, description) VALUES ('%s', '%s', '%s', '%s', '%s')", $request->email, $hash->make($request->password, array("rounds" => 12)), $request->firstName, $request->lastName, $request->description);
    $result = mysql_query($qry);
    if(!$result) {
      die("Failed insertion: ". mysql_error());
    }
    $response->write("Data inserted!");
    mysql_close($conn);
    $next();
  });

  $runner = new CapMousse\ReactRestify\Runner($server);
  $runner->listen(4000);


