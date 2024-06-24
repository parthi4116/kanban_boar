import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class KanbanService {
  todoList: any;
  inprogress: any;
  doneList: any;
  testList: any;
  deployList: any;

  constructor() { };

  setdata(data: any, type: any) {
    (type == 'todoList') ? this.todoList = data : (type == 'inprogress') ? this.inprogress = data : (type == 'doneList') ? this.doneList = data : (type == 'testList') ? this.testList = data : this.deployList = data;
 
  };
  getdata(type: any) {
    let sharedata: any
    (type == 'todoList') ? sharedata = this.todoList : (type == 'inprogress') ? sharedata = this.inprogress : (type == 'doneList') ? sharedata = this.doneList : (type == 'testList') ? sharedata = this.testList : sharedata = this.deployList;
    return sharedata;
  }
}
