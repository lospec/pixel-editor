function closeCompatibilityWarning() {
	document.getElementById("compatibility-warning").style.visibility =	"hidden";
}

//check browser/version
if (
	(bowser.firefox && bowser.version >= 28) ||
	(bowser.chrome && bowser.version >= 29) ||
	(!bowser.mobile && !bowser.tablet)
)
	console.log("compatibility check passed");
//show warning
else document.getElementById("compatibility-warning").style.visibility = "visible";
