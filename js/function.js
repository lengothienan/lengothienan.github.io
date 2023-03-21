function CallAPI(){
    $.ajax({
        url: 'https://thienanapi.000webhostapp.com/?id=1',
        type: 'GET',
        dataType:'json', 
        success: function(data) {
           console.log(data);
        }
    });
}