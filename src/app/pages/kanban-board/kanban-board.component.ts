import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatSort, Sort } from '@angular/material/sort';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
 import { Router } from '@angular/router';
import { KanbanService } from '../kanbon.service';
export interface ItemNames {
  description: any,
  date: any,
  title: any,
  priority: any
}
@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss'],
  providers:[KanbanService]
})
export class KanbanBoardComponent implements OnInit {
  stockForm: FormGroup;
  todoList: ItemNames[] = [];
  inprogress: ItemNames[] = [];
  doneList: ItemNames[] = [];
  testList: ItemNames[] = [];
  deployList: ItemNames[] = [];
  updateIndex: any;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isEditEnabled: boolean = false;
  checktype: any;
  tasks: any;
  searchdata: any = '';
  prioritysearchdata: any = '';
  constructor(private fb: FormBuilder, private router: Router, private modelservice: NgbModal, private kanbanservice: KanbanService) { }
  @ViewChild('add', { static: false }) add: ElementRef;

  ngOnInit() {
    this.stockForm = this.fb.group({
      title: [' ', Validators.required],
      desc: [' ', Validators.required],
      date: [' ', Validators.required],
      priority: [' ', Validators.required]
    })
  };

  // Using for Open a popup for inputing the details
  openpopup() {
    this.modelservice.open(this.add, { centered: true, size: 'md' });
  };

  // Using for Add the user in Array
  addList() {
    this.todoList.push({
      description: this.stockForm.value.desc,
      date: this.stockForm.value.date,
      title: this.stockForm.value.title,
      priority: this.stockForm.value.priority
    });
    this.kanbanservice.setdata(this.todoList, 'todoList');
    this.stockForm.reset()
    this.modelservice.dismissAll()
  };

  // Using for delete the user in Array
  deleteItem(index: number, checktype: any) {
    if (checktype == 'inprogress') {
      this.inprogress.splice(index, 1);
      this.kanbanservice.setdata(this.inprogress, 'inprogress');
    } else if (checktype == 'todo') {
      this.todoList.splice(index, 1);
      this.kanbanservice.setdata(this.todoList, 'todoList');
    } else if (checktype == 'done') {
      this.doneList.splice(index, 1);
      this.kanbanservice.setdata(this.doneList, 'doneList');
    } else if (checktype == 'test') {
      this.testList.splice(index, 1);
      this.kanbanservice.setdata(this.testList, 'testList');
    } else if (checktype == 'deploy') {
      this.deployList.splice(index, 1);
      this.kanbanservice.setdata(this.deployList, 'deployList');

    }
  };

  // Using for patch the value in Form group
  onEdit(item: ItemNames, index: number, type: any) {
    this.checktype = type;
    this.openpopup();
    this.stockForm.controls['title'].setValue(item.title);
    this.stockForm.controls['priority'].setValue(item.priority);
    this.stockForm.controls['date'].setValue(item.date);
    this.stockForm.controls['desc'].setValue(item.description);
    this.updateIndex = index;
    this.isEditEnabled = true;
  };

  // Update the list
  updateList() {
    const updatedItem: ItemNames = {
      description: this.stockForm.value.desc,
      date: this.stockForm.value.date,
      title: this.stockForm.value.title,
      priority: this.stockForm.value.priority
    };
    (this.checktype == 'todo') ? this.todoList[this.updateIndex] = updatedItem : (this.checktype == 'inprogress') ? this.inprogress[this.updateIndex] = updatedItem : (this.checktype == 'done') ? this.doneList[this.updateIndex] = updatedItem : (this.checktype == 'test') ? this.testList[this.updateIndex] = updatedItem : this.deployList[this.updateIndex] = updatedItem;
    this.stockForm.reset();
    this.modelservice.dismissAll();
    this.isEditEnabled = false;
  };

  // using for the drop 
  drop(event: CdkDragDrop<ItemNames[]>) {
    event.previousContainer === event.container ?
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex) :
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    this.kanbanservice.setdata(this.todoList, 'todoList');
    this.kanbanservice.setdata(this.inprogress, 'inprogress');
    this.kanbanservice.setdata(this.doneList, 'doneList');
    this.kanbanservice.setdata(this.testList, 'testList');
    this.kanbanservice.setdata(this.deployList, 'deployList');
  };

  // using for search
  search(type: any) {


    if (type == 'priority') {

      if (this.prioritysearchdata != 'all') {
        this.todoList = this.kanbanservice.getdata('todoList').filter((task: any) => task.priority.includes(this.prioritysearchdata));
        this.inprogress = this.kanbanservice.getdata('inprogress') != undefined ? this.kanbanservice.getdata('inprogress').filter((task: any) => task.priority.includes(this.prioritysearchdata)) : []
        this.doneList = this.kanbanservice.getdata('doneList') != undefined ? this.kanbanservice.getdata('doneList').filter((task: any) => task.priority.includes(this.prioritysearchdata)) : []
        this.testList = this.kanbanservice.getdata('testList') != undefined ? this.kanbanservice.getdata('testList').filter((task: any) => task.priority.includes(this.prioritysearchdata)) : []
        this.deployList = this.kanbanservice.getdata('deployList') != undefined ? this.kanbanservice.getdata('deployList').filter((task: any) => task.priority.includes(this.prioritysearchdata)) : []

      } else {
        this.todoList = this.kanbanservice.getdata('todoList');
        this.inprogress = this.kanbanservice.getdata('inprogress') != undefined ? this.kanbanservice.getdata('inprogress') : [];
        this.doneList = this.kanbanservice.getdata('doneList') != undefined ? this.kanbanservice.getdata('doneList') : [];
        this.testList = this.kanbanservice.getdata('testList') != undefined ? this.kanbanservice.getdata('testList') : [];
        this.deployList = this.kanbanservice.getdata('deployList') != undefined ? this.kanbanservice.getdata('deployList') : [];

      }

    } else {
      this.todoList = this.kanbanservice.getdata('todoList').filter((task: any) => task.title.includes(this.searchdata));
      this.inprogress = this.kanbanservice.getdata('inprogress') != undefined ? this.kanbanservice.getdata('inprogress').filter((task: any) => task.title.includes(this.searchdata)) : []
      this.doneList = this.kanbanservice.getdata('doneList') != undefined ? this.kanbanservice.getdata('doneList').filter((task: any) => task.title.includes(this.searchdata)) : []
      this.testList = this.kanbanservice.getdata('testList') != undefined ? this.kanbanservice.getdata('testList').filter((task: any) => task.title.includes(this.searchdata)) : []
      this.deployList = this.kanbanservice.getdata('deployList') != undefined ? this.kanbanservice.getdata('deployList').filter((task: any) => task.title.includes(this.searchdata)) : []
    };
  }
  // Using for Short
  sortData(sort: Sort) {
    let sort1 = sort;
    let sort2 = sort;
    let sort3 = sort;
    let sort4 = sort;
    let sort5 = sort;
    // Todolist 
    const todo = this.todoList.slice();
    if (!sort1.active || sort1.direction === '') {
      this.todoList = todo;
      return;
    };

    this.todoList = todo.sort((a: any, b: any) => {
      const isAsc = sort1.direction === 'asc';
      switch (sort1.active) {
        case 'date': return compare(a.date, b.date, isAsc);
        default: return 0;
      };
    });

    // in-progress 
    const inprgress = this.inprogress.slice();
    if (!sort2.active || sort2.direction === '') {
      this.inprogress = inprgress;
      return;
    };

    this.inprogress = inprgress.sort((a: any, b: any) => {
      const isAsc = sort2.direction === 'asc';
      switch (sort2.active) {
        case 'date': return compare(a.date, b.date, isAsc);
        default: return 0;
      };
    });
    // done 
    const done = this.doneList.slice();
    if (!sort3.active || sort.direction === '') {
      this.doneList = done;
      return;
    };

    this.doneList = done.sort((a: any, b: any) => {
      const isAsc = sort1.direction === 'asc';
      switch (sort3.active) {
        case 'date': return compare(a.date, b.date, isAsc);
        default: return 0;
      };
    });
    // Test 
    const test = this.testList.slice();
    if (!sort4.active || sort4.direction === '') {
      this.testList = test;
      return;
    };

    this.testList = test.sort((a: any, b: any) => {
      const isAsc = sort4.direction === 'asc';
      switch (sort4.active) {
        case 'date': return compare(a.date, b.date, isAsc);
        default: return 0;
      };
    });
    // deploy 
    const deploy = this.deployList.slice();
    if (!sort5.active || sort5.direction === '') {
      this.deployList = deploy;
      return;
    };

    this.deployList = deploy.sort((a: any, b: any) => {
      const isAsc = sort5.direction === 'asc';
      switch (sort5.active) {
        case 'date': return compare(a.date, b.date, isAsc);
        default: return 0;
      };
    });
  };

  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login'])
  }

};

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}