<?php
/**
 * 
 *  React demo   
 *
 * @package    REACT demo
 * @copyright  Copyright (c) 2010 James Littlejohn
 * @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * @version    $Id$
 */
/**
 * Handles the routing of url requests
 *
 * @package    REACT demo
 * @copyright  Copyright (c) 2010 James Littlejohn
 * @license    http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 */ 
  class reactRouter
  {
   public function __construct($request, $response, $inpath, $mysqli, $conn)
    {
        $this->request     = $request;
        $this->response    = $response;
        
        $this->method      = $inpath['method'];
        $this->path        = $inpath['path'];
        $this->query       = $inpath['query'];
        $this->mysqli      = $mysqli;
        $this->conn        = $conn;
        $this->startRouter();
     
    } 
    
    public function startRouter ()
    {
        if($this->path == '/list'){
            $qry       = "SELECT * FROM user LIMIT 1000;";
            $result    = $this->mysqli->query($qry);
            $data      = array();

            while($row = mysqli_fetch_array($result)) {
              $data[] = $row;
            }
            $this->response->writeHead();
            $this->response->end(json_encode($data));
        }
        elseif($this->path == '/create')
        {  
            $request  = $this->request;
            $response = $this->response;
            $body     = "";
            $mysqli   = $this->mysqli;
            $request->on( 'data', function ($data) use (&$body, $request, $response, $mysqli) {
                $body .= $data;
                $newArray = json_decode($body);
                $qry  = sprintf("INSERT INTO user (email, password, firstName, lastName, description) VALUES ('%s', '%s', '%s', '%s', '%s')", $newArray->email, password_hash($newArray->password, PASSWORD_BCRYPT, array("cost" => 12)), $newArray->firstName, $newArray->lastName, $newArray->description);

                $result      = $mysqli->query($qry);
                if(!$result) {
                    die("Failed insertion: ". mysql_error());
                }
                $newArray->id = mysqli_insert_id($mysqli);
                $response->writeHead();
                $response->end(json_encode($newArray));
            });
        }
        else
        {
            echo "HOME PAGE";
        }
    
    }
} // closes class
