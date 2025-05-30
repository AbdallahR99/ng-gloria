## Migration Tips

### From RxJS to rxResource

**Before (Angular 18):**

```typescript
// Old approach with RxJS
export class DataComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  loading = false;
  data: any[] = [];
  error: string | null = null;

  ngOnInit() {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((query) => {
          this.loading = true;
          return this.dataService.search(query).pipe(
            catchError((error) => {
              this.error = error.message;
              return of([]);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.loading = false;
        this.data = data;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

**After (Angular 19):**

```typescript
// New approach with rxResource
export class DataComponent {
  searchQuery = signal("");

  data = rxResource({
    params: () => ({ query: this.searchQuery() }),
    stream: ({ params }) => this.dataService.search(params.query),
  });

  // No need for manual subscription management!
}
```

### From \*ngIf to @if

**Before:**

```html
<div *ngIf="user.isAdmin; else notAdmin">
  <admin-panel></admin-panel>
</div>
<ng-template #notAdmin>
  <div *ngIf="user.isEditor; else viewer">
    <editor-panel></editor-panel>
  </div>
  <ng-template #viewer>
    <viewer-panel></viewer-panel>
  </ng-template>
</ng-template>
```

**After:**

```html
@if (user.isAdmin) {
<admin-panel></admin-panel>
} @else if (user.isEditor) {
<editor-panel></editor-panel>
} @else {
<viewer-panel></viewer-panel>
}
```

### From @ViewChild to viewChild

**Before:**

```typescript
export class MyComponent implements AfterViewInit {
  @ViewChild("myInput") inputRef!: ElementRef;
  @ViewChildren(ChildComponent) children!: QueryList<ChildComponent>;

  ngAfterViewInit() {
    // Access DOM after view init
    this.inputRef.nativeElement.focus();

    this.children.changes.subscribe(() => {
      // Handle children changes
    });
  }
}
```

**After:**

```typescript
export class MyComponent {
  inputRef = viewChild<ElementRef>("myInput");
  children = viewChildren(ChildComponent);

  // Use in computed or effect for reactive access
  constructor() {
    effect(() => {
      const input = this.inputRef();
      if (input) {
        input.nativeElement.focus();
      }
    });

    effect(() => {
      const childrenList = this.children();
      console.log("Children count:", childrenList.length);
    });
  }
}
```

### Best Practices

1. **Use rxResource for data fetching**: Replace manual RxJS subscription patterns
2. **Prefer signal-based queries**: More reactive and easier to use than decorator-based queries
3. **Use @if/@for/@switch**: Cleaner and more intuitive than structural directives
4. **Combine computed and effect**: Create reactive derived state and side effects
5. **Model for two-way binding**: Simplifies component input/output patterns
6. **Cleanup effects properly**: Use onCleanup parameter for resource cleanup
