<?php

/** @var \App\Model\Review $review */
/** @var \App\Service\Router $router */

$title = 'Create Review';
$bodyClass = "edit";

ob_start(); ?>
<h1>Create Review</h1>
<form action="<?= $router->generatePath('review-create') ?>" method="post" class="edit-form">
    <?php require __DIR__ . DIRECTORY_SEPARATOR . '_form.html.php'; ?>
    <input type="hidden" name="action" value="review-create">
</form>

<a href="<?= $router->generatePath('review-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';