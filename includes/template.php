<?php
    
    
    $page['mainBody'] = &$page['body']->newChild("div");
    $page['mainBody']->setAttribute("class", "body");
    
    $page['container'] = &$page['mainBody']->newChild("div");
    $page['container']->setAttribute("class", "container");
    
    $page['main_body'] = &$page['container']->newChild("div");
    $page['main_body']->setAttribute("class", "mainBody");
    
    $page['main_block'] = &$page['main_body']->newChild("div");
    $page['main_block']->setAttribute("class", "main");
    
    $page['contentBlock'] = &$page['main_block']->newChild("div");
    $page['contentBlock']->setAttribute("class", "content");
    
    $clear = &$page['container']->newChild("div");
    $clear->addClass("clear");
    
    
    $page['footer'] = &$page['body']->newChild("div");
    $page['footer']->setAttribute("class", "footer");
    
    $page['footer_block'] = &$page['footer']->newChild("div");
    $page['footer_block']->setClass("footer_content");
    
    $page['start_button'] = $page['footer_block']->newChild("div");
    $page['start_button']->setClass("start_button");
    //$page['start_button']->setAttribute("onClick", "$('#start_menu').toggle();");
    
    $page['start_menu_block'] = $page['body']->newChild("div");
    $page['start_menu_block']->setClass("start_menu_container");
    $page['start_menu_block']->setAttribute("id", "start_menu");
    //$page['start_menu_block']->setStyle("display", "none");
    
    $page['start_menu'] = $page['start_menu_block']->newChild("div");
    $page['start_menu']->setClass("start_menu");
    
    $page['taskbar'] = $page['footer_block']->newChild("div");
    $page['taskbar']->setAttribute("id", "taskbar");
    $page['taskbar']->setClass("taskbar");
    
    $page['footer_content_clear'] = $page['footer_block']->newChild("div");
    $page['footer_content_clear']->setClass("clear");
    
    