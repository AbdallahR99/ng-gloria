import { Component, signal } from "@angular/core";
import { CommonModule } from "@angular/common";

interface Testimonial {
  rating: number;
  text: string;
  author: {
    name: string;
    location: string;
  };
}

@Component({
  selector: "app-testimonials",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./testimonials.component.html",
  styleUrls: ["./testimonials.component.scss"],
})
export class TestimonialsComponent {
  currentSlide = signal(1);

  testimonials: Testimonial[] = [
    {
      rating: 4,
      text: '"Lorem Ipsum is simply dummy text of the printing and typesetting in . Lorem Ipsum has been been the indus Lorem Ipsum has been Ipsum been"',
      author: {
        name: "Mai Ali",
        location: "UAE",
      },
    },
    {
      rating: 4,
      text: '"Lorem Ipsum is simply dummy text of the printing and typesetting in . Lorem Ipsum has been been the indus Lorem Ipsum has been Ipsum been"',
      author: {
        name: "Mai Ali",
        location: "UAE",
      },
    },
    {
      rating: 4,
      text: '"Lorem Ipsum is simply dummy text of the printing and typesetting in . Lorem Ipsum has been been the indus Lorem Ipsum has been Ipsum been"',
      author: {
        name: "Mai Ali",
        location: "UAE",
      },
    },
  ];

  navigateSlide(direction: "prev" | "next"): void {
    if (direction === "next") {
      this.currentSlide.update((current) =>
        current === this.testimonials.length ? 1 : current + 1,
      );
    } else {
      this.currentSlide.update((current) =>
        current === 1 ? this.testimonials.length : current - 1,
      );
    }
  }

  setSlide(index: number): void {
    this.currentSlide.set(index + 1);
  }

  generateStarArray(rating: number): number[] {
    return Array(5)
      .fill(0)
      .map((_, index) => (index < rating ? 1 : 0));
  }
}
