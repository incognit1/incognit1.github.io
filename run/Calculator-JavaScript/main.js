window.onload = function(){
		var pressed = get('#pressed'); //entered data
		var numeric, 
			flag = false, //control of mathematical expressions
			flagCalc = false, //zeroes the value after entering a new value
			firstCalc = true; // to open the story after first cacl

		var patDigit = /[0-9|\.]+/, //checking for numeric values
			patOperations = /[\*\/\+\-]/; //checking for operation values

		get(".container").addEventListener('click', function(event){

			if (event.target.nodeName == 'BUTTON'){
				if (~event.target.value.search(patDigit)) {
					if (flagCalc) {
						pressed.value = ''; 
						flagCalc = false;  
					}
					pressed.value += event.target.value;
					flag = true;
				}

				else if (~event.target.value.search(patOperations)) {
					if (flag) {
						pressed.value += event.target.value;
						flag = false;
						flagCalc = false;  
					}
				}

				switch (event.target.value) {
					case '=': 	
						if(!pressed.value == "") {
							if (firstCalc = true) { 
								get('#history').classList.add("show"); 
								firstCalc = false; 
								get('#printBtn').removeAttribute('disabled'); 
								get('#printBtn').classList.add("zoom");
							}
							numeric = Math.floor(eval(pressed.value) * 100) / 100;
							get('#output').value += '\n' + pressed.value;
							get('#output').value += '=' + numeric + ' ';
							get('#output').focus();	
							pressed.value = numeric;
							flagCalc = true;
							firstCalc = true;
						}
						break;
					case 'CLast':
						var clast = pressed.value.substring(0, pressed.value.length-1);
						pressed.value = clast;
						break;
					case 'C':
						pressed.value = "";
						break;
					case 'M':
						get('#memory').innerHTML = pressed.value;
						break;
				}
			}
		}, false) 

		function get(el) {
			return document.querySelector(el);
		}
}