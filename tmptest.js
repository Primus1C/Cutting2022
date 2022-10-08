function Main() {

    let p = '<p>Строка без таблицы</p>';
    p += '<p>Вторая строка без таблицы</p>';

    p += "<table class='page' border='1'>";
    p += "<tr><td>Колонка 1</td><td>Колонка 2</td><td>Колонка 3</td></tr>";
    p += "<tr><td>100</td><td>200</td><td>300</td></tr>";
    p += "<tr><td>101</td><td>202</td></tr>";
    p += "<tr><td>aaa</td><td>bbb</td><td>ccc</td><td>ddd</td></tr>";
    
    p += "</table>";
//console.log(document.querySelector(".page").innerHTML);
    p += "<p>Последняя строка без таблицы</p>";

    document.querySelector(".page").innerHTML = p;

}

Main();