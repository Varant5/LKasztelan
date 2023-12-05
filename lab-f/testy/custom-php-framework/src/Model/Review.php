<?php
namespace App\Model;

use App\Service\Config;

class Review
{
    private ?int $id = null;
    private ?string $movieTitle = null;
    private ?string $author = null;
    private ?int $rating = null;
    private ?string $content = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(?int $id): Review
    {
        $this->id = $id;

        return $this;
    }

    public function getMovieTitle(): ?string
    {
        return $this->movieTitle;
    }

    public function setMovieTitle(?string $movieTitle): Review
    {
        $this->movieTitle = $movieTitle;

        return $this;
    }

    public function getAuthor(): ?string
    {
        return $this->author;
    }

    public function setAuthor(?string $author): Review
    {
        $this->author = $author;

        return $this;
    }

    public function getRating(): ?int
    {
        return $this->rating;
    }

    public function setRating(?int $rating): Review
    {
        $this->rating = $rating;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(?string $content): Review
    {
        $this->content = $content;

        return $this;
    }

    public static function fromArray($array): Review
    {
        $review = new self();
        $review->fill($array);

        return $review;
    }

    public function fill($array): Review
    {
        if (isset($array['id']) && ! $this->getId()) {
            $this->setId($array['id']);
        }
        if (isset($array['movieTitle'])) {
            $this->setMovieTitle($array['movieTitle']);
        }
        if (isset($array['author'])) {
            $this->setAuthor($array['author']);
        }
        if (isset($array['rating'])) {
            $this->setRating($array['rating']);
        }
        if (isset($array['content'])) {
            $this->setContent($array['content']);
        }

        return $this;
    }

    public static function findAll(): array
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM review';
        $statement = $pdo->prepare($sql);
        $statement->execute();

        $reviews = [];
        $reviewsArray = $statement->fetchAll(\PDO::FETCH_ASSOC);
        foreach ($reviewsArray as $reviewArray) {
            $reviews[] = self::fromArray($reviewArray);
        }

        return $reviews;
    }

    public static function find($id): ?Review
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = 'SELECT * FROM review WHERE id = :id';
        $statement = $pdo->prepare($sql);
        $statement->execute(['id' => $id]);

        $reviewArray = $statement->fetch(\PDO::FETCH_ASSOC);
        if (! $reviewArray) {
            return null;
        }
        $review = Review::fromArray($reviewArray);

        return $review;
    }

    public function save(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        if (! $this->getId()) {
            $sql = "INSERT INTO review (movieTitle, author, rating, content) VALUES (:movieTitle, :author, :rating, :content)";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                'movieTitle' => $this->getMovieTitle(),
                'author' => $this->getAuthor(),
                'rating' => $this->getRating(),
                'content' => $this->getContent(),
            ]);

            $this->setId($pdo->lastInsertId());
        } else {
            $sql = "UPDATE review SET movieTitle = :movieTitle, author = :author, rating = :rating, content = :content WHERE id = :id";
            $statement = $pdo->prepare($sql);
            $statement->execute([
                ':movieTitle' => $this->getMovieTitle(),
                ':author' => $this->getAuthor(),
                ':rating' => $this->getRating(),
                ':content' => $this->getContent(),
                ':id' => $this->getId(),
            ]);
        }
    }

    public function delete(): void
    {
        $pdo = new \PDO(Config::get('db_dsn'), Config::get('db_user'), Config::get('db_pass'));
        $sql = "DELETE FROM review WHERE id = :id";
        $statement = $pdo->prepare($sql);
        $statement->execute([
            ':id' => $this->getId(),
        ]);

        $this->setId(null);
        $this->setMovieTitle(null);
        $this->setAuthor(null);
        $this->setRating(null);
        $this->setContent(null);
    }
}
