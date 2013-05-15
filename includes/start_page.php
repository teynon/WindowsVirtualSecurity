<?php
    session_start();
    if (!isset($required)) $required = false;
 
    define("DBPREFIX", "securityDemo_");
    define("ROOT", $_SERVER['DOCUMENT_ROOT'] . "/windows_virtual_security/");
    define("BASE_URL", "http://" . $_SERVER['HTTP_HOST'] . "/windows_virtual_security/");
    define("ROOT_URL", "http://" . $_SERVER['HTTP_HOST']);
    define("BASE_DIR", "windows_virtual_security/");
    
    require_once(ROOT . "includes/functions.php");
    define("FORM_TOKEN", build_token());
    // Set a form token for the current page. (XSS Prevention)
    if (!isset($form_token) || $form_token !== false) {
        if (isset($_SESSION['FORM_TOKEN'])) $_SESSION['LAST_TOKEN'] = $_SESSION['FORM_TOKEN'];
        $_SESSION['FORM_TOKEN'] = FORM_TOKEN;
    }
    
    require_once(ROOT . "includes/mysql.php");
    require_once(ROOT . "classes/DOMe/DOMe.php");
    require_once(ROOT . "classes/Data_Table/Data_Table.php");
    require_once(ROOT . "classes/FormValidator/FormValidator.php");
    require_once(ROOT . "classes/LOGINe/LOGINe.php");
    require_once(ROOT . "classes/DOMe/Form_Objects.php");
    require_once(ROOT . "classes/Search/Search.php");
    require_once(ROOT . "classes/Permissions/Permissions.php");
    require_once(ROOT . "classes/Tabs/Tabs.php");
    require_once(ROOT . "classes/Tabs/Tab.php");
    require_once(ROOT . "classes/System/System.php");
    require_once(ROOT . "classes/Form/Form.php");
    require_once(ROOT . "classes/Form/FormSection.php");
    require_once(ROOT . "classes/Form/Form_String.php");
    require_once(ROOT . "classes/Form/Form_Email.php");
    require_once(ROOT . "classes/Form/Form_Date.php");
    require_once(ROOT . "classes/Form/Form_Phone.php");
    require_once(ROOT . "classes/Form/Form_Password.php");
    require_once(ROOT . "classes/Form/Form_Image.php");
    require_once(ROOT . "classes/Form/Form_Submit.php");
    require_once(ROOT . "classes/Form/Form_Captcha.php");
    require_once(ROOT . "classes/Form/Form_User.php");
    require_once(ROOT . "classes/Form/Form_Hidden.php");
    require_once(ROOT . "classes/Form/Form_Toggle.php");
    require_once(ROOT . "classes/Images/Images.php");
    require_once(ROOT . "classes/AAS/AAS.php");
    require_once(ROOT . "core/securimage/securimage.php");
    
    $GLOBALS['_user'] = new LOGINe($required);
    
    $page['html'] = new DOMe("html", "", true, false, '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML+RDFa 1.0//EN" "http://www.w3.org/MarkUp/DTD/xhtml-rdfa-1.dtd">');
    $page['html']->setAttributes('xmlns="http://www.w3.org/1999/xhtml"');
    
    // Define the head.
    $page['head'] = &$page['html']->newChild("head");
    
    $page['encoding'] = $page['head']->newChild("meta", "", false, false);
    $page['encoding']->setAttributes('http-equiv="Content-Type" content="text/html; charset=utf-8"');
    
    // Define the page title.
    $page['title'] = &$page['head']->newChild("title", "Trainer - Windows Security");
    
    $styles['jqueryui'] = &$page['head']->newChild("link", "", false);
    $styles['jqueryui']->setAttributes('href="' . BASE_URL . 'jquery/css/smoothness/jquery-ui-1.10.0.custom.css" rel="stylesheet" type="text/css"');
    
    // Insert main stylesheet.
    $styles['style.css'] = &$page['head']->newChild("link", "", false);
    $styles['style.css']->setAttributes('href="' . BASE_URL . 'css/styles.css" rel="stylesheet" type="text/css"');
    
    // Forms stylesheet
    $styles['Form.css'] = &$page['head']->newChild("link", "", false);
    $styles['Form.css']->setAttributes('href="' . BASE_URL . 'css/Form.css" rel="stylesheet" type="text/css"');
    
    //$styles['googleFonts'] = &$page['head']->newChild("link", "", false);
    //$styles['googleFonts']->setAttributes('href="http://fonts.googleapis.com/css?family=Iceberg" rel="stylesheet" type="text/css"');
    
    $scripts['jquery'] = &$page['head']->newChild("script");
    $scripts['jquery']->setAttributes('type="text/Javascript" src="' . BASE_URL . 'jquery/jquery1.9.js');
    
    $scripts['debug.js'] = &$page['head']->newChild("script");
    $scripts['debug.js']->setAttributes('type="text/Javascript" src="' . BASE_URL . 'js/debug.js');
    
    $scripts['desktop.js'] = &$page['head']->newChild("script");
    $scripts['desktop.js']->setAttributes('type="text/Javascript" src="' . BASE_URL . 'js/desktop.js');
    
    // Applications
    $scripts['outlook.js'] = &$page['head']->newChild("script");
    $scripts['outlook.js']->setAttributes('type="text/Javascript" src="' . BASE_URL . 'js/applications/outlook.js');
    
    $scripts['explorer.js'] = &$page['head']->newChild("script");
    $scripts['explorer.js']->setAttributes('type="text/Javascript" src="' . BASE_URL . 'js/applications/explorer.js');
    
    $scripts['jqueryui'] = &$page['head']->newChild("script");
    $scripts['jqueryui']->setAttributes('type="text/Javascript" src="' . BASE_URL . 'jquery/js/jquery-ui-1.10.0.custom.min.js');
    
    $scripts['jqueryDraggable'] = &$page['head']->newChild("script");
    $scripts['jqueryDraggable']->setAttributes('type="text/Javascript" src="' . BASE_URL . 'js/jqueryDraggable.js');
    
    $scripts['jquerySortable'] = &$page['head']->newChild("script");
    $scripts['jquerySortable']->setAttributes('type="text/Javascript" src="' . BASE_URL . 'js/jquerySortable.js');
    
    $scripts['functions'] = &$page['head']->newChild("script");
    $scripts['functions']->setAttributes('type="text/Javascript" src="' . BASE_URL . 'js/functions.js');
    
    // Define the body.
    $page['body'] = &$page['html']->newChild("body");
    
    // Define the error modal
    $page['error_modal'] = &$page['body']->newChild("div");
    $page['error_modal']->setAttribute("style", "display: none;");
    $page['error_modal']->setAttribute("id", "error_modal");
    
    function finish($html) {
        if (empty($GLOBALS['cancel_shutdown'])) {
            echo $html->generate(true);
        }
        if (!empty($GLOBALS['session_destroy'])) {
            session_destroy();
            header("Location: " . BASE_URL . "signed_out.php");
        }
    }
    
    register_shutdown_function("finish", $page['html']);