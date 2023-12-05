<?php

/** @var \App\Model\Review[] $reviews */
/** @var \App\Service\Router $router */

$title = 'Review List';
$bodyClass = 'index';

ob_start(); ?>
    <h1>Reviews List</h1>

    <a href="<?= $router->generatePath('review-create') ?>">Create new</a>

    <ul class="index-list">
        <?php foreach ($reviews as $review): ?>
            <li>
                <h3><?= $review->getMovieTitle() ?></h3>
                <ul class="action-list">
                    <li><a href="<?= $router->generatePath('review-show', ['id' => $review->getId()]) ?>">Details</a></li>
                    <li><a href="<?= $router->generatePath('review-edit', ['id' => $review->getId()]) ?>">Edit</a></li>
                </ul>
            </li>
        <?php endforeach; ?>
    </ul>

<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';