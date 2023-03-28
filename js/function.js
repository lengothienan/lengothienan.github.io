function CallAPI(){
    $.ajax({
        url: 'https://apithienan.000webhostapp.com/',
        type: 'POST',
        dataType:'json', 
        data: {
            action: "load"
        },
        success: function(data) {
            console.log(data)
        }
    });
}