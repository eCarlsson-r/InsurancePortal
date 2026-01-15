import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see routes/web.php:69
* @route '/ocr/view-file/{ocrId}'
*/
export const viewFile = (args: { ocrId: string | number } | [ocrId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: viewFile.url(args, options),
    method: 'get',
})

viewFile.definition = {
    methods: ["get","head"],
    url: '/ocr/view-file/{ocrId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:69
* @route '/ocr/view-file/{ocrId}'
*/
viewFile.url = (args: { ocrId: string | number } | [ocrId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { ocrId: args }
    }

    if (Array.isArray(args)) {
        args = {
            ocrId: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        ocrId: args.ocrId,
    }

    return viewFile.definition.url
            .replace('{ocrId}', parsedArgs.ocrId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see routes/web.php:69
* @route '/ocr/view-file/{ocrId}'
*/
viewFile.get = (args: { ocrId: string | number } | [ocrId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: viewFile.url(args, options),
    method: 'get',
})

/**
* @see routes/web.php:69
* @route '/ocr/view-file/{ocrId}'
*/
viewFile.head = (args: { ocrId: string | number } | [ocrId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: viewFile.url(args, options),
    method: 'head',
})

const ocr = {
    viewFile: Object.assign(viewFile, viewFile),
}

export default ocr