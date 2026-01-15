import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\CustomerController::index
* @see app/Http/Controllers/CustomerController.php:11
* @route '/master/customer'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/master/customer',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\CustomerController::index
* @see app/Http/Controllers/CustomerController.php:11
* @route '/master/customer'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CustomerController::index
* @see app/Http/Controllers/CustomerController.php:11
* @route '/master/customer'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\CustomerController::index
* @see app/Http/Controllers/CustomerController.php:11
* @route '/master/customer'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const customer = {
    index: Object.assign(index, index),
}

export default customer