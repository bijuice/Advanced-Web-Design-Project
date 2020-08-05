function show_extra(button,id,data,cid){
    if ($('#'+id).is(":visible")){
        $(button).html('<i class="fas fa-arrow-down"></i>')
        $('#'+id).parent().animate({
            width: "20em"
        })
    }
    else{
        $(button).html('<i class="fas fa-arrow-up"></i>')
        $('#'+id).parent().removeAttr('style');
    }
    $('#'+id).animate({
        height: "toggle"
    });
    var clickNum = $(button).data('clickNum');
    if (clickNum = 1){
        gen_chart(data,cid);
    }
    
    $(button).data('clickNum', ++clickNum);
}
function show_addhby(button){
    if ($('#add_hobby').is(":visible")){
        $(button).html('<i class="fas fa-plus-circle fa-4x"></i>')
    }
    else{
        $(button).html('<i class="fas fa-minus-circle fa-4x"></i>')
    }
    $('#add_hobby').animate({
        height: "toggle"
    });
}

function show_adddayform(id,button){
    if ($('#adddayform'+id).is(":visible")){
        $(button).html("Add Day")
    }
    else{
        $(button).html("Hide Add Day")
    }
    $('#adddayform'+id).animate({
        height: "toggle"
    });
}

function show_edit(id){
    $('#edit'+id).animate({
        height: "toggle"
    });
}

function gen_chart(array,cid){
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Date');
    data.addColumn('number', 'Actual');
    data.addColumn('number', 'Expected');
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
        url:'/get_array?id='+hby_id,
        async: false
    }).responseJSON;                     
}
function get_caldata(hby_id){  
    return $.getJSON({
        url:'/get_cal?id='+hby_id,
        async: false
    }).responseJSON;                     
}

function move_calb(hbby_id,id,name,options){
    var d = new Date();
    var counter = parseInt($('#'+id).attr("data"))
    counter-=1;
    $('#'+id).attr("data",counter);
    d.setMonth(d.getMonth()+counter);
    var month = d.getMonth()+1;
    var year = d.getFullYear();
    var activ = get_caldata(hbby_id);
    try {
        activ = activ[year][month];
    }
    catch(err) {
        console.log(err.message);
    }
    if(typeof activ == 'undefined'){
        create_calender(id,month,year,{},name,options);
    }
    else{
        console.log(activ)
        create_calender(id,month,year,activ,name,options);
    }
}

function move_calf(hbby_id,id,name,options){
    var d = new Date();
    var counter = parseInt($('#'+id).attr("data"))
    counter+=1;
    $('#'+id).attr("data",counter);
    d.setMonth(d.getMonth()+counter);
    var month = d.getMonth()+1;
    var year = d.getFullYear();
    var activ = get_caldata(hbby_id);
    try {
        activ = activ[year][month];
    }
    catch(err) {
        console.log(err.message);
    }
    if(typeof activ == 'undefined'){
        create_calender(id,month,year,{},name,options);
    }
    else{
        console.log(activ)
        create_calender(id,month,year,activ,name,options);
    }
}