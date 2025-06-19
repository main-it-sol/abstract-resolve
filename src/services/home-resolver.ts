import { Injectable } from "@angular/core";
import { AbstractClass } from "../abstract-class";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { ConcreteClassHome } from "../concrete-home";
import { UserService } from "./user.service";

@Injectable({
  providedIn: 'root'
})
export class HomeResolver implements Resolve<AbstractClass>{
    constructor(private userService: UserService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): AbstractClass {
    return new ConcreteClassHome(this.userService);
  }
}