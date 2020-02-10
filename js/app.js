let data = JSON.parse(localStorage.getItem('todo_save')) || {active:[],complete:[]};
(function (window) {
	'use strict';

	// Your starting point. Enjoy the ride!
	let Enter_key = 13;
	

//new todo - creat 
	$('input.new-todo').keypress(function(event){
		if(event.which == Enter_key && this.value != ''){
			let content = $('.new-todo').val();
			addItem(content);
			this.value = '';
			countItems();
			minim();
			data.active.push(content);
		}
		save();
	});
	function addItem(content) {
		var item_html = '<li><div class="view"><input class="toggle" type="checkbox"><label>'+ content +'</label><button class="destroy"></button></div><input class="edit" value="'+content+'"></li>';
		$('.todo-list').append(item_html);
	}

//completed
	$('.todo-list').on('click', 'input[type="checkbox"].toggle',function(){
			var data_item = $(this).closest("li").find('label').text();
			if ($(this).prop('checked') == true) {
				$(this).closest('li').addClass('completed');
				countItems();
				data.active.splice(data.active.indexOf(data_item),1);
				data.complete.push(data_item);
				checkProp();
				
			} else {
				$(this).closest('li').removeClass('completed');
				countItems();
				data.complete.splice(data.complete.indexOf(data_item),1);
				data.active.push(data_item);
				$('input.toggle-all').prop('checked',false);
			}
			save();
	});
	
	//items left
	function countItems(){
		var count_items_left = $('.todo-list li').length;
		count_items_left-=$('.todo-list li').filter(".completed").length;
		if(count_items_left>=0){
			$('span.todo-count strong').html(count_items_left);
		} else {
			count_items_left = 0;
			$('span.todo-count strong').html("0");
		}
	}
	
	//destroy
	$('.todo-list').on('click', '.destroy', function(){
		var dato = $(this).closest("li").find('label').text();
		if(data.complete.includes(dato)){
			data.complete.splice(data.complete.indexOf(dato),1);
		}
		if(data.active.includes(dato)){
			data.active.splice(data.active.indexOf(dato),1);
		}
		$(this).closest("li").remove();
		countItems();
		minim();
		save();
	});

	//edicion
	$('.todo-list').on("dblclick", 'label', function(e) {
		var input = $(e.target).closest('li').addClass('editing');
		var todo_temp = $(e.target).closest("li").find('.edit').val();
		input.val(todo_temp);
		$('input.edit').focus();
	});

	$('.todo-list').on("focusout", '.edit', function(e) {
		var before = $(this).parent().find('label').text();
		var new_data = $(e.target).val();
		if($(e.target).val() == ''){
			$(this).parent().find('label').text($(this).attr('value'));
			$(this).closest('li').removeClass('editing');
			new_data = before;
		} else {
			$($(this)).attr('value', $(e.target).val());
			$(this).parent().find('label').html($(e.target).val());
			$(this).closest('li').removeClass('editing');
		}
		if(data.complete.includes(before)){
			data.complete[data.complete.indexOf(before)] = new_data;
		} else {
			data.active[data.active.indexOf(before)] = new_data;
		}
		save();
	});


//complete all
	$('input.toggle-all').click(function(){
		if($(this).prop('checked')== true){
			completeTask(true);
			$('input[type="checkbox"].toggle').prop('checked',true);
			$('.todo-list li').addClass('completed');
		} else {
			completeTask(false);
			$('input[type="checkbox"].toggle').prop('checked',false);
			$('.todo-list li').removeClass('completed');
		}
		countItems();
		save();
	});

// function checkbox to all task
	function completeTask(boo) {
		if (boo) {
			data.active.forEach(i => data.complete.push(i));
			data.active.splice(0,data.active.length+1);
		} else {
			data.complete.forEach(i => data.active.push(i));
			data.complete.splice(0,data.complete.length+1);
		}
	}


//function to initialized view 
	function minim(){
		if($('.todo-list li').length == 0){
			$('.toggle-all + label').css({
				'display': 'none'
			});
			$('.footer').css({
				'display': 'none'
			});
			$('input.toggle-all').prop('checked',false);
		} else {
			$('.toggle-all + label').css({
				'display': 'block'
			});
			$('.footer').css({
				'display': 'block'
			});
		}
	}

	//clear complete
	$('.clear-completed').click(function(){
		$('.todo-list li').filter(".completed").remove();
		countItems();
		minim();
		data.complete.splice(0,data.complete.length+1);
		$('input.toggle-all').prop('checked',false);
		save();
	});

	//filtros
$('.filters li a').click(function(){
	var resp = $(this).text().toLowerCase();
	$('.filters li a').removeClass('selected');
	switch (resp) {
		case 'all':
			// statements_1
			$('.todo-list li').show();
			$(this).addClass('selected');
			break;
		case 'completed':
			// statements_1
			$('.todo-list li.completed').show();
			$('.todo-list li:not(.completed)').hide();
			$(this).addClass('selected');
			break;
		case 'active':
			// statements_1
			$('.todo-list li:not(.completed)').show();
			$('.todo-list li.completed').hide();
			$(this).addClass('selected');
			break;
	}

});

	function checkProp(){
		if($('.todo-list li').length == data.complete.length){
			$('input.toggle-all').prop('checked',true);
		}
	}

	function init(){
		for(var i = 0; i < data.complete.length; i++){
			var value = data.complete[i];
			$('.todo-list').append('<li class="completed"><div class="view"><input class="toggle" type="checkbox" checked><label>'+ value +'</label><button class="destroy"></button></div><input class="edit" value="'+value+'"></li>');
		}
		for(var i = 0; i < data.active.length; i++){
			var value = data.active[i];
			addItem(value);
			
		}
		checkProp();
		minim();
		countItems();
	}

	init();
	
	function save(){
		localStorage.setItem('todo_save',JSON.stringify(data));
	}

})(window);