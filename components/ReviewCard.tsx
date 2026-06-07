type ReviewCardProps = {
  album: string;
  artist: string;
  date: string;
  rating: number;
  review: string;
  coverUrl: string;
};

export default function ReviewCard({ album, artist, date, rating, review, coverUrl }: ReviewCardProps) {
  return (
    <article>
      <img src={coverUrl} alt={`${album} cover`} width={300} height={300} />
      <div>
        <h3>{album}</h3>
        <p>{artist}</p>
        <p>Listened on: {date}</p>
        <p>Rating: {rating}</p>
        <p>{review}</p>
      </div>
    </article>
  );
}