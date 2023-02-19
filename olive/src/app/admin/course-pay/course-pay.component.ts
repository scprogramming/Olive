import { Component,Input } from '@angular/core';
import {faEdit, faTrash, faEllipsisVertical} from '@fortawesome/free-solid-svg-icons';
import { ApiRequestsService } from 'src/app/services/api-requests.service';

@Component({
  selector: 'app-course-pay',
  templateUrl: './course-pay.component.html',
  styleUrls: ['./course-pay.component.css']
})
export class CoursePayComponent {
  faEdit = faEdit;
  faTrash = faTrash;
  faEllipse = faEllipsisVertical;

  updatePaymentPlan:boolean = false;

  planAddName:string = "";
  planTypeSelect:string = "Free";
  currencySelectValue:string = "USD";
  planAmountValue:string = "0";
  payFrequencyValue:string = "Monthly";

  showPriceTable:boolean = true;
  addPayPlan:boolean = false;
  showPaidFields:boolean = false;
  showSubFields:boolean = false;

  @Input() courses:any;
  @Input() id:string = "";

  constructor (private _apiservice:ApiRequestsService){}

  planPrompt(){
    this.showPriceTable = false;
    this.addPayPlan = true;
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

}
