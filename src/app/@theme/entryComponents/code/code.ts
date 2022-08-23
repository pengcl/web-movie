import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DataService} from '../../../services/data.service';

@Component({
  selector: 'app-code',
  templateUrl: 'code.html',
  styleUrls: ['code.scss']
})
export class CodeComponent {
  /*'data:image/png;base64,' + res.data.saleCodeBase64*/
  url;

  constructor(private dialogRef: MatDialogRef<CodeComponent>, @Inject(MAT_DIALOG_DATA) public data, private dataSvc: DataService) {
    this.dataSvc.code(this.data).subscribe(res => {
      this.url = 'data:image/png;base64,' + res.data.saleCodeBase64;
    });
  }

  close() {
    this.dialogRef.close();
  }
}
