<?php

include_once './Server.php';
include_once './ArticleServer.php';
include_once './ReviewServer.php';


$requestobj = $_REQUEST["request"];
$type = $requestobj["type"];
$params = $requestobj["params"];

$sv = new Server();

$typestr = explode("_", $type);

if($typestr[0] === "ARTICLE"){
    $sv = new ArticleServer();
}elseif($typestr[0] === "REVIEW"){
    $sv = new ReviewServer();
}
$sv->setRequest($requestobj);
if($sv->openConnection()){
    $sv->run();
    $sv->closeConnection();
}
echo json_encode($sv->getResponse());