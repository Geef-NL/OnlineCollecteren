import {Component, Input} from '@angular/core';
import {Output} from "@angular/core";
import {EventEmitter} from "@angular/core";

@Component({
    selector: 'image-upload',
    styleUrls: ['./image-upload.scss'],
template: `
    <div class="imageUploadContainer" [ngClass]="{'uploading': currentFile.uploading }">
        
        <div class="currentImage" [ngClass]="{'show': currentFile.file }">
            <img class="currentImageImg" *ngIf="currentFile.file" [src]="currentFile.file|imageSize:currentFile.resize" (error)="clearCurrentFile()"/>   
            <div class="changeImage" (click)="clearCurrentFile()">
                <div class="inner">
                    Ander bestand kiezen
                </div>                
            </div>
        </div>
        
        <div class="uploadImage" [ngClass]="{'show': !currentFile.file }">
            
            <div class="chooseButton" *ngIf="!currentFile.uploading">
                <span class="label">Kies bestand</span>
            </div>
            <div class="imageLoading" *ngIf="currentFile.uploading" >
                <span class="loadingSpinner" *ngIf="currentFile.uploading"><i class="fa fa-spinner fa-spin"></i></span>
                <span *ngIf="currentFile.uploading" class="label">{{chosenFile.name}}</span>                
            </div>
            
            <input type="file" name="file" (change)="fileChosen($event)" accept="image/gif,image/png,image/x-png,image/jpeg" />        
        </div>
        
    </div>`
})
export class ImageUpload {
    @Input() currentFile: any = {
        file: null,
        fileName: null,
        type: 'document',
        uploading: false
    };
    public chosenFile: File;
    @Output() onFileChosen: EventEmitter<File> = new EventEmitter<File>();
    @Output() onClear: EventEmitter<boolean> = new EventEmitter<boolean>();

    clearCurrentFile(){
        this.currentFile.file = null;
        this.currentFile.fileName = null;
        this.onClear.emit(true);
    }

    fileChosen(event){
        const file: any = event.target.files[0];
        if (typeof file === 'undefined') return;

        this.chosenFile = file;
        this.onFileChosen.emit(file);
    }

}
