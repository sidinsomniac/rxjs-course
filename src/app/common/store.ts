import { Injectable } from "@angular/core";
import { Observable, BehaviorSubject } from "rxjs";
import { Course } from "../model/course";
import { map, tap, filter } from "rxjs/operators";
import { createHttpObservable } from "./util";
import { fromPromise } from "rxjs/internal-compatibility";

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

    saveCourse(courseId: number, changes): Observable<any> {
        const courses = this.sub.getValue();
        const courseIndex = courses.findIndex(course => course.id === courseId);
        const newCourses = [...courses];
        newCourses[courseIndex] = {
            ...courses[courseIndex],
            ...changes
        };
        this.sub.next(newCourses);
        return fromPromise(fetch(`/api/courses/${courseId}`, {
            method: 'PUT',
            body: JSON.stringify(changes),
            headers: {
                'content-type': 'application/json'
            }
        }));
    }

    selectCourseById(courseId: number) {
        return this.courses$
            .pipe(
                map(courses => courses
                    .find(course => course.id == courseId)),
                filter(course => !!course)
            );
    }

}