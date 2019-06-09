<?php

class ArticleServer extends Server {

    public function __construct() {
        parent::__construct();
    }

    public function __destruct() {
        parent::__destruct();
    }

    public function run() {
        $type = $this->_request["type"];
        if ($type === "ARTICLE_INSERT") {
            $this->insert_article();
        } else if ($type === "ARTICLE_FINDALL") {
            $this->find_article();
        } else if ($type === "ARTICLE_SEARCHTITLE") {
            $this->search_from_title();
        } else if ($type === "ARTICLE_SEARCHID") {
            $this->search_from_id();
        } else if ($type === "ARTICLE_SEARCH") {
            $this->search_from_keywords();
        } else if ($type === "ARTICLE_COMMENT_SUBMIT") {
            $this->submit_comment();
        } else if ($type === "ARTICLE_LIKE") {
            $this->set_like();
        } else if ($type === "ARTICLE_LIKEANDCOMMENT") {
            $this->get_like_and_comments();
        }
    }

    public function insert_article() {
        $params = $this->_request["params"];
        $title = $params["title"];
        $content = $params["content"];
        $lat = $params["lat"];
        $lon = $params["lon"];
        $author_name = $params["author_name"];
        $insertsql = "insert into article (lat,lon,title,author_name,article_content) values($1,$2,$3,$4,$5)";
        $result = pg_query_params($this->_connection, $insertsql, array($lat, $lon, $title, $author_name, $content));
        if ($result) {
            $this->makeSuccessResponse("insert succeed", true);
        } else {
            $this->makeSuccessResponse("insert failed", false);
        }
        pg_free_result($result);
    }

    public function find_article() {
        $params = $this->_request["params"];
        $username_search = $params["username"];
        $articles_info = array();
        if ($username_search === "-1") {
            $findsql = "select id,lat,lon,title,author_name,article_content from article";
            $result = pg_query($findsql);
            while ($row = pg_fetch_row($result)) {
                $article_arr = array("id" => $row[0], "lat" => $row[1], "lon" => $row[2], "title" => $row[3], "author" => $row[4], "content" => $row[5]);
                $article = json_encode($article_arr);
                array_push($articles_info, $article);
            }
            $this->makeSuccessResponse("find succeed", true, $articles_info);
        }
    }

    public function search_from_title() {
        $params = $this->_request["params"];
        $title = $params["title"];
        $searchsql = "select title,author_name,article_content from article where title = $1";
        $result = pg_query_params($this->_connection, $searchsql, array($title));
        $row = pg_fetch_row($result);
        $article_arr = array("title" => $row[0], "author" => $row[1], "content" => $row[2]);
        $article = json_encode($article_arr);
        $this->makeSuccessResponse("search succeed", true, $article);
    }

    public function search_from_keywords() {
        $params = $this->_request["params"];
        $keywords = $params["keywords"];
        $articles_info = array();
        $findsql = "select id,lat,lon,title,author_name,article_content from article where title like $1";
        $result = pg_query_params($findsql, array($keywords));
        while ($row = pg_fetch_row($result)) {
            $article_arr = array("id" => $row[0], "lat" => $row[1], "lon" => $row[2], "title" => $row[3], "author" => $row[4], "content" => $row[5]);
            $article = json_encode($article_arr);
            array_push($articles_info, $article);
        }
        $this->makeSuccessResponse("find succeed", true, $articles_info);
    }

    public function submit_comment() {
        $params = $this->_request["params"];
        
        $article_id = $params["article_id"];
        $user_id = $params["user_id"];
        $comment = $params["comment"];
        $sql = "insert into article_comment(article_id,commentor_id,comment) values($1,$2,$3)";
        $result = pg_query_params($this->_connection, $sql, array($article_id, $user_id, $comment));
        if ($result) {
            $this->makeSuccessResponse("comment succeed", true);
        } else {
            $this->makeSuccessResponse("comment failed", false);
        }
    }

    public function search_from_id() {
        $params = $this->_request["params"];
        $id = $params["id"];
        $searchsql = "select title,author_name,article_content,writetime from article where id = $1";
        $result = pg_query_params($this->_connection, $searchsql, array($id));
        $row = pg_fetch_row($result);
        $article_arr = array("title" => $row[0], "author" => $row[1], "content" => $row[2], "time" => $row[3]);
        $article = json_encode($article_arr);
        $this->makeSuccessResponse("search succeed", true, $article);
    }

    public function set_like() {
        $params = $this->_request["params"];
        $id = $params["id"];
        $searchsql = "update article set likes = likes + 1 where id=$1";
        $result = pg_query_params($this->_connection, $searchsql, array($id));
        if ($result) {
            $this->makeSuccessResponse("liked succeed", true);
        } else {
            $this->makeSuccessResponse("liked failed", false);
        }
    }

    public function get_like_and_comments() {
        $params = $this->_request["params"];
        $id = $params["id"];
        $sql_like = "select likes from article where id = $1";
        $result_like = pg_query_params($this->_connection, $sql_like, array($id));
        $row_like = pg_fetch_row($result_like);
        $like_num = $row_like[0];

        $comments = array();
        $sql_comment = "select comment from article_comment where article_id = $1";
        $result_comment = pg_query_params($this->_connection, $sql_comment, array($id));
        while ($row_comment = pg_fetch_row($result_comment)) {
            $comment = $row_comment[0];
            array_push($comments, $comment);
        }
        $this->makeSuccessResponse("find succed", true, json_encode(array("like" => $like_num, "comments" => $comments)));
    }

}
