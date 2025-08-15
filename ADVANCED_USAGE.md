# Advanced Usage Examples

## Using with provideSweetAlert2ForFeature

For lazy-loaded modules or components that need different SweetAlert2 configuration:

```typescript
// feature.component.ts
import { Component } from '@angular/core';
import { SwalComponent, provideSweetAlert2ForFeature } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'feature-component',
  imports: [SwalComponent],
  providers: [
    ...provideSweetAlert2ForFeature({
      dismissOnDestroy: false, // Different from root configuration
    })
  ],
  template: `
    <swal #featureSwal 
          title="Feature Modal"
          text="This modal won't auto-dismiss when component is destroyed">
    </swal>
  `
})
export class FeatureComponent {}
```

## Lazy Loading SweetAlert2

For even better performance, you can provide a custom loader:

```typescript
// app.config.ts
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';

export const appConfig: ApplicationConfig = {
  providers: [
    provideSweetAlert2({
      provideSwal: () => import('sweetalert2'), // Lazy load
      fireOnInit: false,
      dismissOnDestroy: true
    })
  ]
};
```

## Using with Custom SweetAlert2 Build

```typescript
// app.config.ts
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';

export const appConfig: ApplicationConfig = {
  providers: [
    provideSweetAlert2({
      provideSwal: () => import('sweetalert2/dist/sweetalert2.all.min.js'),
      fireOnInit: false,
      dismissOnDestroy: true
    })
  ]
};
```

## Testing with Standalone Components

```typescript
// my.component.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';
import { MyComponent } from './my.component';

describe('MyComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyComponent],
      providers: [
        provideSweetAlert2({
          provideSwal: () => Promise.resolve({
            fire: jasmine.createSpy('fire')
          }),
        })
      ]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MyComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });
});
```

## Tree-Shaking Example

Import only what you need for optimal bundle size:

```typescript
// Only using the directive
import { Component } from '@angular/core';
import { SwalDirective } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'simple-component',
  imports: [SwalDirective], // Only imports the directive
  template: `
    <button [swal]="['Hello', 'World!']">Click me</button>
  `
})
export class SimpleComponent {}
```

```typescript
// Using both component and directive
import { Component } from '@angular/core';
import { SwalComponent, SwalDirective } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'advanced-component',
  imports: [SwalComponent, SwalDirective], // Import both
  template: `
    <button [swal]="mySwal">Show Modal</button>
    <swal #mySwal title="Hello" text="World!"></swal>
  `
})
export class AdvancedComponent {}
```

## Portal Usage with Standalone

```typescript
import { Component } from '@angular/core';
import { SwalComponent, SwalPortalDirective } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'portal-example',
  imports: [SwalComponent, SwalPortalDirective],
  template: `
    <swal title="Dynamic Content">
      <div *swalPortal>
        <p>This content is rendered inside the SweetAlert modal!</p>
        <p>Current time: {{ currentTime | date:'medium' }}</p>
      </div>
    </swal>
  `
})
export class PortalExampleComponent {
  currentTime = new Date();
}
