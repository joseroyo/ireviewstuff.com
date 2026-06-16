import { getItunesArtwork } from "@/lib/itunes";

type ReviewCardProps = {
  id: number;
  title: string;
  artist?: string;
  imageUrl: string;
  date: string;
  rating: number;
  review: string;
  onDelete?: (id: number) => void;
};

export default function ReviewCard({ id, title, artist, date, rating, review, imageUrl, onDelete }: ReviewCardProps) {
  function handleDelete() {
    if (!onDelete) return;
    const confirmed = confirm(`Delete your review of "${title}"?`);
    if (confirmed) {
      onDelete(id);
    }
  }

  return (
    <article className="flex gap-4 relative">
      <img src={getItunesArtwork(imageUrl, 600)} alt={`${imageUrl} cover`} width={200} height={200} />
      <div>
        <h3>{title}</h3>
        <p>{artist}</p>
        <p>Listened on: {date}</p>
        <p>
          {"★".repeat(rating)}
          <span className="text-gray-300">{"★".repeat(5 - rating)}</span>
        </p>
        <p>{review}</p>
      </div>
      {onDelete && (
        <button type="button"className="absolute right-[-23px] top-[-59px] border-0 px-4 py-2 cursor-pointer" onClick={handleDelete}>x</button>
      )}
    </article>
  );
}