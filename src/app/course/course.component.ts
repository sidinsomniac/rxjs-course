import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
    debounceTime,
    distinctUntilChanged,
    startWith,
    tap,
    delay,
    map,
    concatMap,
    switchMap,
    withLatestFrom,
    concatAll, shareReplay
} from 'rxjs/operators';
import { merge, fromEvent, Observable, concat } from 'rxjs';
import { Lesson } from '../model/lesson';
import { HttpClient } from "@angular/common/http";
import { debug, RxJsLoggingLevel } from "../common/debug";


@Component({
    selector: 'course',
    templateUrl: './course.component.html',
    styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, AfterViewInit {

    public courseId: string;

    public course$: Observable<Course>;
    public lessons$: Observable<Lesson[]>;


    @ViewChild('searchInput', { static: true }) input: ElementRef;

    constructor(private route: ActivatedRoute, private http: HttpClient) {


    }

    ngOnInit() {

        this.courseId = this.route.snapshot.params['id'];

        this.course$ = this.http.get<Course>(`/api/courses/${this.courseId}`)
            .pipe(
                debug(RxJsLoggingLevel.INFO, "course value"),
            );


    }

    ngAfterViewInit() {



        this.lessons$ = fromEvent<{ target: { value: string; }; }>(this.input.nativeElement, 'keyup')
            .pipe(
                map(e => e.target.value),
                startWith(''),
                debug(RxJsLoggingLevel.INFO, "search"),
                debounceTime(500),
                distinctUntilChanged(),
                switchMap(search => this.loadLessons(search)),
                debug(RxJsLoggingLevel.INFO, "lesson value")
            );

    }


    loadLessons(search = ''): Observable<Lesson[]> {
        return this.http.get<{ payload: Lesson[]; }>(`/api/lessons/?courseId=${this.courseId}&pageSize=100&filter=${search}`)
            .pipe(
                map(data => Object.values(data.payload))
            );
    }




}
