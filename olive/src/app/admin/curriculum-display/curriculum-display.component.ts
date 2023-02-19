import { Component, Input } from '@angular/core';
import {faEdit, faTrash, faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';
import { videoRes } from 'src/app/Response';
import { ApiRequestsService } from 'src/app/services/api-requests.service';

@Component({
  selector: 'app-curriculum-display',
  templateUrl: './curriculum-display.component.html',
  styleUrls: ['./curriculum-display.component.css']
})

export class CurriculumDisplayComponent {
  @Input() courses:any
  faEdit = faEdit;
  faTrash = faTrash;
  addingModule:boolean = false;
  @Input() id:string = "";

  constructor (private _apiservice:ApiRequestsService){}

  basicToggle(tag:HTMLElement){
    tag.classList.toggle('hidden');
  }

  promptDetailEdit(modulePrompt:HTMLElement, moduleTitle:HTMLElement, classTarget:string, titleClass:string){
    const allTitles = document.getElementsByClassName(titleClass);

    [].forEach.call(allTitles, function(el:HTMLElement){
      el.className = titleClass;
    });

    const allModules = document.getElementsByClassName(classTarget);

    [].forEach.call(allModules, function(el:HTMLElement){
      el.className = classTarget + ' hidden';
    });

    modulePrompt.classList.toggle('hidden');
    moduleTitle.className = titleClass + ' hidden';
  }

  deleteModule(deleteModule:HTMLElement){
    const elementId = deleteModule.id.split("-");
    const moduleId = elementId[1];

    this._apiservice.postData('/api/deleteModule', {courseId:this.id,moduleId:moduleId, cookie:localStorage.getItem("auth")}).subscribe(res => {
      console.log(res);
    });

    this.courses.content.splice(moduleId,1);
  }

  editModuleTitle(EditModulePrompt:HTMLElement, ModuleTitle:HTMLElement, ModuleTitleInput:HTMLInputElement){

    const split = ModuleTitleInput.id.split("-");

    this._apiservice.postData('/api/updateModuleTitle',{courseId:this.id, moduleId:split[2], title:ModuleTitleInput.value, cookie:localStorage.getItem('auth')}).subscribe((res) => {
      console.log(res);
    });

    this.courses.content[split[2]].module_title = ModuleTitleInput.value;

    ModuleTitle.className = 'collapsible';
    EditModulePrompt.classList.toggle('hidden');
  }

  showContent(contentTarget:HTMLElement, toHide:string, visibleAppend:string){

    const allLessons = document.getElementsByClassName(toHide);

    [].forEach.call(allLessons, function(el:HTMLElement) {
      el.className = toHide + ' hidden';
    });

    console.log(contentTarget.id + visibleAppend)
    const target = document.getElementById(contentTarget.id + visibleAppend)
    target!.className = toHide;
    console.log(contentTarget.id);
  }

  addLesson(lessonTitle:HTMLInputElement){

    const split = lessonTitle.id.split("-");

    this._apiservice.postData('/api/addLesson',{courseId:this.id, lessonTitle:lessonTitle.value, moduleId:split[2], cookie:localStorage.getItem('auth')}).subscribe((res) => {
      console.log(res);
    })
    this.courses.content[split[2]].lessons.push({lesson_title:lessonTitle.value, content:{data:"",type:""}});
    const allLessons = document.getElementsByClassName('lessonPrompt');

    [].forEach.call(allLessons, function(el:HTMLElement) {
      el.className = 'lessonPrompt' + ' hidden';
    });
    
  }

  readVideo(videoInput:HTMLInputElement, uploadPreview:HTMLVideoElement){
    const formData = new FormData();
    const elementId = videoInput.id.split("-");

    formData.append("video",videoInput.files![0]);
    formData.append("lessonId", elementId[3]);
    formData.append("moduleId", elementId[1]);
    formData.append("courseId",this.id);
    formData.append("auth", localStorage.getItem("auth")!);

    this._apiservice.postFormData('/api/uploadVideo', formData).subscribe(res => {
      const parse = <videoRes>res;
      uploadPreview.src = parse.video;
    })

  }
  
  promptModule(){
    this.addingModule = !this.addingModule;
  }

  updateLessonTitle(lessonTitle:HTMLInputElement){
    const elementId = lessonTitle.id.split("-");
    const moduleId = elementId[1];
    const lessonId = elementId[3];

    this._apiservice.postData('/api/updateLessonTitle', {courseId:this.id, title:lessonTitle.value, lessonId:lessonId, moduleId:moduleId, cookie:localStorage.getItem("auth")}).subscribe(res => {
      console.log(res);
    });

    this.courses.content[moduleId].lessons[lessonId].lesson_title = lessonTitle.value
  }

  promptLesson(lessonPrompt:HTMLElement){
    const allLessons = document.getElementsByClassName('lessonPrompt');

    [].forEach.call(allLessons, function(el:HTMLElement) {
      el.className = 'lessonPrompt' + ' hidden';
    });
    
    lessonPrompt.classList.toggle('hidden');
  }

  addModule(moduleTitle:HTMLInputElement){

    this._apiservice.postData('/api/addModule',{courseId:this.id, moduleTitle:moduleTitle.value, cookie:localStorage.getItem('auth')}).subscribe((res) => {
      console.log(res);
    })
    this.courses.content.push({module_title:moduleTitle.value,lessons:[{lesson_title:"Lesson 1", content:{data:"",type:""}}]});

    this.addingModule = !this.addingModule;
  }

  deleteLesson(deleteLesson:HTMLButtonElement){
    const elementId = deleteLesson.id.split("-");
    const moduleId = elementId[1];
    const lessonId = elementId[3];
    
    this._apiservice.postData('/api/deleteLesson', {courseId:this.id, lessonId:lessonId, moduleId:moduleId, cookie:localStorage.getItem("auth")}).subscribe(res => {
      console.log(res);
    });

    this.courses.content[moduleId].lessons.splice(lessonId,1);

  }

}
