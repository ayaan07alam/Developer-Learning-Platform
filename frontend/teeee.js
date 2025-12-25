$(document).ready(function() {
    // 1. Run processTable when the DOM is fully loaded
    processTable();

    // 2. Trigger when the specific dropdown value changes
    $('#inpt_recmachcustrecord_act_vs_forc_vs_bud_relationrange2').change(function() {
        processTable();
    });

    // 3. Trigger on click or focus events on the input field
    $('#inpt_recmachcustrecord_act_vs_forc_vs_bud_relationrange2').on('click focus', function() {
        processTable();
    });

    // 4. Trigger if a specific table exists
    if ($('#recmachcustrecord_act_vs_forc_vs_bud_relation__tab').length > 0) {
        processTable();
    }

    // 5. Polling for an element to appear
    var checkExist = setInterval(function() {
        if ($('#recmachcustrecord_act_vs_forc_vs_bud_relation__tab').length) {
            clearInterval(checkExist); // Stop polling once the element is found
            processTable();
        }
    }, 100); // Check every 100ms

    // 6. Trigger manually from a button
    $('.uir-select-input-container').click(function() {
        processTable();
    });

    // 7. Multiple events trigger
    $('#inpt_recmachcustrecord_act_vs_forc_vs_bud_relationrange2').on('click focus change', function() {
        processTable();
    });


    function processTable() {
        console.log("Enter Into Function Of Javascript : view");
    
        var table = document.getElementById('recmachcustrecord_act_vs_forc_vs_bud_relation__tab');
        if (table) {
            for (var i = 1; i < table.rows.length; i++) {
                var costCenter = table.rows[i].cells[1].childNodes[0].nodeValue;
                if (costCenter === 'PERSONNEL COST') {
                    var rowId = table.rows[i].id;
                    var id = document.getElementById(rowId);
                    if (id) {
                        id.hidden = true;
                        console.log("Hide Success : view");
                    } else {
                        console.log("Element with ID not found:", rowId);
                    }
                }
            }
        } else {
            console.log("Table not found");
        }
    }
    
    // Run the function on page load
    processTable();

});


