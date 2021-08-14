import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  generalForm: FormGroup;
  generalList = [];

  constructor(
    private firebaseService: FirebaseService,
    public fb: FormBuilder,
    public alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.generalForm = this.fb.group({
      message: ['', [Validators.required]],
      flag: ['', [Validators.required]]
    })

    this.firebaseService.read_general().subscribe(data => {

      this.generalList = data.map(e => {
        return {
          id: e.payload.doc.id,
          flag: e.payload.doc.data()['flag'],
          message: e.payload.doc.data()['message'],
        };
      })

    });
  }


  CreateRecordGeneral() {
    console.log(this.generalForm.value);
   // this.showLoader();
    this.firebaseService.create_general(this.generalForm.value).then(resp => {
      this.generalForm.reset();
     // this.hideLoader();
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
            this.firebaseService.delete_general(rowID);
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

}
