function explorer() {
    var d = new Date();
    var n = d.getSeconds();
    var params = {
        id : n,
        "class" : "Explorer",
        title : "",
        icon : "",
        taskIcon : "images/applications/explorer.png",
        css : {
            "min-width" : "300px"
        },
        menu : { 
            file : {
                'New' : function() {

                },
                'Close' : {
                    click : function() {
                        $(this).closest('.window').remove();
                    }
                }
            }
        },
        files : {
            "Computer" : {
                fileType : false,
                files : {
                    "C:\\" : {
                        fileType : false,
                        files : {
                            
                        }
                    }
                }
            }
        },
        panes : [
            [
                {    
                    css : {
                        "background-color" : "#FFFFFF",
                        padding : "0px",
                        width : "200px",
                        border : "1px solid #0000AA",
                        "vertical-align" : "top"
                    },
                    resizable : true,
                    resizableHandles : "e",
                    height : 100,
                    subPanes : [
                        [
                            {
                                css : {

                                },
                                "class" : "explorer_quickfolders",
                                "alias" : "Messages",
                                "onLoad" : function(that) {
                                    that.options.params.functions.buildFolders(that);
                                }
                            }
                        ]
                    ]
                },
                {     
                    css : {
                        "background-color" : "#FFFFFF",
                        padding : "0px",
                        width : "300px",
                        border : "1px solid #0000AA",
                        "vertical-align" : "top"
                    },
                    resizable : true,
                    resizableHandles : "e",
                    height : 100,
                    subPanes : [
                        [
                            {
                                css : {

                                },
                                "class" : "outlook_title",
                                alias : "Current Folder",
                                text : "Test",
                                resizable : false,
                                height : "22px"
                            }
                        ],
                        [
                            {
                                css : {

                                },
                                alias : "Folder Messages",
                                resizable : false,
                                height : "22px"
                            }
                        ]
                    ]
                }
            ]
        ],
        functions : {
            selectFolder : function(that, folder) {
                //that.aliases['Folder->' + folder].block.css("background-color", "#EEEEEE");
                //that.count = 0;
                //setInterval(function() { that.titleBarContainer.text(++that.count); }, 1000);
                
                // Set title
                that.options.aliases['Current Folder'].block.text(folder);

                var subPanes = [];

                // Get messages
                if (that.options.params.messages[folder]) {
                    for (var i in that.options.params.messages[folder]) {
                        // Rebuild sub pane object.
                        subPanes.push([{
                            css : {

                            },
                            "class" : "outlook_preview",
                            text : that.options.params.messages[folder][i].Subject,
                            resizable : false,
                            height : "22px" 
                        }]);
                    }
                }

                that.options.aliases['Folder Messages'].block.empty();
                var parentPane = $('<table class="child_pane"></table>').appendTo(that.options.aliases['Folder Messages'].block);
                that.buildPanes(parentPane, subPanes);
                
            },
            updateFolderCount : function(that, folder) {
                if (that.options.params.messages[folder]) {
                    var newString = folder + " (" + that.options.params.messages[folder].length + ")";
                    that.options.aliases['Folder->' + folder].block.text(newString);
                }
            },
            buildFolders : function(that) {
                var subPanes = [];
                // Get messages
                if (that.options.params.messages) {
                    for (var i in that.options.params.messages) {
                        // Rebuild sub pane object.
                        subPanes.push([{
                            css : {
                            },
                            "class" : "outlook_folder",
                            "text" : "",
                            "id" : i,
                            "alias" : "Folder->" + i,
                            "onClick" : function(that2, folder) {
                                that2.options.params.functions.selectFolder(that2, folder);
                            },
                            "onLoad" : function(that2, folder) {
                                that2.options.params.functions.updateFolderCount(that2, folder);
                            }
                        }]);
                    }
                }
                
                that.options.aliases['Messages'].block.empty();
                var parentPane = $('<table class="child_pane"></table>').appendTo(that.options.aliases['Messages'].block);
                that.buildPanes(parentPane, subPanes);
            }
        }
    };
    
    return params;
}