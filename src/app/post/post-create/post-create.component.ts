import { Component, EventEmitter, Output } from "@angular/core";
import { PostsService } from "../post.service";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, ParamMap } from '@angular/router';  

import { OnInit } from "@angular/core";
import { Post } from "../post.model";

@Component({
    selector: 'post-create',
    templateUrl: './post-create.component.html',
    styleUrls: ['./post-create.component.css']
})

export class PostCreateComponent implements OnInit{
    // enteredContent = "";
    // enteredTitle = "";

    private mode= 'create';  
    private postId: any | null = null; 
    public post: Post | null = null;  
    public Loading = false;

    constructor(public postsService: PostsService, public route:ActivatedRoute) {
        
    }
    
    ngOnInit(){  
        this.route.paramMap.subscribe((paramMap: ParamMap)=>{  
            if(paramMap.has('postId')){  
              this.mode = 'edit';  
              this.postId = paramMap.get('postId');  

              this.Loading = true;
  
              if (this.postId) {
                  this.postsService.getPost(this.postId).subscribe(postData => {  
                    this.Loading = false;
                      this.post = {
                          id: postData._id,  // ✅ Use `_id` (from MongoDB)
                          title: postData.title || '', // ✅ Handle undefined
                          content: postData.content || '' // ✅ Handle undefined
                      };
                  });
              }
              }else{  
                this.mode = 'create';  
                this.postId = null;  
              }
        });  
  }  

  onAddPost( form: NgForm){  
    if(form.invalid){  
      return;  
    }  
    this.Loading = true;
    if(this.mode==="create"){  
      this.postsService.addPost(form.value.title, form.value.content );  
    }else{  
      this.postsService.updatePost(  
        this.postId,  
        form.value.title,  
        form.value.content  
      );  
    }  
    form.resetForm();  
  }  
}