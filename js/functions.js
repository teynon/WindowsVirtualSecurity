function selectTab(tabId, tabCount, tabName, blockName, hideClass, showClass) {
    var i = 0;
    for (i = 0; i < tabCount; i++) {
            $('#' + tabName + i).removeClass(showClass);
            $('#' + tabName + i).addClass(hideClass);

            $('#' + blockName + i).css("display", "none");
    }

    $('#' + tabName + tabId).removeClass(hideClass);
    $('#' + tabName + tabId).addClass(showClass);

    $('#' + blockName + tabId).css("display", "block");
}

// Autobuild form datepickers
$(document).ready(function() {
    $(".form_datepicker").datepicker({ changeMonth: true, changeYear: true});
    $('input[type=file]').each(function(){
        $(this).addClass('hidden');
        $(this).wrap($('<div class="form_file_input"></div>'));
        $(this).parent().append($('<div class="form_file_fake"></div>').append('<div class="form_file_button">Upload</div>').append($('<input type="text" class="form_file_fake_input" />').attr('id', $(this).attr('id')+'__fake')));

        $(this).bind('change', function() {
            $('#'+$(this).attr('id')+'__fake').val($(this).val());;
        });
        
        $(this).bind('mouseout', function() {
            $('#'+$(this).attr('id')+'__fake').val($(this).val());;
        });
    });
});