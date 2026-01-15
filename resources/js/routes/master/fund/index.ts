import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\FundController::index
* @see app/Http/Controllers/FundController.php:11
* @route '/master/fund'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/master/fund',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\FundController::index
* @see app/Http/Controllers/FundController.php:11
* @route '/master/fund'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\FundController::index
* @see app/Http/Controllers/FundController.php:11
* @route '/master/fund'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\FundController::index
* @see app/Http/Controllers/FundController.php:11
* @route '/master/fund'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const fund = {
    index: Object.assign(index, index),
}

export default fund