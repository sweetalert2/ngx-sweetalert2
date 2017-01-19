# NgSweetAlert2 [![npm version](https://img.shields.io/npm/v/@toverux/ngsweetalert2.svg?style=flat-square)](https://www.npmjs.com/package/@toverux/ngsweetalert2) ![license](https://img.shields.io/github/license/toverux/ngsweetalert2.svg?style=flat-square)

[SweetAlert2](https://github.com/limonte/sweetalert2) integration for Angular. This is not a wrapper for SweetAlert (which works well alone), it intends to provide Angular-esque utilities on top of it.

## Installation & Usage

Install via the npm registry:

```bash
yarn add @toverux/ngsweetalert2
```

Then, import the module:

```typescript
import { SweetAlert2Module } from '@toverux/ngsweetalert2';

@NgModule({
    imports: [SweetAlert2Module],
    // ...
})
export class AppModule {}
```

## API

### SwalDirective

Adding the `[swal]` attribute to an element will attach the directive to it.

The directive will listen for `click` events and display a SweetAlert modal, configured using the options you pass to the attribute. The options are of type [`SweetAlertOptions` (provided by sweetalert2)](https://github.com/limonte/sweetalert2/blob/master/sweetalert2.d.ts#L204), or a simple array of strings, of format `[title: string, text: string (, type: string)]`.

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

### More to come...

 - Real tests, not just a .travis.yml file ;
 - I plan to add more features, like supporting SweetAlert queues ;
 - Add a component? Like `<swal #myAlert title="Hey you"></swal>` ? Useful ?
 - **Don't hesitate to open an issue to propose/ask for a feature.**
