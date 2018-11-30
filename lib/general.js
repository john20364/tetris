//-------------------------------------
// Generic event handler
//-------------------------------------
//function(e) {
	//e = e || event;
	//var target = 
		//e.target || e.srcElement;
//}

//-------------------------------------
// Cancel Bubbing
//-------------------------------------
// e.cancelBubble = true;
// if (e.stopPropagation) {
//     e.stopPropagation();
// }

//-------------------------------------
// Prevent Default Action
// An event handler can prevent a browser
// action associated with the event
// (such as submitting a form).
//-------------------------------------
//e.returnValue = false;
//if (e.prventDefault) {
	//e.preventDefault();
//}
//return false;


JCB.locked = false;

JCB.showChildNodes = function(childnodes, show) {
	for (i=0; i<childnodes.length-1;i++) {
		//nodeType 1: ELEMENT_NODE
		if ((childnodes[i].nodeType) === 1) {
			if (show) {
				childnodes[i].style.display = "block"; //block
			} else {
				childnodes[i].style.display = "none"; //block
			}
		}
	}
}

JCB.walkTheDOM = function(node, func) {
	func(node);
	node = node.firstChild;
	while (node) {
		JCB.walkTheDOM(node, func);
		node = node.nextSibling;
	}
}

JCB.purgeEventHandlers = function(node) {
	JCB.walkTheDOM(node, function(e) {
		for (var n in e) {
			if (typeof e[n] === 'function') {
				e[n] = null;
			}
		}
	});
}

JCB.getElementByClassNameAndId = function(classname, id) {
	var nodes = JCB.getElementsByClassName(classname);
	var node = null;
	var i;
	for (i=0; i<nodes.length; i++) {
		if (nodes[i].id === id) {
			node = nodes[i];
			break;
		}
	}
	return node;
}

JCB.getElementsByClassName = function(className) {
	var results = [];
	JCB.walkTheDOM(document.body, function(node) {
		var a, c = node.className, i;
		if (c) {
			a = c.split(' ');
			for (i=0; i<a.length; i +=1) {
				if (a[i] === className) {
					results.push(node);
					break;
				}
			}
		}
	});
	return results;
}

JCB._ = function(id) {
	return document.getElementById(id);
}

JCB.readOnlyStyle = function(el) {
	if (window.getComputedStyle) {
	  return getComputedStyle(el, null);
	} else {
	  // IE
	  return el.currentStyle;
	}
}

JCB.empty = function(parent) {
	JCB.purgeEventHandlers(parent);
	parent.innerHTML = '';
}

JCB.getRole = function(role) {
	var r = role.toLowerCase();
	if (r === 'nurse') {
		return 'Verpleegkundige';
	} else if (r === 'physician') {
		return 'Arts';
	}
}

JCB.getSex = function(gender) {
	var g = gender.toLowerCase();
	if((g == 'f') || (g == 'v')) {
		return 'Vrouw';
	}
	if (g == 'm') {
		return 'Man';
	}
}

JCB.getDOB = function(dob) {
	var res = dob.split('-', 3)
	var day = res[2].split(' ')[0];
	var month = res[1];
	var year = res[0];
	return day+'-'+month+'-'+year;
}

JCB.getAge = function(dob) {
	var res = dob.split('-', 3)
	var day = res[2].split(' ')[0];
	var month = res[1];
	var year = res[0];
	
	var n = new Date();
	if(n != null) {
		var age = n.getFullYear() - year;
		if (month - n.getMonth() > 0) {
			age--;
		} else if (month == n.getMonth()) {
			if (day - n.getDate() > 0) {
				age--;
			}
		}
		return age;
	}
	return null;
}

JCB.getDateTimeStr = function(date) {
	var res = 
		date.getFullYear() + "-" + 
		(date.getMonth()+1) + "-" + 
		date.getDate() + " " +
		date.getHours() + ":" +
		date.getMinutes() + ":" +
		date.getSeconds();
	return res;
}

JCB.getDateStr = function(date) {
	var res = 
		date.getFullYear() + "-" + 
		(date.getMonth()+1) + "-" + 
		date.getDate();
	return res;
}

JCB.getTimeStr = function(date) {
	var res = 
		date.getHours() + ":" +
		date.getMinutes() + ":" +
		date.getSeconds();
	return res;
}

JCB.getTemperatureObj = function(temp) {
	var color = '',
		acclamation = '';
	if (temp >= 36.5 && temp <= 37.5) {
		color = "#0c0";
	} else if (temp > 37.5 && temp <= 37.9) {
		color = "#f90";
	} else  if (temp > 37.9) {
		color = "#f00";
		acclamation = " !";
	} else if (temp < 36.5) {
		color = "#00f";
		acclamation = " !";
	} else {
		color = "#000";
	}
	return {
		"temperature":temp,
		"color":color,
		"acclamation":acclamation
	};
}





