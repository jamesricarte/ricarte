import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Post } from "./post.model";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs";
import {Router} from '@angular/router';  
import { AuthService } from '../authentication/auth.service';  

@Injectable({providedIn: 'root'})
export class PostsService {
    private posts: Post[] = [];
    private postUpdated = new Subject<{posts: Post[], postCount: number}>();  

    constructor(private http: HttpClient, private router: Router, private authService: AuthService){

    }  

    getPosts(pagesize: number, currentpage: number) {
        const queryParams = `?pagesize=${pagesize}&currentpage=${currentpage}`;
        this.http.get<{message: string, posts: any, maxPosts: number}>('http://localhost:3000/api/posts' + queryParams)
        .pipe(  
            map(postData => {  
                return {
                    posts: postData.posts.map((post: any) => {
                        return {
                        title: post.title,
                        content: post.content,
                        id: post._id,
                        imagePath: post.imagePath,
                        creator: post.creator._id,
                        creatorEmail: post.creator.email
                        };
                    }),
                    maxPosts: postData.maxPosts
                }; 
            })  
        )  
        .subscribe((transformedPostsData) => {
            this.posts = transformedPostsData.posts;  
            this.postUpdated.next({  
                posts: [...this.posts],   
                postCount: transformedPostsData.maxPosts
            });  
        });  
    }
    
    getPostUpdateListener() {
        return this.postUpdated.asObservable();
    }

    getPost(id: string) {  
        return this.http.get<{_id: string, title: string, content:string, imagePath: string, creator: string}>("http://localhost:3000/api/posts/"+id);     
    }  

    addPost(title: string, content: string, image: File) {
        const postData = new FormData();
        postData.append('title', title);
        postData.append('content', content);
        postData.append('image', image, title);
        
        this.http.post<{message: string, post: Post}>('http://localhost:3000/api/posts', postData)
        .subscribe((responseData) => {
            this.router.navigate(["/"]);
        })
    }

    updatePost( id: string, title:string, content:string, image: File | string){  
       let postData: Post|FormData
        if (typeof(image) == 'object') {
            postData = new FormData();
            postData.append('id', id);
            postData.append('title', title);
            postData.append('content', content);
            postData.append('image', image, title);
        } else {
            postData = {
                id: id,
                title: title,
                content: content,
                imagePath: image,
                creator: null,
                creatorEmail: ''
            };
        }

        const token = this.authService.getToken();
        this.http.put<{ message: string; imagePath: string }>("http://localhost:3000/api/posts/"+id,postData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .subscribe(response =>{  
            this.router.navigate(["/"]);  
          });  
      }  

    deletePost(postId: string) {
        const token = this.authService.getToken();
        return this.http.delete("http://localhost:3000/api/posts/"+postId, {
            headers: {
            Authorization: `Bearer ${token}`
        }});  
    }
}