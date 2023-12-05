<?php
require_once __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'autoload.php';

$config = new \App\Service\Config();

$templating = new \App\Service\Templating();
$router = new \App\Service\Router();

$action = $_REQUEST['action'] ?? null;
switch ($action) {
    // Obsługa postów
    case 'post-index':
    case null:
        $controller = new \App\Controller\PostController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'post-create':
        $controller = new \App\Controller\PostController();
        $view = $controller->createAction($_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-edit':
        if (!$_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['post'] ?? null, $templating, $router);
        break;
    case 'post-show':
        if (!$_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'post-delete':
        if (!$_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\PostController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;

    // Obsługa recenzji
    case 'review-index':
        $controller = new \App\Controller\ReviewController();
        $view = $controller->indexAction($templating, $router);
        break;
    case 'review-create':
        $controller = new \App\Controller\ReviewController();
        $view = $controller->createAction($_REQUEST['review'] ?? null, $templating, $router);
        break;
    case 'review-edit':
        if (!$_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\ReviewController();
        $view = $controller->editAction($_REQUEST['id'], $_REQUEST['review'] ?? null, $templating, $router);
        break;
    case 'review-show':
        if (!$_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\ReviewController();
        $view = $controller->showAction($_REQUEST['id'], $templating, $router);
        break;
    case 'review-delete':
        if (!$_REQUEST['id']) {
            break;
        }
        $controller = new \App\Controller\ReviewController();
        $view = $controller->deleteAction($_REQUEST['id'], $router);
        break;

    // Pozostałe przypadki
    case 'info':
        $controller = new \App\Controller\InfoController();
        $view = $controller->infoAction();
        break;
    default:
        $view = 'Not found';
        break;
}

if ($view) {
    echo $view;
}

