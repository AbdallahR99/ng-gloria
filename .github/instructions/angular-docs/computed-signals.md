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
