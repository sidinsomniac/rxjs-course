import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, Observable, of, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    public beginnerCourses: Course[];
    public advancedCourses: Course[];


    constructor(private http: HttpClient) {

    }

    ngOnInit() {

        this.http.get('/api/courses')
            .pipe(
                map((payload: { payload: Course[]; }) => Object.values(payload.payload))
            )
            .subscribe((courses: Course[]) => {
                this.beginnerCourses = courses.filter((course: Course) => course.category === "BEGINNER");
                this.advancedCourses = courses.filter((course: Course) => course.category === "ADVANCED");
            });

    }

}
