import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiRequestsService } from 'src/app/services/api-requests.service';
import {faEdit, faTrash, faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';
import { videoRes } from 'src/app/Response';
@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.css']
})
export class EditCourseComponent {

  id:string = "";
  authStatus:boolean = false;
  addingModule:boolean = false;
  courses:any;
  faEdit = faEdit;
  faTrash = faTrash;
  faEllipse = faEllipsisVertical;
  addingLesson:boolean = false;
  showPriceTable:boolean = true;
  addPayPlan:boolean = false;
  showPaidFields:boolean = false;
  showSubFields:boolean = false;
  addingLearnObj:boolean = false;
  addingAudience:boolean = false;
  addingRequirement:boolean = false;

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

  addModule(moduleTitle:HTMLInputElement){

    this._apiservice.postData('/api/addModule',{courseId:this.id, moduleTitle:moduleTitle.value, cookie:localStorage.getItem('auth')}).subscribe((res) => {
      console.log(res);
    })
    this.courses.content.push({module_title:moduleTitle.value,lessons:[{lesson_title:"Lesson 1", content:{data:"",type:""}}]});

    this.addingModule = !this.addingModule;
  }

  promptLesson(lessonPrompt:HTMLElement){
    const allLessons = document.getElementsByClassName('lessonPrompt');

    [].forEach.call(allLessons, function(el:HTMLElement) {
      el.className = 'lessonPrompt' + ' hidden';
    });
    
    lessonPrompt.classList.toggle('hidden');
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

  planPrompt(){
    this.showPriceTable = false;
    this.addPayPlan = true;
  }

  savePaymentPlan(){

  }

  addObjective(learningObjective:HTMLInputElement){

  }

  promptLearningObjective(){
    this.addingLearnObj = !this.addingLearnObj
  }

  addAudience(audience:HTMLInputElement){

  }

  promptAudience(){
    this.addingAudience = !this.addingAudience
  }

  addRequirement(audience:HTMLInputElement){

  }

  promptRequirement(){
    this.addingRequirement = !this.addingRequirement
  }


  cancelAddPayment(){
    this.showPriceTable = true;
    this.addPayPlan = false;
  }

  changePlanType(planSelect:HTMLSelectElement){
    if (planSelect.value === 'One-time'){
      this.showPaidFields = true;
      this.showSubFields = false;
    }else if (planSelect.value === 'Subscription'){
      this.showPaidFields = true;
      this.showSubFields = true;
    }else{
      this.showPaidFields = false;
      this.showSubFields = false;
    }
    console.log(planSelect.value);
  }

  editPayOption(){
  }

  deletePayOption(){
    
  }
}
