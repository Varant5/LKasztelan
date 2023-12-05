<?php
namespace App\Controller;

use App\Exception\NotFoundException;
use App\Model\Review;
use App\Service\Router;
use App\Service\Templating;

class ReviewController
{
    public function indexAction(Templating $templating, Router $router): ?string
    {
        $reviews = Review::findAll();
        $html = $templating->render('review/index.html.php', [
            'reviews' => $reviews,
            'router' => $router,
        ]);
        return $html;
    }

    public function createAction(?array $requestData, Templating $templating, Router $router): ?string
    {
        if ($requestData) {
            $review = Review::fromArray($requestData);
            // @todo missing validation
            $review->save();

            $path = $router->generatePath('review-index');
            $router->redirect($path);
            return null;
        } else {
            $review = new Review();
        }

        $html = $templating->render('review/create.html.php', [
            'review' => $review,
            'router' => $router,
        ]);
        return $html;
    }

    public function editAction(int $reviewId, ?array $requestData, Templating $templating, Router $router): ?string
    {
        $review = Review::find($reviewId);
        if (! $review) {
            throw new NotFoundException("Missing review with id $reviewId");
        }

        if ($requestData) {
            $review->fill($requestData);
            // @todo missing validation
            $review->save();

            $path = $router->generatePath('review-index');
            $router->redirect($path);
            return null;
        }

        $html = $templating->render('review/edit.html.php', [
            'review' => $review,
            'router' => $router,
        ]);
        return $html;
    }

    public function showAction(int $reviewId, Templating $templating, Router $router): ?string
    {
        $review = Review::find($reviewId);
        if (! $review) {
            throw new NotFoundException("Missing review with id $reviewId");
        }

        $html = $templating->render('review/show.html.php', [
            'review' => $review,
            'router' => $router,
        ]);
        return $html;
    }

    public function deleteAction(int $reviewId, Router $router): ?string
    {
        $review = Review::find($reviewId);
        if (! $review) {
            throw new NotFoundException("Missing review with id $reviewId");
        }

        $review->delete();
        $path = $router->generatePath('review-index');
        $router->redirect($path);
        return null;
    }
}
