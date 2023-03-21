function exportHTML(param, day, month, year, publisherName, leaderDepartment, director, securityValue, priorityValue) {
    console.log(param);
    var header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " +
        "xmlns:w='urn:schemas-microsoft-com:office:word' " +
        "xmlns='http://www.w3.org/TR/REC-html40'>" +
        "<head>" +
        "<style>table, td, th {border: unset;}</style>" +
        "<meta charset='utf-8'><title>Export HTML to Word Document with JavaScript</title></head><body>";
    var footer = "</body></html>";
    var leaderDepartmentRole = leaderDepartment.roleName;
    var signer = ``;
    var incommingNumber = param.incommingNumber != undefined ? param.incommingNumber : param.IncommingNumber;
    var number = param.number != undefined ? param.number : param.Number;
    var summary = param.summary != undefined ? param.summary : param.Summary;
    var processingRecommended = param.processingRecommended != undefined ? param.processingRecommended : param.ProcessingRecommended;
    if (leaderDepartmentRole == "Trưởng phòng ") {
        signer += `<b>TRƯỞNG PHÒNG</b>`;
    } else {
        signer += `<b>KT. TRƯỞNG PHÒNG</b><br><b>PHÓ TRƯỞNG PHÒNG</b>`
    }
    //  param.range = (param.range !== null || param.range !== undefined) ? param.range : '';
    var body = `
     <div class="word-content" id="source-html">
     <div id="content" #content>
          <table style="width:100%; border: unset;font-size: 18.5px;">
               <thead>
                    <tr>
                         <th style="text-align: left;font-size: 16.5px;">CÔNG AN TP HỒ CHÍ MINH</th>
                     <th style="text-align: center;font-size: 16.5px;">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</th>
                    </tr>
                    <tr>
                     <td style="text-align:center; font-weight: bold; text-decoration: underline;font-size: 16.5px;">PHÒNG THAM MƯU</td>
                     <td style="text-align: center; font-weight: bold;text-decoration: underline;">Độc lập - Tự do - Hạnh phúc</td>
                   </tr>
                   <tr>
                     <td style="text-align: left; padding-left: 40px;">Số đến: ` + incommingNumber + `</td>
                     <td style=" font-style: italic; text-align: justify;">TP.Hồ Chí Minh, ngày ` + day + ` tháng ` + month + ` năm ` + year + `</td>
                   </tr>
             </thead>
             <tbody>
                 <tr style="margin-top: 30px">
                     <th colspan="2" style="text-align:center;">PHIẾU TRÌNH ĐỀ XUẤT Ý KIẾN CHỈ ĐẠO</th>          
                 </tr>
                 <tr>
                    <th colspan="2" style="text-align:center; font-weight: normal;">Số văn bản : ` + number + `</th>
                    </tr>
                    <tr>
                    <th colspan="2" style="text-align:center; font-weight: normal;">Cơ quan ban hành : ` + publisherName + `</th>
                    </tr>
                    <th colspan="4" style="text-align:center; font-weight: normal;"><span style="margin-right: 30px;">Độ mật: ` + securityValue + ` </span> - Độ khẩn: ` + priorityValue + `</th>
                    <tr>
                    </tr>
                    <tr>
                    <th colspan="2"style="text-align:center; font-weight: normal;">Kính gửi : &nbsp;<span style="font-weight: bold;">Đ/c&nbsp;&nbsp;` + director.fullName + `&nbsp; - &nbsp;` + director.roleName + ` CATP</span></th>
                    </tr>
                    </tbody>
               </table>
               <br />
               <br />
               <div class="row justify-content-center">
                   <div class="col-4" style="margin-left: 20px; font-size: 18.5px;">
                       <b>
                           Ý kiến chỉ đạo của Ban Giám đốc CATP:
                       </b>
                   </div>
               </div>
               <div class="row justify-content-center"
                   style="padding: 5px 5px 32px 5px;font-weight: bold">
                   <div class="col-4">
                       <b>
                           ............................................................................................................................................................
                           ............................................................................................................................................................
                           ............................................................................................................................................................
                           ............................................................................................................................................................
                           ............................................................................................................................................................
                           ............................................................................................................................................................
                           ............................................................................................................................................................
                           ............................................................................................................................................................
                       </b>
                   </div>
                   
               </div>
               <br />
               <br />
               <div class="row justify-content-center"
                   style="padding: 0px 5px 32px 5px ;font-weight: normal; font-size: 18.5px;">
                   
                   <div class="col-4" style="margin-left: 20px; font-weight: bold;">
                       <b>
                           Ý kiến đề xuất của Phòng Tham mưu CATP
                       </b>

                   </div>
                   <div class="col-4">
                        <p style="text-indent: 20px;">` + summary + `</p>
                   </div>
               </div>
               <div class="row justify-content-center"
                   style="padding: 5px 5px 32px 5px ;font-weight: normal; font-size: 18.5px;">
                   <div class="col-4">
                       <p style="text-indent: 20px;">` + processingRecommended + `</p>
                       </div>
                </div>
                <br />
                <div class="row justify-content-between" style=" padding-bottom: 50px; font-size: 18.5px; width: 100%">
                    <table style="width: 100%;font-size: 18.5px; font-weight: bold">
                        <tr>
                            <td width="60%"></td>
                            <td width="40%" style="text-align:center;">` + signer + `</td>
                        </tr>
                        <tr style="height: 120px;"></tr>
                        <tr>
                            <td width="60%"></td>
                            <td width="40%" style="text-align:center;">` + leaderDepartment.fullName + `</td>
                        </tr>
                    </table>
                    
                </div>
                   

               </div>
           </div>`;

    //var sourceHTML = header + document.getElementById("source-html").innerHTML + footer;
    var sourceHTML = header + body + footer;
    var source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    var fileDownload = document.createElement("a");
    document.body.appendChild(fileDownload);
    fileDownload.href = source;
    fileDownload.download = 'PHIẾU TRÌNH ĐỀ XUẤT Ý KIẾN CHỈ ĐẠO.doc';
    fileDownload.click();
    document.body.removeChild(fileDownload);
}
