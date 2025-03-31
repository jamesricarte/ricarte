import { Component, EventEmitter, Output } from "@angular/core";
import { PostsService } from "../post.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from '@angular/router';  

import { OnInit } from "@angular/core";
import { Post } from "../post.model";

import { mimetype } from "./mime-type.validator";

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
    public form!: FormGroup;
    public Pickedimage!: string;

    constructor(public postsService: PostsService, public route:ActivatedRoute) {
        
    }
    
    ngOnInit(){  
        this.form = new FormGroup({
          'title': new FormControl(null, {validators: [Validators.required, Validators.minLength(3)]}),
          'content': new FormControl(null, {validators: [Validators.required]}),
          'image': new FormControl(null, {
            validators: [Validators.required],
            asyncValidators: [mimetype]
          }),
        })
        this.route.paramMap.subscribe((paramMap: ParamMap)=>{  
            if(paramMap.has('postId')){  
              this.mode = 'edit';  
              this.postId = paramMap.get('postId');  

              this.Loading = true;
  
              if (this.postId) {
                  this.postsService.getPost(this.postId).subscribe(postData => {  
                    this.Loading = false;
                      this.post = {
                          id: postData._id,
                          title: postData.title , 
                          content: postData.content,
                          imagePath: postData.imagePath
                      };
                      this.form.setValue({
                        title: this.post.title,
                        content: this.post.content,
                        image: this.post.imagePath
                      })
                  });
              }
              }else{  
                this.mode = 'create';  
                this.postId = null;  
              }
        });  
  }  

  PickedImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input || !input.files || input.files.length === 0) {
      return;
    }
    const file = input.files[0];
    this.form.patchValue({image: file});
    this.form.get('image')?.updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.Pickedimage = reader.result as string;
    }
    reader.readAsDataURL(file);
  } 

  onAddPost(){  
    if(this.form.invalid){  
      return;
    }  
    this.Loading = true;
    if(this.mode==="create"){  
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );  
    }else{  
      this.postsService.updatePost(  
        this.postId,  
        this.form.value.title,  
        this.form.value.content,
        this.form.value.image
      );  
    }  
    this.form.reset();  
  }  
}