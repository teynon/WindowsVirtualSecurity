<?php
    ##########################################
    # Form Objects                           #
    # -------------------------------------- #
    #    Enables the quick use of form       #
    # objects with the DOMe class.           #
    ##########################################

    if (!class_exists("D_FORM")) {
        class D_FORM extends DOMe {
            function __construct($name = "D_FORM", $action = "", $method = "POST") {
                $this->tag = "form";
                $this->text = "";
                $this->preValue = "";
                $this->endTag = true;
                $this->allowHTML = true;
                $this->id = 0;

                $this->children = array();
                $this->childIndex = array();
                $this->attributes = array();
                $this->styles = array();
                $this->pointer = 0;
                
                $this->setAttribute("name", $name);
                $this->setAttribute("action", $action);
                $this->setAttribute("method", $method);
                
                // Auto create a token value.
                $this->assign(new D_INPUT("hidden", "form_token", $_SESSION['FORM_TOKEN']));
            }
        }
    }

    if (!class_exists("D_INPUT")) {
        class D_INPUT extends DOMe {
            function __construct($type = "text", $name = "", $value = "") {
                $this->tag = "input";
                $this->text = "";
                $this->preValue = "";
                $this->endTag = false;
                $this->allowHTML = false;
                $this->id = 0;

                $this->children = array();
                $this->childIndex = array();
                $this->attributes = array();
                $this->styles = array();
                $this->pointer = 0;
                
                $this->setAttribute("type", $type);
                $this->setAttribute("name", $name);
                $this->setAttribute("value", $value);
            }
        }
    }

    if (!class_exists("D_TEXTAREA")) {
        class D_TEXTAREA extends DOMe {
            function __construct($name = "", $value = "", $rows = 2, $cols = 50) {
                $this->tag = "textarea";
                $this->text = $value;
                $this->preValue = "";
                $this->endTag = true;
                $this->allowHTML = false;
                $this->defaultTidy = false;
                $this->id = 0;

                $this->children = array();
                $this->childIndex = array();
                $this->attributes = array();
                $this->styles = array();
                $this->pointer = 0;
                
                $this->setAttribute("name", $name);
                $this->setAttribute("rows", $rows);
                $this->setAttribute("cols", $cols);
            }
        }
    }
?>