import Button from "./Button";

type ReviewCardProps = {
  id: number,
  album: string;
  artist: string;
  date: string;
  rating: number;
  review: string;
  coverUrl: string;
  onDelete?: (id: number) => void;
};

export default function ReviewCard({ id, album, artist, date, rating, review, coverUrl, onDelete }: ReviewCardProps) {
  function handleDelete() {
    if (!onDelete) return;
    const confirmed = confirm(`Delete your review of "${album}"?`);
    if (confirmed) {
      onDelete(id);
    }
  }

  return (
    <article className="border-2 flex">
      <img src={coverUrl} alt={`${album} cover`} width={200} height={200} />
      <div>
        <h3>{album}</h3>
        <p>{artist}</p>
        <p>Listened on: {date}</p>
        <p>Rating: {rating}</p>
        <p>{review}</p>
        {onDelete && (
          <Button type="button" variant="secondary" onClick={handleDelete}>Delete</Button>
        )}
      </div>
    </article>
  );
}