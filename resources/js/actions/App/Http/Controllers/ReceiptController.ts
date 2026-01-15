import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ReceiptController::index
* @see app/Http/Controllers/ReceiptController.php:11
* @route '/sales/receipt'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/sales/receipt',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ReceiptController::index
* @see app/Http/Controllers/ReceiptController.php:11
* @route '/sales/receipt'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ReceiptController::index
* @see app/Http/Controllers/ReceiptController.php:11
* @route '/sales/receipt'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ReceiptController::index
* @see app/Http/Controllers/ReceiptController.php:11
* @route '/sales/receipt'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const ReceiptController = { index }

export default ReceiptController