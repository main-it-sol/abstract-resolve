import { Injectable } from "@angular/core";
import { delay, defer, Observable, of } from "rxjs";
import { FormControl, Validators } from '@angular/forms';

export const USER_ROLES = ['Admin', 'User', 'Manager'] as const;
export type UserRole = typeof USER_ROLES[number];
export type User = { userName: string; userEmail: string; userRole: UserRole; numberOfSeats: number };
export type DashboardRow = { seatName: string; sourceId: string; sourceName: string; environmentName: string };

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  getDashboardReport(
    ): Observable<DashboardRow[]> {
    // Mock dashboard data.
    const mockData = [
      {
        seatName: "Alpha",
        sourceId: "SRC001",
        sourceName: "Source A",
        environmentName: "Production"
      },
      {
        seatName: "Bravo",
        sourceId: "SRC002",
        sourceName: "Source B",
        environmentName: "Staging"
      },
      {
        seatName: "Charlie",
        sourceId: "SRC003",
        sourceName: "Source C",
        environmentName: "Development"
      },
      {
        seatName: "Bravo",
        sourceId: "SRC004",
        sourceName: "Source D",
        environmentName: "QA"
      },
      {
        seatName: "Bravo",
        sourceId: "SRC005",
        sourceName: "Source E",
        environmentName: "Production"
      },
      {
        seatName: "Bravo",
        sourceId: "SRC006",
        sourceName: "Source F",
        environmentName: "Staging"
      },
      {
        seatName: "Alpha",
        sourceId: "SRC007",
        sourceName: "Source G",
        environmentName: "Development"
      },
      {
        seatName: "Charlie",
        sourceId: "SRC008",
        sourceName: "Source H",
        environmentName: "QA"
      },
      {
        seatName: "Charlie",
        sourceId: "SRC009",
        sourceName: "Source I",
        environmentName: "Production"
      },
      {
        seatName: "Alpha",
        sourceId: "SRC010",
        sourceName: "Source J",
        environmentName: "Staging"
      }
    ];
    // ponytail: demo-only latency; remove the delays when using the real backend.
    return of(mockData).pipe(delay(1000));
  }
 
  // ponytail: session-only demo storage; replace with a backend when persistence is required.
  private users: User[] = [
      {
        userName: "Alice Smith",
        userEmail: "alice.smith@example.com",
        userRole: "Admin",
        numberOfSeats: 5
      },
      {
        userName: "Bob Johnson",
        userEmail: "bob.johnson@example.com",
        userRole: "User",
        numberOfSeats: 2
      },
      {
        userName: "Carol Lee",
        userEmail: "carol.lee@example.com",
        userRole: "Manager",
        numberOfSeats: 3
      },
      {
        userName: "David Kim",
        userEmail: "david.kim@example.com",
        userRole: "User",
        numberOfSeats: 1
      },
      {
        userName: "Eva Brown",
        userEmail: "eva.brown@example.com",
        userRole: "Admin",
        numberOfSeats: 4
      },
      {
        userName: "Frank Green",
        userEmail: "frank.green@example.com",
        userRole: "User",
        numberOfSeats: 2
      },
      {
        userName: "Grace White",
        userEmail: "grace.white@example.com",
        userRole: "Manager",
        numberOfSeats: 6
      },
      {
        userName: "Henry Black",
        userEmail: "henry.black@example.com",
        userRole: "User",
        numberOfSeats: 1
      },
      {
        userName: "Ivy Wilson",
        userEmail: "ivy.wilson@example.com",
        userRole: "Admin",
        numberOfSeats: 3
      },
      {
        userName: "Jack Taylor",
        userEmail: "jack.taylor@example.com",
        userRole: "User",
        numberOfSeats: 2
      }
    ];

  getAllUsersData(): Observable<User[]> {
    return defer(() => of(this.users.map(user => ({ ...user })))).pipe(delay(1000));
  }

  emailExists(email: string): boolean {
    return this.users.some(user => user.userEmail.toLowerCase() === email.trim().toLowerCase());
  }

  addUser(user: User): void {
    const userName = user.userName.trim();
    const userEmail = user.userEmail.trim();
    const email = new FormControl(userEmail, [Validators.required, Validators.email]);
    if (!userName || email.invalid || !USER_ROLES.includes(user.userRole) ||
        !Number.isSafeInteger(user.numberOfSeats) || user.numberOfSeats < 0) {
      throw new Error('Invalid user details.');
    }
    if (this.emailExists(userEmail)) throw new Error('A user with this email already exists.');
    this.users = [...this.users, { ...user, userName, userEmail }];
  }
}