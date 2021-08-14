import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{


  infoList = [];
  infoForm: FormGroup;

  constructor(
    private firebaseService: FirebaseService,
    public fb: FormBuilder,
    public alertController: AlertController,
    private loadingController: LoadingController) {
  }


  ngOnInit(): void {

      this.infoForm = this.fb.group({
      message: ['', [Validators.required]],
      striked: ['']
    })


    this.firebaseService.read_info().subscribe(data => {

      this.infoList = data.map(e => {
        return {
          id: e.payload.doc.id,
          message: e.payload.doc.data()['message'],
          striked: e.payload.doc.data()['striked'],
        };
      })

    });
  }

  CreateRecordInfo() {
    console.log(this.infoForm.value);
    this.infoForm.patchValue({
      striked: "false"
    });
    //this.showLoader();
    this.firebaseService.create_info(this.infoForm.value).then(resp => {
      this.infoForm.reset();
    //  this.hideLoader();
    })
      .catch(error => {
        console.log(error);
      });
  }

  RemoveRecord(rowID) {
    this.presentAlertConfirm(rowID);

  }

  async presentAlertConfirm(rowID) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Delete!',
      message: '<strong>Are you sure to delete this...</strong>!!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Okay',
          handler: () => {
            this.firebaseService.delete_info(rowID);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }



  showLoader () {

    this.loadingController.create({
      message: 'Creating',
      spinner: 'bubbles',
      cssClass:'custom-loader-class'
    }).then((res) => {
      res.present();

      res.onDidDismiss().then((dis) => {
        console.log('Loading dismissed! after 2 Seconds');
      });
    });
  }

  hideLoader() {
    this.loadingController.dismiss();
  }

  StrikeIt(itemdata){
    let record = {};
    record['message'] = itemdata.message;
    record['striked'] = "false";
    this.firebaseService.update_info(itemdata.id, record);
  }

  UnstrikeIt(itemdata) {
    let record = {};
    record['message'] = itemdata.message;
    record['striked'] = "true";
    this.firebaseService.update_info(itemdata.id, record);
  }

  }





