import {Component, Input} from '@angular/core';
import {Output} from "@angular/core";
import {EventEmitter} from "@angular/core";

@Component({
    selector: 'file-upload',
    styleUrls: ['./file-upload.scss'],
    template: `<div class="fileUploadContainer" [ngClass]="{'uploading': currentFile.uploading }">
    
            
                <div class="currentFile" [ngClass]="{'show': currentFile.file }">
                    <a class="fileName" href="{{currentFile.file}}" target="_blank">
                        {{currentFile.fileName}}
                    </a>  
                    <span class="changeFile" (click)="clearCurrentFile()" title="Verwijderen">&times;</span>                    
                </div>
        
                <div class="uploadFile" [ngClass]="{'show': !currentFile.file }">
                    <span *ngIf="!currentFile.uploading" class="fileName empty">Kies bestand…</span>
                    <span *ngIf="currentFile.uploading" class="fileName">{{chosenFile.name}}</span>
                    <span class="loadingSpinner" *ngIf="currentFile.uploading"><i class="fa fa-spinner fa-spin"></i></span>
                    
                    <input type="file" name="file" (change)="fileChosen($event)" />        
                </div>
        
            </div>`
})
export class FileUpload {
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