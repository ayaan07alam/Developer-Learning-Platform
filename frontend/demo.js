
jQuery(document).ready(function() {
console.log("Enter Into Function Of Javascript : view");
var table = document.getElementById('recmachcustrecord_act_vs_forc_vs_bud_relation__tab');
for (var i = 1; i < table.rows.length; i++) {
    var costCenter = table.rows[i].cells[1].childNodes[0].nodeValue;
 if (costCenter == 'PERSONNEL COST') {
var rowId = table.rows[i].id;
var id = document.getElementById(rowId);
id.hidden = true;
console.log("Hide Success : view");
 }
}
 });
