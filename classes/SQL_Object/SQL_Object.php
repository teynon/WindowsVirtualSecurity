<?php
####################################################
# Extendable SQL Object Class                      #
# ------------------------------------------------ #
#    This class takes a valid SQL string and       #
# converts the resulting MySQL resource into an    #
# object that uses dynamic variables.              #
#                                                  #
#    This allows ease of use and quick access to   #
# data information.                                #
# ------------------------------------------------ #
# CREATED BY: Thomas Eynon                         #
#             www.thomaseynon.com                  #
# CREATED ON: 1/15/2012                            #
####################################################

if (!interface_exists("Object_Array")) {
    // Blend the interfaces.
    interface Object_Array extends Iterator, Countable {

    }
}

if (!class_exists("SQL_Object")) {
    class SQL_Object implements Object_Array {
        public $data, $object, $sql, $pointer, $size;
        
        // Default constructor
        function __construct($sql = "", $autoRun = true) {
            $this->data = array();
            $this->object = array();
            $this->sql = "";
            $this->pointer = 0;
            $this->size = 0;
            
            if (!empty($sql)) {
                $this->run($sql, $autoRun);
            }
        }
        
        // Run a custom query.
        function SQL_Data($sql, $autoRun = true) {
            $this->run($sql, $autoRun);
        }
        
        
        function run($sql, $autoRun = true) {
            $this->sql = $sql;
            
            if ($autoRun) {
               $this->runQuery();
            }
        }

        function runQuery() {
            try {
                if ($query = $GLOBALS['db']->query($this->sql)) {
                    while ($req = $query->fetch(PDO::FETCH_ASSOC)) {
                        foreach ($req as $key => $value) {
                            $this->data[$this->pointer][$key] = $value;
                        }
                        $this->pointer++;
                    }
                    $this->size = $this->pointer;
                    $this->pointer = 0;
                }
            }
            catch (Exception $e) {
                trigger_error("SQL Object: " . $e, E_USER_WARNING);
            }
        }
        
        function check($object) {
            if (isset($this->object[$this->pointer][$object])) {
                return $this->object[$this->pointer][$object];
            }
            else {
                if (method_exists($this, "build{$object}")) {
                    $method = "build{$object}";
                    $this->$method();
                    
                    if (isset($this->object[$this->pointer][$object])) {
                        return $this->object[$this->pointer][$object];
                    }
                }
            }
            
            return false;
        }
        
        // PHP 5 Magic Method
        // ----------------------------
        // Pulls the requested variable.
        // If the variable is not defined, throw a notice.
        function __get($param) {
            // Check if its a data value.
            if (isset($this->data[$this->pointer][$param])) {
                return $this->data[$this->pointer][$param];
            }
            
            // Check if its an object.
            $this->check($param);
            
            // Check if its a object value.
            if (isset($this->object[$this->pointer][$param])) {
                return $this->object[$this->pointer][$param];
            }
            
            // See if variable exists now.
            if (isset($this->$param)) {
                return $this->$param;
            }
            
            $trace = debug_backtrace();
            
            trigger_error('Undefined property: ' . $param .
            ' in ' . $trace[0]['file'] .
            ' on line ' . $trace[0]['line'],
            E_USER_NOTICE);
            
            return null;
        }
        
        // Iterator template methods
        function current() {
            return $this->data[$this->pointer];
        }
        
        function next() {
            $this->pointer++;
            if (isset($this->data[$this->pointer])) {
                return $this->data[$this->pointer];
            }
            
            return false;
        }
        
        function valid() {
            if (isset($this->data[$this->pointer])) {
                return true;
            }
            return false;
        }
        
        function rewind() {
            $this->pointer = 0;
        }
        
        function key() {
            return $this->pointer;
        }
        
        function count() {
            return $this->size;
        }
    }
}