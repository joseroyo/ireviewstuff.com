import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";

export default function Music() {
  return (
    <main>
      <h1>Music Reviews</h1>
      <ReviewForm />
      <ReviewCard
        album="The New Abnormal"
        artist="The Strokes"
        date="7 Jun 2026"
        rating={4}
        review="Really enjoyed this one."
        coverUrl="https://placehold.co/300"
      />
      <ReviewCard
        album="Laurel Hell"
        artist="Mitski"
        date="7 Jun 2026"
        rating={5}
        review="My fav"
        coverUrl="https://placehold.co/300"
      />
    </main>
  );
}