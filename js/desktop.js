var xpos = 0;
var ypos = 0;
$(document).ready(function() {
    var xpos = $('.main').outerWidth() / 2;
    var ypos = $('.main').outerHeight() / 2;
    rebuild_desktop();
    $('#start_menu').hide();
    
    $('.start_button').on("click", function (e) {
        $('#start_menu').toggle();
        e.stopPropagation();
    });
    
    $('#start_menu').on("click", function (e) {
        e.stopPropagation();
    });
    
    $('html').click(function() {
        $('#start_menu').hide();
    });
    
    $().mousemove(function(e){
        window.mouseXPos = e.pageX;
        window.mouseYPos = e.pageY;
    }); 
    
    
/*$( ".main" ).sortable({
        stop: function (event, ui) {
            // Changed.
            console.log(event + ui);
        }
    });*/
});

$(function( ) {
    $.widget("ui.window", $.ui.mouse, {
        self : this,
        icon : false,
        taskIcon : false,
        titleBar : false,
        titleBarContainer : false,
        bodyBox : false,
        menuBar : false,
        taskBox : false,
        taskBoxImage : false,
        taskBoxTitle : false,
        contentBox : false,
        panesBlock : false,
        windowID : 0,
        status : true,
        options : {
            aliases : {},
            params : {
                title : "My Window",
                icon : false,
                maximized : true,
                defaultWidth : 500,
                defaultHeight : 400,
                defaultX : 10,
                defaultY : 10,
                panes : {},
                paneRows : 0,
                css : {},
                menu : { 
                }
            },
            functions : {

            }
        },

        titleBarButtons : { 
            minimize : false,
            maximize : false,
            collapse : false,
            close : false
        },
        menus : {},
        panes : {},
        statusBar : false,

        _create : function() {
            this.createWindow();
            var that = this;
            $('html').click(function() {
                $('.menu').hide();
            });
            
            window_manager.addWindow(this);
            window_manager.setFocus(this);
        },
        _init : function() {
        },

        createWindow : function() {
            var that = this;
            this.element.addClass("window");
            this.element.addClass("maximized");
            this.element.css(this.options.params.css);
            this.element.resizable({
                handles : 'n, e, s, w, se', 
                disabled : true
            });
            this._maxHeight();
            
            this.element.on("mousedown", function() { window_manager.setFocus(that) });
            
            // Task bar item
            this.taskBox = $('<div class="taskbar_task"></div>').appendTo('#taskbar');
            this.taskBox.on("click", function(e) {
                if (window_manager.hasFocus(that)) {
                    if (that.element.hasClass('minimized')) {
                        that.restore();
                    }
                    else {
                        that.minimize();
                    }
                }
                else {
                    window_manager.setFocus(that);
                }
            });
            
            this.taskBoxImage = $('<img src="' + this.options.params.taskIcon + '" />').appendTo(this.taskBox);
            
            this.taskBoxTitle = $('<span>' + this.options.params.title + '</span>').appendTo(this.taskBox);
            

            // Title bar
            // -----------------------------------------------------------------
            this.titleBar = $('<div class="window_title"></div>').appendTo(this.element);
            this.titleBarContainer = $('<div class="window_title_container">' + this.options.params.title + '</div>').appendTo(this.titleBar);

            if (this.options.params.icon) {
                this.icon = $('<img src="' + this.options.params.icon + '" />').prependTo(this.titleBarContainer);
            }

            this.titleBarButtons.close = $('<div class="window_close">x</div>').appendTo(this.titleBarContainer);
            this.titleBarButtons.close.on("click", function(e) {
                that.closeWindow();
                e.stopPropagation();
            });
            
            this.titleBarButtons.minimize = $('<div class="window_minimize">-</div>').appendTo(this.titleBarContainer);
            this.titleBarButtons.minimize.on("click", function(e) {
                that.minimize();
                e.stopPropagation();
            });

            this.titleBar.on("dblclick", function(e) {
                if (that.element.hasClass('maximized')) {
                    that.windowed();
                }
                else {
                    that.maximize();
                }
            });

            // Element dragging
            // ---------------------------------------------
            this.element.draggable({
                handle: this.titleBar,
                scroll: false,
                cursorAt : {
                    left : 100,
                    top: 10
                },
                start : function(e) {
                    if (that.element.hasClass('maximized')) {
                        that.element.removeClass("maximized");
                        that.element.addClass("windowed");
                        that.element.css({
                            width : that.options.params.defaultWidth, 
                            height : that.options.params.defaultHeight
                        });
                        that.titleBar.addClass("title_windowed");

                        // Put the titlbar back in mouse range.
                        that.element.draggable("option", "cursorAt", false);

                        that.element.resizable({
                            handles : 'n, e, s, w, se'
                        });
                    }
                },
                drag : function (e) {
                    that.options.params.defaultX = that.element.css("left");
                    that.options.params.defaultY = that.element.css("top");
                    that.scalePanes();
                }
            });
            
            // Body block
            this.bodyBox = $('<div class="window_body"></div>').appendTo(this.element);

            // Menus
            // --------------------------------------
            this.menuBar = $('<div class="window_menu"></div>').appendTo(this.bodyBox);

            this.menuBar.append(this.buildMenu('File', this.options.params.menu.file));

            // Content area
            // --------------------------------------
            this.contentBox = $('<div class="window_content"></div>').appendTo(this.bodyBox);

            // Status bar
            // --------------------------------------
            this.statusBar = $('<div class="window_status"></div>').appendTo(this.bodyBox);

            this.panesBlock = $('<table class="content_panes"></table>').appendTo(this.contentBox);

            // Content panes
            this.buildPanes(this.panesBlock, this.options.params.panes);
            this.scalePanes();

            $(window).resize(function() { 
                that._maxHeight();
                that.scalePanes();
            });
        },

        maximize : function() {
            this.options.params.defaultWidth = this.element.css("width");
            this.options.params.defaultHeight = this.element.css("height");
            this.element.addClass("maximized");
            this.element.removeClass("windowed");
            this.titleBar.removeClass("title_windowed");
            this.bodyBox.removeClass("body_windowed");
            this.element.draggable("option", "cursorAt", {
                left : 100, 
                top: 10
            });
            this.element.attr("style", "");

            this.element.resizable("disable");
            this.element.removeClass("ui-resizable-disabled");
            this.element.removeClass("ui-state-disabled");
            this.scalePanes(-50);
            var that = this;
        //setTimeout(function() { that.scalePanes(); }, 500);
        },

        windowed : function() {
            this.element.css({
                "left" : this.options.params.defaultX,
                "top" : this.options.params.defaultY,
                "width" : this.options.params.defaultWidth,
                "height" : this.options.params.defaultHeight
            });
            this.element.removeClass("maximized");
            this.element.addClass("windowed");
            this.titleBar.addClass("title_windowed");
            this.element.draggable("option", "cursorAt", false );
            this.scalePanes();
            this.bodyBox.addClass("body_windowed");

            this.element.resizable("enable");
        },
        
        restore : function() {
            this.element.removeClass("minimized");
            this.scalePanes();
            window_manager.setFocus(this);
        },
        
        minimize : function() {
            this.element.addClass("minimized");
        },

        _maxHeight : function() {
            this.element.css("max-height", $('body').outerHeight() - $('.footer').outerHeight());
        },

        buildMenu : function(title, data) {
            var menuBody = $('<div class="menu_container"></div>');
            var menuButton = $('<div class="menu_title">' + title + '</div>').appendTo(menuBody);
            var menu = $('<div class="menu" style="display: none;"></div>').appendTo(menuBody);
            for (var i in data) {
                if (data[i].Icon) data[i].Icon.appendTo(menu);
                var menuOption = $('<div class="menu_option">' + i + '</div>').appendTo(menu);

                if (data[i].click) menuOption.on("click", data[i].click);
                if (data[i].blur) menuOption.on("blur", data[i].blur);
            }
            menuButton.on("click", function(event) {
                menu.toggle();
                event.stopPropagation();
            });
            return menuBody;
        },

        buildPanes : function(paneBlock, panes) {
            var that = this;
            var paneIndex = 0;
            for (var i in panes) {
                this.paneRows++;
                var rowPane = $('<tr></tr>').appendTo(paneBlock);
                for (var h in panes[i]) {
                    panes[i][h].block = $('<td class="pane"></td>').appendTo(rowPane);
                    if (panes[i][h].text) {
                        panes[i][h].block.text(panes[i][h].text);
                    }
                    if (panes[i][h]['class']) {
                        panes[i][h].block.addClass(panes[i][h]['class']);
                    }
                    
                    panes[i][h].block.css(panes[i][h].css);

                    if (panes[i][h].resizable) {
                        panes[i][h].block.resizable({
                            handles : panes[i][h].resizableHandles
                        });
                    }

                    if (panes[i][h].subPanes) {
                        var parentPane = $('<table class="child_pane"></table>').appendTo(panes[i][h].block);
                        that.buildPanes(parentPane, panes[i][h].subPanes);
                    }

                    if (panes[i][h].alias) {
                        that.options.aliases[panes[i][h].alias] = panes[i][h];
                    }

                    if (!panes[i][h].id) panes[i][h].id = null;

                    if (panes[i][h].onClick) {
                        that.onClick(that, panes[i][h]);
                    }

                    if (panes[i][h].onLoad) {
                        that.onLoad(that, panes[i][h]);
                    }
                }
            }
        },

        onClick : function(that, pane) {
            pane.block.on("click", function() {
                that.options.aliases['Current Folder'].block.text("folder");
                //that.titleBarContainer.text("test");
                
                pane.onClick(that, pane.id);
            });
        },

        onLoad : function(that, pane) {
            var pane = pane;
            var that = that;
            pane.onLoad(that, pane.id);
        },

        scalePanes : function(addHeight) {
            var pane = null;
            var contentHeight = this.element.outerHeight() - (this.titleBar.outerHeight() + this.menuBar.outerHeight() + this.statusBar.outerHeight());
            if (this.element.hasClass("windowed")) contentHeight -= 9;
            var contentWidth = this.contentBox.outerWidth();
            if (addHeight) contentHeight += addHeight;
            
            this.panesBlock.outerHeight(contentHeight);
        /*
        for (var i in this.options.params.panes) {
            pane = this.options.params.panes[i];
            if (pane.height) {
                pane.block.outerHeight(contentHeight * (pane.height / 100));
            }
            if (pane.width) {
                pane.block.outerWidth(contentWidth * (pane.width / 100));
            }
        }
        */
        },

        closeWindow : function() {
            this.element.remove();
            this.taskBox.remove();
            this.status = false;
        }
    });
});

$(window).resize(function() {
    rebuild_desktop();
});

function rebuild_desktop() {
    var wdth = $('body').outerHeight() - $('.footer').outerHeight();
    var hght = $('body').outerWidth();
    if (wdth > hght) wdth = hght;
    else hght = wdth;
    xpos = (wdth / 2) - (hght / 2);
    ypos = (hght / 2) - (wdth / 2);
    
    $(".main").css( {
        width : wdth + "px", 
        height: hght, 
        left: xpos + "px", 
        top: ypos + "px"
    });
}

var Objects = [];
var ObjectsIndex = 0;

function create_window(parameters) {
    $('#start_menu').hide();
    
    if (parameters.maxWindows) {
        var similar = window_manager.similarWindows(parameters);
        if (similar.length >= parameters.maxWindows) {
            window_manager.setFocus(similar[similar.length - 1]);
            return;
        }
    }
    
    var param = parameters;
    var thewindow = $('<div></div>').prependTo('body');
    Objects[ObjectsIndex++] = parameters;
    thewindow.window({
        params : param
    });
}

var window_manager = {
    windows : [],
    focus : false,
    top : 50,
    addWindow : function(window) {
        var index = this.windows.length;
        window.windowID = index;
        this.windows.push(window);
        this.top++;
    },
    setFocus : function(window) {
        for (var i = 0; i < this.windows.length; ++i) {
            if (window.windowID == i) {
                if (this.focus) {
                    this.focus.element.addClass("not_focused");
                    this.focus.taskBox.addClass("not_focused_taskbar");
                }
                this.focus = window;
                this.focus.element.removeClass("not_focused");
                this.focus.taskBox.removeClass("not_focused_taskbar");
                
                if (window.element.hasClass("minimized")) {
                    window.restore();
                }
                
                if (window.element.css("z-index") < this.top - 1) {
                    window.element.css("z-index", this.top++);
                }
                break;
            }
        }
    },
    hasFocus : function(window) {
        if (window.windowID == this.focus.windowID) return true;
        return false;
    },
    similarWindows : function(window) {
        var results = [];
        
        for (var i = 0; i < this.windows.length; ++i) {
            if (this.windows[i].status) {
                if (window["class"] == this.windows[i].options.params["class"]) {
                    results[results.length] = this.windows[i];
                }
            }
        }
        
        return results;
    }
};

