import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";


@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  getDashboardReport(
    ): Observable<any> {
    // Mock data based on colDefs in ConcreteClassHome
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
    return of(mockData);
  }
 
  getAllUsersData(): Observable<any> {
    // Mock data based on colDefs in ConcreteClassUsers
    const mockData = [
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
    return of(mockData);
  }
}