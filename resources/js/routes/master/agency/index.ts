import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\AgencyController::index
* @see app/Http/Controllers/AgencyController.php:11
* @route '/master/agency'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/master/agency',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\AgencyController::index
* @see app/Http/Controllers/AgencyController.php:11
* @route '/master/agency'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\AgencyController::index
* @see app/Http/Controllers/AgencyController.php:11
* @route '/master/agency'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\AgencyController::index
* @see app/Http/Controllers/AgencyController.php:11
* @route '/master/agency'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

const agency = {
    index: Object.assign(index, index),
}

export default agency