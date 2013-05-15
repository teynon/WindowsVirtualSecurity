<?php
require "SQL_Object.php";

// Example extended class
class forumObject extends SQL_Object {
    function buildForum() {
        $sql = "SELECT * FROM `forum_cats` WHERE `PID` = '{$this->data[$this->pointer]['ID']}'";
        $this->object[$this->pointer]['Forum'] = new forumObject($sql);
    }
}

// Make sure you connect to your database first.
$id_link = mysql_connect("localhost", "root", "");
mysql_select_db("testing");

// ------------------------------------------------

// Example Recursive Forum Builder.
function buildForumCategories($forums) {
	// Build a container so the child boards indent.
    echo "<div style=\"margin-left: 10px;\">";
	
	// We can use foreach to increment the internal pointer on the class.
    foreach ($forums as $key => $forum) {
		// Echo the forum name. (The field name is the MySQL row or whatever you specified in the query.
        echo $forums->name . "<br />";
		
		// We can see if there are any child forums using count.
		// $forums->Forum will invoke PHP 5's magic method "__get"
		// SQL_Object also implements countable interface so we can
		// override the count function with our own.
        if (count($forums->Forum) > 0) {
            // Call child boards.
            buildForumCategories($forums->Forum);
        }
    }
	// We can also manually do it with a for:
	// 		Example: for ($forums->rewind(); $forums->valid(); $forums->next())
	//
	// We could use the internal objects, but the methods work just fine.
	
    echo "</div>";
}

// Do you're normal query for the initial boards.
$sql = "SELECT * FROM `forum_cats` WHERE `PID` = 0";

// Pass the query to the extended class.
$forums = new forumObject($sql);

// Build the forum
buildForumCategories($forums);