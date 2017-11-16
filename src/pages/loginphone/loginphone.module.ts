import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginphonePage } from './loginphone';

@NgModule({
  declarations: [
    LoginphonePage,
  ],
  imports: [
    IonicPageModule.forChild(LoginphonePage),
  ],
})
export class LoginphonePageModule {}
