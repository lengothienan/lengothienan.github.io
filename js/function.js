function CallAPI(){
    $.ajax({
        url: 'https://apithienan.000webhostapp.com/?id=1',
        type: 'GET',
        dataType:'json', 
        success: function(data) {
        //    $("#main").html(data)
        }
    });
}