import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, Observable, of, timer } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap, filter } from 'rxjs/operators';
import { HttpClient } from "@angular/common/http";


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    public beginnerCourses$: Observable<Course[]>;
    public advancedCourses$: Observable<Course[]>;


    constructor(private http: HttpClient) {

    }

    ngOnInit() {

        const courses$: Observable<Course[]> = this.http.get('/api/courses')
            .pipe(
                tap(console.log),
                map((payload: { payload: Course[]; }) => Object.values(payload.payload)),
                shareReplay(),
                catchError(() => of([
                    {
                        id: 0,
                        description: "RxJs In Practice Course",
                        iconUrl: 'https://s3-us-west-1.amazonaws.com/angular-university/course-images/rxjs-in-practice-course.png',
                        courseListIcon: 'https://angular-academy.s3.amazonaws.com/main-logo/main-page-logo-small-hat.png',
                        longDescription: "Understand the RxJs Observable pattern, learn the RxJs Operators via practical examples",
                        category: 'BEGINNER',
                        lessonsCount: 10
                    }
                ]))
            );

        this.beginnerCourses$ = courses$.pipe(
            map(courses => courses.filter((course: Course) => course.category === "BEGINNER"))
        );

        this.advancedCourses$ = courses$.pipe(
            map(courses => courses.filter((course: Course) => course.category === "ADVANCED"))
        );

    }

}
