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
  showModuleTitle:boolean=true;
  updatePaymentPlan:boolean = false;

  planAddName:string = "";
  planTypeSelect:string = "Free";
  currencySelectValue:string = "USD";
  planAmountValue:string = "0";
  payFrequencyValue:string = "Monthly";

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

  editModuleTitle(EditModulePrompt:HTMLElement, ModuleTitle:HTMLElement, ModuleTitleInput:HTMLInputElement){

    const split = ModuleTitleInput.id.split("-");

    this._apiservice.postData('/api/updateModuleTitle',{courseId:this.id, moduleId:split[2], title:ModuleTitleInput.value, cookie:localStorage.getItem('auth')}).subscribe((res) => {
      console.log(res);
    });

    this.courses.content[split[2]].module_title = ModuleTitleInput.value;

    ModuleTitle.className = 'collapsible';
    EditModulePrompt.classList.toggle('hidden');
  }

  promptEditModule(modulePrompt:HTMLElement, moduleTitle:HTMLElement){
    const allModules = document.getElementsByClassName('editModulePrompt');
    
    [].forEach.call(allModules, function(el:HTMLElement){
      el.className = 'editModulePrompt' + ' hidden';
    });

    modulePrompt.classList.toggle('hidden');
    moduleTitle.className = 'hidden';
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

  deleteModule(deleteModule:HTMLElement){
    const elementId = deleteModule.id.split("-");
    const moduleId = elementId[1];

    this._apiservice.postData('/api/deleteModule', {courseId:this.id,moduleId:moduleId, cookie:localStorage.getItem("auth")}).subscribe(res => {
      console.log(res);
    });

    this.courses.content.splice(moduleId,1);
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

  updateLessonTitle(lessonTitle:HTMLInputElement){
    const elementId = lessonTitle.id.split("-");
    const moduleId = elementId[1];
    const lessonId = elementId[3];

    this._apiservice.postData('/api/updateLessonTitle', {courseId:this.id, title:lessonTitle.value, lessonId:lessonId, moduleId:moduleId, cookie:localStorage.getItem("auth")}).subscribe(res => {
      console.log(res);
    });

    this.courses.content[moduleId].lessons[lessonId].lesson_title = lessonTitle.value
  }

  savePaymentPlan(planSelect:HTMLSelectElement, PlanName:HTMLInputElement){
    
    if (planSelect.value === 'One-time'){

      this._apiservice.postData('/api/addPaymentOption', {courseId:this.id, planName:this.planAddName,planType:this.planTypeSelect,
      currency:this.currencySelectValue, payAmount:this.planAmountValue,cookie:localStorage.getItem("auth")}).subscribe(res => {
        console.log(res);
      });

      this.courses.payment_options.push({plan_name:this.planAddName, plan_type:this.planTypeSelect,status:"enabled",currency:this.currencySelectValue, frequency:"",
      pay_amount:this.planAmountValue});

    }else if (planSelect.value === 'Subscription'){
      this._apiservice.postData('/api/addPaymentOption', {courseId:this.id, planName:this.planAddName,planType:this.planTypeSelect,
      currency:this.currencySelectValue, payAmount:this.planAmountValue, frequency:this.payFrequencyValue, cookie:localStorage.getItem("auth")}).subscribe(res => {
        console.log(res);
      });

      this.courses.payment_options.push({plan_name:this.planAddName, plan_type:this.planTypeSelect,status:"enabled",currency:this.currencySelectValue, frequency:this.payFrequencyValue,
      pay_amount:this.planAmountValue});

    }else{
      console.log(this.planAddName);
      this._apiservice.postData('/api/addPaymentOption', {courseId:this.id, planName:this.planAddName,planType:this.planTypeSelect,cookie:localStorage.getItem("auth")}).subscribe(res => {
        console.log(res);
      });
      this.courses.payment_options.push({plan_name:this.planAddName, plan_type:this.planTypeSelect,status:"enabled",currency:"", frequency:"",
      pay_amount:""});
    }

    this.clearPayFields();
  }

  addObjective(objective:HTMLInputElement){
    this._apiservice.postData('/api/addLearningObjective', {courseId:this.id, learningObj:objective.value,cookie:localStorage.getItem("auth")}).subscribe(res => {
      console.log(res);
    });

    this.courses.learning_objective.push(objective.value)
  }

  promptLearningObjective(){
    this.addingLearnObj = !this.addingLearnObj
  }

  addAudience(audience:HTMLInputElement){
    this._apiservice.postData('/api/newAudience', {courseId:this.id, audience:audience.value,cookie:localStorage.getItem("auth")}).subscribe(res => {
      console.log(res);
    });

    this.courses.audience.push(audience.value)
  }

  promptAudience(){
    this.addingAudience = !this.addingAudience
  }

  addRequirement(requirement:HTMLInputElement){
    this._apiservice.postData('/api/newRequirement', {courseId:this.id, requirement:requirement.value,cookie:localStorage.getItem("auth")}).subscribe(res => {
      console.log(res);
    });

    this.courses.requirements.push(requirement.value)
  }

  promptRequirement(){
    this.addingRequirement = !this.addingRequirement
  }

  clearPayFields(){
    this.showPriceTable = true;
    this.addPayPlan = false;
    this.updatePaymentPlan = false;
    this.showPaidFields = false;
    this.showSubFields = false;

    this.planAddName = "";
    this.planTypeSelect = "Free";
    this.currencySelectValue = "USD";
    this.planAmountValue = "0";
    this.payFrequencyValue = "Monthly"
  }

  cancelAddPayment(){
    this.clearPayFields();
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
  }

  editPayOption(payEditItem:HTMLElement){
    this.addPayPlan = true;
    this.updatePaymentPlan = true;
    this.showPriceTable = false;

    const id = payEditItem.id.split('-');
    console.log(id[1]);

    const planName = this.courses.payment_options[id[1]].plan_name;
    const planType = this.courses.payment_options[id[1]].plan_type;

    if (planType === 'One-time' || planType === 'Subscription'){  
      const planCurrency = this.courses.payment_options[id[1]].currency;
      const planAmount = this.courses.payment_options[id[1]].pay_amount;

      this.showPaidFields = true;
      this.currencySelectValue = planCurrency;
      this.planAmountValue = planAmount;
    }

    if (planType === 'Subscription'){
      const PlanFrequency = this.courses.payment_options[id[1]].frequency;
      this.showSubFields = true;
      this.payFrequencyValue = PlanFrequency;
    }

    this.planAddName = planName;
    this.planTypeSelect = planType;

  }

  deletePayOption(payDelete:HTMLElement){
    const payId = payDelete.id.split("-")[1];
    this._apiservice.postData('/api/deletePaymentOption', {courseId:this.id,cookie:localStorage.getItem("auth"), paymentId:payId}).subscribe(res => {
      console.log(res);
    });

    this.courses.payment_options.splice(payId,1);
  }

  deleteAudience(deleteAudience:HTMLElement){
    const elementId = deleteAudience.id.split("-");
    const audienceId = elementId[1];

    this._apiservice.postData('/api/deleteAudience', {courseId:this.id,audienceId:audienceId, cookie:localStorage.getItem("auth")}).subscribe(res => {
      console.log(res);
    });

    this.courses.audience.splice(audienceId,1);
  }

  deleteLearningObj(deleteLearn:HTMLElement){
    const elementId = deleteLearn.id.split("-");
    const learnId = elementId[1];

    this._apiservice.postData('/api/deleteLearningObjective', {courseId:this.id,learningObj:learnId, cookie:localStorage.getItem("auth")}).subscribe(res => {
      console.log(res);
    });

    this.courses.learning_objective.splice(learnId,1);
  }

  deleteRequirement(deleteReq:HTMLElement){
    const elementId = deleteReq.id.split("-");
    const reqId = elementId[1];

    this._apiservice.postData('/api/deleteRequirements', {courseId:this.id,requirementId:reqId, cookie:localStorage.getItem("auth")}).subscribe(res => {
      console.log(res);
    });

    this.courses.requirements.splice(reqId,1);
  }

  editDetail(EditModulePrompt:HTMLElement, ModuleTitle:HTMLElement, ModuleTitleInput:HTMLInputElement, titleClass:string){

    const split = ModuleTitleInput.id.split("-");

    if (titleClass === 'learningObj'){
      this._apiservice.postData('/api/updateLearningObj',{courseId:this.id, title:ModuleTitleInput.value, id:split[2], cookie:localStorage.getItem('auth')}).subscribe((res) => {
        console.log(res);
      });
  
      this.courses.learning_objective[split[2]] = ModuleTitleInput.value;
    }

    if (titleClass === 'audienceTitle'){
      this._apiservice.postData('/api/updateAudience',{courseId:this.id, title:ModuleTitleInput.value, id:split[2], cookie:localStorage.getItem('auth')}).subscribe((res) => {
        console.log(res);
      });
  
      this.courses.audience[split[2]] = ModuleTitleInput.value;
    }

    if (titleClass === 'requirementTitle'){
      this._apiservice.postData('/api/updateRequirements',{courseId:this.id, title:ModuleTitleInput.value, id:split[2], cookie:localStorage.getItem('auth')}).subscribe((res) => {
        console.log(res);
      });
  
      this.courses.requirements[split[2]] = ModuleTitleInput.value;
    }
    
    ModuleTitle.className = titleClass;
    EditModulePrompt.classList.toggle('hidden');
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
}
