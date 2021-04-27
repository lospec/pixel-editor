var rawFile = new XMLHttpRequest();
rawFile.open("GET", '/pixel-editor/latestLog.html', false);
rawFile.onreadystatechange = function ()
{
    if(rawFile.readyState === 4)
    {
        if(rawFile.status === 200 || rawFile.status == 0)
        {
            var allText = rawFile.responseText;
            document.getElementById("latest-update").innerHTML = allText;
        }
    }
}
rawFile.send(null);