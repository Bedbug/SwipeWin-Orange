import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { SessionService } from '../session.service';
import { LocalizationService } from '../localization.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import UIkit from 'uikit';
import { createPipeInstance } from '@angular/core/src/view/provider';
import { debug } from 'util';
import { TranslateService } from '@ngx-translate/core';

// import * as libphonenumber from 'google-libphonenumber';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loginOn: number;
  AutoLogin: boolean;
  openVerify: boolean;
  lblShow:boolean = true;
  passType: string = "password";
  loggedin: boolean;
  credits: number;
  gamesPlayed: number;
  openSubSuccess: boolean = false;
  
  // get this form the User object
  get isHasCashback(): boolean {
    return this._isHasCashback;
  }
  
  // get this form the User objectusername
  get isSubscribed(): boolean {
    return this._isSubscribed;
  }

  public _isSubscribed = true;
  private _isHasCashback = false;
  public demoGamesPlayed = 0;
  public errorMsg = "";
  public noMoreRealGames = this.translate.instant('MESSAGES.MESSAGE_08');
  public noMoreDemoGames = this.translate.instant('MESSAGES.MESSAGE_09');
  public authError = this.translate.instant('MESSAGES.MESSAGE_10');
  public logOut = this.translate.instant('MESSAGES.MESSAGE_11');
  public blackListed = this.translate.instant('MESSAGES.MESSAGE_12');
  public noCredits = this.translate.instant('MESSAGES.MESSAGE_13');


  
  public logOutBtn = true;
  public gotofaqBtn = false;
  
  public lastDemoPlayed : Date;
  public now: Date = new Date();
  
  public showLogin = false;
  
  // Lottie
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed: number = 1;

  
  constructor(
    private dataService : DataService, 
    private sessionService: SessionService,
    private localizationService: LocalizationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private cookieService: CookieService,
    private translate: TranslateService
    
    ) {}
    
  
  ngOnInit() {
    
    // this.lottieConfig = {
    //         path: 'assets/logoanim.json',
    //         renderer: 'svg',
    //         autoplay: true,
    //         loop: false,
    //         rendererSettings: {
    //           progressiveLoad:true,
    //           preserveAspectRatio: 'xMidYMid meet',
    //           imagePreserveAspectRatio: 'xMidYMid meet',
    //           title: 'TEST TITLE',
    //           description: 'TEST DESCRIPTION',
    //       }
    //     };
    
    // Get Login On From LocalStorage
    // this.loginOn = 0;
    // this.loginOn = +localStorage.getItem('loginOn');
    
    // if(this.loginOn != 1) console.log("Login is Off");
    // if(this.loginOn == 1) {
    //  this.showLogin = true;
    //   console.log("Login is On");
    // }
    // // This Resets Every time the demo games played
    // // localStorage.setItem('demoGamesPlayed', "0");
    // this.lastDemoPlayed = new Date( (localStorage.getItem('lastDemoPlayed')) );
    // console.log("Last Time Played: "+this.lastDemoPlayed);
    // console.log("Now: "+this.now);
      
    // let hours = Math.abs((this.now.getTime() - this.lastDemoPlayed.getTime()) / 3600000)
    // if( hours > 1) localStorage.setItem('demoGamesPlayed', "0");
    
    // console.log("Substract Dates: " + hours);
    // Check if we have any errorCode in the url, coming from another angular state
    this.activatedRoute.queryParams.subscribe(params => {
          const errorCode = params["errorCode"];
          let modal = UIkit.modal("#error");
          
          if (errorCode) {
            switch(errorCode) {
              case '401': this.errorMsg = this.authError; this.logOutBtn = true; this.gotofaqBtn = true; console.log('401'); break;
              case '1010': this.errorMsg = this.authError; this.logOutBtn = true; this.gotofaqBtn = true; console.log('1010');  break;
              case '1026': this.errorMsg = this.blackListed; this.logOutBtn = true; this.gotofaqBtn = true; console.log('1026'); break;
              case '1023': this.errorMsg = this.noMoreRealGames; this.gotofaqBtn = false;this.logOutBtn = false; break;
              case '1021': this.errorMsg = this.noCredits; this.gotofaqBtn = false; this.logOutBtn = false; break;
              case '1025': this.errorMsg =  this.noCredits; this.gotofaqBtn = false; this.logOutBtn = false; break;
            }
            
            if (this.sessionService.user)
              this.sessionService.reset();
            
            if (this.errorMsg !== '' &&  modal != null) {
                modal.show();
            }
             
          }
      });
    
    
      // Load the game settings
      this.dataService.fetchGameSettings().then(
        data => {
          this.sessionService.gameSettings = data;
          this.localizationService.init(this.sessionService.gameSettings.localization);
        },
        err => {});

      // Check AutoLogin or NOt
      this.AutoLogin = false;
      this.openVerify = false;
    this.loggedin = false;

    // Determine if this is the mobile/Ussd/Sms user flow or the WiFi one
    if (!this.sessionService.msisdn) {
      // WiFi flow here
    }
    else {
      // Mobile/Ussd/Sms flow here
    }
  }
  
  public playGame($event) {
    // console.log('button is clicked');
    // $event.stopPropagation();
    // this.dataService.authenticateRedirect();
    this.showLogin = true;
  }
  
  // public playGame($event) {
  //   console.log('button is clicked');
  //   $event.stopPropagation();
  //   this.dataService.authenticateRedirect();
  // }
  
  logOutUser() {
    console.log("LoggingOut!");
    const allCookies: {} = this.cookieService.getAll();
    console.log(allCookies);
    this.cookieService.deleteAll('/');
    // Trying the updated MTS logout redirect with the logout parameter
    this.sessionService.reset();
    this.router.navigate(['/home']);
    // this.dataService.logoutRedirect();
    
  }
  
  gotoFaqPage() {
    this.logOutUser();
    this.router.navigate(['/faq']);
  }
  
  login(user: string, pass: string) {
    
    console.log("username: "+user);
    console.log("password: "+pass);
    

    // Run or Go to returnHome
    this.router.navigate(['/auth-callback'], { queryParams: { code: user } });
    localStorage.setItem('loginOn', "0");
  }

  // Check MSISDN FOR:
  // REGISTERED
  // VALID ORANGE USER
  CheckN( num: string) {
    
    console.log("MSISDN: "+num);
    // Check if user is registered, send Pin to Smartlink
    this._isSubscribed = false;
    console.log("USER IS SUBED: " + this._isSubscribed);
    // If not, check if valid orange User
    
    // If yes send pin to smartlink
    this.CreatePin();
    // Open Pin Validation
    this.openVerify = true;
  }

  CreatePin() {
    console.log("Creating PIN!");
  }

  VerifySubPin(pin:string) {
    console.log("Verify PIN & subscribe User!");
    this.openVerify = false;
    this.loggedin = true;
    this.openSubSuccess = true;
    // Check Credits
    // this.CheckCredits();
    // this.router.navigate(['returnhome']);
  }

  GotoReturnHome() {
    this.router.navigate(['returnhome']);
  }
  

  VerifyLogPin(pin:string) {
    console.log("Verify PIN & login User!");
    this.loggedin = true;
    // Check Credits
    // this.CheckCredits();
    this.router.navigate(['returnhome']);
  }

  // CheckCredits() {
  //   console.log("Checking Credits!");
  //   this.credits = 0;
  //   this.gamesPlayed = 5;

  //   if(this.credits > 0){
  //     // Open Button "Play Now"
  //   }
  //   if(this.credits == 0 && this.gamesPlayed < 5){
  //     // Open Button "Buy New Round"
  //   }
  //   if(this.credits == 0 && this.gamesPlayed >= 5){
  //     // Close Button "Buy New Round"
  //   }
  // }

  OpenPass(){
    this.lblShow = !this.lblShow;
    console.log("Hide/Show Password: " + this.lblShow);
    if(this.lblShow)
      this.passType = "password";
    else
      this.passType = "test";
  }
  
  // Check the number of games played in demo mode
  // public playDemoGame($event) {
  //   console.log('Demo button is clicked');
    
  //   if (!this.sessionService.gameSettings || !this.sessionService.gameSettings.maintenance || this.sessionService.gameSettings.maintenance.siteDown || this.sessionService.gameSettings.maintenance.noGames)
  //     return;
      
  //   // this.router.navigate(['demogame']);
  //   this.demoGamesPlayed = +localStorage.getItem('demoGamesPlayed');
  //   // Check games count
  //   console.log("demoGamesPlayed "+ this.demoGamesPlayed);
  //   if(this.demoGamesPlayed >= 2) {
  //     // popup modal with error
  //     var modal = UIkit.modal("#error");
  //     this.errorMsg = this.noMoreDemoGames;
  //     modal.show();
      
  //   }else{
  //     // Add one and play the demo game
  //     this.demoGamesPlayed++;
  //     localStorage.setItem('demoGamesPlayed', this.demoGamesPlayed.toString());
  //     localStorage.setItem('lastDemoPlayed', (new Date()).toString() );
  //     // this.router.navigate(['demogame']);
  //     this.router.navigate(['demogame']);
  //   }
  // }

}
