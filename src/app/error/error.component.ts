import { Component, Inject } from '@angular/core';  
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
  
@Component({  
    selector: 'error',
    templateUrl: './error.component.html',
})  
export class ErrorComponent{  
    constructor(@Inject(MAT_DIALOG_DATA) public data: {message: string}){}  
}  