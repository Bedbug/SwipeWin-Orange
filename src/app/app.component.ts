import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'swipr';
  lang: string;
  constructor(public translate: TranslateService) {
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|ar/) ? browserLang : 'en');

    // this.activatedRoute.paramMap.subscribe(params => {
    //   this.lang = params.get("lang");
    //   if(this.lang != null)
    //   translate.setDefaultLang(this.lang);
    //   console.log("Language Selected: "+this.lang);
    // })
    // this.activatedRoute.params.subscribe((params: Params) => {
    //   let token = params['token'];
    //   console.log(token);
    // });
  }
}
