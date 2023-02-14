import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { idRes } from 'src/app/Response';
import { ApiRequestsService } from 'src/app/services/api-requests.service';

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.css']
})
export class AddCourseComponent {

  courseTitle="";
  courseDesc="";
  urlPath="";
  message="";
  imageSrc="";

  constructor(private _apiService:ApiRequestsService, private router:Router){}

  addCourse():void{

    this._apiService.postData('/api/addCourse',{title:this.courseTitle, course_path:this.urlPath, 
      thumbnail:this.imageSrc, courseDesc:this.courseDesc, cookie:localStorage.getItem("auth")}).subscribe(res => {
        const parse = <idRes> res

        if (parse.code === 1){
          this.message = "";
          this.router.navigate(['dashboard/editCourse/' + parse.id])
        }else{
          this.message = parse.status;
        }
      })

  }

  readURL(event:Event): void{
    let target = <HTMLInputElement>event.target;

    if (target.files && target.files[0]){
      const file = target.files[0];
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = <string>reader.result;

      reader.readAsDataURL(file);
    }
  }

}
