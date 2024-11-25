import {
    Component,
    OnDestroy,
    AfterViewInit,
    Input,
} from '@angular/core';
import {NG_VALUE_ACCESSOR} from "@angular/forms";
import {forwardRef} from "@angular/core";
import {ControlValueAccessor} from "@angular/forms";

declare var tinymce: any;

const TINYMCE_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TinyMceComponent),
    multi: true
};


@Component({
    selector: 'tinymce',
    template: `<textarea [id]="elementId" [name]="elementId" [(ngModel)]="value"></textarea>`,
    providers: [TINYMCE_VALUE_ACCESSOR]
})
export class TinyMceComponent implements AfterViewInit, OnDestroy, ControlValueAccessor {

    public elementId: String;
    private content: any = '';

    //Placeholders for the callbacks which are later providesd
    //by the Control Value Accessor
    private onTouchedCallback: () => void;
    private onChangeCallback: (_: any) => void;

    @Input() height: number = 300;

    private editor;
    private editorInitialized: boolean = false;

    constructor(){
        this.elementId = this.generateId();
    }

    ngAfterViewInit() {

       let _this = (this);

       tinymce.init({
            selector: '#' + _this.elementId,
            toolbar: 'bold italic underline | bullist numlist | paste | link',
            language: 'nl',
            language_url : '/assets/i18n/tinymce_nl.js',
            menubar: '',
            height: _this.height,
            plugins: 'link, paste, lists',
            resize: true,
            statusbar: false,
            branding: false,
            default_link_target: "_blank",
            link_assume_external_targets: true,
            target_list: false,
            link_title: false,
            paste_as_text: true,
            invalid_elements: 'h1,h2,h3,h4,h5,h6,hr,div,span,blockquote',
            skin_url:'/assets/tinymce-skins/lightgray',
            setup: function (editor) {
                _this.editor = editor;
                editor.on('init', () => {
                    _this.editorInitialized = true;
                    editor.setContent(_this.content);
                });
                editor.on('change', function(){
                    _this.value = editor.getContent();
                });
            }
        });
    }


    //get accessor
    get value(): any {
        return this.content;
    };

    //set accessor including call the onchange callback
    set value(v: any) {
        if (v !== this.content) {
            this.content = v;
            this.onChangeCallback(v);
        }
    }

    //From ControlValueAccessor interface
    writeValue(value: any) {
        if (value !== this.content) {
            this.content = value;
            if(this.editor && this.editorInitialized) {
                this.editor.setContent(value);
            }
        }
    }

    //From ControlValueAccessor interface
    registerOnChange(fn: any) {
        this.onChangeCallback = fn;
    }

    //From ControlValueAccessor interface
    registerOnTouched(fn: any) {
        this.onTouchedCallback = fn;
    }

    ngOnDestroy() {
        tinymce.remove(this.editor);
    }

    private  generateId() {
      var text = "";
      var possible = "abcdefghijklmnopqrstuvwxyz";
      for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      return text;
    }
}
