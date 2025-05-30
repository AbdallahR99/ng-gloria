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
    params: () => ({}),
    stream: () => this.service.getData(),
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
    @switch (userPermission()) { @case ("admin") {
    <admin-panel>
      <h2>Admin Dashboard</h2>
      <button>Manage Users</button>
      <button>System Settings</button>
    </admin-panel>
    } @case ("editor") {
    <editor-panel>
      <h2>Content Editor</h2>
      <button>Create Post</button>
      <button>Edit Content</button>
    </editor-panel>
    } @case ("viewer") {
    <viewer-panel>
      <h2>View Only</h2>
      <p>You have read-only access</p>
    </viewer-panel>
    } @default {
    <div class="access-denied">
      <h2>Access Denied</h2>
      <p>Please contact your administrator</p>
    </div>
    } }

    <!-- With complex expressions -->
    @switch (getStatusLevel(order.status, order.priority)) { @case ("critical") {
    <div class="alert alert-error"><strong>Critical:</strong> Immediate attention required</div>
    } @case ("warning") {
    <div class="alert alert-warning"><strong>Warning:</strong> Needs review</div>
    } @default {
    <div class="alert alert-info">Status: {{ order.status }}</div>
    } }
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
