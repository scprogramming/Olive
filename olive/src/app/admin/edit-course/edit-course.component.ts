import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiRequestsService } from 'src/app/services/api-requests.service';
import {faEdit, faTrash, faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent {

  id:string = "";
  authStatus:boolean = false;
  courses:any;
  faEdit = faEdit;
  faTrash = faTrash;
  faEllipse = faEllipsisVertical;

  constructor (private route: ActivatedRoute, private _apiservice:ApiRequestsService){}

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.id = params['id'];
      console.log(this.id);
  
      this._apiservice.getData('/api/courseDataWithId/' + this.id).subscribe(res =>{
        this.courses = res;
        console.log(this.courses);
      })
    })
  }

  toggle(e: HTMLElement, button:HTMLElement) {
    const allTabs = document.getElementsByClassName('content');
    const allButtons = document.getElementsByClassName('tabButton');

    [].forEach.call(allTabs, function(el:HTMLElement) {
      el.className = 'content hidden';
    });

    [].forEach.call(allButtons, function(el:HTMLElement){
      el.className = 'tabButton';
    });

    e.classList.toggle('hidden');
    button.classList.toggle('active');

  }

  basicToggle(tag:HTMLElement){
    tag.classList.toggle('hidden');
  }

  showLesson(lesson:HTMLElement){

    const allLessons = document.getElementsByClassName('lessonContent');

    [].forEach.call(allLessons, function(el:HTMLElement) {
      el.className = 'lessonContent hidden';
    });

    const target = document.getElementById(lesson.id + '-content')
    target!.className = "lessonContent";
    console.log(lesson.id);
  }
}
