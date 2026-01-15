import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\PolicyController::index
* @see app/Http/Controllers/PolicyController.php:21
* @route '/sales/policy'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/sales/policy',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PolicyController::index
* @see app/Http/Controllers/PolicyController.php:21
* @route '/sales/policy'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PolicyController::index
* @see app/Http/Controllers/PolicyController.php:21
* @route '/sales/policy'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PolicyController::index
* @see app/Http/Controllers/PolicyController.php:21
* @route '/sales/policy'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PolicyController::processOcr
* @see app/Http/Controllers/PolicyController.php:133
* @route '/sales/policy/process-ocr'
*/
export const processOcr = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processOcr.url(options),
    method: 'post',
})

processOcr.definition = {
    methods: ["post"],
    url: '/sales/policy/process-ocr',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PolicyController::processOcr
* @see app/Http/Controllers/PolicyController.php:133
* @route '/sales/policy/process-ocr'
*/
processOcr.url = (options?: RouteQueryOptions) => {
    return processOcr.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PolicyController::processOcr
* @see app/Http/Controllers/PolicyController.php:133
* @route '/sales/policy/process-ocr'
*/
processOcr.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: processOcr.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PolicyController::create
* @see app/Http/Controllers/PolicyController.php:42
* @route '/sales/policy/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/sales/policy/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PolicyController::create
* @see app/Http/Controllers/PolicyController.php:42
* @route '/sales/policy/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PolicyController::create
* @see app/Http/Controllers/PolicyController.php:42
* @route '/sales/policy/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PolicyController::create
* @see app/Http/Controllers/PolicyController.php:42
* @route '/sales/policy/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PolicyController::edit
* @see app/Http/Controllers/PolicyController.php:110
* @route '/sales/policy/{policy}/edit'
*/
export const edit = (args: { policy: string | number } | [policy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/sales/policy/{policy}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PolicyController::edit
* @see app/Http/Controllers/PolicyController.php:110
* @route '/sales/policy/{policy}/edit'
*/
edit.url = (args: { policy: string | number } | [policy: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { policy: args }
    }

    if (Array.isArray(args)) {
        args = {
            policy: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        policy: args.policy,
    }

    return edit.definition.url
            .replace('{policy}', parsedArgs.policy.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PolicyController::edit
* @see app/Http/Controllers/PolicyController.php:110
* @route '/sales/policy/{policy}/edit'
*/
edit.get = (args: { policy: string | number } | [policy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PolicyController::edit
* @see app/Http/Controllers/PolicyController.php:110
* @route '/sales/policy/{policy}/edit'
*/
edit.head = (args: { policy: string | number } | [policy: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

const policy = {
    index: Object.assign(index, index),
    processOcr: Object.assign(processOcr, processOcr),
    create: Object.assign(create, create),
    edit: Object.assign(edit, edit),
}

export default policy