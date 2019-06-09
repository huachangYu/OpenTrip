<?php

class ReviewServer extends Server {

    public function __construct() {
        parent::__construct();
    }

    public function __destruct() {
        parent::__destruct();
    }

    public function run() {
        $type = $this->_request["type"];
        if ($type === "REVIEW_INSERT") {
            $this->_reviewInsert();
        } else if ($type === "REVIEW_FINDALL") {
            $this->_reviewFindAll();
        } else if($type === "REVIEW_SEARCHID"){
            $this->_reviewSearchID();
        } else if($type === "REVIEW_SEARCH"){
            $this->_reviewSearchFromKey();
        } else if($type === "REVIEW_CACULATEAVG"){
            $this->_getAvgScore();
        }
    }

    public function _reviewInsert() {
        $params = $this->_request["params"];
        $title = $params["title"];
        $author_id = $params["author_id"];
        $author_name = $params["author_name"];
        $lat = $params["lat"];
        $lon = $params["lon"];
        $scoreEnv = $params["scoreEnv"];
        $scoreSer = $params["scoreSer"];
        $scoreFel = $params["scoreFel"];
        $comment = $params["comment"];
        $insertsql = "insert into review(title,author_id,author_name,lat,lon,score_environment,"
                . "score_serve,score_feeling,comment) values($1,$2,$3,$4,$5,$6,$7,$8,$9)";
        $result = pg_query_params($this->_connection, $insertsql, array($title, $author_id, $author_name, $lat, $lon, $scoreEnv, $scoreSer, $scoreFel, $comment));
        if ($result) {
            $this->makeSuccessResponse("insert review succed", true);
        } else {
            $this->makeSuccessResponse("insert review failed", false);
        }
    }

    public function _reviewFindAll() {
        $params = $this->_request["params"];
        $articles_info = array();
        $findsql = "select id,lat,lon,title from review";
        $result = pg_query($findsql);
        while ($row = pg_fetch_row($result)) {
            $article_arr = array("id" => $row[0], "lat" => $row[1], "lon" => $row[2], "title" => $row[3]);
            $article = json_encode($article_arr);
            array_push($articles_info, $article);
        }
        $this->makeSuccessResponse("find succeed", true, $articles_info);
    }

    public function _reviewSearchID() {
        $params = $this->_request["params"];
        $id = $params["id"];
        $searchsql = "select title,author_name,score_environment,"
                . "score_serve,score_feeling,comment,writetime from review where id = $1";
        $result = pg_query_params($this->_connection, $searchsql, array($id));
        $row = pg_fetch_row($result);
        $article_arr = array("title" => $row[0], "author" => $row[1], "scoreEnv" => $row[2],
            "scoreSer" => $row[3],"scoreFel" => $row[4],"comment" => $row[5],"time"=>$row[6]);
        $article = json_encode($article_arr);
        $this->makeSuccessResponse("search succeed", true, $article);
    }

    public function _reviewSearchFromKey() {
        $params = $this->_request["params"];
        $keywords = $params["keywords"];
        $articles_info = array();
        $findsql = "select id,lat,lon,title,author_name,comment from review where title like $1";
        $result = pg_query_params($findsql, array($keywords));
        while ($row = pg_fetch_row($result)) {
            $article_arr = array("id" => $row[0], "lat" => $row[1], "lon" => $row[2], "title" => $row[3], "author" => $row[4], "content" => $row[5]);
            $article = json_encode($article_arr);
            array_push($articles_info, $article);
        }
        $this->makeSuccessResponse("find succeed", true, $articles_info);
    }

    public function _getAvgScore() {
        $params = $this->_request["params"];
        $ids = $params["ids"];
        $sql = "select avg(score_environment),avg(score_serve),avg(score_feeling) from review where id in (".$ids.")";
        $result = pg_query($this->_connection,$sql);
        $row = pg_fetch_row($result);
        $this->makeSuccessResponse("caculate succed", true,array("env"=>$row[0],"ser"=>$row[1],"fel"=>$row[2]));
    }

}
