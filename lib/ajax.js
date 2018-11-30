JCB.CreateAjaxObj = function(method, parameter) {
	var obj = new XMLHttpRequest();
	obj.open(method, parameter, true);
	obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	return obj;
}

JCB.isAjaxRequestReady = function(obj) {
	if (obj.readyState == 4 && obj.status == 200) {
		return true;
	}
	return false;
}

// Usage
//----------------------------------------------------
// function foo() {
// 	var ajax = CreateAjaxObj("POST", "file.php");
// 	ajax.onreadystatechange = function() {
// 	if (isAjaxRequestReady(ajax)) {
// 		Do something with the ajax.responseText result.
// 	}
// }
// ajax.send("var1=param1&var2=param2");
// results.innerHTML = "processing...";
// }

