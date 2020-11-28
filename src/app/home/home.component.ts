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
                map((payload: { payload: Course[]; }) => Object.values(payload.payload))
            );

        this.beginnerCourses$ = courses$.pipe(
            map(courses => courses.filter((course: Course) => course.category === "BEGINNER"))
        );

        this.advancedCourses$ = courses$.pipe(
            map(courses => courses.filter((course: Course) => course.category === "ADVANCED"))
        );


        // .subscribe((courses: Course[]) => {
        //     this.beginnerCourses$ = );
        //     this.advancedCourses$ = courses.filter((course: Course) => course.category === "ADVANCED");
        // });

    }

}
