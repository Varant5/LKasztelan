<?php
/** @var $review ?\App\Model\Review */
?>

<div class="form-group">
    <label for="movieTitle">Movie Title</label>
    <input type="text" id="movieTitle" name="review[movieTitle]" value="<?= $review ? $review->getMovieTitle() : '' ?>">
</div>

<div class="form-group">
    <label for="author">Author</label>
    <input type="text" id="author" name="review[author]" value="<?= $review ? $review->getAuthor() : '' ?>">
</div>

<div class="form-group">
    <label for="rating">Rating</label>
    <input type="number" id="rating" name="review[rating]" min="1" max="5" value="<?= $review ? $review->getRating() : '' ?>">
</div>

<div class="form-group">
    <label for="content">Content</label>
    <textarea id="content" name="review[content]"><?= $review ? $review->getContent() : '' ?></textarea>
</div>

<div class="form-group">
    <label></label>
    <input type="submit" value="Submit">
</div>
