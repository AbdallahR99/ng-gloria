import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { TestimonialsComponent } from "../../core/shared/components/testimonials/testimonials.component";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, TestimonialsComponent],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent {
  // Component logic here
}
