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
