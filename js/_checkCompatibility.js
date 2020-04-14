/////=include libraries/bowser.js

function closeCompatibilityWarning () {
    document.getElementById('compatibility-warning').style.visibility = 'hidden';
}

console.log('checking compatibility');

//check browser/version
if ((bowser.msie && bowser.version < 11) || 
    (bowser.firefox && bowser.version < 28) ||  
    (bowser.chrome && bowser.version < 29)  ||  
    (bowser.msedge && bowser.version < 12)  ||  
    (bowser.safari && bowser.version < 9)  ||  
    (bowser.opera && bowser.version < 17)  )  
    //show warning  
    document.getElementById('compatibility-warning').style.visibility = 'visible';

else alert(bowser.name+' '+bowser.version+' is fine!');
