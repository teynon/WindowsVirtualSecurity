<?php
    error_reporting(E_ALL);
    ini_set('display_errors', '1');
    $required = false;
    require_once "includes/start_page.php";
    require_once "includes/template.php";
    
    
    // Icons
    $icons['computer']['block'] = $page['main_block']->newChild("div");
    $icons['computer']['block']->setClass("desktop_icon");
    $icons['computer']['block']->setAttribute("ondblclick", "create_window(explorer());");
    
    $icons['computer']['icon'] = $icons['computer']['block']->newChild("img", "", false, false);
    $icons['computer']['icon']->setAttributes('src="images/My_Computer.png" alt="My Computer"');
    
    $icons['computer']['text'] = $icons['computer']['block']->newChild("div", "My Computer");
    
    $icons['outlook']['block'] = $page['main_block']->newChild("div");
    $icons['outlook']['block']->setClass("desktop_icon");
    $icons['outlook']['block']->setAttribute("ondblclick", "create_window(outlook());");
    
    $icons['outlook']['icon'] = $icons['outlook']['block']->newChild("img", "", false, false);
    $icons['outlook']['icon']->setAttributes('src="images/applications/outlook-1.png" alt="Outlook"');
    
    $icons['outlook']['text'] = $icons['outlook']['block']->newChild("div", "Outlook");
    
    
    $start['outlook']['block'] = $page['start_menu']->newChild("div");
    $start['outlook']['block']->setClass("start_menu_item");
    $start['outlook']['block']->setAttribute("onClick", "create_window(outlook());");
    
    $start['outlook']['icon'] = $start['outlook']['block']->newChild("img", "", false, false);
    $start['outlook']['icon']->setAttributes('src="images/applications/outlook-1.png" alt="Outlook"');
    
    $start['outlook']['text'] = $start['outlook']['block']->newChild("div", "Microsoft Outlook");
    
    
    
    // Start Menu Options
    
    //$blocks['main']['p'][] = &$mainContent->newChild("p", "In 2012, 50.4% of US Consumers used smart phones. Can you afford to miss out on 50% of potential customers? Let us release your app with built - in customization and an administrative app.");
    //$blocks['main']['p'][] = &$mainContent->newChild("p", "Publish your most recent hours, pricing, portfolio, or let them schedule their next appointment automatically. Get your app on your customers phone before your competitors do.");
    
    