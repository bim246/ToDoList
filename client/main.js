import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import '../lib/collection.js';

Template.tasks.helpers({
	ShowTasks(){
		return tasksDB.find({},{sort:{PrivateOwner:-1,Checked: -1}})
	},
	PrivateTask(){
		var status = tasksDB.findOne({'_id':this._id}).Status;
    	if(status == 0)
    	{
    		if(Meteor.user()){
				if(Meteor.user()._id == tasksDB.findOne({'_id':this._id}).PrivateOwner){
					return true;
				}
			}	
    	}
		return false; 
	},

	PublicTask(){
		var status = tasksDB.findOne({'_id':this._id}).Status;
    	if(status == 1)
    	{
    		if(tasksDB.findOne({'_id':this._id}).PrivateOwner == ""){
				return true;
			}	
    	}
		return false;
	}
})

Template.tasks.events({
	'click .js-delete'(event){
		var taskid = this._id;
		$("#" + taskid).fadeOut("slow","swing",function(){
			tasksDB.remove({_id:taskid});
		});
	},

	'click .js-checked'(event){
		var elementname = "checkbox" + this._id;
		var val = document.getElementById(elementname);
		tasksDB.update({'_id':this._id},{$set:{'Checked':val.checked}});
	}
})

Template.addtasks.events({
	'click .js-addtask'(event){
		var name = $('#addtask input[name="taskName"]').val();
		var status = $("#setstatus").val();
		var private = "";

		$('#addtask input[name="taskName"]').val('');

		if(status==0){
			private=Meteor.user()._id;
		}
		$('#addtask').modal('hide');
		tasksDB.insert({'Name':name, 'Status':status, 'PrivateOwner':private, 'Checked':false})
	}
})