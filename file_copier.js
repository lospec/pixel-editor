const fs = require('fs');

const fileArr = walk("./",n => !n.includes("node_modules")
    && !n.includes(".git")
    && !n.includes(".vscode")
    && !n.includes("build")
);
const destPath = `C:/Users/jaman/OneDrive/Documents/GitHub/pixel-editor/`;
console.log('fileArr === ',fileArr);
fileArr.forEach(pathStr=>{
    const fileStr = fs.readFileSync(pathStr, "utf8");
    const destFilePathStr = destPath + pathStr;
    console.log('destFilePathStr, fileStr.length === ',destFilePathStr, fileStr.length);
    fs.writeFileSync(destFilePathStr, fileStr);
})

function walk(dir, condition = () => true ) {
    // console.log('dir === ',dir);
    let results = [];
    for (let file of fs.readdirSync(dir)) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file, condition));
        } else { 
            if(condition(file))results.push(file);
        }
    }
    return results;
}