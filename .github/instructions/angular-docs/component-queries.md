## Component Queries

Angular 19 introduces signal-based queries that provide reactive access to child components and DOM elements.

### View Queries

```typescript
@Component({
  selector: "app-user-form",
  template: `
    <form #userForm="ngForm">
      <input #nameInput name="name" ngModel placeholder="Enter name" required />

      <input #emailInput name="email" type="email" ngModel placeholder="Enter email" required />

      <button type="submit" [disabled]="!userForm.valid">Submit</button>
    </form>

    <div class="validation-summary">
      <p>Form Valid: {{ isFormValid() }}</p>
      <p>Name Length: {{ nameLength() }}</p>
    </div>
  `,
})
export class UserFormComponent {
  // Signal-based view queries
  nameInput = viewChild<ElementRef<HTMLInputElement>>("nameInput");
  emailInput = viewChild<ElementRef<HTMLInputElement>>("emailInput");
  userForm = viewChild<NgForm>("userForm");

  // Required queries (will throw error if not found)
  nameInputRequired = viewChild.required<ElementRef<HTMLInputElement>>("nameInput");

  // Computed values based on queries
  isFormValid = computed(() => {
    const form = this.userForm();
    return form ? form.valid : false;
  });

  nameLength = computed(() => {
    const input = this.nameInput();
    return input ? input.nativeElement.value.length : 0;
  });

  ngAfterViewInit() {
    // Access elements after view initialization
    const nameEl = this.nameInput()?.nativeElement;
    if (nameEl) {
      nameEl.focus();
    }
  }

  // Method to programmatically interact with form
  resetForm() {
    const form = this.userForm();
    if (form) {
      form.resetForm();
    }
  }
}
```

### Multiple View Queries

```typescript
@Component({
  selector: "app-card-list",
  template: `
    @for (card of cards(); track card.id) {
      <app-card [title]="card.title" [content]="card.content"> </app-card>
    }

    <div class="card-summary">
      <p>Total Cards: {{ cardComponents().length }}</p>
      <button (click)="highlightAllCards()">Highlight All</button>
    </div>
  `,
})
export class CardListComponent {
  cards = signal([
    { id: 1, title: "Card 1", content: "Content 1" },
    { id: 2, title: "Card 2", content: "Content 2" },
  ]);

  // Query for multiple components
  cardComponents = viewChildren(CardComponent);

  // Computed based on multiple queries
  totalCards = computed(() => this.cardComponents().length);
  hasCards = computed(() => this.cardComponents().length > 0);

  highlightAllCards() {
    this.cardComponents().forEach((card) => {
      card.highlight();
    });
  }
}

@Component({
  selector: "app-card",
  template: `
    <div class="card" [class.highlighted]="isHighlighted">
      <h3>{{ title }}</h3>
      <p>{{ content }}</p>
    </div>
  `,
})
export class CardComponent {
  @Input() title = "";
  @Input() content = "";
  isHighlighted = false;

  highlight() {
    this.isHighlighted = true;
    setTimeout(() => (this.isHighlighted = false), 2000);
  }
}
```

### Content Queries

```typescript
@Component({
  selector: "app-tab-group",
  template: `
    <div class="tab-headers">
      @for (tab of tabComponents(); track tab.id; let i = $index) {
        <button class="tab-header" [class.active]="i === activeTabIndex()" (click)="selectTab(i)">
          {{ tab.title }}
        </button>
      }
    </div>

    <div class="tab-content">
      <ng-content></ng-content>
    </div>
  `,
})
export class TabGroupComponent {
  activeTabIndex = signal(0);

  // Content queries - find projected content
  tabComponents = contentChildren(TabComponent);

  // Computed properties
  hasMultipleTabs = computed(() => this.tabComponents().length > 1);
  currentTab = computed(() => {
    const tabs = this.tabComponents();
    const index = this.activeTabIndex();
    return tabs[index] || null;
  });

  ngAfterContentInit() {
    // Show first tab by default
    this.showTabAtIndex(0);
  }

  selectTab(index: number) {
    this.activeTabIndex.set(index);
    this.showTabAtIndex(index);
  }

  private showTabAtIndex(index: number) {
    const tabs = this.tabComponents();
    tabs.forEach((tab, i) => {
      tab.isActive = i === index;
    });
  }
}

@Component({
  selector: "app-tab",
  template: `
    <div class="tab-panel" [hidden]="!isActive">
      <ng-content></ng-content>
    </div>
  `,
})
export class TabComponent {
  @Input() title = "";
  @Input() id = "";
  isActive = false;
}

// Usage:
@Component({
  template: `
    <app-tab-group>
      <app-tab title="Profile" id="profile">
        <h2>User Profile</h2>
        <p>Profile content here...</p>
      </app-tab>

      <app-tab title="Settings" id="settings">
        <h2>Settings</h2>
        <p>Settings content here...</p>
      </app-tab>

      <app-tab title="Help" id="help">
        <h2>Help & Support</h2>
        <p>Help content here...</p>
      </app-tab>
    </app-tab-group>
  `,
})
export class AppComponent {}
```
