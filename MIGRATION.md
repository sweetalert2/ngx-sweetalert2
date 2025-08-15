# Migration Guide: From SweetAlert2Module to provideSweetAlert2

This guide helps you migrate from the traditional NgModule approach to the modern standalone component approach.

## Quick Migration

### Before (NgModule approach)

```typescript
// app.module.ts
import { NgModule } from '@angular/core';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  imports: [
    SweetAlert2Module.forRoot({
      fireOnInit: false,
      dismissOnDestroy: true
    })
  ],
  // ... other module configuration
})
export class AppModule {}
```

```typescript
// my.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'my-component',
  template: `
    <button [swal]="['Hello', 'World!']">Click me</button>
    <swal #mySwal title="Hello" text="World!"></swal>
  `
})
export class MyComponent {}
```

### After (Standalone approach)

```typescript
// app.config.ts or main.ts
import { ApplicationConfig } from '@angular/core';
import { provideSweetAlert2 } from '@sweetalert2/ngx-sweetalert2';

export const appConfig: ApplicationConfig = {
  providers: [
    provideSweetAlert2({
      fireOnInit: false,
      dismissOnDestroy: true
    }),
    // ... other providers
  ]
};
```

```typescript
// my.component.ts
import { Component } from '@angular/core';
import { SwalComponent, SwalDirective } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'my-component',
  imports: [SwalComponent, SwalDirective], // Import only what you need
  template: `
    <button [swal]="['Hello', 'World!']">Click me</button>
    <swal #mySwal title="Hello" text="World!"></swal>
  `
})
export class MyComponent {}
```

## Key Changes

1. **Replace** `SweetAlert2Module.forRoot()` **with** `provideSweetAlert2()` in your app configuration
2. **Replace** `SweetAlert2Module.forChild()` **with** `provideSweetAlert2ForFeature()` in feature modules/components
3. **Import individual components/directives** (`SwalComponent`, `SwalDirective`, `SwalPortalDirective`) instead of the entire module
4. **Configuration options remain the same** - no changes to `fireOnInit`, `dismissOnDestroy`, or `provideSwal` options

## Benefits of Migration

- ✅ **Smaller bundle size** - Only import components you actually use
- ✅ **Better tree-shaking** - Unused components are automatically excluded
- ✅ **Improved performance** - Reduced overhead from NgModule bootstrapping
- ✅ **Future-proof** - Aligns with modern Angular architecture
- ✅ **Better TypeScript support** - Enhanced IDE intellisense and error detection

## Gradual Migration

You don't need to migrate everything at once! The library supports both approaches:

1. **Start with new components** using the standalone approach
2. **Keep existing components** using the module approach
3. **Gradually migrate** components as you update them

Both approaches can coexist in the same application.

## Testing Updates

### Before
```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [SweetAlert2Module.forRoot()],
    declarations: [MyComponent]
  });
});
```

### After
```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    imports: [MyComponent], // Import the standalone component
    providers: [provideSweetAlert2()]
  });
});
```

## Need Help?

If you encounter issues during migration, please:

1. Check this migration guide
2. Review the updated documentation
3. Open an issue on GitHub with your specific use case

The traditional NgModule approach will continue to work for backward compatibility, so there's no rush to migrate unless you want the benefits of the modern approach.
