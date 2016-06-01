/****************************************************/
/*               ViewModelData                      */
/****************************************************/

/* single task */
function Task (title, hours_worked, day) {
	this.title = ko.observable(title);
	this.hours_worked = ko.observable(hours_worked);
	this.day = ko.observable(day);
}

/* main view model */
function ViewModel (tasks, cur_day) {
	var self = this;
	self.cur_day = ko.observable(cur_day);

	self.tasks = ko.observableArray(tasks.map(function (task) {
		return new Task(task.title, task.hours_worked, task.day);
    }));

	/* filter tasks by day */
	self.filteredTasks = ko.computed(function () {
		var ftasks = ko.observableArray([]);
			ko.utils.arrayForEach(self.tasks(), function(task) {
		    	if (task.day() == self.cur_day()){
		    		ftasks.push(task);
		    	}
			});
		return ftasks();
	}.bind(this));

	
	/* add task to the task list of current day */
	self.addTask = function (title) {
		self.tasks.push(new Task( title, 0, self.cur_day() ));
	}

	/* remove task from the task list of current day */
	self.removeTask = function(task) { 
		self.tasks.remove(task) 
	}

	/* increment the number of hours worked to the specific task */
	self.incrementHoursWorked = function (task) {
		task.hours_worked(task.hours_worked() + 1);			
	}

	/* decrement the number of hours worked to the specific task */
	self.decrementHoursWorked = function (task) {
		var num = task.hours_worked() - 1;
		if (num < 0) num = 0;

		task.hours_worked(num);			
	}

	/* update the current day to the next one */
	self.nextDay = function () {
		self.cur_day(self.cur_day() + 1);
	}

	/* update the current day to the previous one */
	self.previousDay = function () {
		var num = self.cur_day() - 1;
		if (num < 1) num = 1;

		self.cur_day(num);
	}

	/* compute total hours worked on the specific day */
	TotalHours = ko.computed(function() {
		var total = 0;			
		ko.utils.arrayForEach(self.tasks(), function(task) {
			if (task.day() == self.cur_day()){
	    		total += task.hours_worked();
	    	}
		});
   		return total;
	}.bind(this));

	/* store a clean copy of 'tasks' to local storage */
	ko.computed(function () {
		localStorage.setItem('alltasks', ko.toJSON(self.tasks()));
	}.bind(this));
}	

var tasks = ko.utils.parseJson(localStorage.getItem('alltasks'));

ko.applyBindings(new ViewModel(tasks || [], 1));


