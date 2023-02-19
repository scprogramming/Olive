import { Component, Input } from '@angular/core';
import { ApiRequestsService } from 'src/app/services/api-requests.service';
import {faEdit, faTrash, faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css']
})
export class CourseDetailsComponent {
  @Input() courses:any
  faEdit = faEdit;
  faTrash = faTrash;
  @Input() id:string = "";

  addingLearnObj:boolean = false;
  addingAudience:boolean = false;
  addingRequirement:boolean = false;

  constructor (private _apiservice:ApiRequestsService){}

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
}
