<?php

include_once './Config.php';

class Server {

    protected $_request = NULL;
    protected $_response = NULL;
    protected $_connection = false;

    public function __construct() {
        $this->makeSuccessResponse("unknown error", false);
    }

    public function __destruct() {
        ;
    }

    public function run() {
        ;
    }
    
    public function openConnection() {
        $constr = "host=" . HOST . " port=" . PORT . " dbname=" . DATEBASE . " user=" . USERNAME . " password=" . PASSWORD;
        $con = pg_connect($constr);
        if (!$con) {
            $this->makeSuccessResponse("cannot connect database.", false);
            return false;
        }
        $this->_connection = $con;
        return true;
    }

    public function closeConnection() {
        if ($this->_connection) {
            pg_close($this->_connection);
        }
        $this->_connection = false;
    }

    public function makeSuccessResponse($message, $success, $data = array()) {
        $this->_response = array(
            "message" => $message,
            "success" => $success,
            "data" => $data
        );
    }
    
    public function setRequest($request){
        $this->_request = $request;
    }

    public function getResponse() {
        return $this->_response;
    }
}
