import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { Course } from "../model/course";
import { map, tap } from "rxjs/operators";
import { createHttpObservable } from "./util";

@Injectable({
    providedIn: 'root'
})

export class Store {

    private sub: BehaviorSubject<Course[]> = new BehaviorSubject([]);
    public courses$: Observable<Course[]> = this.sub.asObservable();

    init() {
        const http$: Observable<any> = createHttpObservable('/api/courses');

        http$.pipe(
            tap(() => console.log("HTTP request executed")),
            map(res => Object.values(res["payload"]))
        ).subscribe(
            (courses: Course[]) => {
                this.sub.next(courses);
            }
        );
    }

    selectBeginnerCourses(): Observable<Course[]> {
        return this.filterByCategory('BEGINNER');
    }

    selectAdvancedCourses(): Observable<Course[]> {
        return this.filterByCategory('ADVANCED');
    }

    filterByCategory(category: string) {
        return this.courses$
            .pipe(
                map(courses => courses
                    .filter(course => course.category == category))
            );
    }

}