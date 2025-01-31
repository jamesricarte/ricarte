import { Component } from "@angular/core";

@Component({
    selector: 'post-list',
    templateUrl: './post-list.component.html',
    styleUrls: ['./post-list.component.css']
})

export class PostListComponent {
    posts = [
        { title: '1st Title', content: 'Surprise my n g' },
        { title: '2st Title', content: 'Surprise my n g' },
        { title: '3st Title', content: 'Surprise my n g' },
    ]
}