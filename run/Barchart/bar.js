function createSVGChart(elements, width, height, color, names) {

  var chart = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  chart.setAttribute('id', 'chartbar');
  chart.style.width = width + 'px';
  chart.style.height = height + 'px';
  chart.style.margin = '20px auto';

  var isMax,
      maxLength = Number.NEGATIVE_INFINITY,
      maxI = findMax(),
      max = elements[maxI],
      scale = height / max,
      width = Math.floor(width / elements.length);


  for (var i = 0; i < names.length; i++) {
    if (maxLength < names[i].length) {
      maxLength = names[i].length;
    }
  }

  chart.style.paddingBottom = maxLength * 10 + 'px';

  //creation of rect elements
  for (var i = 0; i < elements.length; i++) {
    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect"),
      	textVal = document.createElementNS("http://www.w3.org/2000/svg", "text"),
      	textNames = document.createElementNS("http://www.w3.org/2000/svg", "text");

    draw(i, rect, textVal, textNames);
    textVal.onclick = textListener;

    chart.appendChild(rect);
    chart.appendChild(textVal);
    chart.appendChild(textNames);
  }


  //listener for click on value
  function textListener(e) {
    var arrRect = document.getElementsByTagName('rect'),
      	arrTextVal = document.querySelectorAll('text[id^=val]');
      	arrTextNames = document.querySelectorAll('text[id^=name]');

    var oldValue = e.target.textContent,
        newValue = prompt("Хотите изменить значение?", e.target.textContent);
    item = Number(e.target.getAttribute('id').replace(/\D+/g, ""));

    //check for input
    if (!newValue || !~newValue.search(/\d+/g)) return;
    newValue = newValue.replace(/\D+/g, "");
    e.target.textContent = newValue;

    //save to array
    elements[item] = newValue;

    //is it element with max value?
    isMax = maxI == item;
    if (isMax && +newValue < +oldValue) {
      maxI = findMax();
      max = elements[maxI];
      scale = height / max;
    }

    //if new value > max
    if (+newValue > +max) {
      maxI = item;
      max = newValue;
      scale = height / max;
    }

    for (var i = 0; i < elements.length; i++) {
      draw(i, arrRect[i], arrTextVal[i], arrTextNames[i]);
    }
  }


  //finding the maximum value of chartbar
  function findMax() {
    var max = Number.NEGATIVE_INFINITY,
      n;

    for (var i = 0; i < elements.length; i++) {
      if (elements[i] > max) {
        max = elements[i];
        n = i;
      }
    }
    return n;
  }

  //rendering of chartbar
  function draw(i, rect, textVal, textNames) {
    var textPos = 25,
      textColor = '#f3f3f3';
    rect.setAttribute('width', width - 4 + 'px');
    rect.setAttribute('height', elements[i] * scale + 'px');
    rect.setAttribute('fill', color);
    rect.setAttribute('y', height - elements[i] * scale + 'px');
    rect.setAttribute('x', width * i + 'px');

    if (+elements[i] < +max / 9) {
      textPos = -15;
      textColor = '#5f5f5f';
    }

    textVal.setAttribute('id', 'val-' + i)
    textVal.setAttribute('y', height - elements[i] * scale + textPos + 'px');
    textVal.setAttribute('x', width * i + width / 2.1 + 'px');
    textVal.setAttribute('fill', textColor);
    textVal.innerHTML = elements[i];

    //check for length of title
    if (elements[i].length > width/10) {
      textVal.setAttribute('writing-mode', 'tb');
      textVal.setAttribute('text-anchor', '');
    }

    else {
      textVal.setAttribute('writing-mode', '');
      textVal.setAttribute('text-anchor', 'middle');
    }

    textNames.setAttribute('id', 'name-' + i)
    textNames.setAttribute('y', height + 10 + 'px');
    textNames.setAttribute('x', width * i + width / 2.1 + 'px');
    textNames.innerHTML = names[i];
  }

  return chart;
}



//first try to div implementation
// function createDIVChart(elements, width, height, color) {
// 		var chart = document.createElement('div');

// 		chart.style.position = 'relative';
// 		chart.style.width = width + 'px';
// 		chart.style.height = height + 'px';
// 		chart.style.margin = '20px auto';

// 		//finding max value
// 		var max = Number.NEGATIVE_INFINITY;
// 		for (var i = 0; i < elements.length; i++) {
// 			if (elements[i] > max) max = elements[i];
// 		}

// 		var scale = height/max,
// 			width = width/elements.length;

// 		//creating bars
// 		for (var i = 0; i < elements.length; i++) {
// 			bar = document.createElement('div');
// 			bar.style.position = 'absolute';
// 			bar.style.backgroundColor = color;
// 			bar.style.width = width - 4 + 'px';
// 			bar.style.left = width * i + 'px';
// 			bar.style.bottom = '0px';
// 			bar.style.height = elements[i] * scale + 'px';

// 			chart.appendChild(bar);
// 		}

// 		return chart;
// }
