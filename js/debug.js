var _print_r_indent = 0;
var _print_r_increment = 8;
function print_r(obj) {
    var indentText = "";
    for (x = 0; x < _print_r_indent; x++) {
        indentText += " ";
    }
    var result = "";
    if (typeof obj == 'object') {
        for (x in obj) {
            result += indentText + "Object ['" + x + "'] =>";
            //alert(x + " = " + typeof(obj[x]));
            if (typeof obj[x] == 'object') {
                _print_r_indent += _print_r_increment;
                result += "\n" + indentText + print_r(obj[x]);
                _print_r_indent -= _print_r_increment;
            }
            else {
                result += "(" + typeof(obj[x]) + ") " + obj[x] + "\n";
            }
        }
    }
    else result += indentText + "(" + typeof(obj) + ") " +  obj;
    return result;
}