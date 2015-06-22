<?php
  require 'vendor/autoload.php';
  require 'router.php';

  $loop   = new React\EventLoop\StreamSelectLoop();
  $socket = new React\Socket\Server($loop);
  $http   = new React\Http\Server($socket, $loop);

  $mysqli = mysqli_init();
  ini_set('mysql.connect_timeout', 999999);
  mysqli_options($mysqli,MYSQLI_OPT_CONNECT_TIMEOUT, 999999);
  mysqli_options($mysqli,MYSQLI_READ_DEFAULT_GROUP, "max_connections = 99999999");
  // mysqli_options($mysqli,MYSQLI_READ_DEFAULT_GROUP, "max_allowed_packet = 50M");
  // mysqli_options($mysqli,MYSQLI_READ_DEFAULT_GROUP, "max_user_connections = 150");
  $conn = mysqli_real_connect($mysqli, getenv("MYSQL_PORT_3306_TCP_ADDR"), "root", "test","benchmark", getenv("MYSQL_PORT_3306_TCP_PORT"), NULL, MYSQLI_CLIENT_COMPRESS);

  // $conn = mysqli_connect(getenv("MYSQL_PORT_3306_TCP_ADDR"), "root", "test", "benchmark", getenv("MYSQL_PORT_3306_TCP_PORT"));
  if (mysqli_connect_errno()) {
      die("Error connecting " . mysqli_error($conn));
  } else {
      echo "DB Connected successfully\n";
  }

  $http->on('request', function ($request, $response) use ($mysqli, $conn) {
    $inpath['method'] = $request->getMethod();
    $inpath['path']   = $request->getPath();
    $inpath['query']  = $request->getQuery();

    $newRouter = new reactRouter($request, $response, $inpath, $mysqli, $conn);
  });
  $socket->listen(4000);
  $loop->run();