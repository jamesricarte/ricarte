import { Component, EventEmitter, Output } from "@angular/core";
import { PostsService } from "../post.service";
import { NgForm } from "@angular/forms";

@Component({
    selector: 'post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent {
    // enteredContent = "";
    // enteredTitle = "";
    
    constructor(public postsService: PostsService) {
        
    }

    onAddPost(form: NgForm) {
        if(form.invalid) {
            return;
        }
        this.postsService.addPost(form.value.title, form.value.content);
    }
}