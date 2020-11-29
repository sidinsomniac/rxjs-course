import { Component, OnInit } from '@angular/core';
import { Course } from "../model/course";
import { interval, Observable, of, timer, throwError } from 'rxjs';
import { catchError, delayWhen, map, retryWhen, shareReplay, tap, filter, finalize } from 'rxjs/operators';
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
                catchError(err => throwError(err)),
                finalize(() => console.log("Finalize executed")),
                tap(console.log),
                map((payload: { payload: Course[]; }) => Object.values(payload.payload)),
                shareReplay(),
                retryWhen(err => err.pipe(
                    delayWhen(() => timer(2000))
                ))
            );

        this.beginnerCourses$ = courses$.pipe(
            map(courses => courses.filter((course: Course) => course.category === "BEGINNER"))
        );

        this.advancedCourses$ = courses$.pipe(
            map(courses => courses.filter((course: Course) => course.category === "ADVANCED"))
        );

    }

}
