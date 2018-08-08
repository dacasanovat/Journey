
/* Vanilla JS Calendar */
(function vanillaJsCalendar(){

"use strict";
var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let DateObject;
let theDate;

// document.addEventListener("DOMContentLoaded", function(event){

		theDate = new Date();

		DateObject = function DateObject(theDate) {
				this.theDay = theDate.getDate();
				this.dayName = dayNames[theDate.getDay()];
				this.theMonth = monthNames[theDate.getMonth()];
				this.theYear = theDate.getFullYear();
				this.daysInMonth = new Date(theDate.getFullYear(), theDate.getMonth()+1, 0).getDate();
				this.firstDayOfMonth = dayNames[new Date(theDate.getFullYear(), theDate.getMonth(), 1).getDay()];
		};

		var currentDate = new DateObject(theDate);

		function renderCalendar(targetElem){
				// Custom function to make new elements easier:
				function addElem(elementType, elemClass, appendTarget){
					appendTarget.innerHTML += "<"+elementType+" class="+elemClass+"> </"+elementType+">";
				}

				currentDate = new DateObject(theDate);

				// Refreshing Calendar
				var renderTarget = document.getElementById(targetElem);
				renderTarget.remove();
				renderTarget = document.createElement("div");
				renderTarget.id = targetElem;
				document.getElementsByTagName('body')[0].appendChild(renderTarget);

				// Monday, dayView
				addElem("div", "day-view", renderTarget);
				const dayView = document.querySelector('.day-view');
				const dayNameElem = document.createElement("div"); // i.e.: Wednesday
				dayView.setAttribute('id', 'dayView');
				dayNameElem.className = "day-header";
				const dayNameNode = document.createTextNode(currentDate.dayName);
				dayNameElem.appendChild(dayNameNode);
				dayView.appendChild(dayNameElem);

				const formString =
						`
						<div class="row headerDaySection">
						  <div class="day-header col s10">Monday</div>
						  <div class="day-header todaySection col s2"><a href="#" id="goToday"><img class="imagenToday" src="/images/today.png" alt="today"><a/></div>
						</div
						<div class="row">
							<form id="activityForm" class="col s12">
								<div class="row">
									<div class="input-field col s12">
										<input id="activityInput" type="text">
										<input type="submit" style="display:none">
										<label for="activityInput">Activity</label>
									</div>
								</div>
							</form>
						</div>

						<ul class="collection" id="activityLog">

						</ul>
						`;

				// ADDING html to <div id='dayView'>
				$('#dayView').html(formString);



				// 21st, dayNumber
				// addElem("time", "day-number", dayView);
				// var dayNumber = document.querySelector('.day-number');
				// var dayNumNode = document.createTextNode(currentDate.theDay);
				// dayNumber.appendChild(dayNumNode);
				// dayView.appendChild(dayNumber);

				addElem("div", "month-view", renderTarget);
				var monthView = document.querySelector('.month-view');

				var prevMonthSpan = document.createElement("SPAN");
				prevMonthSpan.addEventListener('click', function(){

					goToMonth(currentDate, false); // Go To Previous Month
				});
				prevMonthSpan.classList.add('arrow', 'float-left', 'prev-arrow');
				var backArrow = document.createTextNode("<");
				prevMonthSpan.appendChild(backArrow);

				var nextMonthSpan = document.createElement("SPAN");
				nextMonthSpan.addEventListener('click', function(){
					goToMonth(currentDate, true); // Go To Next Month
				});
				nextMonthSpan.classList.add('arrow', 'float-right', 'next-arrow');
				var nextArrow = document.createTextNode(">");
				nextMonthSpan.appendChild(nextArrow);

				document.onkeydown = function() {
					switch (window.event.keyCode) {
						case 37: //Left key
							goToMonth(currentDate, false);
							break;
						case 39: //Right key
							goToMonth(currentDate, true);
							break;
					}

				};

				var monthSpan = document.createElement("SPAN");
				monthSpan.className = "month-header";
				var monthOf = document.createTextNode(
					currentDate.theMonth +" "+ currentDate.theYear
				);

				monthSpan.appendChild(prevMonthSpan);
				monthSpan.appendChild(monthOf);
				monthSpan.appendChild(nextMonthSpan);
				monthView.appendChild(monthSpan);

				for(var i=0; i < dayNames.length; i++){
					var dayOfWeek = document.createElement('div');
					dayOfWeek.className = "day-of-week";
					var charOfDay = document.createTextNode(dayNames[i].charAt(0));
					dayOfWeek.appendChild(charOfDay);
					monthView.appendChild(dayOfWeek);
				}

				// renderTarget.appendChild(document.createElement("ul"));
				var calendarList = document.createElement("ul");
				for(i = 0; i < currentDate.daysInMonth; i++){
					var calendarCell = document.createElement("li");
					var calCellTime = document.createElement("time");
					calendarList.setAttribute('id', 'dayList');
					calendarList.appendChild(calendarCell);
					calendarCell.id = 'day_'+(i+1);
					var dayDataDate = new Date(theDate.getFullYear(), theDate.getMonth(), (i+1));
					calCellTime.setAttribute('datetime', dayDataDate.toISOString());
					calCellTime.setAttribute('data-dayofweek', dayNames[dayDataDate.getDay()]);

					calendarCell.className = "calendar-cell";
					if(i === currentDate.theDay-1){
						calendarCell.className = "today";
					}
					var dayOfMonth = document.createTextNode(i+1);
					calCellTime.appendChild(dayOfMonth);
					calendarCell.appendChild(calCellTime);
					monthView.appendChild(calendarList);
				} // daysInMonth for loop ends


				// let windowSize;
				//
				// window.addEventListener("resize", function() {
				// 	windowSize = window.innerWidth;
				// 	console.log(windowSize);
				// });

					if(window.innerWidth <= 767){
						console.log('screen size small')
						var dayOne = document.getElementById('day_1');
						if (currentDate.firstDayOfMonth == "Monday"){
							dayOne.style.marginLeft = "49px";
						} else if (currentDate.firstDayOfMonth == "Tuesday"){
							dayOne.style.marginLeft = "98px";
						} else if (currentDate.firstDayOfMonth == "Wednesday"){
							dayOne.style.marginLeft = "147px";
						} else if (currentDate.firstDayOfMonth == "Thursday"){
							dayOne.style.marginLeft = "196px";
						} else if (currentDate.firstDayOfMonth == "Friday"){
							dayOne.style.marginLeft = "245px";
						} else if (currentDate.firstDayOfMonth == "Saturday"){
							dayOne.style.marginLeft = "304px";
						}
					// } else {
					} else if(window.innerWidth >= 1396){
						console.log('screen size big')

						var dayOne = document.getElementById('day_1');
						if (currentDate.firstDayOfMonth == "Monday"){
							dayOne.style.marginLeft = "91px";
						} else if (currentDate.firstDayOfMonth == "Tuesday"){
							dayOne.style.marginLeft = "182px";
						} else if (currentDate.firstDayOfMonth == "Wednesday"){
							dayOne.style.marginLeft = "273px";
						} else if (currentDate.firstDayOfMonth == "Thursday"){
							dayOne.style.marginLeft = "364px";
						} else if (currentDate.firstDayOfMonth == "Friday"){
							dayOne.style.marginLeft = "455px";
						} else if (currentDate.firstDayOfMonth == "Saturday"){
							dayOne.style.marginLeft = "546px";
						}
					// }
					} else if(window.innerWidth < 1396 && window.innerWidth > 767){
						console.log('screen size medium');

						var dayOne = document.getElementById('day_1');
						if (currentDate.firstDayOfMonth == "Monday"){
							dayOne.style.marginLeft = "51px";
						} else if (currentDate.firstDayOfMonth == "Tuesday"){
							dayOne.style.marginLeft = "102px";
						} else if (currentDate.firstDayOfMonth == "Wednesday"){
							dayOne.style.marginLeft = "153px";
						} else if (currentDate.firstDayOfMonth == "Thursday"){
							dayOne.style.marginLeft = "204px";
						} else if (currentDate.firstDayOfMonth == "Friday"){
							dayOne.style.marginLeft = "255px";
						} else if (currentDate.firstDayOfMonth == "Saturday"){
							dayOne.style.marginLeft = "306px";
						}
					}

					function today(){
						for(i = 0; i < currentDate.daysInMonth; i++){
							var calendarCell = document.createElement("li");
							var calCellTime = document.createElement("time");
							calendarList.appendChild(calendarCell);
							calendarCell.id = 'day_'+(i+1);
							var dayDataDate = new Date(theDate.getFullYear(), theDate.getMonth(), (i+1));
							calCellTime.setAttribute('datetime', dayDataDate.toISOString());
							calCellTime.setAttribute('data-dayofweek', dayNames[dayDataDate.getDay()]);

							calendarCell.className = "calendar-cell";
							if(i === currentDate.theDay-1){
								calendarCell.className = "today";
							}
							var dayOfMonth = document.createTextNode(i+1);
							calCellTime.appendChild(dayOfMonth);
							calendarCell.appendChild(calCellTime);
							monthView.appendChild(calendarList);
						} // daysInMonth for loop ends
					}



				var dayHeader = document.getElementsByClassName('day-header');
				var dayNumNode = document.getElementsByClassName('day-number');
				var updateDay = function(){
					var thisCellTime = this.querySelector('time');
					dayHeader[0].textContent = thisCellTime.getAttribute('data-dayofweek');

					dayNumNode[0].textContent = this.textContent;

				}

				var calCells = document.getElementsByClassName('calendar-cell');
				for(i = 0; i < calCells.length; i++){
					calCells[i].addEventListener('click', updateDay, false);
				}

				addSortable();

		} // renderCalener function ends

		// console.log(new DateObject(theDate));
		renderCalendar("calendarThis");

		// currentDate.theDay

//	}); // DOMContentLoaded event listener ends

	function goToMonth(currentDate, direction) {
		if (direction == false){
			theDate = new Date(theDate.getFullYear(), theDate.getMonth()-1, 1);
		}
		if(direction == true){
			theDate = new Date(theDate.getFullYear(), theDate.getMonth()+1, 1);
		}
		if(direction == undefined){
			theDate = new Date();
		}
		return renderCalendar("calendarThis");
	}

	// when everything on the page finished loading it executes this function.
	$(function() {
		// all code here

		const activityList = [];

		$('body').on('submit', '#activityForm', function(e){
			e.preventDefault();
			const activity = $('#activityInput').val();
			if($('#activityInput').val() == ''){
				console.log('You need to write something')
			} else {
				activityList.push(activity);
				displayAct();
				$('#activityInput').val('');
			}
		});

		function displayAct(){
			let str = '';
			activityList.forEach((act) => {
				str += `<li class="collection-item">${act}</li>`;
			})
			$('#activityLog').html(str);
		}

		console.log('adding got today click thing');
		$('body').on('click', '#goToday', function(e) {
			e.preventDefault();
			currentDate = new DateObject(theDate);
			goToMonth(currentDate, undefined);
		});

		$('body').on('click', '#dayList > li', function(e) {
			e.preventDefault();
			const listTag = document.getElementById('dayList').getElementsByTagName('li');

			console.log('Click one of those list items ');
			for (let i = 0; i < listTag.length; i++) {
				listTag[i].classList.remove('today');
			}
			e.target.classList.add('today');
		});
		// ADD sortable
		addSortable();
	});

	function addSortable (){
		console.log('adding sortable');
		$( "#activityLog" ).sortable();
		$( "#activityLog" ).disableSelection();
	}

})(); // iife (immediately invoked function expressions) ends
