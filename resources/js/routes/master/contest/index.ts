import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\ContestController::index
* @see app/Http/Controllers/ContestController.php:11
* @route '/master/contest'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/master/contest',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ContestController::index
* @see app/Http/Controllers/ContestController.php:11
* @route '/master/contest'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ContestController::index
* @see app/Http/Controllers/ContestController.php:11
* @route '/master/contest'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ContestController::index
* @see app/Http/Controllers/ContestController.php:11
* @route '/master/contest'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const contest = {
    index: Object.assign(index, index),
}

export default contest