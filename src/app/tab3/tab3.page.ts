import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';

interface GeneralData {
  amount: string;
  flag: string;
  message: string;
}


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit{

  generalList = [];
  generalData: GeneralData;
  ledgerForm: FormGroup;

  constructor(
    private firebaseService: FirebaseService,
    public fb: FormBuilder,
    public alertController: AlertController,
    private loadingController: LoadingController
    ) {
    this.generalData = {} as GeneralData;
  }


  ngOnInit(): void {

    this.ledgerForm = this.fb.group({
      message: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      flag: ['']
    })


    this.firebaseService.read_ledger().subscribe(data => {

      this.generalList = data.map(e => {
        return {
          id: e.payload.doc.id,
          amount: e.payload.doc.data()['amount'],
          flag: e.payload.doc.data()['flag'],
          message: e.payload.doc.data()['message'],
        };
      })

    });


  }


  CreateRecord(){

    this.ledgerForm.patchValue({
      flag: "new"
    });
   // this.showLoader();
    console.log(this.ledgerForm.value);
    this.firebaseService.create_ledger(this.ledgerForm.value).then(resp => {
      this.ledgerForm.reset();
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
            this.firebaseService.delete_ledger(rowID);
            console.log('Confirm Okay');
          }
        }
      ]
    });

    await alert.present();
  }

  UpdateRecord(recordRow) {
    let record = {};
    record['message'] = recordRow.message;
    record['amount'] = recordRow.amount;
    record['flag'] = "striked";
    this.firebaseService.update_ledger(recordRow.id, record);
  }

  unstrike(recordRow){
    let record = {};
    record['message'] = recordRow.message;
    record['amount'] = recordRow.amount;
    record['flag'] = "new";
    this.firebaseService.update_ledger(recordRow.id, record);
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
