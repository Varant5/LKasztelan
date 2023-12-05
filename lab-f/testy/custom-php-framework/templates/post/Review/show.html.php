<?php

/** @var \App\Model\Review $review */
/** @var \App\Service\Router $router */

$title = "{$review->getMovieTitle()} ({$review->getId()})";
$bodyClass = 'show';

ob_start(); ?>
    <h1><?= $review->getMovieTitle() ?></h1>
    <article>
        <?= $review->getContent();?>
    </article>

    <ul class="action-list">
        <li><a href="<?= $router->generatePath('review-index') ?>">Back to list</a></li>
        <li><a href="<?= $router->generatePath('review-edit', ['id'=> $review->getId()]) ?>">Edit</a></li>
    </ul>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
