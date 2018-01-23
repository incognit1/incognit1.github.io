//(function() {

	var createTask = get("#createTask"),
		deleteTasks = get("#deleteTasks"),
		list = get("#tasks"),
		bg = get("#bg");

	//Start data
	function loadData() {
		var startData = JSON.parse(dataJSON);

		for(var i = 0; i < startData.length; i++) {
		var newLi = document.createElement("li"),
			newInput = document.createElement("input"),
			newLabel = document.createElement("label");

			newLabel.innerHTML = startData[i].value;
			newInput.setAttribute("type", "checkbox");
			newInput.setAttribute("id", "item" + startData[i].id);
			newLabel.setAttribute("for", "item" + startData[i].id);

			newLi.appendChild(newInput);
			newLi.appendChild(newLabel);
			
			list.appendChild(newLi);
		}
	}

	loadData();

	//Adding new task
	createTask.addEventListener("click", function() {
		var newLabelText = prompt("Назовите задачу");

		if (newLabelText!=null && newLabelText!="") {
			var newLi = document.createElement("li"),
			newInput = document.createElement("input"),
			newLabel = document.createElement("label"),
			arrItems = document.querySelectorAll("#tasks li");

			newLabel.innerHTML = newLabelText;
			newInput.setAttribute("type", "checkbox");
			newInput.setAttribute("id", "item" + arrItems.length);
			newLabel.setAttribute("for", "item" + arrItems.length);
			contextMenuListener(newLabel);

			newLi.appendChild(newInput);
			newLi.appendChild(newLabel);
			
			list.appendChild(newLi);
		}
	},false);

	//Changing
	var items = document.querySelectorAll("#tasks li label");

	for( var i = 0; i < items.length; i++) {
		contextMenuListener(items[i]);
	}

	function contextMenuListener(el) {
		el.addEventListener("contextmenu", function(e){
			e.preventDefault();
			var oldData = this.innerHTML;
			var newData = prompt("Изменить задачу", oldData);
			if (newData != null && newData != undefined) {
				this.innerHTML = newData;
			}
						
		})
	}

		
	//delete all tasks
	deleteTasks.addEventListener("click", function() {
		//var arrItems = document.querySelectorAll("#tasks li input[type=checkbox]");
		//console.log(arrItems[3].checked);
		var arrItems = document.querySelectorAll("#tasks li");

		for (var i = 0; i < arrItems.length; i++) {
			var arrCheckbox = arrItems[i].firstChild;
			if (arrCheckbox.checked) {
				console.log(i);
				arrItems[i].remove();
			}
		}

		var newArrItems = document.querySelectorAll("#tasks li");
		for (var i = 0; i < newArrItems.length; i++) {
			newArrItems[i].firstChild.setAttribute("id","item" + i);
			newArrItems[i].lastChild.setAttribute("for","item" + i);
		}
	}, false)

	//background
	bg.addEventListener("change", function(){
		document.body.style.background = bg.value;
	}, false)


	var degree = -5,
		bgParam = get("#bg-param");
	setInterval(function(){
		degree = degree + 1 % 360;
		bgParam.style.color = "hsl(" + degree + ", 30%, 45%)";
	}, 200);


	function get(el) {
		return document.querySelector(el);
	}

//})();

