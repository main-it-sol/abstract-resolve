import { Injectable } from "@angular/core";
import { AbstractClass } from "../abstract-class";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { UserService } from "./user.service";
import { ConcreteClassUsers } from "../concrete-users";

@Injectable({
  providedIn: 'root'
})
export class UsersResolver implements Resolve<AbstractClass>{
    constructor(private userService: UserService) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): AbstractClass {
    return new ConcreteClassUsers(this.userService);
  }
}