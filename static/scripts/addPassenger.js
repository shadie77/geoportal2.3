var table = document.getElementsByClassName('showCSV')[0]


function showTable() {
    var fileUpload = document.getElementById('file');
    if (fileUpload.files.length > 0) {
        table.innerHTML = "";
        var file = fileUpload.files[0];
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
        console.log(evt.target.result);
        let csv = evt.target.result.split("\r\n");
        let index = 0;
        for (let row of csv) {
            let tr = table.insertRow(index);
            let rowindex= 0
            for (let col of row.split(",")) {
                let td = tr.insertCell(rowindex);
                td.innerHTML = col;
                rowindex++;
        }
            index++
        }
}}
}