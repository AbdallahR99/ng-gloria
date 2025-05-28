---
applyTo: "**"
---

# Angular 19 - New Features & Enhancements Guide

This guide covers the key new features and enhancements in Angular 19, focusing on modern reactive patterns and improved developer experience.

## Table of Contents

1. [rxResource - RxJS-based Resource Loading](angular-docs/rxresource.md)
2. [Template Control Flow](angular-docs/template-control-flow.md)
3. [Component Queries with Signals](angular-docs/component-queries.md)
4. [Model Signals](angular-docs/model-signals.md)
5. [Computed Signals](angular-docs/computed-signals.md)
6. [Effect Function](angular-docs/effect-function.md)
7. [Migration Tips](angular-docs/migration-tips.md)

---

## rxResource

The `rxResource` function creates a reactive resource that automatically manages loading states and updates based on request changes. It's perfect for data fetching scenarios where you need automatic loading states and reactive updates.

### Basic Usage

```typescript
import { rxResource } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-live-view",
  template: `
    <!-- Loading State -->
    @if (liveViewCards.isLoading()) {
      <div class="flex justify-center items-center w-full h-full">
        <span class="text-primary loading loading-infinity loading-lg"></span>
      </div>
    }

    <!-- Content State -->
    @if (liveViewCards.hasValue()) {
      @let cards = liveViewCards.value();
      @if (cards.length === 0) {
        <div class="flex justify-center items-center w-full h-full">
          <h4>No Data Available</h4>
        </div>
      } @else {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (card of cards; track card.id) {
            <div class="card bg-base-100 shadow-xl">
              <div class="card-body">
                <h2 class="card-title">{{ card.title }}</h2>
                <p>{{ card.description }}</p>
              </div>
            </div>
          }
        </div>
      }
    }

    <!-- Error State -->
    @if (liveViewCards.hasError()) {
      <div class="alert alert-error">
        <span>Error loading data: {{ liveViewCards.error() }}</span>
      </div>
    }
  `,
})
export class LiveViewComponent {
  searchQuery = signal("");

  liveViewCards = rxResource({
    request: () => ({
      queryParam: this.searchQuery(),
    }),
    loader: ({ request }) => {
      return this.dataService.getObjects({
        advancedSearch: {
          keyword: request.queryParam.length > 3 ? request.queryParam : undefined,
        },
        type: "LiveViewUiObject",
      });
    },
  });

  updateSearch(query: string) {
    this.searchQuery.set(query);
    // rxResource automatically triggers reload when request changes
  }
}
```

### Advanced rxResource Features

```typescript
// With default value
liveViewCards = rxResource({
  request: () => ({ query: this.searchQuery() }),
  loader: ({ request }) => this.dataService.getData(request),
  defaultValue: [], // Provides initial value while loading
});

// With error handling
userProfile = rxResource({
  request: () => ({ userId: this.userId() }),
  loader: ({ request }) => {
    return this.userService.getProfile(request.userId).pipe(
      catchError((error) => {
        console.error("Failed to load profile:", error);
        return throwError(() => error);
      }),
    );
  },
});

// Dependent resources
userPosts = rxResource({
  request: () => {
    const profile = this.userProfile.value();
    return profile ? { userId: profile.id } : null;
  },
  loader: ({ request }) => {
    return request ? this.postsService.getUserPosts(request.userId) : EMPTY;
  },
});
```

### Resource Status Methods

```typescript
export class DataComponent {
  data = rxResource({
    request: () => ({}),
    loader: () => this.service.getData(),
  });

  ngOnInit() {
    // Check various states
    console.log("Is Loading:", this.data.isLoading());
    console.log("Has Value:", this.data.hasValue());
    console.log("Has Error:", this.data.hasError());
    console.log("Current Value:", this.data.value());
    console.log("Current Error:", this.data.error());

    // Get status object
    const status = this.data.status();
    console.log("Status:", status); // 'loading' | 'success' | 'error'
  }
}
```

---

## Template Control Flow

Angular 19 introduces new control flow syntax that replaces `*ngIf`, `*ngFor`, and `*ngSwitch` with more intuitive `@if`, `@for`, and `@switch` blocks.

### @if, @else if, @else

```typescript
@Component({
  template: `
    @if (user.role === "admin") {
      <admin-dashboard />
    } @else if (user.role === "editor") {
      <editor-dashboard />
    } @else {
      <user-dashboard />
    }

    <!-- With variable assignment -->
    @if (user.profile?.settings?.preferences; as prefs) {
      <div>
        <h3>User Preferences</h3>
        <p>Theme: {{ prefs.theme }}</p>
        <p>Language: {{ prefs.language }}</p>
      </div>
    }

    <!-- Loading pattern -->
    @if (data.isLoading()) {
      <div class="loading-spinner">Loading...</div>
    } @else if (data.hasError()) {
      <div class="error-message">{{ data.error() }}</div>
    } @else {
      <div class="content">{{ data.value() }}</div>
    }
  `,
})
export class DashboardComponent {
  user = signal({ role: "admin", profile: { settings: { preferences: { theme: "dark", language: "en" } } } });
  data = rxResource({
    request: () => ({}),
    loader: () => this.service.getData(),
  });
}
```

### @for Loop

```typescript
@Component({
  template: `
    <!-- Basic for loop -->
    @for (item of items(); track item.id) {
      <div class="item">
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
      </div>
    }

    <!-- With empty fallback -->
    @for (post of posts(); track post.id) {
      <article class="post">
        <h2>{{ post.title }}</h2>
        <p>{{ post.content }}</p>
        <small>Posted on {{ post.date | date }}</small>
      </article>
    } @empty {
      <div class="no-posts">
        <p>No posts available yet.</p>
        <button (click)="createFirstPost()">Create Your First Post</button>
      </div>
    }

    <!-- With contextual variables -->
    @for (user of users(); track user.id; let i = $index, isFirst = $first, isLast = $last) {
      <div class="user-card" [class.first]="isFirst" [class.last]="isLast">
        <span class="user-number">{{ i + 1 }}</span>
        <h4>{{ user.name }}</h4>
        <p>{{ user.email }}</p>
      </div>
    }

    <!-- Nested loops with aliasing -->
    @for (category of categories(); track category.id; let categoryIndex = $index) {
      <div class="category">
        <h3>{{ category.name }}</h3>
        @for (product of category.products; track product.id; let productIndex = $index) {
          <div class="product">Category {{ categoryIndex + 1 }}, Product {{ productIndex + 1 }}: {{ product.name }}</div>
        }
      </div>
    }
  `,
})
export class ProductListComponent {
  items = signal([
    { id: 1, name: "Item 1", description: "First item" },
    { id: 2, name: "Item 2", description: "Second item" },
  ]);

  posts = signal([]);
  users = signal([
    { id: 1, name: "John Doe", email: "john@example.com" },
    { id: 2, name: "Jane Smith", email: "jane@example.com" },
  ]);

  categories = signal([
    {
      id: 1,
      name: "Electronics",
      products: [
        { id: 1, name: "Laptop" },
        { id: 2, name: "Phone" },
      ],
    },
  ]);
}
```

### @switch Statement

```typescript
@Component({
  template: `
    @switch (userPermission()) {
      @case ("admin") {
        <admin-panel>
          <h2>Admin Dashboard</h2>
          <button>Manage Users</button>
          <button>System Settings</button>
        </admin-panel>
      }
      @case ("editor") {
        <editor-panel>
          <h2>Content Editor</h2>
          <button>Create Post</button>
          <button>Edit Content</button>
        </editor-panel>
      }
      @case ("viewer") {
        <viewer-panel>
          <h2>View Only</h2>
          <p>You have read-only access</p>
        </viewer-panel>
      }
      @default {
        <div class="access-denied">
          <h2>Access Denied</h2>
          <p>Please contact your administrator</p>
        </div>
      }
    }

    <!-- With complex expressions -->
    @switch (getStatusLevel(order.status, order.priority)) {
      @case ("critical") {
        <div class="alert alert-error"><strong>Critical:</strong> Immediate attention required</div>
      }
      @case ("warning") {
        <div class="alert alert-warning"><strong>Warning:</strong> Needs review</div>
      }
      @default {
        <div class="alert alert-info">Status: {{ order.status }}</div>
      }
    }
  `,
})
export class PermissionComponent {
  userPermission = signal("admin");
  order = signal({ status: "pending", priority: "high" });

  getStatusLevel(status: string, priority: string): string {
    if (status === "failed" || priority === "critical") return "critical";
    if (status === "pending" && priority === "high") return "warning";
    return "normal";
  }
}
```

---

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

---

## Model Signals

Model signals provide two-way binding capabilities with automatic input/output generation.

### Basic Model Usage

```typescript
@Component({
  selector: "app-user-editor",
  template: `
    <div class="user-form">
      <label>
        First Name:
        <input [value]="firstName()" (input)="firstName.set($event.target.value)" />
      </label>

      <label>
        Last Name:
        <input [value]="lastName()" (input)="lastName.set($event.target.value)" />
      </label>

      <label>
        Age:
        <input type="number" [value]="age()" (input)="age.set(+$event.target.value)" />
      </label>

      <div class="preview">
        <h3>Preview:</h3>
        <p>{{ fullName() }}</p>
        <p>Age: {{ age() }}</p>
      </div>
    </div>
  `,
})
export class UserEditorComponent {
  // Model signals - create input/output pairs automatically
  firstName = model<string>(""); // Creates firstName input and firstNameChange output
  lastName = model.required<string>(); // Required model
  age = model(25); // With default value

  // Computed based on model signals
  fullName = computed(() => {
    const first = this.firstName();
    const last = this.lastName();
    return `${first} ${last}`.trim();
  });

  // Effect to log changes
  constructor() {
    effect(() => {
      console.log("User changed:", {
        firstName: this.firstName(),
        lastName: this.lastName(),
        age: this.age(),
      });
    });
  }
}

// Parent component usage:
@Component({
  template: `
    <app-user-editor [(firstName)]="userFirstName" [(lastName)]="userLastName" [(age)]="userAge" (firstNameChange)="onFirstNameChange($event)" (lastNameChange)="onLastNameChange($event)"> </app-user-editor>

    <div class="parent-display">
      <h2>Parent Component Data:</h2>
      <p>Full Name: {{ userFirstName() }} {{ userLastName() }}</p>
      <p>Age: {{ userAge() }}</p>
    </div>
  `,
})
export class ParentComponent {
  userFirstName = signal("John");
  userLastName = signal("Doe");
  userAge = signal(30);

  onFirstNameChange(newName: string) {
    console.log("First name changed to:", newName);
  }

  onLastNameChange(newName: string) {
    console.log("Last name changed to:", newName);
  }
}
```

### Advanced Model Patterns

```typescript
@Component({
  selector: "app-advanced-form",
  template: `
    <form class="advanced-form">
      <!-- Text inputs -->
      <div class="form-group">
        <label>Email:</label>
        <input type="email" [value]="email()" (input)="email.set($event.target.value)" [class.invalid]="!isEmailValid()" />
        @if (!isEmailValid() && email()) {
          <span class="error">Please enter a valid email</span>
        }
      </div>

      <!-- Multi-select -->
      <div class="form-group">
        <label>Interests:</label>
        <select multiple [value]="interests()" (change)="updateInterests($event)">
          <option value="sports">Sports</option>
          <option value="music">Music</option>
          <option value="travel">Travel</option>
          <option value="technology">Technology</option>
        </select>
        <p>Selected: {{ interests().join(", ") }}</p>
      </div>

      <!-- Object model -->
      <div class="form-group">
        <label>Address:</label>
        <input placeholder="Street" [value]="address().street" (input)="updateAddress('street', $event.target.value)" />

        <input placeholder="City" [value]="address().city" (input)="updateAddress('city', $event.target.value)" />

        <input placeholder="ZIP" [value]="address().zip" (input)="updateAddress('zip', $event.target.value)" />
      </div>

      <div class="form-summary">
        <h3>Form Status:</h3>
        <p>Valid: {{ isFormValid() }}</p>
        <p>Changed: {{ hasChanges() }}</p>
      </div>
    </form>
  `,
})
export class AdvancedFormComponent {
  // Simple model
  email = model("");

  // Array model
  interests = model<string[]>([]);

  // Object model
  address = model({
    street: "",
    city: "",
    zip: "",
  });

  // Initial values for change detection
  private initialEmail = this.email();
  private initialInterests = [...this.interests()];
  private initialAddress = { ...this.address() };

  // Computed validations
  isEmailValid = computed(() => {
    const email = this.email();
    return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  });

  isFormValid = computed(() => {
    return this.isEmailValid() && this.email().length > 0 && this.address().street.length > 0;
  });

  hasChanges = computed(() => {
    return this.email() !== this.initialEmail || JSON.stringify(this.interests()) !== JSON.stringify(this.initialInterests) || JSON.stringify(this.address()) !== JSON.stringify(this.initialAddress);
  });

  updateInterests(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selected = Array.from(select.selectedOptions).map((option) => option.value);
    this.interests.set(selected);
  }

  updateAddress(field: keyof typeof this.address.value, value: string) {
    this.address.update((addr) => ({
      ...addr,
      [field]: value,
    }));
  }

  resetForm() {
    this.email.set(this.initialEmail);
    this.interests.set([...this.initialInterests]);
    this.address.set({ ...this.initialAddress });
  }
}
```

---

## Computed Signals

Computed signals derive reactive values from other signals and automatically update when dependencies change.

### Basic Computed Usage

```typescript
@Component({
  selector: "app-shopping-cart",
  template: `
    <div class="shopping-cart">
      <h2>Shopping Cart</h2>

      @for (item of items(); track item.id) {
        <div class="cart-item">
          <span>{{ item.name }}</span>
          <span>\${{ item.price }}</span>
          <span>Qty: {{ item.quantity }}</span>
          <button (click)="updateQuantity(item.id, item.quantity + 1)">+</button>
          <button (click)="updateQuantity(item.id, item.quantity - 1)">-</button>
          <button (click)="removeItem(item.id)">Remove</button>
        </div>
      }

      <div class="cart-summary">
        <p>Total Items: {{ totalItems() }}</p>
        <p>Subtotal: \${{ subtotal() }}</p>
        <p>Tax ({{ taxRate() * 100 }}%): \${{ taxAmount() }}</p>
        <p>
          <strong>Total: \${{ total() }}</strong>
        </p>
        <p>Average Item Price: \${{ averageItemPrice() }}</p>

        @if (hasDiscount()) {
          <p class="discount">Discount Applied: -\${{ discountAmount() }}</p>
        }
      </div>

      <div class="cart-actions">
        <button [disabled]="isEmpty()" (click)="checkout()">Checkout ({{ totalItems() }} items)</button>
        <button [disabled]="isEmpty()" (click)="clearCart()">Clear Cart</button>
      </div>
    </div>
  `,
})
export class ShoppingCartComponent {
  // Base signals
  items = signal([
    { id: 1, name: "Laptop", price: 999.99, quantity: 1 },
    { id: 2, name: "Mouse", price: 29.99, quantity: 2 },
    { id: 3, name: "Keyboard", price: 79.99, quantity: 1 },
  ]);

  taxRate = signal(0.08);
  discountThreshold = signal(1000);

  // Computed signals - automatically recalculate when dependencies change
  totalItems = computed(() => {
    return this.items().reduce((sum, item) => sum + item.quantity, 0);
  });

  subtotal = computed(() => {
    return this.items().reduce((sum, item) => sum + item.price * item.quantity, 0);
  });

  taxAmount = computed(() => {
    return Math.round(this.subtotal() * this.taxRate() * 100) / 100;
  });

  hasDiscount = computed(() => {
    return this.subtotal() > this.discountThreshold();
  });

  discountAmount = computed(() => {
    return this.hasDiscount() ? this.subtotal() * 0.1 : 0;
  });

  total = computed(() => {
    return Math.round((this.subtotal() + this.taxAmount() - this.discountAmount()) * 100) / 100;
  });

  averageItemPrice = computed(() => {
    const items = this.items();
    const totalValue = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
    return totalQty > 0 ? Math.round((totalValue / totalQty) * 100) / 100 : 0;
  });

  isEmpty = computed(() => this.items().length === 0);

  // Complex computed with conditions
  shippingCost = computed(() => {
    const subtotal = this.subtotal();
    if (subtotal > 100) return 0;
    if (subtotal > 50) return 5.99;
    return 9.99;
  });

  updateQuantity(id: number, newQuantity: number) {
    if (newQuantity <= 0) {
      this.removeItem(id);
      return;
    }

    this.items.update((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)));
  }

  removeItem(id: number) {
    this.items.update((items) => items.filter((item) => item.id !== id));
  }

  clearCart() {
    this.items.set([]);
  }

  checkout() {
    console.log("Checkout:", {
      items: this.items(),
      subtotal: this.subtotal(),
      tax: this.taxAmount(),
      discount: this.discountAmount(),
      total: this.total(),
    });
  }
}
```

### Advanced Computed Patterns

```typescript
@Component({
  selector: "app-data-analytics",
  template: `
    <div class="analytics-dashboard">
      <h2>Data Analytics Dashboard</h2>

      <!-- Controls -->
      <div class="controls">
        <select (change)="selectedMetric.set($event.target.value)">
          <option value="revenue">Revenue</option>
          <option value="users">Users</option>
          <option value="orders">Orders</option>
        </select>

        <select (change)="selectedPeriod.set($event.target.value)">
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        <button (click)="refreshData()">Refresh Data</button>
      </div>

      <!-- Computed Results -->
      <div class="metrics">
        <div class="metric-card">
          <h3>Current Period</h3>
          <p class="value">{{ currentPeriodValue() | number }}</p>
          <p class="change" [class]="trendClass()">{{ trendDirection() }} {{ trendPercentage() }}%</p>
        </div>

        <div class="metric-card">
          <h3>Statistics</h3>
          <p>Average: {{ averageValue() | number }}</p>
          <p>Peak: {{ peakValue() | number }}</p>
          <p>Growth Rate: {{ growthRate() | number: "1.2-2" }}%</p>
        </div>

        <div class="metric-card">
          <h3>Projections</h3>
          <p>Next Period: {{ projectedValue() | number }}</p>
          <p>Confidence: {{ projectionConfidence() | number: "1.0-0" }}%</p>
        </div>
      </div>

      <!-- Data Table -->
      <table class="data-table">
        <thead>
          <tr>
            <th>Period</th>
            <th>{{ selectedMetric() | titlecase }}</th>
            <th>Change</th>
          </tr>
        </thead>
        <tbody>
          @for (item of processedData(); track item.period) {
            <tr>
              <td>{{ item.period }}</td>
              <td>{{ item.value | number }}</td>
              <td [class]="item.changeClass">{{ item.change }}%</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  `,
})
export class DataAnalyticsComponent {
  // Base signals
  rawData = signal({
    revenue: [1000, 1200, 1150, 1300, 1250, 1400, 1350],
    users: [100, 120, 115, 130, 125, 140, 135],
    orders: [50, 60, 58, 65, 63, 70, 68],
  });

  selectedMetric = signal<"revenue" | "users" | "orders">("revenue");
  selectedPeriod = signal<"daily" | "weekly" | "monthly">("daily");
  lastRefresh = signal(Date.now());

  // Computed data transformations
  currentData = computed(() => {
    return this.rawData()[this.selectedMetric()];
  });

  currentPeriodValue = computed(() => {
    const data = this.currentData();
    return data[data.length - 1] || 0;
  });

  previousPeriodValue = computed(() => {
    const data = this.currentData();
    return data[data.length - 2] || 0;
  });

  averageValue = computed(() => {
    const data = this.currentData();
    return data.length ? data.reduce((sum, val) => sum + val, 0) / data.length : 0;
  });

  peakValue = computed(() => {
    const data = this.currentData();
    return Math.max(...data);
  });

  // Trend calculations
  trendPercentage = computed(() => {
    const current = this.currentPeriodValue();
    const previous = this.previousPeriodValue();
    if (previous === 0) return 0;
    return Math.abs(((current - previous) / previous) * 100);
  });

  trendDirection = computed(() => {
    const current = this.currentPeriodValue();
    const previous = this.previousPeriodValue();
    if (current > previous) return "↑";
    if (current < previous) return "↓";
    return "→";
  });

  trendClass = computed(() => {
    const current = this.currentPeriodValue();
    const previous = this.previousPeriodValue();
    if (current > previous) return "positive";
    if (current < previous) return "negative";
    return "neutral";
  });

  // Growth rate calculation
  growthRate = computed(() => {
    const data = this.currentData();
    if (data.length < 2) return 0;

    const firstValue = data[0];
    const lastValue = data[data.length - 1];
    const periods = data.length - 1;

    return Math.pow(lastValue / firstValue, 1 / periods) - 1;
  });

  // Projection using linear regression
  projectedValue = computed(() => {
    const data = this.currentData();
    if (data.length < 3) return 0;

    // Simple linear trend projection
    const recent = data.slice(-3);
    const trend = (recent[2] - recent[0]) / 2;
    return Math.max(0, recent[2] + trend);
  });

  projectionConfidence = computed(() => {
    const data = this.currentData();
    if (data.length < 3) return 0;

    // Calculate confidence based on data consistency
    const variance = this.calculateVariance(data);
    const mean = this.averageValue();
    const cv = mean ? Math.sqrt(variance) / mean : 1;

    return Math.max(0, Math.min(100, (1 - cv) * 100));
  });

  // Processed data for table
  processedData = computed(() => {
    const data = this.currentData();
    const period = this.selectedPeriod();

    return data.map((value, index) => {
      const previousValue = index > 0 ? data[index - 1] : value;
      const change = previousValue ? ((value - previousValue) / previousValue) * 100 : 0;

      return {
        period: `${period.charAt(0).toUpperCase() + period.slice(1)} ${index + 1}`,
        value,
        change: Math.round(change * 100) / 100,
        changeClass: change > 0 ? "positive" : change < 0 ? "negative" : "neutral",
      };
    });
  });

  private calculateVariance(data: number[]): number {
    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const squaredDiffs = data.map((val) => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / data.length;
  }

  refreshData() {
    // Simulate data refresh
    this.lastRefresh.set(Date.now());

    // Generate some random variation in the data
    this.rawData.update((data) => ({
      revenue: data.revenue.map((val) => val + (Math.random() - 0.5) * 100),
      users: data.users.map((val) => Math.round(val + (Math.random() - 0.5) * 20)),
      orders: data.orders.map((val) => Math.round(val + (Math.random() - 0.5) * 10)),
    }));
  }
}
```

---

## Effect Function

Effects run side effects when their signal dependencies change. They're perfect for logging, API calls, DOM manipulation, and other reactive side effects.

### Basic Effect Usage

```typescript
@Component({
  selector: "app-user-settings",
  template: `
    <div class="user-settings">
      <h2>User Settings</h2>

      <div class="setting-group">
        <label>
          <input type="checkbox" [checked]="darkMode()" (change)="darkMode.set($event.target.checked)" />
          Dark Mode
        </label>
      </div>

      <div class="setting-group">
        <label>
          Language:
          <select [value]="language()" (change)="language.set($event.target.value)">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </label>
      </div>

      <div class="setting-group">
        <label>
          Font Size:
          <input type="range" min="12" max="24" [value]="fontSize()" (input)="fontSize.set(+$event.target.value)" />
          <span>{{ fontSize() }}px</span>
        </label>
      </div>

      <div class="setting-group">
        <label>
          Auto-save:
          <input type="checkbox" [checked]="autoSave()" (change)="autoSave.set($event.target.checked)" />
        </label>
        @if (autoSave()) {
          <p class="auto-save-status">{{ saveStatus() }}</p>
        }
      </div>

      <button (click)="resetSettings()">Reset to Defaults</button>
    </div>
  `,
})
export class UserSettingsComponent {
  // Settings signals
  darkMode = signal(false);
  language = signal("en");
  fontSize = signal(16);
  autoSave = signal(true);
  saveStatus = signal("");

  constructor() {
    // Load settings from localStorage on init
    this.loadSettings();

    // Effect: Apply dark mode to document
    effect(() => {
      const isDark = this.darkMode();
      document.body.classList.toggle("dark-mode", isDark);
      console.log("Dark mode:", isDark ? "enabled" : "disabled");
    });

    // Effect: Update document language
    effect(() => {
      const lang = this.language();
      document.documentElement.lang = lang;
      console.log("Language changed to:", lang);
    });

    // Effect: Apply font size to root
    effect(() => {
      const size = this.fontSize();
      document.documentElement.style.setProperty("--base-font-size", `${size}px`);
      console.log("Font size changed to:", size);
    });

    // Effect: Auto-save settings
    effect(() => {
      if (this.autoSave()) {
        // Create a settings object
        const settings = {
          darkMode: this.darkMode(),
          language: this.language(),
          fontSize: this.fontSize(),
          autoSave: this.autoSave(),
        };

        // Save to localStorage
        localStorage.setItem("userSettings", JSON.stringify(settings));
        this.saveStatus.set(`Settings saved at ${new Date().toLocaleTimeString()}`);

        console.log("Settings auto-saved:", settings);
      }
    });

    // Effect: Log all setting changes for analytics
    effect(() => {
      const settings = {
        darkMode: this.darkMode(),
        language: this.language(),
        fontSize: this.fontSize(),
        autoSave: this.autoSave(),
      };

      // Simulate analytics tracking
      this.trackSettingsChange(settings);
    });
  }

  private loadSettings() {
    try {
      const saved = localStorage.getItem("userSettings");
      if (saved) {
        const settings = JSON.parse(saved);
        this.darkMode.set(settings.darkMode ?? false);
        this.language.set(settings.language ?? "en");
        this.fontSize.set(settings.fontSize ?? 16);
        this.autoSave.set(settings.autoSave ?? true);
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }

  private trackSettingsChange(settings: any) {
    // Simulate analytics call
    console.log("Analytics: Settings changed", settings);
  }

  resetSettings() {
    this.darkMode.set(false);
    this.language.set("en");
    this.fontSize.set(16);
    this.autoSave.set(true);
  }
}
```

### Advanced Effect Patterns

```typescript
@Component({
  selector: "app-data-sync",
  template: `
    <div class="data-sync">
      <h2>Data Synchronization Demo</h2>

      <div class="controls">
        <button (click)="toggleConnection()">
          {{ isConnected() ? "Disconnect" : "Connect" }}
        </button>

        <button (click)="triggerSync()" [disabled]="!isConnected()">Force Sync</button>

        <label>
          <input type="checkbox" [checked]="realTimeSync()" (change)="realTimeSync.set($event.target.checked)" />
          Real-time Sync
        </label>
      </div>

      <div class="status">
        <p>Connection: {{ isConnected() ? "Connected" : "Disconnected" }}</p>
        <p>Sync Status: {{ syncStatus() }}</p>
        <p>Last Sync: {{ lastSyncTime() || "Never" }}</p>
        <p>Pending Changes: {{ pendingChanges() }}</p>
      </div>

      <div class="data-editor">
        <h3>Data Editor</h3>
        <textarea [value]="localData()" (input)="updateLocalData($event.target.value)" rows="10" cols="50"> </textarea>
      </div>

      <div class="sync-log">
        <h3>Sync Log</h3>
        <div class="log-entries">
          @for (entry of syncLog(); track entry.timestamp) {
            <div class="log-entry" [class]="entry.type">
              <span class="timestamp">{{ entry.timestamp | date: "short" }}</span>
              <span class="message">{{ entry.message }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class DataSyncComponent {
  // Core state signals
  isConnected = signal(false);
  realTimeSync = signal(false);
  localData = signal("");
  remoteData = signal("");
  syncStatus = signal<"idle" | "syncing" | "error">("idle");
  lastSyncTime = signal<string | null>(null);
  pendingChanges = signal(0);
  syncLog = signal<Array<{ timestamp: Date; message: string; type: string }>>([]);

  // Cleanup functions for effects
  private cleanupFunctions: Array<() => void> = [];

  constructor() {
    // Effect: Connection status changes
    effect(() => {
      const connected = this.isConnected();
      this.addLogEntry(connected ? "Connected to server" : "Disconnected from server", connected ? "success" : "warning");

      if (!connected) {
        this.syncStatus.set("idle");
      }
    });

    // Effect: Real-time sync when enabled and connected
    effect((onCleanup) => {
      if (this.realTimeSync() && this.isConnected()) {
        this.addLogEntry("Real-time sync enabled", "info");

        // Simulate real-time connection (WebSocket, etc.)
        const interval = setInterval(() => {
          this.performSync();
        }, 5000);

        onCleanup(() => {
          clearInterval(interval);
          this.addLogEntry("Real-time sync disabled", "info");
        });
      }
    });

    // Effect: Track data changes for pending changes counter
    effect(() => {
      const local = this.localData();
      const remote = this.remoteData();

      if (local !== remote && local !== "") {
        this.pendingChanges.set(this.pendingChanges() + 1);
      }
    });

    // Effect: Auto-sync when connected and has pending changes
    effect((onCleanup) => {
      const hasChanges = this.pendingChanges() > 0;
      const connected = this.isConnected();
      const realTime = this.realTimeSync();

      if (hasChanges && connected && !realTime) {
        // Debounced auto-sync
        const timeout = setTimeout(() => {
          this.performSync();
        }, 2000);

        onCleanup(() => clearTimeout(timeout));
      }
    });

    // Effect: Monitor sync status for error handling
    effect(() => {
      const status = this.syncStatus();

      if (status === "error") {
        this.addLogEntry("Sync failed - will retry", "error");

        // Auto-retry after error
        setTimeout(() => {
          if (this.isConnected()) {
            this.performSync();
          }
        }, 10000);
      }
    });

    // Effect: Cleanup log entries (keep only last 50)
    effect(() => {
      const log = this.syncLog();
      if (log.length > 50) {
        this.syncLog.set(log.slice(-50));
      }
    });

    // Effect: Persist connection state
    effect(() => {
      const connected = this.isConnected();
      localStorage.setItem("connectionState", JSON.stringify(connected));
    });

    // Load persisted state
    this.loadPersistedState();
  }

  ngOnDestroy() {
    // Cleanup any remaining effects
    this.cleanupFunctions.forEach((cleanup) => cleanup());
  }

  toggleConnection() {
    this.isConnected.set(!this.isConnected());
  }

  triggerSync() {
    if (this.isConnected()) {
      this.performSync();
    }
  }

  updateLocalData(value: string) {
    this.localData.set(value);
  }

  private async performSync() {
    if (this.syncStatus() === "syncing") {
      return; // Already syncing
    }

    this.syncStatus.set("syncing");
    this.addLogEntry("Starting sync...", "info");

    try {
      // Simulate API call
      await this.simulateApiCall();

      // Update remote data
      this.remoteData.set(this.localData());
      this.pendingChanges.set(0);
      this.lastSyncTime.set(new Date().toISOString());
      this.syncStatus.set("idle");

      this.addLogEntry("Sync completed successfully", "success");
    } catch (error) {
      this.syncStatus.set("error");
      this.addLogEntry(`Sync failed: ${error}`, "error");
    }
  }

  private simulateApiCall(): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 10% chance of failure for demo
        if (Math.random() < 0.1) {
          reject("Network error");
        } else {
          resolve();
        }
      }, 1000);
    });
  }

  private addLogEntry(message: string, type: string) {
    this.syncLog.update((log) => [...log, { timestamp: new Date(), message, type }]);
  }

  private loadPersistedState() {
    try {
      const saved = localStorage.getItem("connectionState");
      if (saved) {
        this.isConnected.set(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load persisted state:", error);
    }
  }
}
```

### Effect with Manual Cleanup

```typescript
@Component({
  selector: "app-websocket-client",
  template: `
    <div class="websocket-client">
      <h2>WebSocket Client</h2>

      <div class="connection-controls">
        <input #urlInput type="text" [value]="serverUrl()" (input)="serverUrl.set($event.target.value)" placeholder="ws://localhost:8080" />

        <button (click)="connect()" [disabled]="isConnected()">Connect</button>

        <button (click)="disconnect()" [disabled]="!isConnected()">Disconnect</button>
      </div>

      <div class="status">
        <p>Status: {{ connectionStatus() }}</p>
        <p>Messages Received: {{ messagesReceived() }}</p>
        <p>Reconnect Attempts: {{ reconnectAttempts() }}</p>
      </div>

      <div class="message-input">
        <input #messageInput type="text" [value]="messageToSend()" (input)="messageToSend.set($event.target.value)" (keyup.enter)="sendMessage()" placeholder="Type a message..." />

        <button (click)="sendMessage()" [disabled]="!isConnected()">Send</button>
      </div>

      <div class="messages">
        <h3>Messages</h3>
        <div class="message-list">
          @for (message of messages(); track message.id) {
            <div class="message" [class]="message.type">
              <span class="time">{{ message.timestamp | date: "HH:mm:ss" }}</span>
              <span class="content">{{ message.content }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class WebSocketClientComponent {
  // Connection state
  serverUrl = signal("ws://localhost:8080");
  isConnected = signal(false);
  connectionStatus = signal<"disconnected" | "connecting" | "connected" | "error">("disconnected");
  reconnectAttempts = signal(0);
  autoReconnect = signal(true);

  // Message state
  messageToSend = signal("");
  messages = signal<Array<{ id: string; content: string; type: string; timestamp: Date }>>([]);
  messagesReceived = signal(0);

  private websocket: WebSocket | null = null;
  private reconnectTimeout: number | null = null;

  constructor() {
    // Effect: Handle connection changes
    effect((onCleanup) => {
      const connected = this.isConnected();
      const status = this.connectionStatus();

      if (connected && status === "connected") {
        this.addMessage("Connected to server", "system");
        this.reconnectAttempts.set(0);
      } else if (!connected && status === "disconnected") {
        this.addMessage("Disconnected from server", "system");

        // Auto-reconnect logic
        if (this.autoReconnect() && this.reconnectAttempts() < 5) {
          const attempts = this.reconnectAttempts();
          const timeout = Math.min(1000 * Math.pow(2, attempts), 30000); // Exponential backoff

          this.addMessage(`Reconnecting in ${timeout / 1000} seconds... (attempt ${attempts + 1})`, "system");

          this.reconnectTimeout = window.setTimeout(() => {
            this.reconnectAttempts.set(attempts + 1);
            this.connect();
          }, timeout);
        }
      }

      onCleanup(() => {
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      });
    });

    // Effect: Monitor message count
    effect(() => {
      const count = this.messagesReceived();
      if (count > 0 && count % 10 === 0) {
        this.addMessage(`Received ${count} messages`, "system");
      }
    });

    // Effect: Clear old messages
    effect(() => {
      const messages = this.messages();
      if (messages.length > 100) {
        this.messages.set(messages.slice(-100));
      }
    });
  }

  ngOnDestroy() {
    this.disconnect();
  }

  connect() {
    if (this.websocket) {
      this.disconnect();
    }

    const url = this.serverUrl();
    this.connectionStatus.set("connecting");
    this.addMessage(`Connecting to ${url}...`, "system");

    try {
      this.websocket = new WebSocket(url);

      this.websocket.onopen = () => {
        this.isConnected.set(true);
        this.connectionStatus.set("connected");
      };

      this.websocket.onmessage = (event) => {
        this.addMessage(event.data, "received");
        this.messagesReceived.set(this.messagesReceived() + 1);
      };

      this.websocket.onclose = () => {
        this.isConnected.set(false);
        this.connectionStatus.set("disconnected");
        this.websocket = null;
      };

      this.websocket.onerror = (error) => {
        this.connectionStatus.set("error");
        this.addMessage("Connection error occurred", "error");
        console.error("WebSocket error:", error);
      };
    } catch (error) {
      this.connectionStatus.set("error");
      this.addMessage(`Failed to connect: ${error}`, "error");
    }
  }

  disconnect() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }

    this.isConnected.set(false);
    this.connectionStatus.set("disconnected");

    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }

  sendMessage() {
    const message = this.messageToSend().trim();
    if (!message || !this.websocket || !this.isConnected()) {
      return;
    }

    try {
      this.websocket.send(message);
      this.addMessage(message, "sent");
      this.messageToSend.set("");
    } catch (error) {
      this.addMessage(`Failed to send message: ${error}`, "error");
    }
  }

  private addMessage(content: string, type: string) {
    const message = {
      id: crypto.randomUUID(),
      content,
      type,
      timestamp: new Date(),
    };

    this.messages.update((messages) => [...messages, message]);
  }
}
```

---

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
            }),
          );
        }),
        takeUntil(this.destroy$),
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
    request: () => ({ query: this.searchQuery() }),
    loader: ({ request }) => this.dataService.search(request.query),
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

---

This guide covers the essential new features of Angular 19. These patterns promote more reactive, cleaner, and maintainable code while reducing boilerplate and improving developer experience.
