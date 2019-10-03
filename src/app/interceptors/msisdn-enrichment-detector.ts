import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
//import { Observable } from 'rxjs/Observable';
import { SessionService } from '../session.service';

@Injectable()
export class MsisdnEnrichmentDetector implements HttpInterceptor {

  constructor(private sessionService: SessionService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {

    if (req.headers.has('X_MSISDN') && !this.sessionService.msisdnCode)
      this.sessionService.msisdnCode = req.headers.get('X_MSISDN');

    return next.handle(req);
  }
}
