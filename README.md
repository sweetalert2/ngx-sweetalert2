# Ng[SweetAlert2](https://github.com/limonte/sweetalert2) [![npm version](https://img.shields.io/npm/v/@toverux/ngsweetalert2.svg?style=flat-square)](https://www.npmjs.com/package/@toverux/ngsweetalert2) ![license](https://img.shields.io/github/license/toverux/ngsweetalert2.svg?style=flat-square)

[SweetAlert2](https://github.com/limonte/sweetalert2) integration for Angular. This is not a wrapper for SweetAlert (which works well alone), it intends to provide Angular-esque utilities on top of it.

## Installation & Usage

1) Install via the npm registry:

```bash
yarn add @toverux/ngsweetalert2
```

2) Then, import SweetAlert's CSS file, exactly like you're doing usually with vendor styles. Could be a TypeScript `import` with Webpack, a SASS `@import`, or even a `<link>` tag: that depends of you build system.

3) Finally, import the module:

```typescript
import { SweetAlert2Module } from '@toverux/ngsweetalert2';

@NgModule({
    imports: [SweetAlert2Module],
    
    // OR provide default options, for example make Swal more Bootstrap-friendly:
    imports: [
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-lg btn-primary',
            cancelButtonClass: 'btn btn-lg'
        })
    ]
})
export class AppModule {}
```

## API

### SwalDirective

Adding the `[swal]` attribute to an element will attach the directive to it.

The directive will listen for `click` events and display a SweetAlert modal, configured using the options you pass to the attribute. The options are of type [`SweetAlertOptions` (provided by sweetalert2)](https://github.com/limonte/sweetalert2/blob/master/sweetalert2.d.ts#L204), or a simple array of strings, of format `[title: string, text: string (, type: string)]`.

```typescript
class __API__ {
    @Input() public set swal(options: SweetAlertOptions|SimpleSweetAlertOptions);

    @Output() public confirm: EventEmitter<any>;
    @Output() public cancel: EventEmitter<any>;
}
```

Simple confirmation dialog:

```html
<button [swal]="['Delete?', 'This cannot be undone.', 'warning']" (confirm)="deleteFile(file)">
  Delete {{ file.name }}
</button>
```

More advanced (input in dialog, dismissal handling):

```html
<button [swal]="{ title: 'Enter your email', input: 'email' }"
        (confirm)="saveEmail($event)"
        (cancel)="handleRefusalToSetEmail($event)">
  Set my e-mail address
</button>
```

```typescript
export class MyComponent {
    public saveEmail(email: string): void {
        // ... save user email
    }

    public handleRefusalToSetEmail(dismissMethod: string): void {
        // dismissMethod can be 'cancel', 'overlay', 'close', and 'timer'
        // ... do something
    }
}
```

### SwalComponent

The library also provides a component, that can be useful for displaying other dialogs than confirmation ones. Others can prefer to use that to avoid having dialog-related logic in their codebehind.

```typescript
class __API__ {
    @Input() public type: SweetAlertType;
    @Input() public title: string;
    @Input() public text: string;
    @Input() public html: string;
    @Input() public options: SweetAlertOptions;
    
    @Output() public confirm: EventEmitter<any>;
    @Output() public cancel: EventEmitter<any>;
    
    public show(): Promise<any>;
}
```

Simple example:

```html
<swal #dialog title="..." type="info"></swal>
<button (click)="dialog.show().then(goToProfile)">Go to my profile</button>

Or:
<swal #dialog title="..." type="info" (confirm)="goToProfile()" (cancel)="doSomethingElse()"></swal>
<button (click)="dialog.show()>Go to my profile</button>
```

If you decide to use the `show().then(...)` form, remember that you'll have to handle the promise rejection if the modal is dismissable, or you'll get an "uncaught promise rejection" in your console.

If you use the `(confirm)="handler()"` form, `(cancel)` is optional.

You can also access the dialog from your codebehind:

```typescript
class MyComponent {
    @ViewChild('dialog') private swalDialog: SwalComponent;
}
```

You can pass more SweetAlert2-native options via the `options` input:

```html
<swal #dialog [options]="{ confirmButtonText: 'I understand' }"></swal>
```

### More to come...

 - Real tests, not just a .travis.yml file ;
 - I plan to add more features, like supporting SweetAlert queues ;
 - **Don't hesitate to open an issue to propose/ask for a feature.**
