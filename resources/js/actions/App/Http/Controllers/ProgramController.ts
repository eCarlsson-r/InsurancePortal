import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ProgramController::index
* @see app/Http/Controllers/ProgramController.php:11
* @route '/master/program'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/master/program',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProgramController::index
* @see app/Http/Controllers/ProgramController.php:11
* @route '/master/program'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProgramController::index
* @see app/Http/Controllers/ProgramController.php:11
* @route '/master/program'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProgramController::index
* @see app/Http/Controllers/ProgramController.php:11
* @route '/master/program'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProgramController::create
* @see app/Http/Controllers/ProgramController.php:22
* @route '/master/program/create'
*/
export const create = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

create.definition = {
    methods: ["get","head"],
    url: '/master/program/create',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProgramController::create
* @see app/Http/Controllers/ProgramController.php:22
* @route '/master/program/create'
*/
create.url = (options?: RouteQueryOptions) => {
    return create.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProgramController::create
* @see app/Http/Controllers/ProgramController.php:22
* @route '/master/program/create'
*/
create.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: create.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProgramController::create
* @see app/Http/Controllers/ProgramController.php:22
* @route '/master/program/create'
*/
create.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: create.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\ProgramController::edit
* @see app/Http/Controllers/ProgramController.php:33
* @route '/master/program/{program}/edit'
*/
export const edit = (args: { program: string | number } | [program: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

edit.definition = {
    methods: ["get","head"],
    url: '/master/program/{program}/edit',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ProgramController::edit
* @see app/Http/Controllers/ProgramController.php:33
* @route '/master/program/{program}/edit'
*/
edit.url = (args: { program: string | number } | [program: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { program: args }
    }

    if (Array.isArray(args)) {
        args = {
            program: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        program: args.program,
    }

    return edit.definition.url
            .replace('{program}', parsedArgs.program.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ProgramController::edit
* @see app/Http/Controllers/ProgramController.php:33
* @route '/master/program/{program}/edit'
*/
edit.get = (args: { program: string | number } | [program: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: edit.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\ProgramController::edit
* @see app/Http/Controllers/ProgramController.php:33
* @route '/master/program/{program}/edit'
*/
edit.head = (args: { program: string | number } | [program: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: edit.url(args, options),
    method: 'head',
})

const ProgramController = { index, create, edit }

export default ProgramController