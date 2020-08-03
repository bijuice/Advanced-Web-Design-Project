function show_extra(button,id,data,cid){
    if ($('#'+id).is(":visible")){
        $(button).html('<i class="fas fa-arrow-down"></i>')
    }
    else{
        $(button).html('<i class="fas fa-arrow-up"></i>')
    }
    $('#'+id).animate({
        height: "toggle"
    });

    var clickNum = $(button).data('clickNum');
    if (clickNum = 1){
        gen_chart(data,cid);
    }
    
    console.log(clickNum)

    $(button).data('clickNum', ++clickNum);
}
function show_addhby(button){
    if ($('#add_hobby').is(":visible")){
        $(button).html('Close Add hobby')
    }
    else{
        $(button).html('Add a new hobby')
    }
    $('#add_hobby').animate({
        height: "toggle"
    });

    var clickNum = $(button).data('clickNum');
    if (clickNum = 1){
        gen_chart(data,cid);
    }
    
    console.log(clickNum)

    $(button).data('clickNum', ++clickNum);
}
function gen_chart(array,cid){
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Date');
    data.addColumn('number', 'Expected');
    data.addColumn('number', 'Actual');
    for (i = 0; i < array.length; i++) {
        array[i][0] = new Date(array[i][0])
      }
    data.addRows(array);

    var options = {
        title: "Overall Minutes",

        legend: { position: 'bottom' },
        width: 900,
        height: 500
    };
    var chart = new google.visualization.BarChart(document.getElementById(cid.id));    
    chart.draw(data, options);

    }
}
function get_chartdata(hby_id){  
    return $.getJSON({
        url:'/get_array/'+hby_id,
        async: false
    }).responseJSON;                     
}
function get_caldata(hby_id){  
    return $.getJSON({
        url:'/get_cal/'+hby_id,
        async: false
    }).responseJSON;                     
}