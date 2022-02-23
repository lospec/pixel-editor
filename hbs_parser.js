const fs = require('fs');
const path = require('path');
const HANDLEBARS = require('handlebars');
const sass = require('sass');

const result = sass.compile('./css/pixel-editor.scss');
fs.writeFileSync("./css/pixel-editor.css",result.css);

// fs.readFile('/css/pixel-editor.scss', function(err, scssFile) {
//   compiler.compile(scssFile.toString(), function(err, css) {
//   });
// });

const hbsArr = [
    ...fs.readdirSync("./views/").filter(n=>n.slice(-3)==="hbs").map(n=>"./views/" + n),
    ...fs.readdirSync("./views/components/").filter(n=>n.slice(-3)==="hbs").map(n=>"./views/components/" + n),
    ...fs.readdirSync("./views/logs/").filter(n=>n.slice(-3)==="hbs").map(n=>"./views/logs/" + n),
    ...fs.readdirSync("./views/popups/").filter(n=>n.slice(-3)==="hbs").map(n=>"./views/popups/" + n),
];
const HBS_STR_MAP = {};
const HBS_SPEC_MAP = {};
const HBS_TEMPLATE_MAP = {};
const HBS_META_DATA = hbsArr.reduce((r,filePath,i)=>{

    const fileStr = fs.readFileSync(filePath,"utf8");
    const sp0 = fileStr.split("{{> ").slice(1);
    const partialArr = sp0.map(n=>n.split("}}")[0]);
    const sp1 = fileStr.split("{{").slice(1);

    if(sp0.length || sp1.length) {
        const dblCurlsArr = sp1.map(n=>n.split("}}")[0]);

        HBS_STR_MAP[filePath] = fileStr;

        HBS_SPEC_MAP[filePath] = HANDLEBARS.precompile(fileStr);
        // HBS_TEMPLATE_MAP[filePath] = HANDLEBARS.template(HBS_SPEC_MAP[filePath]);

        r[filePath] = {
            fileStr,
            filePath,
            dblCurlsArr,
            partialArr
        };
    }
    
    return r;
},{});

fs.writeFileSync(
    "./js/HBS_META_DATA.js",
    "const HBS_META_DATA = " + JSON.stringify(HBS_META_DATA,null,4)
);